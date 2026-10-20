//BLE scanner



// BLE central scanner - ew.apps.scan

ew.apps.scan = {
  modules: [],            // αποθήκευση { name, filters, callbacks, ... }
  devices: {},            // global state { deviceId: { rssi, lastseen, live, ... } }
  deviceList: [],         // array με ids για γρήγορη επανάληψη
  isScanning: false,
  tid: { auto: null, checker: null },
  dbg: 0,                 // debug level

  // ----- Δημόσιες μέθοδοι για εγγραφή modules -----
  register: function(moduleConfig) {
    if (!moduleConfig.name) {
      console.error("scan: module must have a name");
      return false;
    }
    // έλεγχος μη διπλοεγγραφής
    if (this.modules.find(m => m.name === moduleConfig.name)) {
      console.warn("scan: module already registered:", moduleConfig.name);
      return false;
    }
    this.modules.push({
      name: moduleConfig.name,
      filters: moduleConfig.filters || [],
      onDiscover: moduleConfig.onDiscover || null,
      onUpdate: moduleConfig.onUpdate || null,
      onLost: moduleConfig.onLost || null,
      wantAllDevices: moduleConfig.wantAllDevices || false
    });
    if (this.dbg > 1) console.log("scan: registered module", moduleConfig.name);
    // Αν θέλουμε να ξεκινήσει η σάρωση αυτόματα αν είναι η πρώτη εγγραφή
    if (!this.isScanning && this.modules.length === 1) {
      this.startScan();
    }
    return true;
  },

  unregister: function(moduleName) {
    const idx = this.modules.findIndex(m => m.name === moduleName);
    if (idx !== -1) {
      this.modules.splice(idx, 1);
      if (this.dbg) console.log("scan: unregistered", moduleName);
      if (this.modules.length === 0) this.stopScan();
      return true;
    }
    return false;
  },

  // ----- Διαχείριση σάρωσης -----
  startScan: function(phyR) {
    if (this.isScanning) {
      if (this.dbg) console.log("scan: already scanning");
      return;
    }
    if (this.modules.length === 0) {
      if (this.dbg) console.log("scan: no modules registered, scan not started");
      return;
    }
    // Σταματάμε τυχόν προηγούμενο checker και auto
    if (this.tid.checker) clearTimeout(this.tid.checker);
    if (this.tid.auto) clearTimeout(this.tid.auto);
    
    this.isScanning = true;
    const phy = ["1mbps", "coded", "both", "2mbps"];
    const phyIdx = phyR || 0; // default 1mbps
    NRF.setTxPower(ew.def.bt.rfTX || 4);

    // ---- Δημιουργία combined filters από όλα τα modules ----
    let combinedFilters = [];
    for (let mod of this.modules) {
      if (mod.filters && mod.filters.length) {
        combinedFilters.push(...mod.filters);
      }
    }
    // Αν κάποιο module θέλει όλες τις συσκευές, κρατάμε ένα φίλτρο {} (accept all)
    const hasAll = this.modules.some(m => m.wantAllDevices === true);
    const finalFilters = hasAll ? [{}] : combinedFilters;
    
    if (this.dbg) console.log("scan: starting with", finalFilters.length, "filters");

    NRF.setScan((device) => {
      this._handleDevice(device);
    }, {
      filters: finalFilters,
      phy: phy[phyIdx],
      interval: 600,    // μπορείς να το κάνεις configurable
      window: 300,
      active: false
    });
    
    // Ξεκινάμε τον checker
    this._checker();
  },

  stopScan: function() {
    if (!this.isScanning) return;
    NRF.setScan();
    this.isScanning = false;
    if (this.tid.checker) clearTimeout(this.tid.checker);
    if (this.tid.auto) clearTimeout(this.tid.auto);
    if (this.dbg) console.log("scan: stopped");
  },

  // ----- Αυτόματος προγραμματισμός -----
  auto: function(minutes) {
    if (this.tid.auto) clearTimeout(this.tid.auto);
    if (!minutes || minutes <= 0) return;
    this.tid.auto = setTimeout(() => {
      if (ew.sys.batt(1) < 25) {
        ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "SCAN", "LOW BAT", 15, 13);
        // ξαναπρογραμματίζουμε σε 10 λεπτά
        this.auto(10);
      } else {
        this.startScan();
        // η σάρωση θα σταματήσει μετά από 15 δευτερόλεπτα (στον checker ή ξεχωριστά)
        setTimeout(() => {
          if (this.isScanning) this.stopScan();
          this.auto(minutes); // επαναπρογραμματισμός
        }, 15000);
      }
    }, minutes * 60000);
  },

  // ----- Εσωτερικός χειρισμός συσκευών -----
  _handleDevice: function(device) {
    const id = device.id;
    const now = Date.now() / 1000 | 0;
    let dev = this.devices[id];
    const isNew = (dev === undefined);
    
    if (isNew) {
      // Δημιουργία νέας εγγραφής
      dev = {
        id: id,
        rssi: device.rssi,
        lastseen: now,
        live: true,
        oflc: 0,
        rfrs: true
      };
      this.devices[id] = dev;
      this.deviceList.push(id);
    } else {
      // Ενημέρωση υπάρχουσας
      dev.rssi = device.rssi;
      dev.lastseen = now;
      dev.live = true;
      dev.oflc = 0;
      dev.rfrs = true;
    }
    
    // Βρίσκουμε ποια modules ταιριάζουν με αυτή τη συσκευή
    for (let mod of this.modules) {
      let matches = false;
      if (mod.wantAllDevices) {
        matches = true;
      } else {
        // Έλεγχος των filters του module
        for (let f of mod.filters) {
          if (this._deviceMatchesFilter(device, f)) {
            matches = true;
            break;
          }
        }
      }
      if (!matches) continue;
      
      // Προετοιμάζουμε moduleData (μπορεί το module να θέλει να αποθηκεύσει extra info)
      if (!dev.modData) dev.modData = {};
      if (!dev.modData[mod.name]) dev.modData[mod.name] = {};
      const moduleData = dev.modData[mod.name];
      
      if (isNew) {
        if (mod.onDiscover) mod.onDiscover(device, moduleData);
      } else {
        if (mod.onUpdate) mod.onUpdate(device, moduleData);
      }
    }
  },

  // Έλεγχος αν ένα device ταιριάζει με ένα filter (ίδια λογική με NRF.setScan)
  _deviceMatchesFilter: function(device, filter) {
    if (filter.manufacturerData) {
      const manufId = Object.keys(filter.manufacturerData)[0];
      if (device.manufacturer === parseInt(manufId)) {
        // μπορείς να κάνεις και έλεγχο στα δεδομένα αν χρειάζεται
        return true;
      }
    }
    if (filter.serviceData) {
      const uuid = Object.keys(filter.serviceData)[0];
      if (device.serviceData && device.serviceData[uuid]) return true;
    }
    if (filter.namePrefix) {
      if (device.name && device.name.startsWith(filter.namePrefix)) return true;
    }
    // ... μπορείς να προσθέσεις άλλα κριτήρια
    return false;
  },

  // ----- Checker για lost devices -----
  _checker: function() {
    if (this.tid.checker) clearTimeout(this.tid.checker);
    const maxOffline = 5; // δευτερόλεπτα
    const now = Date.now() / 1000 | 0;
    let toDelete = [];
    
    for (let i=0; i<this.deviceList.length; i++) {
      const id = this.deviceList[i];
      const dev = this.devices[id];
      if (dev.rfrs) {
        dev.rfrs = false;
        continue;
      }
      if (now - dev.lastseen > maxOffline) {
        if (!dev.live) {
          dev.oflc = (dev.oflc || 0) + 1;
          if (dev.oflc > 3) { // μετά από 3 συνεχόμενους ελέγχους, θεωρείται lost
            // notify modules
            for (let mod of this.modules) {
              if (dev.modData && dev.modData[mod.name] && mod.onLost) {
                mod.onLost(dev, dev.modData[mod.name]);
              }
            }
            toDelete.push(id);
          }
        } else {
          dev.live = false;
          dev.oflc = 1;
        }
      }
    }
    
    // διαγραφή συσκευών που έχουν χαθεί οριστικά
    for (let id of toDelete) {
      delete this.devices[id];
      const idx = this.deviceList.indexOf(id);
      if (idx !== -1) this.deviceList.splice(idx,1);
    }
    
    if (this.isScanning) {
      this.tid.checker = setTimeout(() => this._checker(), 1000);
    }
  }
};


