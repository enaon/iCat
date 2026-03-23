// health face - temperature

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.temp.state.def.page++;
    if (3 < ew.apps.temp.state.def.page) ew.apps.temp.state.def.page = 1;
    ew.face[0].mode(ew.apps.temp.state.def.page);

});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.temp.state.def.page--;
    if (ew.apps.temp.state.def.page < 1) ew.apps.temp.state.def.page = 3;
    ew.face[0].mode(ew.apps.temp.state.def.page);
});

ew.face[0] = {
    data: {
        source: [], // health data array
        loading: true, // loading state
        key: "temperature", // current key for graph
        pos: 0, // current position
        maxMove: 10000, // default max move
        topL:ew.apps.temp.state.def.topL, 
        btmL:ew.apps.temp.state.def.btmL,
    },
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    pendingReads: 0, // αριθμός εκκρεμών αναγνώσεων

    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;

        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.c.end();

        this.run = true;
    },

    show: function() {
        if (!this.run) return;
        this.mode(ew.apps.temp.state.def.page || 0);
    },

    mode: function(a) {

        //let health = require("health");
        this.data.source = [];
        this.data.loading = true;
        ew.apps.temp.state.def.page = a;
        let time = new Date();
        let period, lenght, type;

        ew.UI.btn.i2l("main", "_main", 9, "LOADING", "", 15, 1, 1.3);
        if (!ew.UI.ntid) ew.UI.ele.fill("_bar", 6, 1);

        if (!a || a === 1) {
            ew.UI.ele.ind(1, 3, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "4 HOURS", "", 15, 1, 1.15, 1);
            period = "readDay"
            length = 24;
            type = "Date"
        }
        else if (a === 2) {
            ew.UI.ele.ind(2, 3, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "24 HOURS", "", 15, 0, 1.15, 1);
            period = "readDay"
            length = 138;
            type = "Date"
        }
        else if (a === 3) {
            ew.UI.ele.ind(3, 3, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "30 DAYS", "", 15, 0, 1.15, 1);
            period = "readDailySummaries"
            length = 30;
            type = "Month"
        }
        if (!this.data["source" + a]) {
            require("health")[period](time, (entry) => {
                //if (entry && entry.temperature && entry.temperature > 0) {
                if (entry) {
                    this.data.source.push({
                        temperature: entry.temperature,
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
                    //if (entry && entry.temperature && entry.temperature > 0) {
                    if (entry) {

                        this.data.source.push({
                            temperature: entry.temperature,
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
            if (a === 2) this.pHAv();
           /* if (a === 3) {
                time = new Date()
                let now = Bangle.getHealthStatus("day")
                this.data.source.push({
                    temperature: now.temperature,
                    hr: time.getDate(),
                    min: time.toString().substr(4, 3)
                });

            }
            if (a === 1) {
                time = new Date();
                let now = Bangle.getHealthStatus();
                this.data.source.push({
                    temperature: now.temperature,
                    hr: time.getHours(),
                    min: Math.floor( time.getMinutes() / 10) * 10
                });
            }
            */
            this.data["source"+a]=this.data.source;
        }
        else
            this.data.source=this.data["source"+a];


            this.pHDa();
    },

    pHAv: function() {
        let sums = new Uint16Array(24);
        let counts = new Uint8Array(24);
        let now = new Date();
        let currentHour = now.getHours();

        // Για κάθε 10λεπτη μέτρηση
        for (let i = 0; i < this.data.source.length; i++) {
            let entry = this.data.source[i];
            let hour = entry.hr; // 0-23

            if (entry.temperature > 0) {
                sums[hour] += entry.temperature;
                counts[hour]++;
            }
        }
        let hourlyData = [];

        //for (let offset = 0; offset < 24; offset++) {
        for (let offset = 23; offset >= 0; offset--) {

            let displayHour = (currentHour - offset + 24) % 24;

            if (counts[displayHour] > 0) {
                hourlyData.push({
                    temperature: sums[displayHour] / counts[displayHour] | 0,
                    hr: displayHour,
                    min: 0,
                });
            }
        }

        this.data.source = hourlyData;
    },

    pHDa: function() {

        this.data.maxMove = 60;
        for (let i = 0; i < this.data.source.length; i++) {
            if (this.data.source[i].temperature > this.data.maxMove) {
                this.data.maxMove = this.data.source[i].temperature;
            }
        }
        if (this.data.maxMove < 60) this.data.maxMove = 100;

        this.data.pos = this.data.source.length - 1;
        this.data.loading = false;

        this.bar();
    },

    dIn: function() {
        if (this.data.loading || this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "NO DATA", "", 15, 1, 1);
            return;
        }

        let entry = this.data.source[this.data.pos];

        let moveStr = entry.temperature.toString();
        ew.UI.btn.c2l("main", "_main", 3, moveStr, "", 15, 6, 1, 8, "LECO1976Regular42");

        // Time
        let hours = entry.hr.toString().padStart(2, '0');
        let mins = entry.min.toString().padStart(2, '0');
        let timeStr = "TIME: " + hours + ":" + mins;

        ew.UI.btn.c2l("main", "_main", 6,timeStr, "", 15, 1,18,2, "Vector");


    },

    dGr: function(update, newPos) {

        const margin = 2;
        const width = g.getWidth() - margin;
        const bottom = g.getHeight();
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

        // Scale for bars
        let scale = graphHeight / this.data.maxMove;

        // Αν είναι update, ανανέωσε μόνο την επιλεγμένη μπάρα
        if (update) {
            let oldPos = this.data.posL; // προηγούμενη θέση
            newPos; // νέα θέση

            // 1. Σβήσε το highlight από την παλιά επιλεγμένη μπάρα
            let oldX = startX + oldPos * (bw + space);
            let oldEntry = this.data.source[oldPos];
            let oldBarH = oldEntry.temperature * scale;
            
            let color =  topL < oldEntry.temperature ? 13 : oldEntry.temperature < btmL? 4: 9;

            g.setCol(1, color);
            g.fillRect(oldX, graphTop + graphHeight - oldBarH, oldX + bw, graphTop + graphHeight);

            // 2. Βάλε highlight στη νέα επιλεγμένη μπάρα
            let newX = startX + newPos * (bw + space);
            let newEntry = this.data.source[newPos];
            let newBarH = newEntry.temperature * scale;

            g.setCol(1, 15); // highlight color
            g.fillRect(newX, graphTop + graphHeight - newBarH, newX + bw, graphTop + graphHeight);

            // 3. Ζωγράφισε τα περιγράμματα
            //g.setCol(1, 14);
            //    g.drawRect(newX - 1, graphTop - 1, newX + bw + 1, graphTop + graphHeight + 1);


        }
        else {

            // Draw bars
            for (let i = 0; i < fields; i++) {
                let entry = this.data.source[i];
                let barH = entry.temperature * scale;
                let x = startX + i * (bw + space);
                let isSelected = (i === this.data.pos);

                let color =  topL < entry.temperature ? 13 : entry.temperature < btmL? 4: 9;

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
            this.dIn()
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
                    this.dGr(true, b); // update mode
                    //this.dIn();
                }
            };

            ew.is.slide = 1;
            this.dGr();
        }
        else if (!this.data.loading && this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "NO DATA", "", 15, 1, 1.3);
        }

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
