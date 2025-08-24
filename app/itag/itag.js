//itag viewer

ew.apps.itag = {
    tid: 0,
    state: {
        lost: 0,
        alert: 0,
        ble: { scan: 0, next: 0, gatt: {} },
        def: [],
        dev: []
    },
    scan: function() {
        // Αρχικοποίηση deviceMap αν δεν υπάρχει
        if (!ew.apps.itag.state.deviceMap) {
            ew.apps.itag.state.deviceMap = {};
        }

        // Αρχικοποίηση store αν δεν υπάρχει
        if (!ew.apps.itag.state.def) {
            ew.apps.itag.state.def = [];
        }

        var deviceMap = ew.apps.itag.state.deviceMap;
        var store = ew.apps.itag.state.def;

        // Ρυθμίσεις σάρωσης
        NRF.setScan(function(device) {
            var now = Date.now();
            var deviceExistsInStore = false;
            //print(device);

            if (device.manufacturer === 261 || device.name=== "eC-08") {

                // Ενημέρωση lastseen στο store (ανεξάρτητα από το αν υπάρχει στο deviceMap)
                for (var i = 0; i < store.length; i++) {
                    if (store[i].id === device.id) {
                        store[i].lastseen = now;
                        deviceExistsInStore = true;
                        break;
                    }
                }

                // Χρησιμοποιούμε το deviceMap για γρήγορο έλεγχο ύπαρξης
                if (deviceMap[device.id] !== undefined) {
                    // Υπάρχουσα συσκευή - ενημέρωση
                    var existingDevice = deviceMap[device.id];
                    existingDevice.rssi = device.rssi;
                    existingDevice.live = true;
                    existingDevice.lastSeen = now;
                    existingDevice.offlineCount = 0; // reset
                }
                else {
                    // Νέα συσκευή
                    var deviceObj = {
                        id: device.id,
                        rssi: device.rssi,
                        live: true,
                        lastSeen: now,
                        offlineCount: 0
                    };
                    if (device.name) deviceObj.name = device.name;

                    // Προσθήκη νέας συσκευής
                    ew.apps.itag.state.dev.push(deviceObj);
                    deviceMap[device.id] = deviceObj;

                    // Προσθήκη νέου αντικειμένου στο store ΜΟΝΟ αν δεν υπάρχει
                    if (!deviceExistsInStore) {
                        var storeDevice = {
                            id: device.id,
                            name: "Unknown",
                            batt: 100,  
                            lastseen: now,
                            silent: 1,  
                            alert: 0
                        };
                        store.push(storeDevice);
                    }
                }
            }
        }, {
           // filters: [{ manufacturerData: { 0x0105: {} } }],
            interval: 300,
            window: 300
        });

        // Εάν δεν υπάρχει ήδη offline checker, τον δημιουργούμε
        if (!ew.apps.itag.state.offlineChecker) {
            ew.apps.itag.state.offlineChecker = setInterval(function() {
                var maxOfflineTime = 6000; // 6 δευτερόλεπτα offline
                var now = Date.now();

                // Ενημέρωση κατάστασης συσκευών
                for (var i = 0; i < ew.apps.itag.state.dev.length; i++) {
                    var device = ew.apps.itag.state.dev[i];
                    if (now - device.lastSeen < maxOfflineTime) {
                        device.live = true;
                    }
                    else {
                        device.live = false;
                        device.offlineCount = (device.offlineCount || 0) + 1;
                    }
                }

                // Αφαίρεση συσκευών που είναι offline για πολύ καιρό
                for (var i = ew.apps.itag.state.dev.length - 1; i >= 0; i--) {
                    var device = ew.apps.itag.state.dev[i];
                    if (device.offlineCount > 50) {
                        // Διαγραφή από deviceMap
                        delete deviceMap[device.id];
                        // Διαγραφή από τον πίνακα συσκευών
                        ew.apps.itag.state.dev.splice(i, 1);

                        /*
                        // Διαγραφή από το store
                        for (var j = 0; j < store.length; j++) {
                            if (store[j].id === device.id) {
                                store.splice(j, 1);
                                break;
                            }
                        }
                        */
                    }
                }

                var liveCount = ew.apps.itag.state.dev.filter(function(d) { return d.live; }).length;
                if (ew.face.appCurr === "itag-scan") ew.face[0].update();
                else if (ew.face.appCurr === "itag-connect") ew.face.go("itag-scan", 0);

            }, 1000); // Έλεγχος κάθε 1 δευτερόλεπτα
        }
    },
    stopScan: function() {
        NRF.setScan(); // Stop σάρωσης
        if (ew.apps.itag.state.offlineChecker) {
            clearInterval(ew.apps.itag.state.offlineChecker);
            ew.apps.itag.state.offlineChecker = undefined;
        }
        ew.apps.itag.state.ble.scan = false;
    },
    conn: function(c) {
        ew.apps.itag.state.ble.id = c;
        if (ew.face.appCurr === "itag-scan") ew.face.go("itag-connect", 0);
        if (ew.apps.itag.tid) { clearTimeout(ew.apps.itag.tid);
            ew.apps.itag.tid = 0; }
        ew.apps.itag.stopScan();
        NRF.connect(c, { minInterval: 50, maxInterval: (-85 < ew.apps.itag.state.dev.find(item => item.id === c).rssi)?100:400
        }).then(function(ga) {
        //NRF.connect(c).then(function(ga) {
            ew.apps.itag.state.ble.gatt = ga;
            if (ew.apps.itag.dbg) console.log("getting service...");
            ga.device.on('gattserverdisconnected', function(reason) {
                ew.apps.itag.state.connected=0;
                if (ew.apps.itag.dbg) console.log("disconnected: " + reason);
                if (reason === 62 && ew.face.appCurr === "itag-connect") {
                   ew.UI.btn.ntfy(1,2,0,"_bar",6,"TOO FAR","",15,13); 
                }
                else if (reason === 8 && ew.face.appCurr === "itag-connect") {
                    ew.UI.btn.ntfy(1,2,0,"_bar",6,"LOST","",15,13); 
                }
                else if ( ew.face.appCurr === "itag-connect") {
                    ew.UI.btn.ntfy(1,2,0,"_bar",6,"DICONNECTED","",0,15); 
                }
                if (ew.apps.itag.state.ble.next) {
                    ew.apps.itag.conn(ew.apps.itag.state.ble.next);
                    if ( ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,1.5,0,"_bar",6,"CONNECTING","",0,15); 
                    ew.apps.itag.state.ble.next = 0;
                }
                else setTimeout(()=>{ if (ew.face.appCurr==="itag-connect") ew.face.go("itag-scan", 0); },1500);
            });
            return ga.getPrimaryService(0xffe0);
        }).then(function(service) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"PRIMARY","SERVICE" ,0,15); 
            if (ew.apps.itag.dbg) console.log("getting characteristic...");
            ew.apps.itag.state.ble.ser_sil = service;
            return service.getCharacteristic(0xffe1);
        }).then(function(characteristic) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"BUTTON","CHARACTERISTIC" ,0,15); 

            characteristic.on('characteristicvaluechanged', function(data) {
                if (ew.apps.itag.dbg) console.log("notification data: ", data);
            });
            if (ew.apps.itag.dbg) console.log("starting notifications...");
            return characteristic.startNotifications();
        }).then(function() {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"START","NOTIFICATIONS" ,0,15); 

            if (ew.apps.itag.dbg) console.log("waiting for notifications");
            return ew.apps.itag.state.ble.ser_sil.getCharacteristic(0xffe2);
        }).then(function(characteristic) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"SILENCE","CHARACTERISTIC" ,0,15); 

            if (ew.apps.itag.dbg) console.log("got silence characteristic");
            ew.apps.itag.state.ble.silence = characteristic;
            return ew.apps.itag.state.ble.gatt.getPrimaryService(0x1802);
        }).then(function(service) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"ALERT","SERVICE" ,0,15); 

            if (ew.apps.itag.dbg) console.log("got alert service");
            return service.getCharacteristic(0x2A06);
        }).then(function(characteristic) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"ALERT","CHARACTERISTIC" ,0,15); 

            if (ew.apps.itag.dbg) console.log("got battery characteristic");
            ew.apps.itag.state.ble.alert = characteristic;
            return ew.apps.itag.state.ble.gatt.getPrimaryService(0x180F);
        }).then(function(service) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"BATTERY","SERVICE" ,0,15); 

            if (ew.apps.itag.dbg) console.log("got battery service");
            return service.getCharacteristic(0x2A19);
        }).then(function(characteristic) {
            if (ew.face.appCurr === "itag-connect")  ew.UI.btn.ntfy(1,10,0,"_bar",6,"BATTERY","CHARACTERISTIC" ,0,15); 

            if (ew.apps.itag.dbg) console.log("got battery characteristic");
            ew.apps.itag.state.ble.battery = characteristic;
            return characteristic.readValue(); 
         }).then(function(d) {
            if (ew.apps.itag.dbg) console.log("Got battery value:", JSON.stringify(d.buffer));
            ew.apps.itag.state.def.find(item => item.id === ew.apps.itag.state.ble.id).batt=d.buffer[0];
            ew.apps.itag.state.ble.silence.writeValue((ew.apps.itag.state.def.find(item => item.id === ew.apps.itag.state.ble.id).silent)?0:1);
            ew.apps.itag.state.connected=1;
            if (ew.face.appCurr === "itag-connect") ew.face.go("itag-connect", 0);
            
        }).catch(function(e) {
            if (ew.apps.itag.dbg) console.log("itag: catch Error: " + e);
            if (e === "ERR 0x12 (CONN_COUNT)"){
                if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1,1.5,0,"_bar",6,"MAX 2","CONNECTIONS",13,15); 
            }else {
                if (ew.apps.itag.dbg) console.log("itag: disconnected");
                //if (ew.face.appCurr === "itag-connect") ew.UI.btn.ntfy(1,1.5,0,"_bar",6,"DISCONNECTING","",0,15); 
                ew.apps.itag.state.ble.gatt.disconnect();
            }
        });

    }

};
if (require('Storage').readJSON('ew.json', 1).itag)
    ew.apps.itag.state.def = require('Storage').readJSON('ew.json', 1).itag;



//ew.apps.itag.scan();