/*
// --- Αυτόματη φόρτωση defaults από storage ---
let saved = (require("Storage").readJSON("ew.json", true) || {}).scan;
if (saved) {
  ew.apps.scan.dbg = saved.dbg || 0;
  // μπορείς να προσθέσεις κι άλλες ρυθμίσεις
}
*/

// --- defaults ---
ew.apps.scan.state.def = Object.assign(
    ew.apps.scan.state.def,
    (require("Storage").readJSON("ew.json", true) || {}).scan || {}
);


// Προαιρετικό: icon για το scanner app (αν χρειαστεί)
if (!require('Storage').read("ew_i_scan.img")) {
  let icon = "mEwwhC/AH4ABmczmAVSgczkUikcjCyMyCwIACmQWRIwIABAoIYOIgIWDDAcgFxoWFAAJKBFxkjC44wNFxAvCMJUDLowXEJBUDIxQABJBJGJC970EXqIXvLwYXrCwjYJC75GFX5UjFxYXJgYXFFwoXLkQWKLxJgFCw4XLmZIBCxBGJYIYVHF5owBC5QwUmUSGBsjDAsykERGBsAVQQCBCwMAgIYCC5cAgRyGiJJBGBgAHGAIxBC6YwBGIIwwC6gwCC6gwBiAXVAH4A8A=";
  require('Storage').write("ew_i_scan.img", require("heatshrink").decompress(atob(icon)));
}






