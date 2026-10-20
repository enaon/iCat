import * as ui from '@zos/ui';
import { onGesture, GESTURE_LEFT, GESTURE_RIGHT,onWristMotion, WRIST_MOTION_LIFT,WRIST_MOTION_LOWER } from '@zos/interaction'
import { setScreenOff,setBrightness,setAutoBrightness } from '@zos/display'
import { push } from '@zos/router';
import finder from '../finder'

Page({
    onInit() {
        if (finder.dbg) console.log('========== BLE SCANNER BARS UI ==========');
        this.finder = finder;

        this.state = {
            selectedIndex: 0,
            lastUpdate: 0
        };

        // Gesture support
        onGesture({
            callback: (event) => {
                if (event === 1) {
                     push({ url: 'page/store' });
                }
                
				else if (event === 2) {
                    push({ url: 'page/store' });
                }
				
				 if (finder.dbg) console.log('--- gestrure:',event );
                return true;
            },
        });

		onWristMotion({
		  callback: (result) => {
			const { type, motion } = result

			if (type === 3) {
				if (motion === 2) {
					setAutoBrightness({
					  autoBright: false,
					})
					setBrightness({
					  brightness: 0,
					})
				}else if (motion === 1) {
					setAutoBrightness({
					  autoBright: true,
					})
				}	
			}
			else if (type === 0) {
				setAutoBrightness({
				  autoBright: false,
				})
				
				setBrightness({
				  brightness: 0,
				})
		  }
			
			if (finder.dbg) console.log("type:",type,"motion:",motion)

		  },
		})

        this.createUI();

        // Auto-start scan
        setTimeout(() => {
            if (!this.finder.state.ble.scan) {
                this.finder.startScan();
                this.updateButtonState();
            }
        }, 500);

        // Periodic UI update
        this.startUIUpdater();
    },

    createUI() {
        // Black background
        ui.createWidget(ui.widget.FILL_RECT, {
            x: 0,
            y: 0,
            w: 480,
            h: 480,
            color: 0x000000
        });

        // name
        this.selectedName = ui.createWidget(ui.widget.TEXT, {
			x: 135, y: 0, w: 200, h: 70,
            color: 0xFFFFFF,
            text_size: 55,
            align_h: ui.align.CENTER_H,
            text: 'Finder'
        });

        // BARS AREA
        this.barsY = 150;
        this.barsHeight = 175;
		
		// Περιοχή για μπάρες (πιο πάνω για περισσότερο χώρο)
		this.barsArea = ui.createWidget(ui.widget.FILL_RECT, {
			//x: 0, y: 140, w: 466, h: 190,
			x: 0, y: 75, w: 466, h: 255,

			color: 0x111111
		});
	
		// info
        this.selectedInfo = ui.createWidget(ui.widget.TEXT, {
            x: 0,
            y: 75,
            w: 466,
            h: 50,
            color: 0xAAAAAA,
            text_size: 40,
            align_h: ui.align.CENTER_H,
            text: ''
        });
		
        // mac 
        this.macText = ui.createWidget(ui.widget.TEXT, {
            x: 0,
            y: 333,
            w: 466,
            h: 35,
            color: 0xAAAAAA,
            text_size: 32,
            align_h: ui.align.CENTER_H,
            text: ''
        });

        // SCAN/STOP button
        this.scanBtn = ui.createWidget(ui.widget.BUTTON, {
			x: 85, y: 405, w: 300, h: 80,
            text: 'START SCAN',
			color: 0xFFFFFF,
			normal_color: 0x00AA00,
			press_color: 0x008800,
             text_size: 28,
            radius: 10
        });

        // Button click
        this.scanBtn.addEventListener(ui.event.CLICK_DOWN, () => {
            this.onScanClick();
        });

        // LEFT/RIGHT touch on bars area
        this.barsArea.addEventListener(ui.event.CLICK_DOWN, (info) => {
            const x = info.x;
            if (x < 240) {
                this.moveSelection(-1);
            }
            else {
                this.moveSelection(1);
            }
        });



        // Arrays for bar widgets
        this.barWidgets = [];
        this.barOutlines = [];
        this.dotWidgets = [];

        console.log('✓ BARS UI created');
    },

    startUIUpdater() {
        // Update UI κάθε 200ms για πιο smooth shrinking!
        const updateLoop = () => {
            this.updateBars();
            this.updateSelectionInfo();
			
			if (this.finder.dbg) console.log('STORE ORDER:', JSON.stringify(this.finder.state.def.storeOrder));
            if (this.finder.dbg) console.log('STORE ORDER length:', this.finder.state.def.storeOrder.length);

            if (this.finder.dbg) console.log('STORE keys:', JSON.stringify(Object.keys(this.finder.state.def.store)));
            if (this.finder.dbg) console.log('STORE has data:', Object.keys(this.finder.state.def.store).length > 0 ? 'YES' : 'NO');

            setTimeout(updateLoop, 1000); // Πιο γρήγορο update για το shrinking
        };

        setTimeout(updateLoop, 200);
    },

    updateButtonState() {
        if (this.finder.state.ble.scan) {
            this.scanBtn.setProperty(ui.prop.TEXT, 'STOP');
            this.scanBtn.setProperty(ui.prop.NORMAL_COLOR, 0xCC3300);
            this.scanBtn.setProperty(ui.prop.PRESS_COLOR, 0x992600);
        }
        else {
            this.scanBtn.setProperty(ui.prop.TEXT, 'START');
            this.scanBtn.setProperty(ui.prop.NORMAL_COLOR, 0x0066CC);
            this.scanBtn.setProperty(ui.prop.PRESS_COLOR, 0x004C99);
        }
    },

    onScanClick() {
        if (this.finder.state.ble.scan) {
            this.finder.stopScan();
        }
        else {
            this.finder.startScan();
        }
        this.updateButtonState();
    },

    moveSelection(direction) {
        const devices = this.finder.state.devA;
        if (devices.length === 0) return;

        const oldIndex = this.state.selectedIndex;
        const newIndex = (oldIndex + direction + devices.length) % devices.length;

        this.state.selectedIndex = newIndex;
        this.finder.state.lastId = devices[newIndex];

        this.updateBars();
        this.updateSelectionInfo();
    },

    getOfflineSeconds(id) {
        const dev = this.finder.state.dev[id];
        if (!dev || !dev.lastSeen) return 0;

        const now = Math.floor(Date.now() / 1000);
        const diff = now - dev.lastSeen;
        return diff;
    },

   updateSelectionInfo() {
    const devices = this.finder.state.devA;
    if (devices.length === 0 || this.state.selectedIndex >= devices.length) {
        this.selectedName.setProperty(ui.prop.TEXT, 'Finder');
        this.selectedInfo.setProperty(ui.prop.TEXT, 'Scanning');
        return;
    }
    
    const id = devices[this.state.selectedIndex];
    const dev = this.finder.state.dev[id];
    const store = this.finder.state.def.store[id];
    
    if (dev) {
        // Όνομα συσκευής
        let name = 'Unknown';
        if (store && store.name) {
            name = store.name;
        } else if (store && store.id) {
            name = store.id.substring(0, 8);
        } else {
            name = 'Device';
        }
        this.selectedName.setProperty(ui.prop.TEXT, name);
        
		// mac
		this.macText.setProperty(ui.prop.TEXT,`${id}` );

		
        // ΜΟΝΟ oflc - ΟΧΙ lastSeen!
        if (!dev.live) {
            const oflc = dev.oflc || 0;
            this.selectedInfo.setProperty(ui.prop.TEXT, 
                `offline ${oflc}s`);  // oflc = seconds offline!
            this.selectedInfo.setProperty(ui.prop.COLOR, 0xFF4444);
        } else {
            let rssi = dev.rssi || 0;
            this.selectedInfo.setProperty(ui.prop.TEXT, `${rssi} dBm`);
            this.selectedInfo.setProperty(ui.prop.COLOR, 0xAAAAAA);
        }
    }
},

  updateBars() {
    this.clearBars();

    const devices = this.finder.state.devA;
    if (devices.length === 0) return;
    
    const barAreaWidth = 456;
    const barAreaX = 10;
    const bottomY = this.barsY + this.barsHeight - 15;
    const maxBarHeight = this.barsHeight - 30;

    const numBars = Math.min(devices.length, 20);
    const barSpacing = 4;
    
    // ΥΠΟΛΟΓΙΣΜΟΣ ΠΛΑΤΟΥΣ - ΟΠΩΣ ΣΤΗΝ ΠΑΛΙΑ!
    const totalSpacing = barSpacing * (numBars - 1);
    const availableWidth = barAreaWidth - totalSpacing - 20; // -20 για margins
    let barWidth = Math.floor(availableWidth / numBars);
    
    // Περιορισμός σε λογικά όρια (όχι πολύ μεγάλες, όχι πολύ μικρές)
    barWidth = Math.min(80, Math.max(25, barWidth));
    
    // Κεντράρισμα μπαρών
    const totalBarsWidth = (barWidth * numBars) + totalSpacing;
    const startX = barAreaX + Math.floor((barAreaWidth - totalBarsWidth) / 2);

    for (let i = 0; i < numBars; i++) {
        const id = devices[i];
        const dev = this.finder.state.dev[id];
        const store = this.finder.state.def.store[id];

        if (!dev) continue;

        const x = startX + i * (barWidth + barSpacing);

        let barHeight;
        let barColor;

        if (dev.live) {
            // ONLINE
            const rssi = dev.rssi || -100;
            const rssiNorm = Math.max(0, Math.min(1, (rssi + 100) / 60));
            barHeight = Math.max(25, rssiNorm * maxBarHeight);
            barColor = 0x0088FF;
        } else {
            // OFFLINE - ΜΟΝΟ με oflc!
            const oflc = dev.oflc || 0;
            barHeight = Math.max(5, 150 - (oflc * 3));
            barColor = 0xFF4444;
        }

        const y = bottomY - barHeight;

        const bar = ui.createWidget(ui.widget.FILL_RECT, {
            x: Math.floor(x),
            y: Math.floor(y),
            w: Math.floor(barWidth - 1),
            h: Math.floor(barHeight),
            color: barColor,
            radius: 2
        });
        bar.setEnable(false);
        this.barWidgets.push(bar);

        // TOP DOT και OUTLINE για επιλεγμένη μπάρα
        if (i === this.state.selectedIndex) {
			//////////
            if (1 < devices.length){
				const dot = ui.createWidget(ui.widget.FILL_RECT, {
					x: Math.floor(x ),
					y: bottomY -160,
					w: barWidth,
					h: 5,
					color: 0xFFFFFF
				});
            dot.setEnable(false);
            this.dotWidgets.push(dot);
			}
            const outline = ui.createWidget(ui.widget.STROKE_RECT, {
                x: Math.floor(x - 2),
                y: Math.floor(y - 2),
                w: Math.floor(barWidth + 3),
                h: Math.floor(barHeight + 4),
                color: 0xFFFFFF,
                line_width: 2,
                radius: 3
            });
            outline.setEnable(false);
            this.barOutlines.push(outline);
        }
		/*
        // Όνομα κάτω από μπάρα - ΜΟΝΟ αν έχει αρκετό χώρο!
        if (barWidth > 35 && store && store.name) {
            let shortName = store.name;
            if (shortName.length > 5) shortName = shortName.substring(0, 5);
            
            // Μικρότερο γράμμα για πολλά devices
            let textSize = 16;
            if (numBars > 8) textSize = 14;
            if (numBars > 10) textSize = 12;

            const nameText = ui.createWidget(ui.widget.TEXT, {
                x: Math.floor(x),
                y: Math.floor(bottomY + 5),
                w: Math.floor(barWidth),
                h: 20,
                color: dev.live ? 0xAAAAAA : 0xFF8888,
                text_size: textSize,
                align_h: ui.align.CENTER_H,
                text: shortName
            });
            nameText.setEnable(false);
            this.barWidgets.push(nameText);
        }
		*/
    }

},
    clearBars() {
        try {
            const hideWidgets = (widgets) => {
                for (let w of widgets) {
                    if (w && typeof w.setProperty === 'function') {
                        w.setProperty(ui.prop.VISIBLE, false);
                    }
                }
            };

            hideWidgets(this.barWidgets);
            hideWidgets(this.barOutlines);
            hideWidgets(this.dotWidgets);

            this.barWidgets = [];
            this.barOutlines = [];
            this.dotWidgets = [];

        }
        catch (e) {
            console.log('Error clearing bars:', e);
            this.barWidgets = [];
            this.barOutlines = [];
            this.dotWidgets = [];
        }
    },

    onDestroy() {
		setAutoBrightness({
		  autoBright: true,
		})
        this.clearBars();
    }
});
