//itag viewer

ew.apps.itag = {

    tid: { con: 0, rssi: 0, checker: 0, alarm: 0, auto: 0, focus: 0 },

    state: {
        time: 0,
        lost: 0,
        move: -1,
        focus: 0,
        alert: 0,
        ble: { scan: 0, next: 0, gatt: {} },
        def: { store: {}, storeOrder: [], hiddenOrder: [], pos: 0, set: { phy: 0, autoPhy: 1, minInterval: 50, maxInterval: 100, slaveLatency: 4, persist: 0, rssi: 1, pos: 0, keepFor: 5, storeLock: 0, scanAll: 0, checker: 1, showHidden: 0, rssiHandler: 1, auto: 15, newG: 1 }, devices: { lBox: {}, light: {} } },
        dev: {},
        devA: [],
        scanAll: {},
        scanAllA: []
    },

    scan(phyR) {

        if (this.google.pendingBond) {
            if (ew.UI) ew.UI.btn.ntfy(1, 25, 0, "_bar", 6, "SCAN PAUSED", "BONDING", 15, 13);
            return;
        }
        this.auto();
        if (ew.apps.itag.state.ble.scan) return;
        ew.apps.itag.state.ble.scan = true;

        let dev = ew.apps.itag.state.dev;
        let devA = ew.apps.itag.state.devA;
        const phy = ["1mbps", "coded", "both", "2mbps"];
        const all = ew.apps.itag.state.def.set.scanAll;

        NRF.setTxPower(ew.def.bt.rfTX);
        phyR = phyR || ew.apps.itag.state.def.set.phy;
        
        // set sstart time
        ew.apps.itag.state.time = (Date.now() / 1000) | 0;
            
        // ---- start checker ----
        ew.apps.itag.checker();

        // ---- start scan ----
        NRF.setScan(function(device) { 

            // check if Espuino
            let ewD = false;
            if (!all && device.manufacturer === 1424) {
                // route by role bitmask
                let rb = device.manufacturerData[0];
                if (rb & 4) ewD = device.manufacturerData; // tag
                else if (rb & 2) { ew.apps.itag.devUpd("lBox", device); return; } // toilet
                else if (rb & 16) { ew.apps.itag.devUpd("light", device); return; } // light
                else return; // other roles
            }

            // check if device exists
            const devE = dev[device.id];

            // device exists
            if (devE !== undefined) {
                devE.rfrs = true;
                devE.rssi = device.rssi;
                return;
            }
            if ( device.manufacturer === 76) return; //return apple, only update if device exists
            if ( device.manufacturer === 43724) return; //return custom google, only update if device exists

            // new device
            //setTimeout(() => { ew.apps.itag.newD(device, ewD) }, 10);
            ew.apps.itag.newD(device, ewD)
        }, {
            filters: [
                ew.apps.itag.state.def.set.scanAll ? {} : // no filter
                { manufacturerData: { 0x0105: {} } }, // itag
                { manufacturerData: { 0x0590: {} } }, //espruino
                { manufacturerData: { 0x004C: {} } }, //apple
                { serviceData: { "feaa": {} } }, // google tags
                //{ serviceData: { uuid: 0xfe2c } }, // google
            ],
            phy: phy[phyR],
            interval: (ew.apps.itag.state.def.set.phy == 2) ? 900 : 600,
            window: (ew.apps.itag.state.def.set.phy == 2) ? 300 : 300,
            active: false
        });

    },

    newD(device, ewD) {

        let id = device.id;

        // new device object
        let newD = {
            rssi: device.rssi,
            live: true,
            oflc: 0,
            rfrs: true
        };

        // check if google tag         
        let Google = (device.serviceData && device.serviceData.feaa) ? 1 : 0;
        if (Google) {

            newD.name = "Google";
            if (2 < ew.apps.itag.dbg) console.log("itag: found google tag");

            // check if bond info exists
            if (!this.google.isBond(id)) {
                console.log("is not bond");
                //schedule bonding  -drop if no new google is allowed
                if (ew.apps.itag.state.def.set.newG && !this.google.pendingBond) {
                    this.google.pendingBond = true;
                    ew.apps.itag.stopScan();
                    if (ew.UI) ew.UI.btn.ntfy(1, 25, 0, "_bar", 6, "SCAN PAUSED", "BONDING", 15, 13);
                    setTimeout(() => {
                        ew.apps.itag.google.startBonding(device);
                    }, 1500);
                }
                return;
            }

        }

        // add device to temp database
        this.state.dev[id] = newD;
        this.state.devA.push(id);

        // ---- Store handling ---

        // ewtag mode
        if (!this.state.def.set.scanAll) {
            let stor = this.state.def.store[id];

            // new entry
            if (!this.state.def.set.lock && !stor) {

                newD = {
                    name: device.name || "No Name",
                    batt: 100,
                    sil: 1,
                    alr: 0
                };

                // device is eW
                if (ewD) {
                    newD.phy = (ewD[1] >> 2) & 0x07;
                    //newD.rfTX = (device.manufacturerData[1] >> 5) & 0x07;
                    newD.batt = ewD[2];
                    newD.volt = ewD[3];
                    newD.brd = (ewD[4]) & 0x0F;
                    newD.name = newD.name.substr(3);
                }

                if (Google) {
                    newD.ggl = true;
                    newD.name = "Google";
                }

                // add to store
                this.state.def.store[id] = newD;
                this.state.def.storeOrder.push(id);

                return;

            }
            // entry exists
            if (stor && ewD) {
                stor.phy = (ewD[1] >> 2) & 0x07;
                stor.batt = ewD[2];
                stor.volt = ewD[3];
                stor.name = device.name.substr(3); ///if (ewD[4] & (1 << 4))
                //if (ewD[4] & 16) stor.name = device.name.substr(3); ///if (ewD[4] & (1 << 4))
            }
            return;
        }

        // All mode
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

    devUpd(role, device) {
        const store = this.state.def.devices[role];
        const id = device.id;
        const m = device.manufacturerData;
        const now = ew.apps.itag.state.time;
        const d = store[id];
        if (d) {
            d.batt = m[2];
            d.volt = m[3];
            d.last = now;
            if (m[4] & 16) d.name=device.name.substr(3); 
        }
        else {
            store[id] = {
                name: device.name ? device.name.substr(3) : "?",
                batt: m[2],
                volt: m[3],
                brd: m[4] & 0x0F,
                last: now
            };
        }
    },

    // Google Tags Bonding Manager
    google: {
        pendingBond: false,
        pendingGatt: null,

        // resolve ephemeral id
        isBond(id) {
            if (2 < ew.apps.itag.dbg) console.log("itag: google tag resolving id:", id);

            let store = ew.apps.itag.state.def.store;
            let storeOrder = ew.apps.itag.state.def.storeOrder;

            let resolved = NRF.resolveAddress(id);

            if (resolved) {
                // check if id key is in store
                if (store[id]) {
                    if (2 < ew.apps.itag.dbg) console.log("itag: fast google resolve success");
                    return true;
                }
                // check if ephemeral id is in store       
                for (let savedId in store) {

                    if (!store[savedId].ggl) continue;

                    let resolvedSaved = NRF.resolveAddress(savedId);
                    if (resolvedSaved && resolvedSaved === resolved) {
                        // device found
                        if (2 < ew.apps.itag.dbg) console.log("itag: google tag found in store");

                        // rename Keys
                        if (id !== savedId) {
                            if (2 < ew.apps.itag.dbg) console.log("itag: google tag rename:", savedId, " to: ", id);
                            ew.apps.itag.google.renameKey(savedId, id);
                        }
                        return true;
                    }
                }

                if (2 < ew.apps.itag.dbg) console.log("itag: google bond exists, but no entry on store, create new");
                return true
            }

            //bond does not exist
            if (2 < ew.apps.itag.dbg) console.log("itag: google resolve failed");
            return false;
        },


        // start bonding
        startBonding(device) {

            let id = device.id;

            if (2 < ew.apps.itag.dbg) console.log("itag: connecting to googgle tag:", id);

            // connect
            NRF.connect(id).then((gatt) => {
                if (2 < ew.apps.itag.dbg) console.log("itag: google tag connected, bonding");
                this.pendingGatt = gatt;

                // // start bonding
                return gatt.startBonding();
            }).then(() => {
                if (2 < ew.apps.itag.dbg) console.log("itag: google tag bond success!");

                // disconnect
                if (this.pendingGatt && this.pendingGatt.connected) {
                    this.pendingGatt.disconnect();
                    this.pendingGatt = null;
                }


                this.pendingBond = false;
                if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "BOND OK", "SCANNING", 15, 6);
                if (ew.face && ew.face.appCurr === "itag") ew.apps.itag.scan();

            }).catch((e) => {
                if (2 < ew.apps.itag.dbg) console.log("itag: google bond failed:", e);
                if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "BOND FAIL", "SCANNING", 15, 13);

                if (this.pendingGatt) {
                    try { this.pendingGatt.disconnect(); }
                    catch (e) {}
                    this.pendingGatt = null;
                }
                this.pendingBond = false;
                if (ew.face && ew.face.appCurr === "itag") ew.apps.itag.scan();
            });
        },
        renameKey(oldKey, newKey) {
            let store = ew.apps.itag.state.def.store;
            let storeOrder = ew.apps.itag.state.def.storeOrder;

            if (!store[oldKey] || store[newKey]) {
                if (2 < ew.apps.itag.dbg) console.log("itag: google tag rename failed");
                return false;
            }

            // get storeOrder index
            let index = storeOrder.indexOf(oldKey);
            if (index === -1) return false; //not found

            // replace store order
            storeOrder[index] = newKey;

            // update store
            store[newKey] = store[oldKey];
            delete store[oldKey];

            if (this.dbg) console.log(`rename: ${oldKey} -> ${newKey} at position ${index}`);

            return true;
        }
    },

    checker() {
        if (this.tid.checker) clearTimeout(this.tid.checker);

        const maxOfflineTime = 5; // 5 δευτερόλεπτα offline
        let store = ew.apps.itag.state.def.store;
        let storeA = ew.apps.itag.state.def.storeOrder;
        let dev = ew.apps.itag.state.dev;
        let devA = ew.apps.itag.state.devA;
        let tid = ew.apps.itag.tid;

        const focus = ew.apps.itag.state.focus;
        const all = ew.apps.itag.state.def.set.scanAll;

        ew.apps.itag.tid.checker = setTimeout(function() {
            ew.apps.itag.tid.checker = false;

            let counter = 0;
            let now = Date.now() / 1000 | 0;
            let devicesToDelete = [];

            for (let i = 0; i < devA.length; i++) {
                counter++;
                let id = devA[i];
                let device = dev[devA[i]];
                if (device.rfrs) {
                    if (3 < ew.apps.itag.dbg) console.log("checker id online:", id);

                    device.rfrs = false;
                    device.live = true;
                    device.oflc = 0; // reset            
                    device.last = now;
                    if (!all && store[id])
                        store[id].last = now;

                    if (!tid.alarm && id === focus) {
                        tid.alarm = setTimeout(function() {
                            ew.notify.alert("info", { "id": id, "src": "itag", "title": store[id].name, "body": "FOUND" }, 1, 1);
                            tid.alarm = 0;
                        }, 50);
                    }

                }
                else if (maxOfflineTime < now - device.last) {
                    if (3 < ew.apps.itag.dbg) console.log("checker id offline:", id);

                    device.live = false;
                    device.oflc = (device.oflc || 0) + 1;

                    if (device.oflc > 50) {
                        if (3 < ew.apps.itag.dbg) console.log("checker id to delete:", id);
                        devicesToDelete.push(id);
                    }
                }
                else if (3 < ew.apps.itag.dbg) console.log("checker id idle:", id);
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

            if (ew.face && ew.face.appCurr === "itag") ew.face[0].update();

            if (3 < ew.apps.itag.dbg) console.log("checker counter:", counter);
            if (!counter && !ew.apps.itag.state.ble.scan) {
                if (3 < ew.apps.itag.dbg) console.log("stop checker");
            }
            else {
                ew.apps.itag.checker();
            }
        }, 1000);
    },
    auto(min) {
        if (this.tid.auto) clearTimeout(this.tid.auto);
        this.tid.auto = false;
        if (!min) return;
        if (3 < ew.apps.itag.dbg) console.log("itag: auto scan start");
        this.tid.auto = setTimeout(() => {
            if (ew.sys.batt(1) < 25) {
                if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "ITAG SCAN", "LOW BAT", 15, 13);
            }
            else
                this.scan(2);
            this.tid.auto = setTimeout(() => {
                this.tid.auto = false;
                this.stopScan();
                this.alert();
            }, 15000);
        }, min * 60000);

    },
    alert() {
        const store = ew.apps.itag.state.def.store;
        for (let tag in store) {
            const bat = store[tag].batt;
            const now = (Date.now() / 1000) | 0;
            // if over 5 hours old, ignore
            if (5 < ((now - store[tag].last) / 3600 | 0)) continue;

            const indx = ew.apps.itag.state.def.storeOrder.indexOf(tag)
            if (bat < 20) {
                ew.notify.alert("error", { "id": "1" + indx + "0", "src": "itag", "title": store[tag].name, "body": "Battery: " + bat + "%" }, 1, 1);
                //print("itag low", store[tag].name)

            }
            else if (bat < 40) {
                //print("itag medium", store[tag].name)
                ew.notify.alert("info", { "id": "1" + indx + "1", src: "itag", title: store[tag].name, body: "Battery: " + bat + "%" }, 1, 1);
            }
        }

        // devices (toilets / lights)
        this.devAlert("lBox");
        this.devAlert("light");

    },
    devAlert(role) {
        const store = this.state.def.devices[role];
        const now = (Date.now() / 1000) | 0;
        for (let mac in store) {
            const d = store[mac];
            // if over 5 hours old, ignore
            if (5 < ((now - d.last) / 3600 | 0)) continue;
            if (d.batt < 20) {
                ew.notify.alert("error", { "id": mac, "src": role, "title": d.name, "body": "Battery: " + d.batt + "%" }, 1, 1);
            }
            else if (d.batt < 40) {
                ew.notify.alert("info", { "id": mac, "src": role, "title": d.name, "body": "Battery: " + d.batt + "%" }, 1, 1);
            }
        }
    },
    stopScan() {
        if (3 < ew.apps.itag.dbg) console.log("itag: stop scan");
        NRF.setScan();
        if (ew.apps.itag.tid.checker && !ew.apps.itag.state.def.set.checker) {
            clearTimeout(ew.apps.itag.tid.checker);
            ew.apps.itag.tid.checker = 0;
        }
        ew.apps.itag.state.ble.scan = false;
        this.auto(this.state.def.set.auto);
    },
    conn(id, phyR) {

        if (ew.face && ew.face.appCurr === "itag") ew.face.go("itag-connect", 0);
        if (ew.apps.itag.tid.con) {
            clearTimeout(ew.apps.itag.tid.con);
            ew.apps.itag.tid.con = false;
        }
        ew.apps.itag.tid.con = setTimeout(() => {
            ew.apps.itag.tid.con = false;
            if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "NOT FOUND", "", 15, 13);
            setTimeout(() => { if (ew.face && ew.face.appCurr === "itag-connect") ew.face.go("itag", 0); }, 1500);
        }, 10000);
        var phy = ["1mbps", "coded", "both", "2mbps"];
        phyR = phyR || ew.apps.itag.state.def.set.phy;

        NRF.connect(id, {
            minInterval: ew.apps.itag.state.def.set.minInterval,
            maxInterval: ew.apps.itag.state.def.set.maxInterval,
            phy: phy[phyR],
            slaveLatency: ew.apps.itag.state.def.set.slaveLatency
        }).then(function(ga) {
            ew.apps.itag.state.ble.gatt = ga;
            if (3 < ew.apps.itag.dbg) console.log("getting service...");

            // Ρύθμιση handler για RSSI
            if (ew.apps.itag.tid.rssi) clearTimeout(ew.apps.itag.tid.rssi)
            ew.apps.itag.tid.rssi = 0;
            ew.apps.itag.state.ble.gatt.setRSSIHandler(function(rssi) {
                if (ew.face && !ew.face.pageCurr && ew.face.appCurr === "itag-connect" && !ew.apps.itag.tid.rssi) {
                    ew.apps.itag.tid.rssi = setTimeout(() => {
                        if (ew.face && ew.face.appCurr === "itag-connect") ew.UI.btn.c1l("main", "_main", 9, rssi + " ", "", 15, 1, 4);
                        ew.apps.itag.tid.rssi = 0;
                    }, 330);
                }
            });

            // Χειρισμός αποσύνδεσης
            ga.device.on('gattserverdisconnected', function(reason) {
                ew.apps.itag.state.connected = 0;

                if (ew.apps.itag.tid.rssi) {
                    clearTimeout(ew.apps.itag.tid.rssi);
                    ew.apps.itag.tid.rssi = 0;
                }
                //ew.apps.itag.state.ble.gatt.setRSSIHandler();

                if (ew.apps.itag.state.focus) {
                    ew.apps.itag.stopScan();
                    ew.apps.itag.scan();
                }

                if (3 < ew.apps.itag.dbg) console.log("disconnected: " + reason);

                if (reason === 62 && ew.face && ew.face.appCurr === "itag-connect") {
                    if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "TOO FAR", "", 15, 13);
                }
                else if (reason === 8 && ew.face && ew.face.appCurr === "itag-connect") {
                    if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "LOST", "", 15, 13);
                }
                else if (ew.face && ew.face.appCurr === "itag-connect") {
                    if (ew.UI) ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "DISCONNECTED", "", 0, 15);
                }

                if (ew.apps.itag.state.ble.next) {
                    ew.apps.itag.conn(ew.apps.itag.state.ble.next);
                    if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "CONNECTING", "", 0, 15);
                    ew.apps.itag.state.ble.next = 0;
                }
                else {
                    setTimeout(() => {
                        if (ew.face && ew.face.appCurr === "itag-connect") ew.face.go("itag", 0);
                    }, 1500);
                }
            });

            return ga.getPrimaryService(0xffe0);
        }).then(function(service) {
            if (ew.apps.itag.tid.con) {
                clearTimeout(ew.apps.itag.tid.con);
                ew.apps.itag.tid.con = 0;
            }
            if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "PRIMARY", "SERVICE", 0, 15);
            if (3 < ew.apps.itag.dbg) console.log("getting characteristic...");
            ew.apps.itag.state.ble.ser_sil = service;

            // Προσπάθεια λήψης του χαρακτηριστικού 0xffe1
            return service.getCharacteristic(0xffe1).catch(function(e) {
                if (3 < ew.apps.itag.dbg) console.log("Characteristic 0xffe1 not available:", e);
                return null; // Επιστροφή null αντί να απορριφθεί η Promise
            });
        }).then(function(characteristic) {
            if (characteristic) {
                if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "BUTTON", "CHARACTERISTIC", 0, 15);
                ew.apps.itag.state.ble.ffe1 = characteristic;

                // incomming
                characteristic.on('characteristicvaluechanged', function(evt) { ew.apps.itag.receive(evt.target.value.buffer) });

                if (3 < ew.apps.itag.dbg) console.log("starting notifications...");
                return characteristic.startNotifications().then(function() {
                    if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "START", "NOTIFICATIONS", 0, 15);
                    if (3 < ew.apps.itag.dbg) console.log("waiting for notifications");
                    return characteristic;
                }).catch(function(e) {
                    if (3 < ew.apps.itag.dbg) console.log("Notifications not supported:", e);
                    return characteristic;
                });
            }
            else {
                if (3 < ew.apps.itag.dbg) console.log("Skipping notifications - characteristic not available");
                return null;
            }
        }).then(function() {
            // Προσπάθεια λήψης του χαρακτηριστικού 0xffe2
            if (ew.apps.itag.state.ble.ser_sil) {
                return ew.apps.itag.state.ble.ser_sil.getCharacteristic(0xffe2).then(function(characteristic) {
                    if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "SILENCE", "CHARACTERISTIC", 0, 15);
                    if (3 < ew.apps.itag.dbg) console.log("got silence characteristic");
                    ew.apps.itag.state.ble.silence = characteristic;
                    return characteristic;
                }).catch(function(e) {
                    if (3 < ew.apps.itag.dbg) console.log("Characteristic 0xffe2 not available:", e);
                    ew.apps.itag.state.ble.silence = null;
                    return null;
                });
            }
            return null;
        }).then(function() {
            // Προσπάθεια λήψης της υπηρεσίας ειδοποιήσεων (0x1802)
            return ew.apps.itag.state.ble.gatt.getPrimaryService(0x1802).then(function(service) {
                if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "ALERT", "SERVICE", 0, 15);
                if (3 < ew.apps.itag.dbg) console.log("got alert service");
                return service.getCharacteristic(0x2A06);
            }).then(function(characteristic) {
                if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "ALERT", "CHARACTERISTIC", 0, 15);
                if (3 < ew.apps.itag.dbg) console.log("got alert characteristic");
                ew.apps.itag.state.ble.alert = characteristic;
                return characteristic;
            }).catch(function(e) {
                if (3 < ew.apps.itag.dbg) console.log("Alert service not available:", e);
                ew.apps.itag.state.ble.alert = null;
                return null;
            });
        }).then(function() {
            // Προσπάθεια λήψης της υπηρεσίας μπαταρίας (0x180F)
            return ew.apps.itag.state.ble.gatt.getPrimaryService(0x180F).then(function(service) {
                if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "BATTERY", "SERVICE", 0, 15);
                if (3 < ew.apps.itag.dbg) console.log("got battery service");
                return service.getCharacteristic(0x2A19);
            }).then(function(characteristic) {
                if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "BATTERY", "CHARACTERISTIC", 0, 15);
                if (3 < ew.apps.itag.dbg) console.log("got battery characteristic");
                ew.apps.itag.state.ble.battery = characteristic;
                return characteristic.readValue();
            }).then(function(d) {
                if (3 < ew.apps.itag.dbg) console.log("Got battery value:", JSON.stringify(d.buffer));
                ew.apps.itag.state.def.store[ew.apps.itag.state.ble.id].batt = d.buffer[0];
                return d;
            }).catch(function(e) {
                if (3 < ew.apps.itag.dbg) console.log("Battery service not available:", e);
                ew.apps.itag.state.ble.battery = null;
                return null;
            });
        }).then(function() {
            // Τελική ρύθμιση σιγήματος (αν υπάρχει το χαρακτηριστικό)
            if (ew.apps.itag.state.ble.silence) {
                ew.apps.itag.state.ble.silence.writeValue(
                    (ew.apps.itag.state.def.store[ew.apps.itag.state.ble.id].sil) ? 0 : 1
                );
            }

            ew.apps.itag.state.connected = 1;
            if (ew.face && ew.face.appCurr === "itag-connect") ew.face[0].bar(); //ew.face.go("itag-connect", 0);
        }).catch(function(e) {
            if (3 < ew.apps.itag.dbg) console.log("itag: catch Error: " + e);
            if (e === "ERR 0x12 (CONN_COUNT)") {
                if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "MAX 2", "CONNECTIONS", 13, 15);
            }
            else {
                if (3 < ew.apps.itag.dbg) console.log("itag: disconnected");
            }
        });

    },
    receive(data) {
        if (3 < ew.apps.itag.dbg) console.log("notification incoming data : ", data);
        if (3 < ew.apps.itag.dbg) console.log("notification incoming data string: ", E.toString(data));
        if (3 < ew.apps.itag.dbg) console.log("notification incoming data length: ", data.length);
        if (data.length === 1) {
            ew.sys.buzz.alrm(ew.sys.buzz.type.alert);
            if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "BUTTON", "PRESSED", 15, 4);
        }
        else {
            data = JSON.parse(E.toString(data));
            if (ew.face && ew.face.appCurr === "itag-connect" && ew.UI) ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, data.s.toUpperCase(), "", 0, 15);
        }
    },


};


// --- defaults ---
ew.apps.itag.state.def = Object.assign(
    ew.apps.itag.state.def,
    (require("Storage").readJSON("ew.json", true) || {}).itag || {}
);
if (ew.apps.itag.state.def.set.newG == undefined) ew.apps.itag.state.def.set.newG = true;


// install icon
if (!require('Storage').read("ew_i_itag.img")) {
    let icon = "lEowIOLh+A/AEBj/B/gEBn/D/wEBv/jAgfn/4Ean/nEQQsDgkf4f8jEfh+B/l8n+HgP4/1/4EAoP/AgUB///AgMDAhEHAgV8AgXB/0H/3/4f/AgN/wf/w/8v+HAgP4n8PCAPwh0f//g8BZB//wKgIkBKgI9CMYIEDwAED4BCCAgIOIwAiCQwcAvi8FA=";
    require('Storage').write("ew_i_itag.img", require("heatshrink").decompress(atob(icon)));
    require('Storage').write("ew_i_itag-dev.img", require("heatshrink").decompress(atob(icon)));
    require('Storage').write("ew_i_itag-connect.img", require("heatshrink").decompress(atob(icon)));
}


// start auto scan if enabled
ew.apps.itag.stopScan();