ew.apps.scan = {
    tid:{ 
        
    },
    state:{
        filters:[],
        def:{}
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
    auto(min) {
        if (this.tid.auto) clearTimeout(this.tid.auto);
        this.tid.auto = false;
        if (!min) return;
        if (3 < this.dbg) console.log("scan: auto scan start");
        this.tid.auto = setTimeout(() => {
            if (ew.sys.batt(1) < 25 ){
                 this.tid.auto = false;
                 ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, "SCAN", "LOW BAT", 15, 13);
            }else{
                this.scan(2);
                this.tid.auto = setTimeout(() => {
                    this.tid.auto = false;
                    this.stopScan();
                    this.alert();
                }, 15000);
            }
        }, min * 60000);

    },    
    alert() {
        let store=ew.apps.itag.state.def.store;
        for (let tag in ew.apps.itag.state.def.store){
            const bat=store[tag].batt;
            const now=(Date.now()/1000)|0;
            // if over 5 hours old, ignore
            if ( 5 < (( now - store[tag].lastseen) / 3600 |0) ) continue;
            
            const indx=ew.apps.itag.state.def.storeOrder.indexOf(tag)
            if (bat < 20 ) {
                ew.notify.alert("error", {"id":"1"+indx+"0","src":"itag", "title": store[tag].name, "body": "Battery: "+bat+"%"  }, 1, 1);
                print ("itag low",store[tag].name)
                
            }else if (bat < 40 ){
                print ("itag medium",store[tag].name)
                ew.notify.alert("info", {"id":"1"+indx+"1",src:"itag", title: store[tag].name, body: "Battery: "+bat+"%"   }, 1, 1);
            }    
        }

    },

    
};

//ew.UI.icon.scan="mEwwhC/AH4ABmczmAVSgczkUikcjCyMyCwIACmQWRIwIABAoIYOIgIWDDAcgFxoWFAAJKBFxkjC44wNFxAvCMJUDLowXEJBUDIxQABJBJGJC970EXqIXvLwYXrCwjYJC75GFX5UjFxYXJgYXFFwoXLkQWKLxJgFCw4XLmZIBCxBGJYIYVHF5owBC5QwUmUSGBsjDAsykERGBsAVQQCBCwMAgIYCC5cAgRyGiJJBGBgAHGAIxBC6YwBGIIwwC6gwCC6gwBiAXVAH4A8A="


