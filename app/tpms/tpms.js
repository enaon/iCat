// tpms.js - TPMS Sensor Service

ew.apps.tpms = {
    tid: {
        scan: 0,
        auto: 0,
        retry: 0
    },
    state: {
        def: {
            wait: 10,           // scan timeout in seconds
            retry: 0,            // retry count
            interval: 0,         // auto scan interval (0=off, 1=2min, 2=5min, 3=30min, 4=60min, 5=6h)
            ref: 0,              // reference index in log
            pos: 0,              // selected sensor position
            metric: "psi",        // pressure unit (psi, bar, kpa)
            allowNew: 1,          // allow new sensors
            list: {}              // list of known sensors { id: { hiP: 50, lowP: 10 } }
        },
        sensors: [],             // array of sensor IDs
        currentId: "",           // current sensor ID
        status: "IDLE",          // IDLE, SCANNING, RETRY, SUCCESS, NOT FOUND
        scanCount: 0,            // number of new sensors found in last scan
        busy: 0
    },

    init() {
        // Load settings
        let s = require('Storage').readJSON('tpms.json', 1);
        if (s && s.def) {
            this.state.def = s.def;
        }
        this.updateSensorsList();
        
        // Start auto scan if enabled
        if (this.state.def.interval) {
            this.auto();
        }
    },

    // Update sensors list from def.list
    updateSensorsList() {
        this.state.sensors = Object.keys(this.state.def.list);
    },

    // Save settings
    save() {
        let data = {
            ver: 7,
            def: this.state.def
        };
        require('Storage').writeJSON('tpms.json', data);
    },

    // Start scan
    scan() {
        if (this.state.busy) return;
        
        this.state.busy = 1;
        this.state.scanCount = 0;
        this.state.status = "SCANNING";
        this.state.def.retry = this.state.def.retry || 0;
        this.scanStart = Date.now() / 1000 | 0;
        
        if (this.tid.scan) {
            clearTimeout(this.tid.scan);
            this.tid.scan = 0;
        }
        
        this.find();
    },

    // Find devices
    find() {
        let self = this;
        let def = this.state.def;
        
        NRF.findDevices(devices => {
            devices.forEach(device => {
                if (!device || !device.id) return;
                
                let mac = device.id.split(" ")[0].split(":");
                // Check if it's a TPMS sensor (manufacturer data with specific pattern)
                if (mac[1] + mac[2] === "eaca" && device.manufacturerData) {
                    let id = mac[3] + mac[4] + mac[5];
                    
                    // Check if allowed (new or known)
                    if (def.allowNew || def.list[id]) {
                        // Add to list if new
                        if (!def.list[id]) {
                            def.list[id] = { hiP: 50, lowP: 10 };
                            this.save();
                            this.updateSensorsList();
                        }
                        
                        def.ref = 0;
                        let time = Date.now() / 1000 | 0;
                        
                        // Parse manufacturer data
                        let pressure = (device.manufacturerData[6] | 
                                       device.manufacturerData[7] << 8 | 
                                       device.manufacturerData[8] << 16 | 
                                       device.manufacturerData[9] << 24) / 1000;
                        
                        let temp = (device.manufacturerData[10] | 
                                   device.manufacturerData[11] << 8 | 
                                   device.manufacturerData[12] << 16 | 
                                   device.manufacturerData[13] << 24) / 100;
                        
                        let dev = {
                            id: id,
                            pos: mac[0][1],
                            kpa: pressure.toFixed(2),
                            bar: (pressure / 100).toFixed(2),
                            psi: (pressure * 0.1450377377).toFixed(2),
                            temp: temp.toFixed(2),
                            batt: device.manufacturerData[14],
                            alarm: device.manufacturerData[15],
                            time: time
                        };
                        
                        self.state.scanCount++;
                        self.state.currentId = id;
                        
                        // Check pressure limits
                        let alarm = 0;
                        if (dev.psi < def.list[id].lowP) {
                            alarm = 1;
                            if (ew.face.appCurr === "tpms") {
                                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, 
                                    id, "LOW PRESSURE", 15, 13);
                            }
                        } else if (dev.psi > def.list[id].hiP) {
                            alarm = 2;
                            if (ew.face.appCurr === "tpms") {
                                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, 
                                    id, "HIGH PRESSURE", 15, 13);
                            }
                        }
                        
                        // Save to log
                        this.saveToLog(id, dev);
                        
                        // Update EUC if available
                        if (global.euc && euc.state !== "OFF") {
                            if (!this.euc) this.euc = {};
                            this.euc[id] = {
                                time: time,
                                alarm: alarm,
                                psi: dev.psi
                            };
                        }
                    }
                }
            });
            
            // Handle scan result
            if (!self.state.scanCount) {
                if (def.retry > 0) {
                    def.retry--;
                    self.state.status = "RETRY (" + (def.retry + 1) + ")";
                    self.find();
                    return;
                } else {
                    self.state.status = "NOT FOUND";
                    self.state.busy = 0;
                }
            } else {
                self.state.status = "SUCCESS";
                self.state.busy = 0;
            }
            
            // Schedule next scan if interval enabled
            if (def.interval) {
                self.auto();
            }
            
            // Refresh face if visible
            if (ew.face.appCurr === "tpms") {
                ew.face[0].update();
            }
            
        }, { timeout: def.wait * 1000, filters: [{ services: ["fbb0"] }] });
    },

    // Save reading to log
    saveToLog(id, data) {
        let log = require('Storage').readJSON('tpmsLog' + id + '.json', 1) || [];
        log.unshift(data);
        if (log.length > 10) log.pop();
        require('Storage').writeJSON('tpmsLog' + id + '.json', log);
    },

    // Get log for sensor
    getLog(id) {
        return require('Storage').readJSON('tpmsLog' + id + '.json', 1) || [];
    },

    // Auto scan
    auto() {
        if (this.tid.auto) clearTimeout(this.tid.auto);
        
        let intervals = [0, 2, 5, 30, 60, 360];
        let minutes = intervals[this.state.def.interval] || 0;
        
        if (minutes) {
            this.tid.auto = setTimeout(() => {
                this.tid.auto = 0;
                this.scan();
            }, minutes * 60000);
        }
    },

    // Stop scan
    stop() {
        NRF.setScan();
        if (this.tid.scan) {
            clearTimeout(this.tid.scan);
            this.tid.scan = 0;
        }
        this.state.busy = 0;
        this.state.status = "IDLE";
    },

    // Delete sensor
    deleteSensor(id) {
        delete this.state.def.list[id];
        require('Storage').erase('tpmsLog' + id + '.json');
        this.updateSensorsList();
        if (this.state.pos >= this.state.sensors.length) {
            this.state.pos = 0;
        }
        this.save();
    },

    // Set pressure limits
    setLimits(id, low, high) {
        if (this.state.def.list[id]) {
            this.state.def.list[id].lowP = low;
            this.state.def.list[id].hiP = high;
            this.save();
        }
    }
};

