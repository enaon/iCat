// health face - notify

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.na);


});
ew.UI.nav.back.replaceWith(ew.UI.nav.next);

ew.face[0] = {
    data: {
        source: [],
        loading: true,
        key: "notify",
        pos: 0,
        max: 10000,
        page: 1,
        topL: ew.apps.notify.state.topL,
        btmL: ew.apps.notify.state.btmL,
        //img: {
        //    trash: "mEwwI1yg/4AocP/gFDhkMApE//4ABAo4PCAUIACAv4FQATkGAQMYXwSgBYAUBAoPgdsg",
        //},
        size:ew.UI.loc("_bar", 6)
    },
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,

    init: function(o) {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;

        ew.UI.ele.ind(0, 0, 0, 15);
        if (typeof o === "number") ew.apps.notify.state.def.page = o;
        else if (o === "jump")
            ew.apps.notify.state.def.page =  1;

        this.now = (Date.now() / 1000) | 0;
        this.view = 0;
        this.barR();
        this.run = true;

    },

    show: function(o) {
        if (!this.run) return;
        if (typeof o === "number" && ew.UI.ntid) {
            clearTimeout(ew.UI.ntid);
            ew.UI.ntid = 0;
        }

        this.mode(ew.apps.notify.state.def.page || 0);
    },

    mode: function(page) {
        if (page !== this.data.page) this.data.pos = 0;
        this.data.page = page;
        //ew.UI.ele.ind(1, 1, 0, 15);
        this.data.source = ew.apps.notify.state.def.log;
        ew.apps.notify.state.info = 0;
        ew.apps.notify.state.run = ew.apps.notify.state.info | 0;


        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 9);
        ew.UI.c.end();

        ew.UI.c.main._main = (i, l) => {
            if (!this.data.source[this.data.pos]) return;
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            this.view = 1 - this.view;
            this.dI(this.view);
        };

        this.data.loading = false;
        //ew.UI.ele.fill("_main", 9, (ew.apps.notify.state.def.page == 1 ? 1 : 13), 10,0);

        this.bar();

    },

    fTD: function(lastseen) {
        const mins = (this.now - lastseen) / 60 | 0;
        if (mins < 1) return 'Now';
        if (mins < 60) return `${mins} Min ago`;
        const hours = (mins / 60) | 0;
        if (hours < 24) return `${hours} Hours ago`;
        const days = (hours / 24) | 0;
        return `${days} Days ago`;
    },

    dI: function(i) {
        if (this.data.loading || this.data.source.length === 0) {
            ew.UI.btn.i2l("main", "_main", 9, "ERROR", "", 15,  13, 1);
            return;
        }

        let entry = this.data.source[this.data.pos];

        ew.UI.btn.c2l("main", "_header", 5, entry.title, "", 15, 0, 1.3, 1, 0, "0", -1, 0,1);

        if (i) {
            ew.UI.ele.fill("_main", 9, (entry.type == "info" ? 1 : 13), 10,1);
            ew.UI.btn.c2l("main", "_main", 3, this.fTD(entry.time), "", 15, (entry.type == "info" == 1 ? 6 : 13), 23, 5, "Vector",0,0,0,1);
            let now = new Date(entry.time * 1000);
            let weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let result = weekdays[now.getDay()] + ' ' + now.getDate() + ' ' + (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
            ew.UI.btn.c2l("main", "_main", 6, result , "", 15, (entry.type == "info" ? 1 : 13), 20, 2, "Vector",0,0,0,1);

        }
        else {

            if (entry.rpt) {
                ew.UI.ele.fill("_main", 9, (entry.type == "info" ? 1 : 13), 10,1);
                ew.UI.btn.c2l("main", "_main", 3, entry.body.toUpperCase(), "", 15, (entry.type == "info" ? 6 : 13), 1, 11, "LECO1976Regular22",0,0,0,1);
                ew.UI.btn.c2l("main", "_main", 6, "Repeats: " + entry.rpt, "", 15, (entry.type == "info" == 1 ? 1 : 13), 20, 2, "Vector",0,0,0,1);
            }
            else
                ew.UI.btn.c2l("main", "_main", 9, entry.body.toUpperCase(), "", 15, (entry.type == "info" ? 6 : 13), 1, 0, "LECO1976Regular22");
        }
        ew.UI.btn.img("main", "_header", 1, "ew_i_" + entry.src + ".img", "", 15, 0, 0.8);

    },

    dG: function(update, newPos) {

        const margin = 2;
        const width = g.getWidth() - margin;
        const bottom = g.getHeight();
        const graphTop = graphTop = this.data.size.y-this.data.size.szY;
        const graphHeight = this.data.size.szY*2;
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

        if (update) {
            let oldPos = this.data.posL;

            let oldX = startX + oldPos * (bw + space);
            let oldEntry = this.data.source[oldPos];
            let oldBarH = 30; // * scale;

            let color = topL < oldBarH ? 13 : oldBarH < btmL ? 9 : oldEntry.type == "info" ? 4 : 13;

            g.setCol(1, color);
            g.fillRect(oldX, graphTop + graphHeight - oldBarH, oldX + bw, graphTop + graphHeight);
            g.setCol(1, 0);
            g.fillRect(oldX, graphTop + 5, oldX + bw, graphTop + 8);

            let newX = startX + newPos * (bw + space);
            let newEntry = this.data.source[newPos];
            let newBarH = 30; // * scale;

            g.setCol(1, 15); // highlight color
            g.fillRect(newX, graphTop + graphHeight - newBarH, newX + bw, graphTop + graphHeight);
            g.fillRect(newX, graphTop + 5, newX + bw, graphTop + 8);

        }
        else {

            // Draw bars
            for (let i = 0; i < fields; i++) {
                let entry = this.data.source[i];
                let barH = 30; //entry.notifyment * scale;
                let x = startX + i * (bw + space);
                let isSelected = (i === this.data.pos);

                let color = topL < barH ? 13 : barH < btmL ? 9 : entry.type == "info" ? 4 : 13;

                g.setCol(1, isSelected ? 15 : color);
                if (isSelected) g.fillRect(x, graphTop + 5, x + bw, graphTop + 8);

                g.fillRect(x, graphTop + graphHeight - barH, x + bw, graphTop + graphHeight);
            }
        }

        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(() => {
            this.tid = 0;
            this.dI(this.view);
        }, 50);

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
                reverce: 0,
                loop: 1
            };

            ew.UI.c.tcBar = (a, b) => {
                if (b >= 0 && b < this.data.source.length) {
                    this.data.posL = this.data.pos;
                    this.data.pos = b;
                    this.view = 0;
                    this.dG(true, b); // update mode
                    //this.dI();
                }
            };

            ew.is.slide = 1;
            if (!this.data.source[this.data.pos]) this.data.pos = this.data.source.length - 1;
            this.dG();
        }
        else if (!this.data.loading && this.data.source.length === 0) {
            ew.UI.btn.c2l("main", "_header", 6, "LOG" , "", 15, 0, 1.1, 1);
            ew.UI.btn.c2l("main", "_main", 9, "EMPTY", "", 15, 6 , 1, 0, "LECO1976Regular22");

        }

    },

    barR: function() {

        this.barC = ew.UI.bar.bind({});

        ew.UI.bar.replaceWith((i) => {
            ew.is.UIpri = 0;
            ew.is.bar = 1;
            ew.is.slide = 0;
            ew.UI.btn.ntfy(0, 2.5, 1);
            ew.UI.ele.fill("_bar", 6, process.env.BOARD == "BANGLEJS2" ? 1 : 0);
            ew.UI.c.start(0, 1);
            ew.UI.btn.img("bar", "_bar", 1, "ew_i_trash.img", "DEL", 13, 13, 1.2, 0, 1);
            ew.UI.btn.img("bar", "_bar", 3, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", "", 15, 0, 0.8, 0, 1);
            ew.UI.c.end();

            ew.UI.c.bar._bar = (i, l) => {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.UI.ntid && !ew.is.UIpri) {
                    clearTimeout(ew.UI.ntid);
                    ew.UI.ntid = 0;
                }
                ew.UI.ele.fill("_bar", 6, 0);
                if (i === 3) ew.face.go(ew.face.appCurr + "-set", 0);

                else if (i === 1) {
                    // ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    if (l) {
                        ew.sys.buzz.nav(ew.sys.buzz.type.na);
                        ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "DELETE ALL?", "", 15, 13, true, false, false);
                        ew.UI.c.bar._ntfy = () => {
                            ew.is.bar = 0;
                            ew.sys.buzz.nav(ew.sys.buzz.type.na);
                            this.data.source.splice(0,50);
                            if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.8, 0, "_bar", 6, "OK", "", 0, 15);
                            else ew.UI.btn.ntfy(0, 0.05, 1);
                        };
                        return;
                    }
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "DELETE?", "", 15, 13, true, false, false);
                    ew.UI.c.bar._ntfy = () => {
                        ew.is.bar = 0;
                        ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                        this.data.source.splice(this.data.pos, 1);
                        if (!this.data.source[this.data.pos]) this.data.pos = this.data.source.length - 1;
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.8, 0, "_bar", 6, "OK", "", 0, 15);
                        else ew.UI.btn.ntfy(0, 0.05, 1);
                    };

                } //else ew.face.go("launcher", 0, i);
            };
        });

    },
    clear: function(o) {
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        ew.UI.bar.replaceWith(this.barC);
        return true;
    },

    off: function(o) {
        g.off();
        this.clear(o);
    }
};
