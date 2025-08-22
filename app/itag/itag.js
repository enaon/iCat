//itag viewer

ew.apps.itag = {
    tid:0,
    state: {
        lost: 0,
        alert: 0,
        ble: { scan: 0, next: 0, gatt: {} },
        def: { store:[], batt:{}, dev: [] },
    },
scan: function() {
    // Αρχικοποίηση deviceMap αν δεν υπάρχει
    if (!ew.apps.itag.state.def.deviceMap) {
        ew.apps.itag.state.def.deviceMap = {};
    }
    
    // Αρχικοποίηση store αν δεν υπάρχει
    if (!ew.apps.itag.state.def.store) {
        ew.apps.itag.state.def.store = [];
    }

    var deviceMap = ew.apps.itag.state.def.deviceMap;
    var store = ew.apps.itag.state.def.store;

    // Ρυθμίσεις σάρωσης
    NRF.setScan(function(device) {
        var now = Date.now();
        var deviceExistsInStore = false;
        
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
            ew.apps.itag.state.def.dev.push(deviceObj);
            deviceMap[device.id] = deviceObj;
            
            // Προσθήκη νέου αντικειμένου στο store ΜΟΝΟ αν δεν υπάρχει
            if (!deviceExistsInStore) {
                var storeDevice = {
                    id: device.id,
                    name: "Unknown",
                    batt: 0, // Προεπιλεγμένη τιμή
                    lastseen: now,
                    silent: 0, // Προεπιλεγμένη τιμή
                    alert: 0
                };
                store.push(storeDevice);
            }
        }
    }, {
        filters: [{ manufacturerData: { 0x0105: {} } }],
        interval: 300,
        window: 300
    });

    // Εάν δεν υπάρχει ήδη offline checker, τον δημιουργούμε
    if (!ew.apps.itag.state.def.offlineChecker) {
        ew.apps.itag.state.def.offlineChecker = setInterval(function() {
            var maxOfflineTime = 6000; // 6 δευτερόλεπτα offline
            var now = Date.now();
            
            // Ενημέρωση κατάστασης συσκευών
            for (var i = 0; i < ew.apps.itag.state.def.dev.length; i++) {
                var device = ew.apps.itag.state.def.dev[i];
                if (now - device.lastSeen < maxOfflineTime) {
                    device.live = true;
                } else {
                    device.live = false;
                    device.offlineCount = (device.offlineCount || 0) + 1;
                }
            }

            // Αφαίρεση συσκευών που είναι offline για πολύ καιρό
            for (var i = ew.apps.itag.state.def.dev.length - 1; i >= 0; i--) {
                var device = ew.apps.itag.state.def.dev[i];
                if (device.offlineCount > 50) {
                    // Διαγραφή από deviceMap
                    delete deviceMap[device.id];
                    // Διαγραφή από τον πίνακα συσκευών
                    ew.apps.itag.state.def.dev.splice(i, 1);
                    
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

            var liveCount = ew.apps.itag.state.def.dev.filter(function(d) { return d.live; }).length;
            if (ew.face.appCurr === "itag_scan") ew.face[0].bar();
            else if  (ew.face.appCurr === "itag_connect") ew.face.go("itag_scan",0);

        }, 1000); // Έλεγχος κάθε 1 δευτερόλεπτα
    }
},

// Συνάρτηση για να σταματήσει την σάρωση και τον offline checker
stopScan: function() {
    NRF.setScan(); // Stop σάρωσης
    if (ew.apps.itag.state.def.offlineChecker) {
        clearInterval(ew.apps.itag.state.def.offlineChecker);
        ew.apps.itag.state.def.offlineChecker = undefined;
    }
    ew.apps.itag.state.ble.scan = false;
},
    conn: function(c) {
        ew.notify.alert("info", { title: "CONNECTING", body: "" }, 0, 0);
        if (ew.apps.itag.tid) {clearTimeout(ew.apps.itag.tid); ew.apps.itag.tid=0}
        ew.apps.itag.state.ble.id=c;
        ew.apps.itag.stopScan();
        NRF.connect(c, { minInterval: 7.5, maxInterval: 15 }).then(function(ga) {
            //NRF.connect(c).then(function(ga) {
            ew.apps.itag.state.ble.gatt = ga;
            console.log("getting service...");
            ga.device.on('gattserverdisconnected', function(reason) {
                console.log("disconnected: " + reason);
                if (reason === 62 ){
                 ew.notify.alert("info", { title: "ERROR 62", body: "" }, 0, 0);
                  //ew.apps.itag.tid=setTimeout(()=>{ew.apps.itag.conn(ew.apps.itag.state.ble.id)},1500);  
                }
                if (reason === 8 ){
                 ew.notify.alert("info", { title: "LOST 8", title: "body" }, 0, 0);
                  //ew.apps.itag.state.ble.gatt.disconnect();
                  //ew.apps.itag.tid=setTimeout(()=>{ew.apps.itag.conn(ew.apps.itag.state.ble.id)},1500);  
                  //return;
                }
                if (ew.face.appCurr === "itag_connect")  ew.face.go("itag_scan",0);
                if (ew.apps.itag.state.ble.next) {
                    ew.apps.itag.conn(ew.apps.itag.state.ble.next);
                    ew.notify.alert("info", { title: "CONNECTING", body: "" }, 0, 0);
                    ew.apps.itag.state.ble.next = 0;
                }else ew.apps.itag.scan();
            });
            return ga.getPrimaryService(0xffe0);
        }).then(function(service) {
            console.log("getting characteristic...");
            ew.apps.itag.state.ble.ser_sil=service;
            return service.getCharacteristic(0xffe1);
        }).then(function(characteristic) {
            characteristic.on('characteristicvaluechanged', function(data) {
                console.log("notification data: ", data);
            });
            console.log("starting notifications...");
            return characteristic.startNotifications();
        }).then(function() {
            console.log("waiting for notifications");
            return ew.apps.itag.state.ble.ser_sil.getCharacteristic(0xffe2);
        }).then(function(characteristic) {
            console.log("got silence characteristic");
            ew.apps.itag.state.ble.silence=characteristic;
            //characteristic.writeValue(0);
            return ew.apps.itag.state.ble.gatt.getPrimaryService(0x1802);
        }).then(function(service) {
            console.log("got alert service");
            return service.getCharacteristic(0x2A06);
        }).then(function(characteristic) {
            console.log("got alert characteristic");
            ew.apps.itag.state.ble.alert=characteristic;
            return ew.apps.itag.state.ble.gatt.getPrimaryService(0x180F);
        }).then(function(service) {
            console.log("got battery service");
            return service.getCharacteristic(0x2A19);
        }).then(function(characteristic) {
            console.log("got battery characteristic");
            ew.apps.itag.state.ble.battery=characteristic;
            //ew.apps.itag.state.def.batt[ew.apps.itag.state.ble.id]=characteristic.readValue(); 
            if (!ew.apps.itag.state.lost) ew.apps.itag.state.ble.silence.writeValue(0);
            if (ew.face.appCurr === "itag_scan") ew.face.go("itag_connect",0);

        }).catch(function(e) {
            console.log("catch Error: " + e);
            if (e === "ERR 0x12 (CONN_COUNT)")
                ew.notify.alert("error", { body: "CONNECTIONS", title: "MAX 2" }, 1, 1);
        });

    }

};

//ew.apps.itag.scan();
