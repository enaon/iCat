// tpms face - main viewer (based on itag store viewer)

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    
    let tpms = ew.apps.tpms;
    if (tpms.state.sensors.length <= 1) {
        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "ONLY ONE", "SENSOR", 15, 13);
        return;
    }
    
    // Next sensor
    if (tpms.state.pos + 1 < tpms.state.sensors.length) {
        tpms.state.pos++;
    } else {
        tpms.state.pos = 0;
    }
    tpms.state.ref = 0;
    ew.face[0].init();
});

ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    
    let tpms = ew.apps.tpms;
    if (tpms.state.sensors.length <= 1) {
        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "ONLY ONE", "SENSOR", 15, 13);
        return;
    }
    
    // Previous sensor
    if (tpms.state.pos > 0) {
        tpms.state.pos--;
    } else {
        tpms.state.pos = tpms.state.sensors.length - 1;
    }
    tpms.state.ref = 0;
    ew.face[0].init();
});

/*
// Left/right για εναλλαγή μεταξύ pressure/temperature
ew.UI.nav.left = function(x, y) {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].info = 1 - ew.face[0].info;
    ew.face[0].drawInfo();
};

ew.UI.nav.right = function(x, y) {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].info = 1 - ew.face[0].info;
    ew.face[0].drawInfo();
};

ew.UI.nav.up.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].scan();
});
*/
ew.face[0] = {
    data: { 
        array: [],      // sensors array
        source: null,   // sensor data source
        key: "psi",     // current key for graph
        pos: 0,         // current sensor position
        ref: 0          // reference index in log
    },
    info: 0,            // 0=pressure, 1=temperature
    log: [],
    run: false,
    coord: (process.env.BOARD == "BANGLEJS2") ? 
        { "main": [0, 29, 176, 115], "id": [88, 97], "value": [88, 65], "unit": [45, 70], "time": [88, 35] } : 
        { "main": [0, 55, 240, 185], "id": [120, 160], "value": [120, 120], "unit": [70, 122], "time": [120, 70] },
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    
    init: function(o) {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        
        let tpms = ew.apps.tpms;
        
        // Setup data arrays
        this.data.array = tpms.state.sensors;
        this.data.source = tpms.state.def.list;
        this.data.key = tpms.state.def.metric;
        this.data.pos = tpms.state.pos;
        this.data.ref = tpms.state.ref;
        
        // Load log for current sensor
        if (this.data.array.length > 0) {
            let sensorId = this.data.array[this.data.pos];
            this.log = tpms.getLog(sensorId);
        }
        
        // Clear screen
        g.setCol(0, 0);
        g.fillRect(0, 0, g.getWidth(), g.getHeight());
        
        // Show page indicator (2 pages: main and settings)
        ew.UI.ele.ind(1, 2, 0, 15);
        
        // Draw main info
        if (this.data.array.length === 0) {
            this.showNoSensors();
        } else {
            this.drawInfo();
            this.drawGraph();
        }
        
        // Bar
        this.bar();
        
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 9);
        ew.UI.c.end();
        
        // Button handler
        ew.UI.c.main._main = (i, l) => {
            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                
                if (this.data.array.length === 0) {
                    // No sensors - start scan
                    this.scan();
                } else {
                    // Long press on main area - toggle info or scan
                    this.info = 1 - this.info;
                    this.drawInfo();
                }
            }
        };
        
        this.run = true;
    },
    
    show: function() {
        if (!this.run) return;
        
        // Update time ago every second
        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.drawInfo();
        }, 1000);
    },
    
    showNoSensors: function() {
        g.setCol(0, 1);
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });
        
        g.setCol(1, 15);
        g.setFont("Vector", 25);
        g.setFontAlign(0, 0);
        g.drawString("NO SENSORS", g.getWidth()/2, 80);
        g.setFont("Vector", 18);
        g.drawString("Touch to scan", g.getWidth()/2, 130);
        
        let tpms = ew.apps.tpms;
        if (tpms.state.status === "SCANNING" || tpms.state.status.startsWith("RETRY")) {
            this.drawScanStatus();
        }
    },
    
    drawInfo: function() {
        if (this.data.array.length === 0) return;
        
        let tpms = ew.apps.tpms;
        let sensorId = this.data.array[this.data.pos];
        let limits = this.data.source[sensorId] || { lowP: 10, hiP: 50 };
        
        if (!this.log || this.log.length === 0) return;
        
        let data = this.log[this.data.ref] || this.log[0];
        let value = this.info ? data.temp : data[this.data.key];
        let unit = this.info ? "°C" : this.data.key.toUpperCase();
        
        // Check alarm
        let alarm = 0;
        if (!this.info) {
            if (data.psi < limits.lowP) alarm = 1;
            else if (data.psi > limits.hiP) alarm = 2;
        }
        
        // Main background
        g.setCol(0, alarm ? 13 : (this.info ? 6 : 1));
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });
        
        // Big value
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 2);
        let valStr = value.toString();
        let l = g.stringWidth(valStr) / 2;
        g.drawString(valStr, this.coord.value[0] - l, this.coord.value[1]);
        
        // Unit
        g.setFont("Vector", 20);
        g.drawString(unit, this.coord.unit[0], this.coord.unit[1]);
        
        // Time ago
        let timeAgo = this.formatTimeAgo(data.time);
        g.setCol(1, 14);
        g.setFont("Teletext10x18Ascii");
        g.drawString(timeAgo, this.coord.time[0] - g.stringWidth(timeAgo) / 2, this.coord.time[1]);
        
        // Sensor ID
        g.setCol(1, 14);
        g.setFont("Vector", process.env.BOARD == "BANGLEJS2" ? 16 : 20);
        g.drawString(sensorId, this.coord.id[0] - g.stringWidth(sensorId) / 2, this.coord.id[1]);
    },
    
    drawGraph: function() {
        if (this.data.array.length === 0 || !this.log || this.log.length === 0) return;
        
        let tpms = ew.apps.tpms;
        let sensorId = this.data.array[this.data.pos];
        let limits = this.data.source[sensorId] || { lowP: 10, hiP: 50 };
        
        // Graph area - κάτω μέρος οθόνης
        const width = g.getWidth() - 20;
        const bottom = g.getHeight() - 15;
        const height = 50;
        const margin = 10;
        
        // Find max value for scale
        let maxVal = 0;
        for (let i = 0; i < this.log.length; i++) {
            let val = this.log[i][this.data.key];
            if (val > maxVal) maxVal = val;
        }
        let scale = height / (maxVal || 1);
        
        // Draw bars
        for (let i = 0; i < this.log.length; i++) {
            let val = this.log[i][this.data.key];
            let barH = val * scale;
            if (barH > height) barH = height;
            
            let x = width - (i * 20) - 20;
            let alarm = (val < limits.lowP || val > limits.hiP);
            
            g.setCol(1, alarm ? 13 : 4);
            g.fillRect(x - 12, bottom - barH, x, bottom);
        }
        
        // Highlight current
        if (this.data.ref < this.log.length) {
            let x = width - (this.data.ref * 20) - 20;
            g.setCol(1, 14);
            g.drawRect(x - 13, bottom - height - 2, x + 1, bottom + 2);
        }
    },
    
    drawScanStatus: function() {
        let tpms = ew.apps.tpms;
        
        g.setCol(0, 0);
        g.fillRect(0, 150, g.getWidth(), 180);
        g.setCol(1, 15);
        g.setFont("Vector", 18);
        g.setFontAlign(0, 0);
        g.drawString(tpms.state.status, g.getWidth()/2, 165);
    },
    
    formatTimeAgo: function(timestamp) {
        let now = Date.now() / 1000 | 0;
        let diff = now - timestamp;
        
        if (diff < 60) return diff + "s ago";
        if (diff < 3600) return Math.floor(diff / 60) + "m ago";
        if (diff < 86400) {
            let hours = Math.floor(diff / 3600);
            let mins = Math.floor((diff % 3600) / 60);
            return hours + "h " + mins + "m ago";
        }
        let days = Math.floor(diff / 86400);
        return days + "d ago";
    },
    
    scan: function() {
        let tpms = ew.apps.tpms;
        tpms.scan();
        
        if (this.data.array.length === 0) {
            this.showNoSensors();
        } else {
            this.drawScanStatus();
        }
    },
    
    bar: function() {
        if (ew.is.UIpri) return;
        
        ew.UI.ele.fill("_bar", 6, 0);
        
        let tpms = ew.apps.tpms;
        let status = tpms.state.status;
        let statusText = status;
        
        if (status === "SCANNING") {
            let elapsed = (Date.now()/1000|0) - (tpms.scanStart || 0);
            let remaining = tpms.state.def.wait - elapsed;
            if (remaining < 0) remaining = 0;
            statusText = "SCAN " + remaining + "s";
        }
        
        // Bar control
        ew.sys.TC.val = { 
            cur: this.data.pos, 
            dn: 0, 
            up: this.data.array.length - 1, 
            tmp: 0, 
            reverce: 0, 
            loop: 1 
        };
        
        ew.UI.c.tcBar = (a, b, r, m) => {
            if (b >= 0 && b < this.data.array.length) {
                this.data.pos = b;
                tpms.state.pos = b;
                tpms.state.ref = 0;
                this.data.ref = 0;
                
                let sensorId = this.data.array[b];
                this.log = tpms.getLog(sensorId);
                
                this.drawInfo();
                this.drawGraph();
            }
        };
        ew.is.slide = 1;
        
        // Bar buttons
        ew.UI.c.start(0, 1);
        
        // Scan button
        ew.UI.btn.c2l("bar", "_bar", 4, statusText, "", 15, status === "SCANNING" ? 4 : 1, 1);
        
        // Settings button
        ew.UI.btn.c2l("bar", "_bar", 6, "SET", "", 15, 4, 1.3);
        
        ew.UI.c.end();
        
        ew.UI.c.bar._bar = (i, l) => {
            if (i == 4) {
                // Scan
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                this.scan();
            } else if (i == 6) {
                if (l) {
                    // Long press - settings
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    ew.face.go("tpms-set", 0);
                } else {
                    // Short press - show info
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    let total = this.data.array.length;
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, 
                        total + " SENSORS", 
                        "HOLD FOR SETTINGS", 15, 4);
                }
            }
        };
    },
    
    clear: function(o) {
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    
    off: function(o) {
        g.off();
        this.clear(o);
    }
};