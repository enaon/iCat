//itag viewer

ew.apps.itag = {

    tid: { con: 0, rssi: 0, checker: 0, alarm: 0, auto: 0, focus:0 },

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

    scan(phyR) {

        if (this.google.pendingBond) {
            ew.UI.btn.ntfy(1, 25, 0, "_bar", 6, "SCAN PAUSED", "BONDING", 15, 13);
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

        // ---- start checker ----
        ew.apps.itag.checker();

        // ---- start scan ----
        NRF.setScan(function(device) {

            // check if Espuino
            let ewD = false;
            if (!all && device.manufacturer === 1424) {
                // is it an eW device ?
                if (device.manufacturerData[0] & 4) ewD = device.manufacturerData;
                else return;
            }

            // check if device exists
            const id = device.id;
            const devE = dev[id];

            // device exists
            if (devE !== undefined) {
                devE.rfrs = true;
                devE.rssi = device.rssi;
                return;
            }

            // new device
            setTimeout(() => { ew.apps.itag.newD(device, ewD) }, 10);

        }, {
            filters: [
                ew.apps.itag.state.def.set.scanAll ? {} : // no filter
                { manufacturerData: { 0x0105: {} } }, // itag
                { manufacturerData: { 0x0590: {} } }, //espruino
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
            //id: id,
            rssi: device.rssi,
            live: true,
            oflc: 0,
            rfrs: true
        };

        // check if google tag         
        let Google = (device.serviceData && device.serviceData.feaa) ? 1 : 0;
        if (Google) {
            newD.name = "Google";
            if (2 < ew.apps.itag.dbg) print("itag: found google tag");

            // check if bond info exists
            if (!this.google.isBond(id)) {
                //schedule bonding   
                if (!this.google.pendingBond) {
                    this.google.pendingBond = true;
                    ew.apps.itag.stopScan();
                    ew.UI.btn.ntfy(1, 25, 0, "_bar", 6, "SCAN PAUSED", "BONDING", 15, 13);
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

        // itag mode
        if (!this.state.def.set.scanAll) {
            let stor = this.state.def.store[id];

            // new entry
            if (!this.state.def.set.lock && !stor) {

                newD = {
                    id: id,
                    name: device.name || "No Name",
                    batt: 100,
                    silent: 1,
                    alert: 0
                };

                // device is eW
                if (ewD) {
                    newD.phy = (ewD[1] >> 2) & 0x07;
                    //newD.rfTX = (device.manufacturerData[1] >> 5) & 0x07;
                    newD.batt = ewD[2];
                    newD.volt = ewD[3];
                    newD.board = (ewD[4]) & 0x0F;
                    newD.name = newD.name.substr(3);
                }

                if (Google) {
                    newD.google = true;
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
                if (ewD[4] & 16) stor.name = device.name.substr(3); ///if (ewD[4] & (1 << 4))
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

                    if (!store[savedId].google) continue;

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
                ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "BOND OK", "SCANNING", 15, 6);
                if (ew.face.appCurr === "itag") ew.apps.itag.scan();

            }).catch((e) => {
                if (2 < ew.apps.itag.dbg) console.log("itag: google bond failed:", e);
                ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "BOND FAIL", "SCANNING", 15, 13);

                if (this.pendingGatt) {
                    try { this.pendingGatt.disconnect(); }
                    catch (e) {}
                    this.pendingGatt = null;
                }
                this.pendingBond = false;
                if (ew.face.appCurr === "itag") ew.apps.itag.scan();
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
            store[newKey].id = newKey;
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

            const deviceIds = Object.keys(dev);

            for (let i = 0; i < deviceIds.length; i++) {
                const id = deviceIds[i];
                counter++;
                let device = dev[id];

                if (device.rfrs) {
                    if (3 < ew.apps.itag.dbg) console.log("checker id online:", id);

                    device.rfrs = false;
                    device.live = true;
                    device.oflc = 0; // reset            
                    device.lastseen = now;
                    if (!all && store[id])
                        store[id].lastseen = now;

                    if (!tid.alarm && id === focus) {
                        tid.alarm = setTimeout(function() {
                            ew.sys.buzz.nav([100, 50, 100, 50, 100]);
                            ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, store[id].name.toUpperCase(), "FOUND", 15, 4);
                            tid.alarm = 0;
                        }, 50);
                    }

                }
                else if (maxOfflineTime < now - device.lastseen) {
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

            if (ew.face.appCurr === "itag") ew.face[0].update();

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
            if (ew.sys.batt(1) < 25 )
                 ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "ITAG SCAN", "LOW BAT", 15, 13);
            else
                this.scan(2);
            this.tid.auto = setTimeout(() => {
                this.tid.auto = false;
                this.stopScan();
                //this.alert();
            }, 25000);
        }, min * 60000);

    },
    alert() {
        let store=ew.apps.itag.state.def.store;
        for (let tag in ew.apps.itag.state.def.store){
            ew.notify.alert("error", {title: "ITAG:"+store[tag].name.toUpperCase() , body: "BAT LOW"  }, 1, 1);
            print( "tag name",store[tag].name)
            if (store[tag].batt < 20 )
                print ("itag low",store[tag].name)
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

        if (ew.face.appCurr === "itag") ew.face.go("itag-connect", 0);
        if (ew.apps.itag.tid.con) {
            clearTimeout(ew.apps.itag.tid.con);
            ew.apps.itag.tid.con = false;
        }
        ew.apps.itag.tid.con = setTimeout(() => {
            ew.apps.itag.tid.con = false;
            ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "NOT FOUND", "", 15, 13);
            setTimeout(() => { if (ew.face.appCurr === "itag-connect") ew.face.go("itag", 0); }, 1500);
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
                if (!ew.face.pageCurr && ew.face.appCurr === "itag-connect" && !ew.apps.itag.tid.rssi) {
                    ew.apps.itag.tid.rssi = setTimeout(() => {
                        if (ew.face.appCurr === "itag-connect") ew.UI.btn.c1l("main", "_main", 9, rssi + " ", "", 15, 1, 4);
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

                if (reason === 62 && ew.face.appCurr === "itag-connect") {
                    ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "TOO FAR", "", 15, 13);
                }
                else if (reason === 8 && ew.face.appCurr === "itag-connect") {
                    ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "LOST", "", 15, 13);
                }
                else if (ew.face.appCurr === "itag-connect") {
                    ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "DISCONNECTED", "", 0, 15);
                }

                if (ew.apps.itag.state.ble.next) {
                    ew.apps.itag.conn(ew.apps.itag.state.ble.next);
                    if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "CONNECTING", "", 0, 15);
                    ew.apps.itag.state.ble.next = 0;
                }
                else {
                    setTimeout(() => {
                        if (ew.face.appCurr === "itag-connect") ew.face.go("itag", 0);
                    }, 1500);
                }
            });

            return ga.getPrimaryService(0xffe0);
        }).then(function(service) {
            if (ew.apps.itag.tid.con) {
                clearTimeout(ew.apps.itag.tid.con);
                ew.apps.itag.tid.con = 0;
            }
            if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "PRIMARY", "SERVICE", 0, 15);
            if (3 < ew.apps.itag.dbg) console.log("getting characteristic...");
            ew.apps.itag.state.ble.ser_sil = service;

            // Προσπάθεια λήψης του χαρακτηριστικού 0xffe1
            return service.getCharacteristic(0xffe1).catch(function(e) {
                if (3 < ew.apps.itag.dbg) console.log("Characteristic 0xffe1 not available:", e);
                return null; // Επιστροφή null αντί να απορριφθεί η Promise
            });
        }).then(function(characteristic) {
            if (characteristic) {
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "BUTTON", "CHARACTERISTIC", 0, 15);
                ew.apps.itag.state.ble.ffe1 = characteristic;

                // incomming
                characteristic.on('characteristicvaluechanged', function(evt) { ew.apps.itag.receive(evt.target.value.buffer) });

                if (3 < ew.apps.itag.dbg) console.log("starting notifications...");
                return characteristic.startNotifications().then(function() {
                    if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "START", "NOTIFICATIONS", 0, 15);
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
                    if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "SILENCE", "CHARACTERISTIC", 0, 15);
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
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "ALERT", "SERVICE", 0, 15);
                if (3 < ew.apps.itag.dbg) console.log("got alert service");
                return service.getCharacteristic(0x2A06);
            }).then(function(characteristic) {
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "ALERT", "CHARACTERISTIC", 0, 15);
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
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "BATTERY", "SERVICE", 0, 15);
                if (3 < ew.apps.itag.dbg) console.log("got battery service");
                return service.getCharacteristic(0x2A19);
            }).then(function(characteristic) {
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "BATTERY", "CHARACTERISTIC", 0, 15);
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
                    (ew.apps.itag.state.def.store[ew.apps.itag.state.ble.id].silent) ? 0 : 1
                );
            }

            ew.apps.itag.state.connected = 1;
            if (ew.face.appCurr === "itag-connect") ew.face[0].bar(); //ew.face.go("itag-connect", 0);
        }).catch(function(e) {
            if (3 < ew.apps.itag.dbg) console.log("itag: catch Error: " + e);
            if (e === "ERR 0x12 (CONN_COUNT)") {
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "MAX 2", "CONNECTIONS", 13, 15);
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
            if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "BUTTON", "PRESSED", 15, 4);
        }
        else {
            data = JSON.parse(E.toString(data));
            if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, data.s.toUpperCase(), "", 0, 15);
        }
    },


};

