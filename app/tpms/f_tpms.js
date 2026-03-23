// tpms face - main viewer

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

// Left/right για εναλλαγή μεταξύ pressure/temperature
ew.UI.nav.left = function(x, y) {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].toggleInfo();
};

ew.UI.nav.right = function(x, y) {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].toggleInfo();
};

ew.UI.nav.up.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].scan();
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 30000,
    info: 0, // 0=pressure, 1=temperature
    log: [],
    scale: 1,
    
    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        
        let tpms = ew.apps.tpms;
        
        // Clear screen
        g.setCol(0, 0);
        g.fillRect(0, 0, g.getWidth(), g.getHeight());
        
        // Check if any sensors
        if (tpms.state.sensors.length === 0) {
            this.showNoSensors();
            this.bar();
            this.run = true;
            return;
        }
        
        // Load log for current sensor
        let sensorId = tpms.state.sensors[tpms.state.pos];
        this.log = tpms.getLog(sensorId);
        
        // Calculate scale for graph
        this.calcScale();
        
        // Draw UI
        this.drawSensorInfo();
        this.drawGraph();
        this.drawSelector();
        this.bar();
        
        this.run = true;
    },
    
    show: function() {
        if (!this.run) return;
        
        // Update if needed (every 250ms)
        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.update();
        }, 250);
    },
    
    update: function() {
        let tpms = ew.apps.tpms;
        if (tpms.state.sensors.length === 0) return;
        
        // Redraw current info
        this.drawSensorInfo();
    },
    
    showNoSensors: function() {
        g.setCol(0, 0);
        g.fillRect(0, 40, g.getWidth(), g.getHeight() - 40);
        
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
    
    drawSensorInfo: function() {
        let tpms = ew.apps.tpms;
        if (tpms.state.sensors.length === 0) return;
        
        let sensorId = tpms.state.sensors[tpms.state.pos];
        let log = this.log;
        
        if (!log || log.length === 0) return;
        
        let data = log[tpms.state.ref] || log[0];
        let metric = this.info ? data.temp : data[tpms.state.def.metric];
        let unit = this.info ? "°C" : tpms.state.def.metric.toUpperCase();
        
        // Check alarm
        let limits = tpms.state.def.list[sensorId] || { lowP: 10, hiP: 50 };
        let alarm = 0;
        if (!this.info) {
            if (data.psi < limits.lowP) alarm = 1;
            else if (data.psi > limits.hiP) alarm = 2;
        }
        
        // Background for value area
        g.setCol(0, 1);
        g.fillRect(0, 50, g.getWidth(), 120);
        
        // Draw big value
        g.setCol(1, alarm ? 13 : 15);
        g.setFont("Vector", 53);
        g.setFontAlign(0, 0);
        
        let valParts = metric.toString().split(".");
        let valInt = valParts[0];
        let valDec = valParts[1] ? "." + valParts[1].slice(0,1) : "";
        
        let intWidth = g.stringWidth(valInt);
        g.drawString(valInt, g.getWidth()/2 - 20, 70);
        g.setFont("Vector", 42);
        g.drawString(valDec, g.getWidth()/2 + intWidth/2, 77);
        g.setFont("Vector", 20);
        g.drawString(unit, g.getWidth()/2 + intWidth/2 + 20, 85);
        
        // Time ago
        let timeAgo = this.formatTimeAgo(data.time);
        g.setCol(0, 1);
        g.fillRect(0, 121, g.getWidth(), 160);
        g.setCol(1, 11);
        g.setFont("Vector", 25);
        g.drawString(timeAgo, g.getWidth()/2, 140);
    },
    
    drawGraph: function() {
        if (!this.log || this.log.length === 0) return;
        
        let tpms = ew.apps.tpms;
        let sensorId = tpms.state.sensors[tpms.state.pos];
        let limits = tpms.state.def.list[sensorId] || { lowP: 10, hiP: 50 };
        
        // Graph area
        let graphY = 165;
        let graphH = 60;
        
        g.setCol(0, 0);
        g.fillRect(0, graphY, g.getWidth(), graphY + graphH);
        
        // Draw bars
        for (let i = 0; i < this.log.length; i++) {
            let val = this.log[i][tpms.state.def.metric];
            let barH = val * this.scale;
            if (barH > graphH) barH = graphH;
            
            let x = g.getWidth() - (i * 18) - 20;
            let alarm = (val < limits.lowP || val > limits.hiP);
            
            g.setCol(1, alarm ? 13 : 4);
            g.fillRect(x - 12, graphY + graphH - barH, x, graphY + graphH);
        }
        
        // Highlight current
        if (tpms.state.ref < this.log.length) {
            let x = g.getWidth() - (tpms.state.ref * 18) - 20;
            g.setCol(1, 14);
            g.drawRect(x - 13, graphY, x + 1, graphY + graphH);
        }
    },
    
    drawSelector: function() {
        let tpms = ew.apps.tpms;
        if (tpms.state.sensors.length === 0) return;
        
        // Sensor selector at top
        let sensorId = tpms.state.sensors[tpms.state.pos];
        let limits = tpms.state.def.list[sensorId] || { lowP: 10, hiP: 50 };
        let log = this.log;
        let currentData = log[tpms.state.ref] || log[0];
        let alarm = (currentData.psi < limits.lowP || currentData.psi > limits.hiP);
        
        // Left side - sensor name
        g.setCol(0, 0);
        g.fillRect(0, 20, 150, 45);
        g.setCol(1, alarm ? 13 : 4);
        g.setFont("Vector", 20);
        g.setFontAlign(-1, -1);
        g.drawString(sensorId, 10, 25);
        
        // Right side - position indicator
        g.setCol(0, 0);
        g.fillRect(150, 20, g.getWidth(), 45);
        g.setCol(1, 4);
        g.setFont("Vector", 20);
        g.setFontAlign(1, -1);
        g.drawString((tpms.state.pos+1) + "/" + tpms.state.sensors.length, g.getWidth() - 10, 25);
    },
    
    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.ele.fill("_bar", 6, 1);
        
        let tpms = ew.apps.tpms;
        let status = tpms.state.status;
        let statusText = status;
        if (status === "SCANNING") {
            let elapsed = (Date.now()/1000|0) - (tpms.scanStart || 0);
            let remaining = tpms.state.def.wait - elapsed;
            if (remaining < 0) remaining = 0;
            statusText = "SCAN " + remaining + "s";
        }
        
        ew.UI.btn.c2l("main", "_bar", 6, statusText, "", 15, 4, 1.3);
        
        ew.UI.c.end();
        
        ew.UI.c.bar._bar = (i, l) => {
            if (i == 6) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (l) {
                    // Long press - settings
                    ew.face.go("tpms-set", 0);
                } else {
                    // Short press - scan
                    this.scan();
                }
            }
        };
    },
    
    scan: function() {
        let tpms = ew.apps.tpms;
        tpms.scan();
        
        // Show scanning status
        if (tpms.state.sensors.length === 0) {
            this.showNoSensors();
        } else {
            this.drawScanStatus();
        }
    },
    
    drawScanStatus: function() {
        let tpms = ew.apps.tpms;
        
        g.setCol(0, 0);
        g.fillRect(0, 170, g.getWidth(), 210);
        g.setCol(1, 15);
        g.setFont("Vector", 18);
        g.setFontAlign(0, 0);
        g.drawString(tpms.state.status, g.getWidth()/2, 190);
    },
    
    toggleInfo: function() {
        this.info = 1 - this.info;
        this.drawSensorInfo();
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
        return new Date(timestamp * 1000).toLocaleDateString();
    },
    
    calcScale: function() {
        if (!this.log || this.log.length === 0) {
            this.scale = 1;
            return;
        }
        
        let tpms = ew.apps.tpms;
        let max = 0;
        for (let i = 0; i < this.log.length; i++) {
            let val = this.log[i][tpms.state.def.metric];
            if (val > max) max = val;
        }
        this.scale = 60 / (max || 1);
    },
    
    clear: function() {
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    
    off: function() {
        g.off();
    }
};