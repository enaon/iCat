// health face - heart rate history viewer (async version)

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.battery.state.def.page++;
    if (3 < ew.apps.battery.state.def.page) ew.apps.battery.state.def.page = 1;
    ew.face[0].loadHealthData(ew.apps.battery.state.def.page);

});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.battery.state.def.page--;
    if (ew.apps.battery.state.def.page < 1) ew.apps.battery.state.def.page = 3;
    ew.face[0].loadHealthData(ew.apps.battery.state.def.page);
});

ew.face[0] = {
    data: {
        source: [], // health data array
        loading: true, // loading state
        key: "battery", // current key for graph
        pos: 0, // current position
        maxBattery: 10000 // default max battery
    },
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    pendingReads: 0, // αριθμός εκκρεμών αναγνώσεων

    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;


        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.c.end();

        //this.bar();

        this.run = true;
    },

    show: function() {
        if (!this.run) return;
        this.loadHealthData(ew.apps.battery.state.def.page || 0);

        /*if (!this.data.loading) this.drawInfo();

        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.show();
        }, 10000);
        */
    },

    loadHealthData: function(a) {

        //let health = require("health");
        this.data.source = [];
        this.data.loading = true;
        ew.apps.battery.state.def.page = a;
        let time = new Date();
        let period, lenght, type;

        ew.UI.btn.i2l("main", "_main", 9, "LOADING", "", 4, 15, 1.3);
        if (!ew.UI.ntid) ew.UI.btn.c2l("bar", "_bar", 6, "", "", 15, 1, 1);

        if (!a || a === 1) {
            ew.UI.ele.ind(1, 3, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "LAST 4 HOURS", "", 15, 0, 1.15, 1);
            period = "readDay"
            length = 24;
            type = "Date"
        }
        else if (a === 2) {
            ew.UI.ele.ind(2, 3, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "LAST 24 HOURS", "", 15, 0, 1.15, 1);
            period = "readDay"
            length = 138;
            type = "Date"
        }
        else if (a === 3) {
            ew.UI.ele.ind(3, 3, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "LAST 30 DAYS", "", 15, 0, 1.15, 1);
            period = "readDailySummaries"
            length = 30;
            type = "Month"
        }
        
        if (!this.data["source" + a]) {
            require("health")[period](time, (entry) => {
                //if (entry && entry.battery && entry.battery > 0) {
                if (entry) {
                    this.data.source.push({
                        battery: entry.battery,
                        hr: entry.day || entry.hr,
                        min: (entry.day ? time.toString().substr(4, 3) : entry.min)
                    });
                }
            });

            if (this.data.source.length < length) {
                print("part 2");
                let partOne = this.data.source;
                this.data.source = [];
                time["set" + type](time["get" + type]() - 1);

                require("health")[period](time, (entry) => {
                    //if (entry && entry.battery && entry.battery > 0) {
                    if (entry) {

                        this.data.source.push({
                            battery: entry.battery,
                            hr: entry.day || entry.hr,
                            min: (entry.day ? time.toString().substr(4, 3) : entry.min)
                        });
                    }
                });
                this.data.source = this.data.source.concat(partOne)
                partOne = [];
            }
            if (this.data.source.length > length) {
                this.data.source = this.data.source.slice(-length);
            }
            if (a === 2) this.processHourlyAverages();
            /*if (a === 3) {
                time = new Date()
                let now = Bangle.getHealthStatus("day")
                this.data.source.push({
                    battery: now.bpm,
                    hr: time.getDate(),
                    min: time.toString().substr(4, 3)
                });

            }*/
            this.data["source"+a]=this.data.source;
        }
        else
            this.data.source=this.data["source"+a];


            this.processHealthData();
    },

    processHourlyAverages: function() {
        let sums = new Uint16Array(24);
        let counts = new Uint8Array(24);
        let now = new Date();
        let currentHour = now.getHours();

        // Για κάθε 10λεπτη μέτρηση
        for (let i = 0; i < this.data.source.length; i++) {
            let entry = this.data.source[i];
            let hour = entry.hr; // 0-23

            if (entry.battery > 0) {
                sums[hour] += entry.battery;
                counts[hour]++;
            }
        }

        let hourlyData = [];

        //for (let offset = 0; offset < 24; offset++) {
        for (let offset = 23; offset >= 0; offset--) {

            let displayHour = (currentHour - offset + 24) % 24;

            if (counts[displayHour] > 0) {
                hourlyData.push({
                    battery: sums[displayHour] / counts[displayHour] | 0,
                    hr: displayHour,
                    min: 0,
                    count: counts[displayHour]
                });
            }
        }

        this.data.source = hourlyData;
    },

    processHealthData: function() {

        this.data.maxBattery = 60;
        for (let i = 0; i < this.data.source.length; i++) {
            if (this.data.source[i].battery > this.data.maxBattery) {
                this.data.maxBattery = this.data.source[i].battery;
            }
        }
        if (this.data.maxBattery < 60) this.data.maxBattery = 100;

        this.data.pos = this.data.source.length - 1;
        this.data.loading = false;

        this.bar();
    },

    drawInfo: function() {
        if (this.data.loading || this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "NO DATA", "", 4, 15, 1);
            return;
        }

        let entry = this.data.source[this.data.pos];

        let batTerystr = entry.battery.toString();
        ew.UI.btn.i2l("main", "_main", 9, batTerystr, "battery", 4, 15, 3);
        //ew.UI.btn.c2l("main", "_main", 2,entry.batteryMin, entry.batteryMax, 4, 15, 1);

        //ew.UI.btn.i2l("main", "_main", 1,entry.batteryMin, entry.batteryMax, 4, 15, 1);

        // Time
        let hours = entry.hr.toString().padStart(2, '0');
        let mins = entry.min.toString().padStart(2, '0');
        //let timeStr = "MAX:" + entry.batteryMax + " MIN:" +entry.batteryMin +" "+ hours + ":" + mins;
        let timeStr = "time: " + hours + ":" + mins;

        //ew.UI.btn.i2l("main", "_main", 6,entry.batteryMin, entry.batteryMax, 4, 15, 1);
        //ew.UI.btn.c2l("main", "_main", 6,timeStr, "", 4, 15,18,0, "Vector");

        ew.UI.btn.c2l("main", "_header", 6, timeStr, "", 15, 0, 1.3, 1);

        //ew.UI.btn.c2l("main", "_main", 6, timeStr, "", 4, 15, 1, 4, "LECO1976Regular22");

    },

    drawGraph: function(update, newPos) {
        const margin = 2;
        const width = g.getWidth() - margin;
        const bottom = g.getHeight();
        const graphTop = 130;
        const graphHeight = 45;
        const fields = this.data.source.length;
        const space = 3;

        // Αν δεν υπάρχουν δεδομένα, έξοδος
        if (fields === 0) return;

        // Μέγιστο πλάτος μπάρας
        const MAX_BAR_WIDTH = 30;

        // Υπολογισμός πλάτους μπάρας και startX (ίδιος με πριν)
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

        // Scale for bars
        let scale = graphHeight / this.data.maxBattery;

        // Αν είναι update, ανανέωσε μόνο την επιλεγμένη μπάρα
        if (update) {
            let oldPos = this.data.posL; // προηγούμενη θέση
            newPos; // νέα θέση


            // 1. Σβήσε το highlight από την παλιά επιλεγμένη μπάρα
            let oldX = startX + oldPos * (bw + space);
            let oldEntry = this.data.source[oldPos];
            let oldBarH = oldEntry.battery * scale;
            let oldColor = 4; // default green
            if (oldEntry.battery > 100) oldColor = 13;
            if (oldEntry.battery > 120) oldColor = 13;

            g.setCol(1, oldColor);
            g.fillRect(oldX, graphTop + graphHeight - oldBarH, oldX + bw, graphTop + graphHeight);

            // 2. Βάλε highlight στη νέα επιλεγμένη μπάρα
            let newX = startX + newPos * (bw + space);
            let newEntry = this.data.source[newPos];
            let newBarH = newEntry.battery * scale;

            g.setCol(1, 15); // highlight color
            g.fillRect(newX, graphTop + graphHeight - newBarH, newX + bw, graphTop + graphHeight);

            // 3. Ζωγράφισε τα περιγράμματα
            //g.setCol(1, 14);
            //    g.drawRect(newX - 1, graphTop - 1, newX + bw + 1, graphTop + graphHeight + 1);


        }
        else {
            // Πρώτη φορά - ζωγράφισε τα πάντα
            //g.setCol(0, 0);
            //g.fillRect(0, graphTop - 5, g.getWidth(), bottom + 5);

            // Draw bars
            for (let i = 0; i < fields; i++) {
                let entry = this.data.source[i];
                let barH = entry.battery * scale;
                let x = startX + i * (bw + space);
                let isSelected = (i === this.data.pos);

                let color = 4; // 
                if (entry.battery > 100) color = 13; // yellow
                if (entry.battery > 120) color = 13; // red

                g.setCol(1, isSelected ? 15 : color);
                g.fillRect(x, graphTop + graphHeight - barH, x + bw, graphTop + graphHeight);

            }
            /*
                    // Highlight selected bar
                    if (this.data.pos < fields) {
                        let x = startX + this.data.pos * (bw + space);
                        g.setCol(1, 14);
                        g.drawRect(x - 1, graphTop - 1, x + bw + 1, graphTop + graphHeight + 1);
                    }
            */
        }

        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.drawInfo()
        }, 50)

    },

    bar: function() {
        if (ew.is.UIpri || ew.UI.ntid) return;

        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);

        // Bar control for scrolling through readings
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
                    this.drawGraph(true, b); // update mode
                    //this.drawInfo();
                }
            };

            ew.is.slide = 1;
            this.drawGraph();
        }
        else if (!this.data.loading && this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "NO DATA", "", 4, 15, 1.3);
            ew.UI.btn.c2l("bar", "_bar", 6, "", "", 15, 0, 1);
        }
        else
            ew.UI.btn.c2l("bar", "_bar", 6, "", "", 15, 0, 1);
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
