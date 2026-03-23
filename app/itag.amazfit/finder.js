import { mstStartScan, mstStopScan } from '@zos/ble'

// Ένα instance για όλη την εφαρμογή
class Finder {
	
    constructor() {
        this.dbg = 1;
        this.tid = { con: 0, rssi: 0, checker: 0, alarm: 0, auto: 0, cyclic: 0 };
        this.state = {
            enabled: 1,
            lost: 0,
            move: -1,
            focus: 0,
            alert: 0,
            ble: { scan: 0, next: 0, gatt: {} },
            def: { 
                store: {}, 
                storeOrder: [], 
                hiddenOrder: [], 
                pos: 0, 
                set: { 
                    phy: 0, 
                    autoPhy: 1, 
                    minInterval: 50, 
                    maxInterval: 100, 
                    slaveLatency: 4, 
                    persist: 0, 
                    rssi: 1, 
                    pos: 0, 
                    keepFor: 5, 
                    storeLock: 0, 
                    scanAll: 0, 
                    checker: 1, 
                    showHidden: 0, 
                    rssiHandler: 0, 
                    auto: 0 
                } 
            },
            dev: {},
            devA: [],
            scanAll: {},
            scanAllA: []
        };
		
		//this.loadFromStorage();
    }

    // --- ΜΕΘΟΔΟΙ ---
    
	loadFromStorage() {
        try {
            const saved = Storage.ReadJson("defaults.json");
            if (saved) {
                this.state.def = saved;
                if (this.dbg) console.log("Loaded from storage");
            }
        } catch(e) {
            if (this.dbg) console.log("No saved data");
        }
    }
    
    saveToStorage() {
        Storage.WriteJson("defaults.json", this.state.def);
		if (finder.dbg) console.log("def saved");
    }
	
	
    startScan(phyR) {
        const finder = this;  // 🎯 saved reference
        
        if (finder.state.ble.scan) return;
        finder.state.ble.scan = true;

        let dev = finder.state.dev;
        let devA = finder.state.devA;
        const phy = ["1mbps", "coded", "both", "2mbps"];
        const all = finder.state.def.set.scanAll;

        phyR = phyR || finder.state.def.set.phy;

        // ---- start checker ----
        finder.checker();

        // ---- callback ----
        const callback = (device) => {
            // χρησιμοποίησε finder, όχι this
            let ewD = false;
            
            if (device.manufacturerData[0] & 4) ewD = device.manufacturerData;
            else return;
            
            
            if (!all && device.vendor_id === 1424) {
                if (finder.dbg) console.log("--- Finder device.ventor_id: *********", device.vendor_id);
                if (device.manufacturerData[0] & 4) ewD = device.manufacturerData;
                //else return;
                if (finder.dbg) console.log("--- Finder device.ventor_id: *********", device.vendor_id);
            }

            // ⚠️ ΕΔΩ ΕΧΕΙΣ RETURN - προσοχή!
            if (finder.dbg) console.log("--- Finder device not espruino, return");
            return;

            // ο κώδικας μετά το return ΔΕΝ τρέχει ποτέ!
            const id = device.id;
            const devE = dev[id];

            if (devE !== undefined) {
                devE.rfrs = true;
                devE.rssi = device.rssi;
                return;
            }

            setTimeout(() => { finder.newD(device, ewD); }, 10);
        };

        const cyclicScan = () => {
            if (finder.dbg) console.log("--- Finder start cyclicScan");
            mstStartScan(callback);

            finder.tid.cyclic = setTimeout(() => {
                finder.tid.cyclic = 0;
                mstStopScan();
                if (finder.state.enabled) {
                    finder.tid.cyclic = setTimeout(cyclicScan, 100);
                } else if (finder.dbg) {
                    console.log("--- Finder scan stopped");
                }
            }, 900);
        };
        
        cyclicScan();
    }

