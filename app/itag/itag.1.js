//itag viewer

ew.apps.itag={
    state:{
        ble: {scan:0, next:0, gatt:{}},
        def:{dev:[]},
    },
    scan: function() {
        ew.apps.itag.state.ble.scan=1;

        NRF.findDevices(function(devices) {
            var deviceMap = {};

            // Ορίζουμε όλα τα υπάρχοντα devices ως offline
            ew.apps.itag.state.def.dev.forEach(function(device, index) {
                deviceMap[device.id] = index;
                device.live = false;
            });

            // Ενημερώνουμε τα devices που βρέθηκαν
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                var existingIndex = deviceMap[device.id];

                if (existingIndex === undefined) {
                    // Νέα συσκευή
                    var deviceObj = {
                        id: device.id,
                        rssi: device.rssi,
                        live: true
                    };
                    if (device.name) deviceObj.name = device.name;
                    ew.apps.itag.state.def.dev.push(deviceObj);
                }
                else {
                    // Υπάρχουσα συσκευή
                    ew.apps.itag.state.def.dev[existingIndex].rssi = device.rssi;
                    ew.apps.itag.state.def.dev[existingIndex].live = true;
                }
            }

            // Προαιρετικό: Αφαίρεση συσκευών που είναι offline για πολύ καιρό
            var maxOfflineTime = 20; // μέγιστος αριθμός scans που επιτρέπεται να είναι offline
            ew.apps.itag.state.def.dev = ew.apps.itag.state.def.dev.filter(function(device) {
                if (device.live) {
                    device.offlineCount = 0; // reset counter
                    return true;
                }
                else {
                    device.offlineCount = (device.offlineCount || 0) + 1;
                    return device.offlineCount <= maxOfflineTime;
                }
            });

           /* // Ταξινόμηση: live devices πρώτα, μετά με βάση RSSI
            ew.apps.itag.state.def.dev.sort(function(a, b) {
                //if (a.live !== b.live) return b.live - a.live;
                return b.rssi - a.rssi;
            });
            */
            //ew.face[0].data.fields = ew.apps.itag.state.def.dev.length;
            if ( ew.face.appCurr === "itag") ew.face[0].bar();

            var liveCount = ew.apps.itag.state.def.dev.filter(function(d) { return d.live; }).length;
            //print("Devices: " + liveCount + " online, " + (ew.apps.itag.state.def.dev.length - liveCount) + " offline");

            setTimeout(function() {
                if (ew.apps.itag.state.ble.scan)
                    ew.apps.itag.scan();
            }, 100);
        }, { interval: 300, window: 300, timeout: 5000, filters: [{ manufacturerData: { 0x0105: {} } }] });
    },
    stopScan: function() {
    
        ew.apps.itag.state.ble.scan = false;
    },    
    conn: function(c) {
            ew.apps.itag.state.ble.scan=0;
            NRF.connect(c,{minInterval:7.5, maxInterval:50}).then(function(ga) {
            //NRF.connect(c).then(function(ga) {
            ew.apps.itag.state.ble.gatt = ga;
            console.log("getting service...");
            ga.device.on('gattserverdisconnected', function(reason) {
                console.log("disconnected: " + reason);
                if (ew.apps.itag.state.ble.next){
                 ew.apps.itag.conn(ew.apps.itag.state.ble.next);
                 ew.notify.alert("info", { body: "CONNECTING", title: ew.apps.itag.state.ble.next.split(" ")[0] }, 0, 0);
                 ew.apps.itag.state.ble.next=0;
                }
            });
            return ga.getPrimaryService(0xffe0);
        }).then(function(service) {
            console.log("getting characteristic...");
            return service.getCharacteristic(0xffe1);
        }).then(function(characteristic) {
            characteristic.on('characteristicvaluechanged', function(data) {
                console.log("notification data: ", data);
            });
            console.log("starting notifications...");
            return characteristic.startNotifications();
        }).then(function() {
            console.log("waiting for notifications");
        }).catch(function(e) {
            console.log("Error: " + e);
            if (e==="ERR 0x12 (CONN_COUNT)")
                ew.notify.alert("error", { body: "CONNECTIONS", title: "MAX 2" }, 1, 1);

        });

    }
    
};

