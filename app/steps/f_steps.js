// steps

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.steps.state.def.page++;
    if (3 < ew.apps.steps.state.def.page) ew.apps.steps.state.def.page = 0;
    ew.face[0].mode(ew.apps.steps.state.def.page);
});

ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.steps.state.def.page--;
    if (ew.apps.steps.state.def.page < 0) ew.apps.steps.state.def.page = 3;
    ew.face[0].mode(ew.apps.steps.state.def.page);
});

ew.face[0] = {
    data: {
        source: [], // health data array
        loading: true, // loading state
        key: "steps", // current key for graph
        pos: 0, // current position
        max: 10000, // default max 
        topL: ew.apps.steps.state.def.topL,
        btmL: ew.apps.steps.state.def.btmL,
        now: ew.apps.steps.state.def.tare ? Bangle.getHealthStatus("day").steps - ew.apps.steps.state.def.tare : Bangle.getHealthStatus("day").steps,

    },
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,

    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;

        if (ew.def.face.info) ew.UI.btn.ntfy(0, 1.5, 0, "_bar", 6, !ew.apps.steps.state.def.dist ? "STEPS" : "DISTANCE", !ew.apps.steps.state.def.dist ? "" : "IN KM", 15, 1);

        ew.apps.steps.state.run = ew.apps.steps.state.def.tare ? 1 : 0;
        if (ew.apps.steps.state.run) ew.apps.steps.state.def.page = 0;

        // UI control Start
        if (ew.apps.steps.state.def.dist) this.data.now = (this.data.now * ew.apps.steps.state.def.strd / 1000).toFixed(2);

        ew.UI.c.start(1, 0);
        ew.UI.c.end();


        this.mode(ew.apps.steps.state.def.page || 0);
        this.run = true;
    },

    show: function() {
        if (!this.run) return;

        if (!ew.apps.steps.state.def.page)
            this.live();


        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.show();
        }, 1000);
    },
    live: function(i) {

        if (i) {
            //ew.UI.btn.img("bar", "_bar", 6, !ew.apps.steps.state.def.tare ? "play" : "stop", "", 15, ew.apps.steps.state.def.tare ? 13 : 1, 1, 1);
            ew.UI.btn.c2l("main", "_header", 6, "LIVE - " + (ew.apps.steps.state.def.tare ? "SESSION" : "TODAY"), "", 15, 0, 1, 1);
        }
        this.data.now = ew.apps.steps.state.def.tare ? Bangle.getHealthStatus("day").steps - ew.apps.steps.state.def.tare : Bangle.getHealthStatus("day").steps;
        if (ew.apps.steps.state.def.dist) this.data.now = (this.data.now * ew.apps.steps.state.def.strd / 1000).toFixed(2);
        ew.UI.btn.c2l("main", "_main", 9, this.data.now, "", 15, 6, 3, 8, "LECO1976Regular22");
        //ew.UI.btn.c2l("main", "_main", 6, "Distance: 0.1 Km", "", 15, 1, 18, 2, "Vector");
        ew.apps.steps.state.run = ew.apps.steps.state.def.tare ? this.data.now ? this.data.now : 1 : 0;

    },
    mode: function(page) {
        ew.apps.steps.state.def.page = page;

        if (page === 0) {
            this.data.now = ew.apps.steps.state.def.tare ? Bangle.getHealthStatus("day").steps - ew.apps.steps.state.def.tare : Bangle.getHealthStatus("day").steps;
            if (ew.apps.steps.state.def.dist) this.data.now = (this.data.now * ew.apps.steps.state.def.strd / 1000).toFixed(2);
            ew.UI.ele.ind(1, 4, 0, 15);
            ew.UI.btn.c2l("main", "_header", 6, "LIVE - " + (ew.apps.steps.state.def.tare ? "SESSION" : "TODAY"), "", 15, 0, 1, 1);
            ew.UI.btn.c2l("main", "_main", 9, this.data.now, "", 15, 6, 3, 8, "LECO1976Regular22");
            //ew.UI.btn.c2l("main", "_main", 6, "Distance: 0.1 Km", "", 15, 1, 18, 2, "Vector");
            this.bar();
            return;
        }

        this.data.source = [];
        this.data.loading = true;
        let time = new Date();
        let period, length, type, title;

        ew.UI.btn.img("main", "_main", 9, "ew_i_scan.img", "", 14, 1, 1.4);
        //ew.UI.btn.i2l("main", "_main", 9, "LOADING", "", 15, 1, 1.3);
        if (!ew.UI.ntid) ew.UI.ele.fill("_bar", 6, 0);

        if (!page || page === 1) {
            ew.UI.ele.ind(2, 4, 0, 15);
            title = "LAST 4 HOURS";
            period = "readDay"
            length = 24;
            type = "Date"
        }
        else if (page === 2) {
            ew.UI.ele.ind(3, 4, 0, 15);
            title = "LAST 24 HOURS";
            period = "readDay"
            length = 138;
            type = "Date"
        }
        else if (page === 3) {
            ew.UI.ele.ind(4, 4, 0, 15);
            title = "LAST 30 DAYS";
            period = "readDailySummaries"
            length = 30;
            type = "Month"
        }

        ew.UI.btn.c2l("main", "_header", 6, title, "", 15, 0, 1.1, 1);

        if (!this.data["source" + page]) {
            require("health")[period](time, (entry) => {
                //if (entry && entry.steps && entry.steps > 0) {
                if (entry) {
                    if ( ew.apps.steps.state.def.act && ( entry.activity!="WALKING"||entry.activity!="EXERCISE")) 
                        return;
                    this.data.source.push({
                        steps: entry.steps,
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
                    //if (entry && entry.steps && entry.steps > 0) {
                    if (entry) {
                        if ( ew.apps.steps.state.def.act && ( entry.activity!="WALKING"||entry.activity!="EXERCISE")) 
                            return;
                        this.data.source.push({
                            steps: entry.steps,
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
            if (page === 2) this.pHAv();
            if (page === 3) {
                time = new Date()
                let now = Bangle.getHealthStatus("day")
                this.data.source.push({
                    steps: now.steps,
                    hr: time.getDate(),
                    min: time.toString().substr(4, 3)
                });

            }
            if (page === 1) {
                time = new Date();
                let now = Bangle.getHealthStatus();
                this.data.source.push({
                    steps: now.steps,
                    hr: time.getHours(),
                    min: Math.floor(time.getMinutes() / 10) * 10
                });
            }
            this.data["source" + page] = this.data.source;
        }
        else
            this.data.source = this.data["source" + page];


        this.pHD();
    },

    pHAv: function() {
        let sums = new Uint16Array(24);
        let counts = new Uint8Array(24);
        let now = new Date();
        let currentHour = now.getHours();

        // Για κάθε 10λεπτη μέτρηση
        for (let i = 0; i < this.data.source.length; i++) {
            if ( ew.apps.steps.state.def.act && ( entry.activity!="WALKING"||entry.activity!="EXERCISE")) continue;
            let entry = this.data.source[i];
            let hour = entry.hr; // 0-23

            if (entry.steps > 0) {
                sums[hour] += entry.steps;
                counts[hour]++;
            }
        }

        let hourlyData = [];

        //for (let offset = 0; offset < 24; offset++) {
        for (let offset = 23; offset >= 0; offset--) {

            let displayHour = (currentHour - offset + 24) % 24;

            //if (counts[displayHour] > 0) {
            hourlyData.push({
                steps: (counts[displayHour] > 0) ? sums[displayHour] | 0 : 0,
                hr: displayHour,
                min: 0,
            });
            //}
        }

        this.data.source = hourlyData;
    },

    pHD: function() {

        this.data.max = 60;
        for (let i = 0; i < this.data.source.length; i++) {
            if (this.data.source[i].steps > this.data.max) {
                this.data.max = this.data.source[i].steps;
            }
        }
        if (this.data.max < 60) this.data.max = 100;

        this.data.pos = this.data.source.length - 1;
        this.data.loading = false;

        this.bar();
        this.dG();
        this.dI();

    },

    dI: function() {
        if (this.data.loading || this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "NO DATA", "", 15, 1, 1);
            return;
        }

        const entry = this.data.source[this.data.pos];
        const str = (ew.apps.steps.state.def.dist) ? (entry.steps * ew.apps.steps.state.def.strd / 1000).toFixed(2) : entry.steps.toString();
        ew.UI.btn.c2l("main", "_main", 3, str, "", 15, 6, 1, 8, "LECO1976Regular42");

        // Time
        let hours = entry.hr.toString().padStart(2, '0');
        let mins = entry.min.toString().padStart(2, '0');
        let timeStr = "TIME: " + hours + ":" + mins;

        ew.UI.btn.c2l("main", "_main", 6, timeStr, "", 15, 1, 18, 2, "Vector");


    },

    dG: function(update, newPos) {
        if (ew.UI.ntid) return;

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
        let scale = graphHeight / this.data.max;

        // Αν είναι update, ανανέωσε μόνο την επιλεγμένη μπάρα
        if (update) {
            let oldPos = this.data.posL; // προηγούμενη θέση
            newPos; // νέα θέση

            // 1. Σβήσε το highlight από την παλιά επιλεγμένη μπάρα
            let oldX = startX + oldPos * (bw + space);
            let oldEntry = this.data.source[oldPos];
            let oldBarH = oldEntry.steps * scale;

            let color = topL < oldEntry.steps ? 13 : oldEntry.steps < btmL ? 4 : 9;

            g.setCol(1, color);
            g.fillRect(oldX, graphTop + graphHeight - oldBarH, oldX + bw, graphTop + graphHeight);

            // 2. Βάλε highlight στη νέα επιλεγμένη μπάρα
            let newX = startX + newPos * (bw + space);
            let newEntry = this.data.source[newPos];
            let newBarH = newEntry.steps * scale;

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
                let barH = entry.steps * scale;
                let x = startX + i * (bw + space);
                let isSelected = (i === this.data.pos);

                let color = topL < entry.steps ? 13 : entry.steps < btmL ? 4 : 9;

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

        if (this.tid1) clearTimeout(this.tid1);
        this.tid1 = setTimeout(() => {
            this.tid1 = 0;
            this.dI()
        }, 50)

    },

    bar: function() {
        if (ew.is.UIpri || ew.UI.ntid) return;

        ew.UI.ele.fill("_bar", 6, 0);

        if (!ew.apps.steps.state.def.page) {
            ew.is.slide = 0;

            ew.UI.c.start(0, 1);
            ew.UI.btn.img("bar", "_bar", 6, !ew.apps.steps.state.def.tare ? "play" : "stop", "", 15, ew.apps.steps.state.def.tare ? 13 : 1, 1, 1);
            ew.UI.c.end();

            ew.UI.c.bar._bar = (i, l) => {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.steps.state.def.tare) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "END SESSION ?", "", 15, 13, true, false, false);
                    ew.UI.c.bar._ntfy = () => {
                        ew.is.bar = 0;
                        ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                        ew.apps.steps.state.def.tare = 0;
                        if (ew.def.face.info) ew.UI.btn.ntfy(0, 1.5, 0, "_bar", 6, "SESSION ENDED", "", 0, 15);
                        this.live(1);
                    };
                    return;
                }
                ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "NEW SESSION ?", "", 15, 1, true, false, false);
                ew.UI.c.bar._ntfy = () => {
                    ew.is.bar = 0;
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    ew.apps.steps.state.def.tare = Bangle.getHealthStatus("day").steps;
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "NEW SESSION", "", 0, 15);
                    this.live(1);
                };
                //if (ew.def.face.info)  ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "NEW SESSION", "", 0, 15);
                //ew.apps.steps.state.def.tare = Bangle.getHealthStatus("day").steps;
                //this.live(1);
            };
            return;
        }


        ew.UI.c.start(0, 1);
        ew.UI.c.end();

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
                    this.dG(true, b); // update mode
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
        return true;
    },

    off: function(o) {
        g.off();
        this.clear(o);
    }
};