// Load settings and initialize
let tpmsSettings = require('Storage').readJSON('tpms.json', 1);
if (tpmsSettings && tpmsSettings.def) {
    ew.apps.tpms.state.def = tpmsSettings.def;
}
ew.apps.tpms.init();

ew.UI.icon.tpms="nE4wkGswA/AHVhiMWDK0RiMiklEAgIZUkczAAckiMUDR8hiUz/4AB+fu90zmlFiRpOiU/DYwAB8lBOppQB/4bDAgMzDgR0BGxoYD+YCCmc+HB8RiYbDmU/kfzAII4Coo4KsRSCAAQEBHwMy/44DiMmUhK/E+cvDYc/DYg4JBQNOCAPjKIMzKII3GDZcUMoU/mUiiMiD4IJCI4IbP8ZXCYYinBDZkRoj1DDIJQCb4YbNihxCAA1EGwQbMDgI5EDQsADZR7CKwciNoVEKAUQgIbQABEADYMSDakQgAABDawaDNwQbTDQJSEKawAFDf4ABkQb2Rf6n/Df4bQgJT/AAtiDaEWDf4ABDaEmDZKMPiQbKsUhUy4ACkMQeQg2SAANhCAMADZMiDRY4CGxUiGxiNCDgKQHDR4cCAAQ8DAoIaQDgoADDSQA/AE4A=";

// install icon
if (!require('Storage').read("ew_i_tpms.img"))   {
  let icon="nE4wkGswA/AHVhiMWDK0RiMiklEAgIZUkczAAckiMUDR8hiUz/4AB+fu90zmlFiRpOiU/DYwAB8lBOppQB/4bDAgMzDgR0BGxoYD+YCCmc+HB8RiYbDmU/kfzAII4Coo4KsRSCAAQEBHwMy/44DiMmUhK/E+cvDYc/DYg4JBQNOCAPjKIMzKII3GDZcUMoU/mUiiMiD4IJCI4IbP8ZXCYYinBDZkRoj1DDIJQCb4YbNihxCAA1EGwQbMDgI5EDQsADZR7CKwciNoVEKAUQgIbQABEADYMSDakQgAABDawaDNwQbTDQJSEKawAFDf4ABkQb2Rf6n/Df4bQgJT/AAtiDaEWDf4ABDaEmDZKMPiQbKsUhUy4ACkMQeQg2SAANhCAMADZMiDRY4CGxUiGxiNCDgKQHDR4cCAAQ8DAoIaQDgoADDSQA/AE4A=";
  require('Storage').write("ew_i_ToF.tpms", require("heatshrink").decompress(atob(icon)));
}