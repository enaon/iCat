//itag scan viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-scan", 0);

});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-scan", 0);

});

ew.face[0] = {
    data: { source: 0, name: 0, key: 0, key_1: 0, key_2: 0, key_3: 0, lowLimit: 0, hiLimit: 0, fields: 0, totLowField: 0, ref: 0, style: 1, posL: 0 },
    gatt: {},
    run: false,
    coord: (process.env.BOARD == "BANGLEJS2") ? { "main": [0, 35, 176, 123], "id": [88, 104], "batt": [30, 72], "unit": [45, 75], "last": [88, 42] } : { "main": [0, 55, 240, 185], "id": [120, 160], "batt": [57, 120], "unit": [70, 122], "last": [120, 70] },
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function(o) {
        ew.def.face.off[ew.face.appCurr] = this.offms;
        ew.UI.ele.ind(1, 2, 0, 2);
        
        // ---- scan mode setup ----
        if (!ew.apps.itag.state.def.set.scanAll) {
            if (o === "move") this.moveMode = 1;
            this.moveDo = 0;
            this.data.array = ew.apps.itag.state.def.set.showHidden?ew.apps.itag.state.def.hiddenOrder: ew.apps.itag.state.def.storeOrder;
            this.data.source = ew.apps.itag.state.def.store;;

            this.data.key = "batt";
            if (ew.apps.itag.state.focus)
                this.data.posL = this.data.array.indexOf(ew.apps.itag.state.focus);
            else
                this.data.posL = this.data.array[ew.apps.itag.state.def.set.pos]?ew.apps.itag.state.def.set.pos:0;
        }else{
            this.data.array = ew.apps.itag.state.scanAllOrder;
            this.data.source = ew.apps.itag.state.scanAll;;
            this.data.key = "fixed";
            this.data.posL = ew.apps.itag.state.scanAllOrder[ew.apps.itag.state.def.set.pos]?ew.apps.itag.state.def.set.pos:0;
        }
        
        // ---- UI control Start ----
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 6);
        ew.UI.c.end();
        
        // ---- button hander ----
        ew.UI.c.main._main = (i, l) => {
            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);

                if (this.moveMode) {
                    this.moveDo = 1 - this.moveDo;
                    if (this.moveDo) ew.apps.itag.state.move = this.data.posL
                    let v = this.graph(ew.face[0].data.array, this.data.posL, 1, this.data.key);
                    this.info(v[0], v[1].split(" ")[0], v[2], v[3]);
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.4, 0, "_bar", 6, this.moveDo ? "DRAG TO MOVE" : "MOVED", "", 0, 15);
                }
                else {
                    if (ew.apps.itag.state.focus == ew.face[0].data.array[this.data.posL]) {
                        ew.apps.itag.state.focus = 0;
                        if (!ew.apps.itag.state.def.set.persist) ew.apps.itag.stopScan();
                    }
                    else {
                        ew.apps.itag.state.focus = ew.face[0].data.array[this.data.posL];
                        if (!ew.apps.itag.state.ble.scan) ew.apps.itag.scan();

                    }
                    let v = this.graph(ew.face[0].data.array, this.data.posL, 1, this.data.key);
                    this.info(v[0], v[1].split(" ")[0], v[2], v[3]);
                    
                    if (ew.def.face.info) {
                    if (ew.apps.itag.state.def.set.scanAll )
                        ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6,  (!ew.apps.itag.state.focus) ? "UNFOCUS FROM" : "FOCUS TO",ew.apps.itag.state.scanAll[this.data.array[this.data.posL]].name.toUpperCase(), 0, 15);
                    else
                        ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6,  (!ew.apps.itag.state.focus) ? "UNFOCUS FROM" : "FOCUS TO",ew.apps.itag.state.def.store[this.data.array[this.data.posL]].name.toUpperCase(), 0, 15);
                    }
                    
                }
            }
        };
        
        

        this.bar();

        //this.run=1

    },
    show: function(s) {
        if (!this.run) return;

    },
    info: function(batt, id, name, last) {
        //ew.UI.ele.fill("_main", 6, (ew.apps.itag.state.focus && id === ew.apps.itag.state.focus.split(" ")[0]) ? 13 : this.moveDo ? 4 : 1);
        g.setCol(0, (ew.apps.itag.state.focus && id === ew.apps.itag.state.focus.split(" ")[0]) ? 13 : this.moveDo ? 4 : ew.apps.itag.state.def.set.scanAll?6:1);
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });
        // batt
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 1);
        let l = g.stringWidth(batt) / 2;
        g.drawString(batt, this.coord.batt[0] - l, this.coord.batt[1]);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("%", this.coord.unit[0] + l - g.stringWidth("%") / 2, this.coord.unit[1]);

        const now = (Date.now() / 1000 | 0);
        const diffMins = (now - last) / 60 | 0;
        // last seen
        g.setCol(1, 14);
        //g.setFont("LECO1976Regular22");
        g.drawString(this.formatTimeDiff(diffMins), this.coord.last[0] - g.stringWidth(this.formatTimeDiff(diffMins)) / 2, this.coord.last[1]); //


        // id
        g.setCol(1, 14);
        if (process.env.BOARD == "BANGLEJS2") g.setFont("Vector", 20* ew.UI.size.txt);
        else g.setFont("Teletext10x18Ascii");
        g.drawString(id.toUpperCase(), this.coord.id[0] - g.stringWidth(id.toUpperCase()) / 2, this.coord.id[1]); //

        // name
        ew.UI.btn.c2l("main", "_headerS", 6, name, "", 15, 0, 1.5);

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
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";

        if (this.data.array.length === 0) {
            ew.UI.btn.c2l("main", "_main", 6, "EMPTY", "", 15, 0, 2);
            //return;
        }
        ew.UI.ele.fill("_bar", 6, 0);

        // graph the bar
        if (this.data.array.length) {
            let v = this.graph(ew.face[0].data.array, this.data.posL, 0, this.data.key);
            this.info(v[0], v[1].split(" ")[0], v[2], v[3]);
        }else {
            ew.UI.btn.c2l("main", "_main", 15, "EMPTY", "", 15, 0, 2);
        }

        // set the bar control
        ew.sys.TC.val = { cur: this.data.posL, dn: 0, up: ew.face[0].data.array.length - 1, tmp: 0, reverce: 0, loop: 1 };
        ew.UI.c.tcBar = (a, b, r, m) => {
            "ram";
            if (ew.apps.itag.state.move != -1 && this.moveDo) {
                this.move(this.data.posL, b);
                ew.apps.itag.state.move = b;

            }
            let v = this.graph(ew.face[0].data.array, b, 1, this.data.key);
            if (!v) { return; }
            g.flip();
            // call info
            if (ew.tid.barDo) clearTimeout(ew.tid.barDo);
            ew.tid.barDo = setTimeout(() => { ew.tid.barDo = 0;
                this.info(v[0], v[1].split(" ")[0], v[2], v[3]); }, 20);

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
        const height = bottom / (process.env.BOARD == "BANGLEJS2" ? 3.65 : 3.5) | 0;
        const value = this.data.key;
        const fields = this.data.array.length;
        const source = this.data.source;
        const margin = process.env.BOARD == "BANGLEJS2" ? 0 : 15;
        const bw = width / fields;
        if (!data[pos]) return;

        // get scale
        let scale = 0;
        for (let i in data)
            if (scale < source[data[i]][value] - 0) scale = source[data[i]][value];
        scale = (height - (bottom / 10)) / ((scale) ? scale : 1);


        const limitsP = (ew.apps.itag.state.focus == data[pos]) ? 1 : 0;
        const limitsLp = (ew.apps.itag.state.focus == data[this.data.posL]) ? 1 : 0;

        const moveP = (ew.apps.itag.state.move === pos && this.moveDo ? 1 : 0);
        const moveLp = ew.apps.itag.state.move === this.data.posL && this.moveDo ? 1 : 0;
        if (update) {

            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - height + 0, margin + 2 + (this.data.posL * bw), bottom - height + 5);
            // top dot - create current
            g.setCol(1, 14);

            if (fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);

            // bar - clear previus 
            g.setCol(1, limitsLp ? 13 : moveLp ? 15 : ew.apps.itag.state.def.set.scanAll?6: ew.apps.itag.state.def.set.showHidden?9:1);
            //g.setCol(1,  1);
            g.fillRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - (source[data[this.data.posL]][value] * scale), margin + 2 + (this.data.posL * bw), bottom);
            limits = (ew.apps.itag.state.focus == data[pos]) ? 1 : 0; //data[pos].live
            // bar - highlight current
            g.setCol(1, limitsP ? 13 : moveP ? 15 : 4);
            //g.setCol(1, 4);
            g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - (source[data[pos]][value] * scale), margin + 2 + (pos * bw), bottom);
            this.data.posL = pos;

        }

        // first draw
        else {
            // dot highlight current
            g.setCol(1, 14);
            if (1 < fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);

            // bar - draw bars
            for (let i in data) {
                if (fields < i) break;
                let limits = (ew.apps.itag.state.focus === data[i]) ? 1 : 0;
                let move = (ew.apps.itag.state.move === i) ? 1 : 0;
                g.setCol(1, limits ? 13 : move ? 15 : ew.apps.itag.state.def.set.scanAll?6:ew.apps.itag.state.def.set.showHidden?9:1);
                //g.setCol(1,  1);
                g.fillRect(margin + 2 + (i * bw) + bw - 2, bottom - (source[data[i]][value] * scale), margin + 2 + (i * bw), bottom);
            }
            // bar - highlight curent
            g.setCol(1, limitsP ? 13 : moveP ? 15 : 4);
            g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - (source[data[pos]][value] * scale), margin + 2 + (pos * bw), bottom);

        }
        return [source[data[pos]][value], data[pos], source[data[pos]].name, source[data[pos]].lastseen];

    },
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        if (ew.face.appCurr != "itag-dev-set") ew.apps.itag.state.move = -1;
        ew.apps.itag.state.def.set.pos = this.data.posL;
        this.tid = 0;
        if (ew.apps.itag.state.focus || (ew.apps.itag.state.def.set.persist && ew.face.appCurr === "itag-scan") || (ew.face.appCurr.startsWith("itag") && !ew.face.pageCurr)) return;
        else ew.apps.itag.stopScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
