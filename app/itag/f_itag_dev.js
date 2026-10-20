//itag store viewer

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag", 0);

});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag", 0);

});

ew.face[0] = {
    data: {
        img: {
            scan: "mEwwIcZg/+Aocfx+AAoV4gPgAoQDBuAEBgPAgE4AoQVBjgFBgYCBhgoCAQMGAQUgAolACggFL6AFGGQQFJEZsGsAFEIIhNFLIplFgBxBnwFCPYP/AoU8gf/BwKVB/+/SAUD/kf+CjDh/4V4n8AoYeBAoq1DgIqDAAP/XYcAv4qEn4qEGwsfC4kPEYkHF4Z1DACA=",
        },
        source: 0,
        name: 0,
        key: 0,
        key_1: 0,
        key_2: 0,
        key_3: 0,
        lowLimit: 0,
        hiLimit: 0,
        fields: 0,
        totLowField: 0,
        ref: 0,
        style: 1,
        posL: 0
    },
    gatt: {},
    run: false,
    coord: (process.env.BOARD == "BANGLEJS2") ? { "main": [0, 29, 176, 115], "id": [88, 97], "batt": [88, 65], "unit": [45, 70], "last": [88, 35] } : { "main": [0, 55, 240, 185], "id": [120, 160], "batt": [120, 120], "unit": [70, 122], "last": [120, 70] },
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function(o) {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        ew.UI.ele.ind(2, 2, 0, 15);
        this.moveDo = 0;

        // ---- scan mode setup ----
        if (!ew.apps.itag.state.def.set.scanAll) {
            if (o === "move") this.moveMode = 1;
            this.data.array = ew.apps.itag.state.def.set.showHidden ? ew.apps.itag.state.def.hiddenOrder : ew.apps.itag.state.def.storeOrder;
            this.data.source = ew.apps.itag.state.def.store;;
            this.data.key = "batt";
            if (ew.apps.itag.state.focus)
                this.data.posL = this.data.array.indexOf(ew.apps.itag.state.focus);
            else
                this.data.posL = this.data.array[ew.apps.itag.state.def.set.pos] ? ew.apps.itag.state.def.set.pos : 0;
        }
        else {
            this.data.array = ew.apps.itag.state.scanAllA;
            this.data.source = ew.apps.itag.state.scanAll;;
            this.data.key = "fixed";
            this.data.posL = this.data.array[ew.apps.itag.state.def.set.pos] ? ew.apps.itag.state.def.set.pos : 0;
        }

        let dev = this.data.array[this.data.posL];
        this.info(this.data.source[dev].batt, dev, this.data.source[dev].name, this.data.source[dev].last);
        ew.UI.btn.img("main", "_bar", 6, "scan.face", "WAIT", 14, 0, 1);

        this.bar();

        // ---- UI control Start ----
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 9);
        ew.UI.c.end();

        // ---- button hander ----
        ew.UI.c.main._main = (i, l) => {
            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);

                if (this.moveMode) {
                    this.moveDo = 1 - this.moveDo;
                    if (this.moveDo) ew.apps.itag.state.move = this.data.posL
                    let v = this.graph(this.data.array, this.data.posL, 0, this.data.key);
                    this.info(v[0], v[1], v[2], v[3]);
                    if (ew.def.face.info) ew.UI.btn.ntfy(0, 0.8, 0, "_bar", 6, this.moveDo ? "DRAG TO MOVE" : "MOVED", "", 0, 15);
                    return;
                }

                // set focus mode
                if (ew.apps.itag.state.focus == this.data.array[this.data.posL]) {
                    ew.apps.itag.state.focus = 0;
                    ew.apps.itag.stopScan();
                    if (ew.apps.itag.state.def.set.persist) ew.apps.itag.scan();
                    ew.apps.itag.state.run = 0;
                    if (ew.apps.itag.tid.focus) {
                        clearTimeout(ew.apps.itag.tid.focus);
                        ew.apps.itag.tid.focus = 0
                    }
                }
                else {
                    ew.apps.itag.state.focus = this.data.array[this.data.posL];
                    ew.apps.itag.stopScan();
                    ew.apps.itag.scan((this.data.source[ew.apps.itag.state.focus].phy === 2 ? 2 : "0"));
                    ew.apps.itag.state.run = 1;
                    //stop scan after half an hour
                    if (ew.apps.itag.tid.focus) clearTimeout(ew.apps.itag.tid.focus);
                    ew.apps.itag.tid.focus = setTimeout(() => {
                        ew.apps.itag.state.focus = 0;
                        ew.apps.itag.stopScan();
                        ew.apps.itag.state.run = 0;
                        ew.notify.alert("error", { "id": "1999", "src": "itag", "title": "Scanner", "body": "Focus Timeout" }, 0, 1);
                    }, 60000 * 30)
                }
                let v = this.graph(ew.face[0].data.array, this.data.posL, 1, this.data.key);
                this.info(v[0], v[1], v[2], v[3]);
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, (!ew.apps.itag.state.focus) ? "UNFOCUS FROM" : "FOCUS AT", this.data.source[this.data.array[this.data.posL]].name.toUpperCase(), 0, 15);

            }
            else if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.4, 0, "_bar", 6, "HOLD TO", this.moveMode ? this.moveDo ? "RELEASE" : "SELECT" : "FOCUS", 0, 15);

        };
    },
    show: function(s) {
        if (!this.run) return;

    },
    info: function(batt, id, name, last) {
        g.setCol(0, (ew.apps.itag.state.focus && id === ew.apps.itag.state.focus) ? 13 : this.moveDo ? 4 : ew.apps.itag.state.def.set.scanAll ? 6 : 1);
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });


        // devInfo
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 1);
        //g.setFont("Teletext10x18Ascii");
        let volt = this.data.source[id].volt;
        let devInfo = (volt) ? batt + "% " + volt / 100 * 2 + "V " + (this.data.source[id].phy ? "CD" : "1M") : batt + "%";
        let l = g.stringWidth(devInfo) / 2;
        g.drawString(devInfo, this.coord.batt[0] - l, this.coord.batt[1]);


        // last seen
        const now = (Date.now() / 1000 | 0);
        const diffMins = (now - last) / 60 | 0;
        g.setCol(1, 14);
        g.setFont("Teletext10x18Ascii");
        g.drawString(this.formatTimeDiff(diffMins), this.coord.last[0] - g.stringWidth(this.formatTimeDiff(diffMins)) / 2, this.coord.last[1]); //


        // id
        g.setCol(1, 14);
        if (process.env.BOARD == "BANGLEJS2") g.setFont("Vector", 20 * ew.UI.size.txt);
        else g.setFont("Teletext10x18Ascii");
        g.drawString(id.split(" ")[0].toUpperCase(), this.coord.id[0] - g.stringWidth(id.split(" ")[0].toUpperCase()) / 2, this.coord.id[1]); //

        // name
        //g.setFont("Teletext10x18Ascii");
        ew.UI.btn.c2l("main", "_header", 6, name, "", 15, 0, 1.5);
        //ew.UI.btn.c2l("main", "_header", 6, name, "", 15, 0, 2,-2,"Intl");

    },
    formatTimeDiff: function(mins) {
        if (mins < 1) return 'Now';
        if (mins < 60) return `${mins} Minutes ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} Hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} Days ago`;
    },
    move: function(from, to) {
        ew.face[0].data.array.splice(to, 0, ew.face[0].data.array.splice(from, 1)[0]);
    },
    bar: function() {
        //if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        if (ew.UI.ntid) return;

        //"ram";

        if (this.data.array.length === 0) {
            ew.UI.btn.c2l("main", "_main", 15, "EMPTY", "", 15, 0, 2);
            //return;
        }
        ew.UI.ele.fill("_bar", 6, 0);

        // graph the bar
        if (this.data.array.length) {
            let v = this.graph(ew.face[0].data.array, this.data.posL, 0, this.data.key);
            //this.info(v[0], v[1], v[2], v[3]);
        }
        else {
            ew.UI.btn.c2l("main", "_main", 15, "EMPTY", "", 15, 0, 2);
        }

        // set the bar control
        ew.sys.TC.val = { cur: this.data.posL, dn: 0, up: ew.face[0].data.array.length - 1, reverce: 0, loop: 1 };
        ew.UI.c.tcBar = (a, b, r, m) => {
            //"ram";
            if (ew.apps.itag.state.move != -1 && this.moveDo) {
                this.move(this.data.posL, b);
                ew.apps.itag.state.move = b;

            }
            let v = this.graph(ew.face[0].data.array, b, 1, this.data.key);
            if (!v) { return; }
            g.flip();
            // call info
            if (ew.tid.barDo) clearTimeout(ew.tid.barDo);
            ew.tid.barDo = setTimeout(() => {
                ew.tid.barDo = 0;
                this.info(v[0], v[1], v[2], v[3])
            }, 20);

        };
        ew.is.slide = 1;

        // reset UI control, bar only
        ew.UI.c.start(0, 1);
        ew.UI.c.end();

        // bar buttons
        ew.UI.c.bar._bar = (i) => {
            if (i == 1) {}
        };
    },
    graph: function(data, pos, update, focus) {
        //"ram";
        // vars
        const width = g.getWidth() - (process.env.BOARD == "BANGLEJS2" ? 0 : 30);
        const bottom = g.getHeight() - (process.env.BOARD == "BANGLEJS2" ? 0 : 15);
        const height = process.env.BOARD == "BANGLEJS2" ? 42 : 70
        const value = this.data.key;
        const fields = this.data.array.length;
        const source = this.data.source;
        const margin = process.env.BOARD == "BANGLEJS2" ? 0 : 15;
        const bw = width / fields;
        const devP=data[pos];
        if (!devP) return;


        let scale = height / 100;

        const limitsP = (ew.apps.itag.state.focus == devP) ? 1 : 0;
        const limitsLp = (ew.apps.itag.state.focus == data[this.data.posL]) ? 1 : 0;

        if (update) {

            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 3 + (this.data.posL * bw) + bw - 3, bottom - height - 8, margin + 3 + (this.data.posL * bw), bottom - height - 5);
            // top dot - create current
            g.setCol(1, 15);
            if (fields) g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - height - 8, margin + 3 + (pos * bw), bottom - height - 5);

            // bar - clear previus 
            g.setCol(1, limitsLp ? 13 : this.moveDo ? 1 : ew.apps.itag.state.def.set.scanAll ? 6 : ew.apps.itag.state.def.set.showHidden ? 9 : 4);
            if (this.moveDo) 
                g.fillRect(margin + 3 + (this.data.posL * bw) + bw - 3, bottom - 100 * scale, margin + 3 + (this.data.posL * bw), bottom);
            else
                g.fillRect(margin + 3 + (this.data.posL * bw) + bw - 3, bottom - (source[data[this.data.posL]][value] * scale), margin + 3 + (this.data.posL * bw), bottom);

            // bar - highlight current
            g.setCol(1, limitsP ? 13 : 15);
            if (this.moveDo) 
                g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - 100 * scale, margin + 3 + (pos * bw), bottom);
            else
                g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - (source[devP][value] * scale), margin + 3 + (pos * bw), bottom);

            this.data.posL = pos;

            return [source[devP][value], devP, source[devP].name, source[devP].last];
        }

        // first draw
        // dot highlight current
        g.setCol(1, 14);
        if (1 < fields) g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - height - 8, margin + 3 + (pos * bw), bottom - height - 5);

        // bar - draw bars
        for (let i in data) {
            if (fields < i) break;
            const dev=data[i];
            let limits = (ew.apps.itag.state.focus === dev) ? 1 : 0;
            g.setCol(1, limits ? 13 : this.moveDo ? 1 : ew.apps.itag.state.def.set.scanAll ? 6 : ew.apps.itag.state.def.set.showHidden ? 9 : 4);
            if (this.moveDo)
                g.fillRect(margin + 3 + (i * bw) + bw - 3, bottom -100 * scale, margin + 3 + (i * bw), bottom);
            else
                g.fillRect(margin + 3 + (i * bw) + bw - 3, bottom - (source[dev][value] * scale), margin + 3 + (i * bw), bottom);

        }
        // bar - highlight curent
        g.setCol(1,  limitsP ? 13 : 15);
        if (this.moveDo)
            g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - 100 * scale, margin + 3 + (pos * bw), bottom);
        else
            g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - (source[devP][value] * scale), margin + 3 + (pos * bw), bottom);

        return [source[devP][value], devP, source[devP].name, source[devP].last];


    },
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        if (ew.face.appCurr != "itag-dev-set") ew.apps.itag.state.move = -1;
        ew.apps.itag.state.def.set.pos = this.data.posL;
        this.tid = 0;
        if (ew.apps.itag.state.focus || (ew.apps.itag.state.def.set.persist && ew.face.appCurr === "itag") || (ew.face.appCurr.startsWith("itag") && !ew.face.pageCurr)) return;
        else ew.apps.itag.stopScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
