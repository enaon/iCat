//BLE scanner

ew.apps.scan = {
    tid: { con: 0, rssi: 0, checker: 0, alarm: 0, auto: 0 },
    state: {
        lost: 0,
        move: -1,
        focus: 0,
        alert: 0,
        ble: { scan: 0, next: 0, gatt: {} },
        def: { store: {}, storeOrder: [], hiddenOrder: [], pos: 0, set: { phy: 0, autoPhy: 1, minInterval: 50, maxInterval: 100, slaveLatency: 4, persist: 0, rssi: 1, pos: 0, keepFor: 5, storeLock: 0, scanAll: 0, checker: 1, showHidden: 0, rssiHandler: 0, auto: 0 } },
        dev: {},
        devA: [],
        scanAll: {},
        scanAllA: []
    },
    startScan(phyR) {
        this.auto();
        if (ew.apps.scan.state.ble.scan) return;
        ew.apps.scan.state.ble.scan = true;

        let dev = ew.apps.scan.state.dev;
        let devA = ew.apps.scan.state.devA;
        const phy = ["1mbps", "coded", "both", "2mbps"];
        const all = ew.apps.scan.state.def.set.scanAll;

        NRF.setTxPower(ew.def.bt.rfTX);
        phyR = phyR || ew.apps.scan.state.def.set.phy;
        
        // ---- start checker ----
        //ew.apps.scan.checker();
        
        // ---- start scan ----
        NRF.setScan(function(device) {
            console.log ("dev:",device);
            const id = device.id;
            const devE = dev[id];

            if (devE !== undefined) {
                devE.rfrs = true;
                devE.rssi = device.rssi;

                return;
            }

            // --- new device ---
            setTimeout(() => { ew.apps.scan.newD(device) }, 10);

        }, {
            filters: [
                ew.apps.scan.state.def.set.scanAll ? {} : // no filter
                //{ id: "64:69:4e:75:89:4d public"},
                { namePrefix: "KS-"  },
				//{ manufacturerData: { 0x0105: {} } }, // KingSong
				//{ manufacturerData: { 0x0590: {} } }, // Inmotion
				//{ serviceData: { "fff0": {} } }, // Kingsong
			//	{ services: ['fff0'] }
				//{ serviceData: { uuid: 0xfe2c } }, // Liperkim
				//{ serviceData: { uuid: 0xfe2c } }, // NineBot
            ],
            phy: phy[phyR],
            interval: (ew.apps.scan.state.def.set.phy == 2) ? 900 : 600,
            window: (ew.apps.scan.state.def.set.phy == 2) ? 300 : 300,
            active: true
        });

    },
    newD(device) {
        let id = device.id;
        // --- new device ---
        let newD = {
            //id: id,
            rssi: device.rssi,
            live: true,
            oflc: 0,
            rfrs: true
        };

        this.state.dev[id] = newD;
        this.state.devA.push(id);

        if (!this.state.def.set.scanAll ) {
            let stor = this.state.def.store[id];
            if (!this.state.def.set.lock && !stor) {
                newD = {
                    id: id,
                    name: device.name || "No Name",
                    batt: 100,
                    silent: 1,
                    alert: 0
                };
    
                this.state.def.store[id] = newD;
                this.state.def.storeOrder.push(id);

            }
            return;
        }
        if (!this.state.scanAll[id]) {
            newD = {
                id: id,
                //rssi: device.rssi,
                name: device.name || "No Name",
                live: true,
                fixed: 100,
                oflc: 0
            };
            this.state.scanAll[id] = newD;
            this.state.scanAllA.push(id);
        }
    },

    checker() {
        if (this.tid.checker) clearTimeout(this.tid.checker);

        const maxOfflineTime = 5; // 5 δευτερόλεπτα offline
        let store = ew.apps.scan.state.def.store;
        let storeA = ew.apps.scan.state.def.storeOrder;
        let dev = ew.apps.scan.state.dev;
        let devA = ew.apps.scan.state.devA;
        let tid = ew.apps.scan.tid;

        const focus = ew.apps.scan.state.focus;
        const all = ew.apps.scan.state.def.set.scanAll;

        ew.apps.scan.tid.checker = setTimeout(function() {
            ew.apps.scan.tid.checker = false;

            let counter = 0;
            let now = Date.now() / 1000 | 0;
            let devicesToDelete = [];

            const deviceIds = Object.keys(dev);

            for (let i = 0; i < deviceIds.length; i++) {
                const id = deviceIds[i];
                counter++;
                let device = dev[id];

                if (device.rfrs) {
                    if (ew.apps.scan.dbg) console.log("checker id online:", id);

                    device.rfrs = false;
                    device.live = true;
                    device.oflc = 0; // reset            
                    device.lastseen = now;
                    if (!all && store[id])
                        store[id].lastseen = now;
                        

                        
                }
                else if (maxOfflineTime < now - device.lastseen) {
                    if (ew.apps.scan.dbg) console.log("checker id offline:", id);

                    device.live = false;
                    device.oflc = (device.oflc || 0) + 1;

                    if (device.oflc > 50) {
                        if (ew.apps.scan.dbg) console.log("checker id to delete:", id);
                        devicesToDelete.push(id);
                    }
                }
                else if (ew.apps.scan.dbg) console.log("checker id idle:", id);
            }

            if (devicesToDelete.length > 0) {
                for (let i = 0; i < devicesToDelete.length; i++) {
                    const id = devicesToDelete[i];
                    delete dev[id];
                    const index = devA.indexOf(id);
                    if (index !== -1) {
                        devA.splice(index, 1);
                    }
                }
            }

            if (ew.face.appCurr === "scan") ew.face[0].update();

            if (ew.apps.scan.dbg) console.log("checker counter:", counter);
            if (!counter && !ew.apps.scan.state.ble.scan) {
                if (ew.apps.scan.dbg) console.log("stop checker");
            }
            else {
                ew.apps.scan.checker();
            }
        }, 1000);
    },
    auto(min) {
        if (this.tid.auto) clearTimeout(this.tid.auto);
        this.tid.auto = false;
        if (!min) return;
        if (ew.apps.scan.dbg) console.log("itag: auto scan start");
        this.tid.auto = setTimeout(() => {
            this.startScan(2);
            this.tid.auto = setTimeout(() => {
                this.tid.auto = false;
                this.stopScan();
            }, 25000);
        }, min * 60000);

    },
    stopScan() {
        if (ew.apps.scan.dbg) console.log("itag: stop scan");
        NRF.setScan();
        if (ew.apps.scan.tid.checker && !ew.apps.scan.state.def.set.checker) {
            clearTimeout(ew.apps.scan.tid.checker);
            ew.apps.scan.tid.checker = 0;
        }
        ew.apps.scan.state.ble.scan = false;
        this.state.dev={};
        this.state.devA=[];
        this.auto(this.state.def.set.auto);
    },
  


};
if (require('Storage').readJSON('ew.json', 1).scan) {
    ew.apps.scan.state.def = require('Storage').readJSON('ew.json', 1).scan;
    if (!ew.apps.scan.state.def) ew.apps.scan.state.def = { store: {}, storeOrder: [], hiddenOrder: [], pos: 0, set: { phy: 0, autoPhy: 1, minInterval: 50, maxInterval: 100, slaveLatency: 4, persist: 0, rssi: 1, pos: 0, keepFor: 5, storeLock: 0, scanAll: 0, checker: 1, showHidden: 0, rssiHandler: 0, auto: 0 } };
    //ew.apps.scan.state.def.storeOrder=  Object.values(ew.apps.scan.state.def.store).map(item => item.id);
}
//ew.apps.scan.stopScan();