// defaults
if (require('Storage').readJSON('ew.json', 1).itag) {
    ew.apps.itag.state.def = require('Storage').readJSON('ew.json', 1).itag;
    if (!ew.apps.itag.state.def) ew.apps.itag.state.def = { store: {}, storeOrder: [], hiddenOrder: [], pos: 0, set: { phy: 0, autoPhy: 1, minInterval: 50, maxInterval: 100, slaveLatency: 4, persist: 0, rssi: 1, pos: 0, keepFor: 5, storeLock: 0, scanAll: 0, checker: 1, showHidden: 0, rssiHandler: 0, auto: 0 } };
    //ew.apps.itag.state.def.storeOrder=  Object.values(ew.apps.itag.state.def.store).map(item => item.id);
}

// icons
//ew.UI.icon.scan="mEwwIcZg/+Aocfx+AAoV4gPgAoQDBuAEBgPAgE4AoQVBjgFBgYCBhgoCAQMGAQUgAolACggFL6AFGGQQFJEZsGsAFEIIhNFLIplFgBxBnwFCPYP/AoU8gf/BwKVB/+/SAUD/kf+CjDh/4V4n8AoYeBAoq1DgIqDAAP/XYcAv4qEn4qEGwsfC4kPEYkHF4Z1DACA=";
//ew.UI.icon.trash="mEwwI1yg/4AocP/gFDhkMApE//4ABAo4PCAUIACAv4FQATkGAQMYXwSgBYAUBAoPgdsg";
//ew.UI.icon.move="mEwwIYWAok4Aok8Aok+Aok/AouAAonAAongAonwAon4Aon8AQP/AAP+gF/AoX/AovAAongAonwAon4Aon8AoqldFJZZDLQMfAokPAokHAokDDokBJopQFRowFEh4FEg4FEgYFEgIFEgB6FvjoKjgFEhB9IA=";
//ew.UI.icon.alarm="mEwwIKH/ACBh8Agf+AoN/4EH/+AgH/+EP//AgP//EfAoMDAo38n4dDAoIpCj4FB8E//kHAoPA///wIFBwYFB8AFBGAI0BvkeFQIuBnkcn/wDgM4FgOAgIyC/41CAQIICn4OB/kB4EfAoP4AoMPKAPwAo8H8ABBAo8DAoJ2BAo5EBAYIFF8AFE+AFE/gFC8BMBEYQFBh+DAocHw4fCL4IJBAoZTBL4IFE/inCZAJ3EQYzaBR4abBh4aDU4QFEBYU/AoIXCvwFB3wFBvjbBjwFBXYMAAoQAEA=";
//ew.UI.icon.power="lkuwIKHgP4AocfwAKN+P4+AJCz+fBYMH/P5/wKB/4KBCAMfBQP/wED/0fw/8gF/4P4n/gg/wFYIbB/w2BBAXABQM/wP8BQMD/AIBAIWD/BMC/k/JgUP4fwBQd+BQUH8/gBQV+BSJwCBQQABBQw2BAAI2CAoRBBRgUfNYKbDMQIFBMQQEBMQMPEwV/AIQlBQYIQBSIIXBCAN/4EB//An4pBh//AAIdCAgISBCAP/HIQQCaoa5BAoU/IYQAEA=";

