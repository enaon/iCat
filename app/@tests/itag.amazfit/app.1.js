import { Storage } from "@silver-zepp/easy-storage";
import { pauseDropWristScreenOff, pausePalmScreenOff, setPageBrightTime, setWakeUpRelaunch } from '@zos/display'
import { mstStartScan, mstStopScan } from '@zos/ble'



App({
    globalData: {
        devices: [],
        scanning: false,
        finder: {},
    },
	 constructor() {
		  this.globalData.finder = {
            dbg: 1,
            //ble: require('@zos/ble'),
            tid: { con: 0, rssi: 0, checker: 0, alarm: 0, auto: 0, cyclic: 0 },
            state: {
                enabled: 1,
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

            startScan: (phyR) => {
                if (this.state.ble.scan) return;
                this.state.ble.scan = true;

                let dev = this.state.dev;
                let devA = this.state.devA;
                const phy = ["1mbps", "coded", "both", "2mbps"];
                const all = this.state.def.set.scanAll;

                phyR = phyR || this.state.def.set.phy;

                // ---- start checker ----
                this.checker();

                // ---- callback ----
                const callback = (device) => {

                    function customStringify(obj) {
                        return JSON.stringify(obj, (key, value) => {
                            if (value instanceof ArrayBuffer) {
                                const bytes = new Uint8Array(value);
                                return {
                                    __type: 'ArrayBuffer',
                                    length: value.byteLength,
                                    hex: Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(':'),
                                    decimal: Array.from(bytes).join(',')
                                };
                            }
                            return value;
                        }, 2);
                    }

                    //if (this.dbg) console.log("BLE SCAN RESULT:", customStringify(device));



                    let ewD = false;
                    if (!all && device.vendor_id === 1424) {
                        if (this.dbg) console.log("******* Finder device.ventor_id: *********", device.vendor_id);

                        //if (device.manufacturerData[0] & 4) ewD = device.manufacturerData;
                        //else return;
                    }

                    if (this.dbg) console.log("Finder device not espruino, return");
                    return;

                    const id = device.id;
                    const devE = dev[id];

                    if (devE !== undefined) {
                        devE.rfrs = true;
                        devE.rssi = device.rssi;

                        return;
                    }

                    // --- new device ---
                    setTimeout(() => { this.newD(device, ewD); }, 10);

                };


                const cyclicScan = () => {
                    if (finder.dbg) console.log("Finder start cyclicScan");
                    mstStartScan(callback);

                    this.tid.cyclic = setTimeout(() => {
                        this.tid.cyclic = 0;
                        mstStopScan();
                        if (this.state.enabled) this.tid.cyclic = setTimeout(cyclicScan, 100);
                        else if (this.dbg) console.log("Finder scan stopped");
                    }, 900);

                };
                cyclicScan();

            },

            newD(device, ewD) {
                let id = device.id;
                // --- new device ---
                let newD = {
                    //id: id,
                    rssi: device.rssi,
                    live: true,
                    oflc: 0,
                    rfrs: true
                };
                let Google = (device.serviceData && device.serviceData.feaa) ? 1 : 0;
                if (Google) newD.name = "Google tag";
                this.state.dev[id] = newD;
                this.state.devA.push(id);

                if (!this.state.def.set.scanAll && !Google) {
                    let stor = this.state.def.store[id];
                    if (!this.state.def.set.lock && !stor) {
                        newD = {
                            id: id,
                            name: device.name || "No Name",
                            batt: 100,
                            silent: 1,
                            alert: 0
                        };
                        if (ewD) {
                            newD.phy = (ewD[1] >> 2) & 0x07;
                            //newD.rfTX = (device.manufacturerData[1] >> 5) & 0x07;
                            newD.batt = ewD[2];
                            newD.volt = ewD[3];
                            newD.board = (ewD[4]) & 0x0F;
                            newD.name = newD.name.substr(3);
                        }
                        if (device.serviceData && device.serviceData.feaa) newD.name = "Google tag";
                        this.state.def.store[id] = newD;
                        this.state.def.storeOrder.push(id);

                    }
                    else if (stor && ewD) {
                        stor.phy = (ewD[1] >> 2) & 0x07;
                        stor.batt = ewD[2];
                        stor.volt = ewD[3];
                        if (ewD[4] & 16) stor.name = device.name.substr(3); ///if (ewD[4] & (1 << 4))
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
                let store = this.state.def.store;
                let storeA = this.state.def.storeOrder;
                let dev = this.state.dev;
                let devA = this.state.devA;
                let tid = this.tid;

                const focus = this.state.focus;
                const all = this.state.def.set.scanAll;

                this.tid.checker = setTimeout(function() {
                    this.tid.checker = false;

                    let counter = 0;
                    let now = Date.now() / 1000 | 0;
                    let devicesToDelete = [];

                    const deviceIds = Object.keys(dev);

                    for (let i = 0; i < deviceIds.length; i++) {
                        const id = deviceIds[i];
                        counter++;
                        let device = dev[id];

                        if (device.rfrs) {
                            if (this.dbg) console.log("checker id online:", id);

                            device.rfrs = false;
                            device.live = true;
                            device.oflc = 0; // reset            
                            device.lastseen = now;
                            if (!all && store[id])
                                store[id].lastseen = now;

                            if (!tid.alarm && id === focus) {
                                tid.alarm = setTimeout(function() {
                                    tid.alarm = 0;
                                }, 50);
                            }

                        }
                        else if (maxOfflineTime < now - device.lastseen) {
                            if (this.dbg) console.log("checker id offline:", id);

                            device.live = false;
                            device.oflc = (device.oflc || 0) + 1;

                            if (device.oflc > 50) {
                                if (this.dbg) console.log("checker id to delete:", id);
                                devicesToDelete.push(id);
                            }
                        }
                        else if (this.dbg) console.log("checker id idle:", id);
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

                    if (this.dbg) console.log("checker counter:", counter);
                    if (!counter && !this.state.ble.scan) {
                        if (this.dbg) console.log("stop checker");
                    }
                    else {
                        this.checker();
                    }
                }, 1000);
            },
            stopScan() {
                if (this.dbg) console.log("itag: stop scan");
                clearTimeout(this.tid.cyclic);
                this.enabled = 0;
                mstStopScan();
                if (this.tid.checker && !this.state.def.set.checker) {
                    clearTimeout(this.tid.checker);
                    this.tid.checker = 0;
                }
                this.state.ble.scan = false;
            }
        };

		 
	 },
    onCreate(options) {
        /* if (Storage.ReadJson("defaults.json")) {
            if (finder.dbg) console.loge("On Create: default.json lloaded")
            finder.state.def = Storage.ReadJson("defaults");
        }
		*/
        pauseDropWristScreenOff({
            duration: 360000,
        })
        pausePalmScreenOff({
            duration: 360000,
        })
        setPageBrightTime({
            brightTime: 360000,
        })
        setWakeUpRelaunch({
            relaunch: true,
        })
       


        console.log('App onCreate');
    },

    onDestroy(options) {
        //Storage.WriteJson("defaults.json", finder.state.def);
        this.globalData.finder.stopScan()
        console.log('App onDestroy');
    }
});