    newD(device, ewD) {
        const finder = this;
        let id = device.id;
        
        let newD = {
            rssi: device.rssi,
            live: true,
            oflc: 0,
            rfrs: true
        };
        
        let Google = (device.serviceData && device.serviceData.feaa) ? 1 : 0;
        if (Google) newD.name = "Google tag";
        
        finder.state.dev[id] = newD;
        finder.state.devA.push(id);

        if (!finder.state.def.set.scanAll && !Google) {
            let stor = finder.state.def.store[id];
            if (!finder.state.def.set.lock && !stor) {
                newD = {
                    id: id,
                    name: device.name || "No Name",
                    batt: 100,
                    silent: 1,
                    alert: 0
                };
                if (ewD) {
                    newD.phy = (ewD[1] >> 2) & 0x07;
                    newD.batt = ewD[2];
                    newD.volt = ewD[3];
                    newD.board = (ewD[4]) & 0x0F;
                    newD.name = newD.name.substr(3);
                }
                if (device.serviceData && device.serviceData.feaa) newD.name = "Google tag";
                finder.state.def.store[id] = newD;
                finder.state.def.storeOrder.push(id);
            }
            else if (stor && ewD) {
                stor.phy = (ewD[1] >> 2) & 0x07;
                stor.batt = ewD[2];
                stor.volt = ewD[3];
                if (ewD[4] & 16) stor.name = device.name.substr(3);
            }
            return;
        }
        
        if (!finder.state.scanAll[id]) {
            newD = {
                id: id,
                name: device.name || "No Name",
                live: true,
                fixed: 100,
                oflc: 0
            };
            finder.state.scanAll[id] = newD;
            finder.state.scanAllA.push(id);
        }
    }

    checker() {
        const finder = this;
        
        if (finder.tid.checker) clearTimeout(finder.tid.checker);

        const maxOfflineTime = 5;
        let store = finder.state.def.store;
        let dev = finder.state.dev;
        let tid = finder.tid;
        const focus = finder.state.focus;
        const all = finder.state.def.set.scanAll;

        finder.tid.checker = setTimeout(function() {
            // εδώ το this ΔΕΝ είναι το finder, γι'αυτό έχουμε closure
            finder.tid.checker = false;

            let counter = 0;
            let now = Date.now() / 1000 | 0;
            let devicesToDelete = [];

            const deviceIds = Object.keys(dev);

            for (let i = 0; i < deviceIds.length; i++) {
                const id = deviceIds[i];
                counter++;
                let device = dev[id];

                if (device.rfrs) {
                    if (finder.dbg) console.log("checker id online:", id);
                    device.rfrs = false;
                    device.live = true;
                    device.oflc = 0;
                    device.lastseen = now;
                    if (!all && store[id]) store[id].lastseen = now;

                    if (!tid.alarm && id === focus) {
                        tid.alarm = setTimeout(function() {
                            tid.alarm = 0;
                        }, 50);
                    }
                }
                else if (maxOfflineTime < now - device.lastseen) {
                    if (finder.dbg) console.log("checker id offline:", id);
                    device.live = false;
                    device.oflc = (device.oflc || 0) + 1;

                    if (device.oflc > 50) {
                        if (finder.dbg) console.log("checker id to delete:", id);
                        devicesToDelete.push(id);
                    }
                }
                else if (finder.dbg) console.log("checker id idle:", id);
            }

            // Delete devices
            for (let i = 0; i < devicesToDelete.length; i++) {
                const id = devicesToDelete[i];
                delete dev[id];
                const index = finder.state.devA.indexOf(id);
                if (index !== -1) {
                    finder.state.devA.splice(index, 1);
                }
            }

            if (finder.dbg) console.log("checker counter:", counter);
            
            if (!counter && !finder.state.ble.scan) {
                if (finder.dbg) console.log("stop checker");
            } else {
                finder.checker();
            }
        }, 1000);
    }

    stopScan() {
        const finder = this;
        
        if (finder.dbg) console.log("itag: stop scan");
        clearTimeout(finder.tid.cyclic);
        finder.enabled = 0;
        mstStopScan();
        
        if (finder.tid.checker && !finder.state.def.set.checker) {
            clearTimeout(finder.tid.checker);
            finder.tid.checker = 0;
        }
        finder.state.ble.scan = false;
    }
}

// ✨ ΜΟΝΟ ΑΥΤΟ! Export ένα instance
export default new Finder();