//ew.UI.icon.itag="mUywIROh8Aj4FD8Ef8AFBg/8h/8AoMD/+D/+AAwP/8P/CQU//l/CQUf/8//4eC//P//AgEB//z//wBgIWB/4YOGIIYEn/4v/4CQX+j/+AoIrBw4eCvE/4H/4Pgv8H8E/8H8MwPwg/wv+PHQX4n/nDYRBB/pmDh///40CPIP/GggABP4V/AoPgh+ALwIYBh/wDwO//xRBDwIxBAYJLB+JNBCgKYC8AtBh4BBNwIOCgJYBCQWAjhHCg6JBAoTNDJohTCBgRTDOYRTCLQRTCVAQkCCQQeDQwQFDG4JDBFYY3CRgYiBZIKYCa4QAHA==";
//ew.UI.icon.itag="mEwwg63h//+AHE///CxwABDAYGCDBgPDCAQeDHAwXMAwgXKE4gQCAwhIKC4wGFC/4X/C+TvXC6g9BJAoPCC44bECI4FCMAgMEFQ4FCJ4wLEAoRqMCQJNGTYyCKWgwXXZSCUFC9JGLC4iqGC57yGC43wC5AfLX5QOGBA4GFcgwgKeoxtIC4woGQpIQICIZGJEQyXDAAIWLPIjjUfRQuKDBj6MDBQWNOowXRGBAX/C76nOR5AwGA5IwLf5YAaA"
//ew.UI.icon.itag="lEowIOLh+A/AEBj/B/gEBn/D/wEBv/jAgfn/4Ean/nEQQsDgkf4f8jEfh+B/l8n+HgP4/1/4EAoP/AgUB///AgMDAhEHAgV8AgXB/0H/3/4f/AgN/wf/w/8v+HAgP4n8PCAPwh0f//g8BZB//wKgIkBKgI9CMYIEDwAED4BCCAgIOIwAiCQwcAvi8FA=";

// install icon
if (!require('Storage').read("ew_i_itag.img"))  {
    let icon="lEowIOLh+A/AEBj/B/gEBn/D/wEBv/jAgfn/4Ean/nEQQsDgkf4f8jEfh+B/l8n+HgP4/1/4EAoP/AgUB///AgMDAhEHAgV8AgXB/0H/3/4f/AgN/wf/w/8v+HAgP4n8PCAPwh0f//g8BZB//wKgIkBKgI9CMYIEDwAED4BCCAgIOIwAiCQwcAvi8FA=";
    require('Storage').write("ew_i_itag.img", require("heatshrink").decompress(atob(icon)) );
    require('Storage').write("ew_i_itag-dev.img", require("heatshrink").decompress(atob(icon)));
    require('Storage').write("ew_i_itag-connect.img", require("heatshrink").decompress(atob(icon)));
}


// start auto scan if enabled
ew.apps.itag.stopScan();

