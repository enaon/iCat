ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {clearTimeout(ew.UI.ntid);ew.UI.ntid=0}
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.hr.state.def.page++;
    if (3 < ew.apps.hr.state.def.page) ew.apps.hr.state.def.page = 0; 
    ew.face[0].mode(ew.apps.hr.state.def.page);
});

ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {clearTimeout(ew.UI.ntid);ew.UI.ntid=0}
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.hr.state.def.page--;
    if (ew.apps.hr.state.def.page < 0) ew.apps.hr.state.def.page = 3;
    ew.face[0].mode(ew.apps.hr.state.def.page);
});

ew.face[0] = {
    data: {
        topL:ew.apps.hr.state.def.topL, 
        btmL:ew.apps.hr.state.def.btmL,
        source: [], // health data array
        loading: true, // loading state
        key: "bpm", // current key for graph
        pos: 0, // current position
        maxBpm: 100, // default max bpm
        realtime: {
            bpm: 0,
            //confidence: 0,
            //lastUpdate: 0
        }
    },
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    pendingReads: 0, // αριθμός εκκρεμών αναγνώσεων


    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;

        // Start real time HR monitor
        Bangle.setOptions({hrmPollInterval:40});
        Bangle.setHRMPower(1,"ew");
        //Bangle.setOptions({hrmPollInterval:40});
        Bangle.setOptions({hrmStaticSampleTime:true});
        //print("hrm mode",Bangle.getOptions().hrmStaticSampleTime);
        //print("hrm mode",Bangle.getOptions().hrmPollInterval);
        //print("ew.face.appPrev",ew.face.appPrev)
        if (ew.face.appPrev !== "hr") Bangle.on("HRM", this.hrmRT);

        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.c.end();

        this.run = true;
    },

    show: function() {
        if (!this.run) return;
        if (ew.face.appPrev !== "hr") this.mode(ew.apps.hr.state.def.page || 0);

    },

    // Real-time HRM handler
    hrmRT: function(hrm) {
        let face = ew.face[0];
        if (!face || !face.run) return;
       
        if (face.tid1){
            clearTimeout(face.tid1);
            face.tid1=0;
        }
        
        if (ew.apps.hr.state.def.page === 0) {
            face.data.realtime.bpm = hrm.bpm || 0;
            face.data.realtime.conf = hrm.confidence || 0;
            //face.data.realtime.lastUpdate = Date.now();
            //print(hrm);
            //print("bpm,confidence",hrm.bpm,hrm.confidence)
            if (!hrm.bpm ) {
                ew.UI.btn.i2l("main", "_main",9, "MEASURING", "", 15, 4,1, 8);
            }
            face.tid1=setTimeout(()=>{
                    ew.face[0].tid1=0;
                    ew.UI.btn.i2l("main", "_main",9, "WEAR PROPERLY", "", 15, 4,1, 8);
            },3000)
            
            
            if (!ew.UI.ntid) face.dRTI();
        }
    },

    mode: function(page) {
        ew.apps.hr.state.def.page = page;

        if (page === 0) {

            this.data.realtime= {bpm: 0};
            this.data.loading = false;
            this.data.source = [];
            ew.UI.ele.ind(1, 4, 0, 15); // 1/4
            ew.UI.btn.c2l("main", "_header", 6, "HEART RATE", "", 15, 0, 1.15, 1);
            ew.UI.btn.i2l("main", "_main",9, "STAY STILL", "", 15, 4,1, 8);
            ew.UI.ele.fill("_bar", 6, 0, 1); 
            if (this.tid1){
                clearTimeout(this.tid1);
                this.tid1=0;
            }
            
            this.tid1=setTimeout(()=>{
                this.tid1=0;
                ew.UI.btn.i2l("main", "_main",9, "WEAR PROPERLY", "", 15, 4,1, 8);
            },5000)
            //this.dRTI();
            this.bar();
            return;
        }

        this.data.source = [];
        this.data.loading = true;

        ew.UI.btn.i2l("main", "_main", 9, "LOADING", "", 15, 1, 1.3);
        if (!ew.UI.ntid) ew.UI.ele.fill("_bar", 6, 0);

        let time = new Date();
        let period, length, type, title;

        if (page === 1) {
            ew.UI.ele.ind(2, 4, 0, 15); // 2/4
            title = "LAST 4 HOURS";
            period = "readDay";
            length = 24;
            type = "Date";
        }
        else if (page === 2) {
            ew.UI.ele.ind(3, 4, 0, 15); // 3/4
            title = "LAST 24 HOURS";
            period = "readDay";
            length = 138;
            type = "Date";
        }
        else if (page === 3) {
            ew.UI.ele.ind(4, 4, 0, 15); // 4/4
            title = "LAST 30 DAYS";
            period = "readDailySummaries";
            length = 30;
            type = "Month";
        }

        ew.UI.btn.c2l("main", "_header", 6, title, "", 15, 0, 1.15, 1);
        
        // create data source
        if (!this.data["source" + page]) {
            require("health")[period](time, (entry) => {
                if (entry) {
                    this.data.source.push({
                        bpm: entry.bpm,
                        bpmMin: entry.bpmMin,
                        bpmMax: entry.bpmMax,
                        hr: entry.day || entry.hr,
                        min: (entry.day ? time.toString().substr(4, 3) : entry.min)
                    });
                }
            });

            if (this.data.source.length < length) {
                let partOne = this.data.source;
                this.data.source = [];
                time["set" + type](time["get" + type]() - 1);

                require("health")[period](time, (entry) => {
                    if (entry) {
                        this.data.source.push({
                            bpm: entry.bpm,
                            bpmMin: entry.bpmMin,
                            bpmMax: entry.bpmMax,
                            hr: entry.day || entry.hr,
                            min: (entry.day ? time.toString().substr(4, 3) : entry.min)
                        });
                    }
                });
                this.data.source = this.data.source.concat(partOne);
                partOne = [];
            }
            if (this.data.source.length > length) {
                this.data.source = this.data.source.slice(-length);
            }
            // get average values
            if (page === 2) this.pHAV();
            
            // add last readings
            if (page === 3) {
                time = new Date();
                let now = Bangle.getHealthStatus("day");
                this.data.source.push({
                    bpm: now.bpm,
                    bpmMin: now.bpmMin,
                    bpmMax: now.bpmMax,
                    hr: time.getDate(),
                    min: time.toString().substr(4, 3)
                });
            }
            if (page === 1) {
                time = new Date();
                let now = Bangle.getHealthStatus();
                this.data.source.push({
                    bpm: now.bpm,
                    bpmMin: now.bpmMin,
                    bpmMax: now.bpmMax,
                    hr: time.getHours(),
                    min: Math.floor( time.getMinutes() / 10) * 10
                });
            }

            // save data source
            this.data["source" + page] = this.data.source;
        }
        
        // use saved data source
        else 
            this.data.source = this.data["source" + page];

        this.pHD();
    },

    dRTI: function() {
        if (ew.apps.hr.state.def.page !== 0) return;
        let rt = this.data.realtime;
        let bpm = rt.bpm || 0;
        let conf = rt.conf || 0;

        //let bpmStr = bpm > 0 ? bpm.toString() : "WAIT";
        if (bpm) ew.UI.btn.c2l("main", "_main",9,  bpm.toString(), "", 15, 90<conf?4:1,3, 8,"LECO1976Regular22");

        //if (70 < confidence) 
        this.uRTG(bpm,conf);
    },

    uRTG: function(bpm,conf) {
        // Δημιούργησε ή ενημέρωσε ένα buffer με τις τελευταίες 14 τιμές
        if (!this.data.realtime.buffer) {
            this.data.realtime.buffer = new Uint8Array(14);
            this.data.realtime.bufferPos = 0;
            this.data.realtime.bufferFull = false;

            // Αρχικοποίησε όλες τις τιμές στο 0
            for (let i = 0; i < 14; i++) {
                this.data.realtime.buffer[i] = 0;
            }
        }


        // Κυκλικό buffer: Πάντα γράφουμε στην τρέχουσα θέση και προχωράμε
        this.data.realtime.buffer[this.data.realtime.bufferPos] = bpm;
        this.data.realtime.bufferPos = (this.data.realtime.bufferPos + 1) % 14;
        this.data.realtime.bufferFull = true; // Μετά την πρώτη εγγραφή, θεωρούμε ότι είναι γεμάτο

        // Δημιούργησε tempSource με τις τιμές σε ΣΩΣΤΗ ΣΕΙΡΑ (παλιές αριστερά, νέες δεξιά)
        let tempSource = [];

        // Ξεκίνα από την παλαιότερη τιμή (bufferPos) και προχώρα μέχρι να γεμίσεις 14 τιμές
        for (let i = 0; i < 14; i++) {
            let idx = (this.data.realtime.bufferPos + i) % 14;
            tempSource.push({
                bpm: this.data.realtime.buffer[idx] || 0
            });
        }

        let originalSource = this.data.source;
        this.data.source = tempSource;

        let maxVal = 80;
        for (let i = 0; i < tempSource.length; i++) {
            if (tempSource[i].bpm > maxVal) maxVal = tempSource[i].bpm;
        }
        this.data.maxBpm = maxVal + 10;

        if(!ew.UI.ntid) this.dRTG();
        
        this.data.source = originalSource;
    },
    
    pHAV: function() {
        let sums = new Uint16Array(24);
        let counts = new Uint8Array(24);
        let now = new Date();
        let currentHour = now.getHours();

        for (let i = 0; i < this.data.source.length; i++) {
            let entry = this.data.source[i];
            let hour = entry.hr;

            if (entry.bpm > 0) {
                sums[hour] += entry.bpm;
                counts[hour]++;
            }
        }

        let hourlyData = [];

        for (let offset = 23; offset >= 0; offset--) {
            let displayHour = (currentHour - offset + 24) % 24;
            if (counts[displayHour] > 0) {
                hourlyData.push({
                    bpm: sums[displayHour] / counts[displayHour] | 0,
                    hr: displayHour,
                    min: 0,
                    count: counts[displayHour]
                });
            }
        }

        this.data.source = hourlyData;
    },

    pHD: function() {
        this.data.maxBpm = 60;
        for (let i = 0; i < this.data.source.length; i++) {
            if (this.data.source[i].bpm > this.data.maxBpm) {
                this.data.maxBpm = this.data.source[i].bpm;
            }
        }
        if (this.data.maxBpm < 60) this.data.maxBpm = 100;

        this.data.pos = this.data.source.length - 1;
        this.data.loading = false;

        this.bar();
        this.dG();
        this.dI();
    },

    dI: function() {
        if (ew.apps.hr.state.def.page === 0) return; // Το real-time έχει το δικό του draw
        if (this.data.loading || this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 3, "NO DATA", "", 15, 1, 1);
            return;
        }

        let entry = this.data.source[this.data.pos];
        let bpmStr = entry.bpm.toString();
        //ew.UI.btn.i2l("main", "_main", 9, bpmStr, "bpm", 15, 6, 2);
        ew.UI.btn.c2l("main", "_main", 3, bpmStr, "", 15, 6, 1, 8, "LECO1976Regular42");
        

        // Time
        let hours = entry.hr.toString().padStart(2, '0');
        let mins = entry.min.toString().padStart(2, '0');
        let timeStr = "time: " + hours + ":" + mins;
        ew.UI.btn.c2l("main", "_main", 6,timeStr, "", 15, 1,18,2, "Vector");
        //ew.UI.btn.c2l("main", "_header", 6, timeStr, "", 15, 0, 1.3, 1);
    },
    dG: function(update, newPos) {

        const margin = 2;
        const width = g.getWidth() - margin;
        const graphTop = 130;
        const graphHeight = 45;
        const fields = this.data.source.length;
        const space = 3;
        const topL = this.data.topL; 
        const btmL = this.data.btmL; 
        
        if (fields === 0) return;

        const MAX_BAR_WIDTH = 30;

        let bw, startX;
        if (fields * (MAX_BAR_WIDTH + space) <= width) {
            bw = MAX_BAR_WIDTH;
            let totalWidth = fields * (bw + space);
            startX = margin + (width - totalWidth) / 2;
        }
        else {
            bw = (width - (fields * space)) / fields;
            startX = margin;
        }

        let scale = graphHeight / this.data.maxBpm;

        for (let i = 0; i < fields; i++) {
            let entry = this.data.source[i];
            let barH = entry.bpm * scale;
            let x = startX + i * (bw + space);
            let isSelected = (i === this.data.pos);

            let color =  topL < entry.bpm ? 13 : entry.bpm < btmL? 9: 4;

            g.setCol(1, isSelected ? 15 : color);
            g.fillRect(x, graphTop + graphHeight - barH, x + bw, graphTop + graphHeight);
        }

        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.dI();
        }, 50);
    },

    dRTG: function() {

        const margin = 2;
        const width = g.getWidth() - margin;
        const graphTop = 130;
        const graphHeight = 45;
        const fields = this.data.source.length; // 14
        const space = 3;
        const topL = this.data.topL; 
        const btmL = this.data.btmL; 

        if (fields === 0) return;

        const MAX_BAR_WIDTH = 30;

        let bw, startX;
        if (fields * (MAX_BAR_WIDTH + space) <= width) {
            bw = MAX_BAR_WIDTH;
            let totalWidth = fields * (bw + space);
            startX = margin + (width - totalWidth) / 2;
        }
        else {
            bw = (width - (fields * space)) / fields;
            startX = margin;
        }

        let scale = graphHeight / this.data.maxBpm;

        // Καθάρισε περιοχή
        g.setCol(0, 0);
        g.fillRect(0, graphTop - 5, g.getWidth(), graphTop + graphHeight + 5);

        for (let i = 0; i < fields; i++) {
            let entry = this.data.source[i];
            let barH = entry.bpm * scale;
            let x = startX + i * (bw + space);
            //print(entry)
            // Highlight μόνο την τελευταία μπάρα (δεξιά)
            let isSelected = (i === fields - 1);
            let color =  topL < entry.bpm ? 13 : entry.bpm < btmL? 9: 4;

            g.setCol(1, isSelected ? 15 : color);
            g.fillRect(x, graphTop + graphHeight - barH, x + bw, graphTop + graphHeight);
        }
    },
    bar: function() {
        if (ew.is.UIpri || ew.UI.ntid) return;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);


        if (ew.apps.hr.state.def.page === 0) {
            ew.is.slide = 0;
            this.dRTI();
            return;
        }
        
        if (!this.data.loading && this.data.source.length > 0) {
            ew.sys.TC.val = {
                cur: this.data.pos,
                dn: 0,
                up: this.data.source.length - 1,
                tmp: 0,
                reverce: 0,
                loop: 1
            };

            ew.UI.c.tcBar = (a, b) => {
                if (b >= 0 && b < this.data.source.length) {
                    this.data.posL = this.data.pos;
                    this.data.pos = b;
                    this.dG(true, b);
                }
            };

            ew.is.slide = 1;
            this.dG();
        }
        else if (!this.data.loading && this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "NO DATA", "", 15, 1, 1.3);
        }

    },

    clear: function(o) {
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        if (this.tid1) clearTimeout(this.tid1);
        this.tid1 = 0;
        if (ew.face.appCurr!=="hr"){ 
            Bangle.setHRMPower(0,"ew");
            Bangle.removeListener("HRM", ew.face[0].hrmRT);
        }       
        return true;
    },

    off: function(o) {
        g.off();
    }
};
