//itag scan viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-dev", 0);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-dev", 0);
});

ew.face[0] = {
    data: { source: 0, name: 0, key: 0, key_1: 0, key_2: 0, key_3: 0, lowLimit: 0, hiLimit: 0, fields: 0, totLowField: 0, ref: 0, style: 0, posL: 0 },
    gatt: {},
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;
        if (ew.apps.itag.state.ble.gatt.connected|| (ew.comm.mstr.connection  && ew.comm.mstr.connection.connected)) {
            ew.face.go("itag-connect", 0);
            return;
        }
        ew.is.bar = 0;
        if (ew.face.appPrev === "itag-dev") this.started = 1
        ew.UI.ele.ind(2, 2, 0, 3);

        this.data.key = "rssi";
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 6);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            if (ew.face[0].dbg) console.log("button: ", i);
            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.scanAll) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SCAN ALL", "IS ACTIVE", 15, 13);
                    return;
                }
                ew.apps.itag.state.ble.id = ew.apps.itag.state.devA[this.data.posL];
                ew.face.go("itag-connect", 0, ew.apps.itag.state.ble.id);
            } else if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.4, 0, "_bar", 6,"HOLD TO", "CONNECT", 0, 15);

        };
        if (!ew.apps.itag.state.def.set.scanAll) {
            //this.data.array =  ew.apps.itag.state.def.storeOrder;
            this.data.source = ew.apps.itag.state.def.store;;
        }
        else {
            //this.data.array = ew.apps.itag.state.scanAllA;
            this.data.source = ew.apps.itag.state.scanAll;;
        }

        if (ew.apps.itag.state.focus)
            ew.apps.itag.state.lastId = ew.apps.itag.state.focus;

        if (!ew.apps.itag.state.ble.scan) {
            if (!ew.apps.itag.state.def.set.persist) {
                let timePassed = ((getTime() | 0) - ew.apps.itag.state.time);
                if (ew.apps.itag.state.def.set.keepFor * 60 <= timePassed) {
                    ew.apps.itag.state.dev = {};
                    ew.apps.itag.state.devA = [];
                }
            }
            ew.apps.itag.stopScan();
            ew.apps.itag.scan();
        }
        this.bar();

 
        //if (ew.apps.itag.state.lastId && (ew.apps.itag.state.dev[ew.apps.itag.state.lastId]))
        //        this.data.posL = ew.apps.itag.state.devA.indexOf(ew.apps.itag.state.lastId);
        //else this.data.posL = 0;

        //this.info(this.data.source[ew.apps.itag.state.devA[this.data.posL] ].rssi   , ew.apps.itag.state.devA[this.data.posL] , this.data.source[ew.apps.itag.state.devA[this.data.posL] ].name , this.data.source[ew.apps.itag.state.devA[this.data.posL] ].oflc);
        //this.bar();


        //this.run=1

    },
    show: function() {
        if (!this.run) return;

        this.bar();
        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(function(t) {
            t.tid = 0;
            t.show();
        }, 1000, this);
    },

    info: function(rssi, id, name, oflc) {

        name = this.data.source[id] ? this.data.source[id].name : name;
        let brd =(this.data.source[id] &&this.data.source[id].board )?this.data.source[id].board:0;
        let boCo=[0,0,0,6,1]
        ew.UI.btn.i2l("main", "_main", 6, oflc ? oflc : rssi + " ", oflc ? "OFFLINE" : (ew.apps.itag.state.def.set.scanAll) ? id.split(" ")[0].toUpperCase() : "dBm", oflc ? 13 : 4, 15, process.env.BOARD === "BANGLEJS2" ? 3 : 4);
        //name
        ew.UI.btn.c2l("main", "_headerS", 6, name, "", 15, boCo[brd], 1.5);

    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }

        if (ew.is.bar) return;
        
        // set the bar control
        ew.UI.c.tcBar = (a, b) => {
            let v = this.graph(ew.apps.itag.state.devA, b, 1, this.data.key);
            if (!v) { return; }
            this.info(v[0], v[1], v[2], v[3]);
        };
        ew.is.slide = 1;

        // reset UI control, bar only
        ew.UI.c.start(0, 1);
        ew.UI.c.end();

        if (!ew.apps.itag.state.devA.length) {
            ew.UI.ele.fill("_bar", 6, 0);
            ew.UI.btn.img("main", "_main", 6, "scan", "WAIT", 4, 15, 3);
            ew.UI.btn.c2l("main", "_headerS", 6, "SCANNING", "", 15, 0, 1.2);

            if (!this.started && ew.def.face.info) {
                ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ITAG", "SCANNER", 15, 1);
                setTimeout(() => { ew.face[0].started = 1; }, 1000);
            }
            return;
        }
        g.flip();
        this.update();
    },

    update: function(listReniew) {
        if (ew.is.bar) return;
      
        ew.UI.ele.fill("_bar", 6, 0);

        ew.sys.TC.val = { cur: this.data.posL, dn: 0, up: ew.apps.itag.state.devA.length - 1, tmp: 0, reverce: 0, loop: 1 };
        // graph the bar
        if (ew.apps.itag.state.devA.length) {
            if (ew.apps.itag.state.lastId && (ew.apps.itag.state.dev[ew.apps.itag.state.lastId]))
                this.data.posL = ew.apps.itag.state.devA.indexOf(ew.apps.itag.state.lastId);
            else this.data.posL = 0;

            let v = this.graph(ew.apps.itag.state.devA, this.data.posL, 0, this.data.key);
            this.info(v[0], v[1], v[2], v[3]);

        }
        else {
            ew.UI.btn.img("main", "_bar", 6, "scan", "WAIT", 14, 0, 3);
            //ew.UI.ele.fill("_bar", 6, 0);
            g.flip();
        }
    },
    graph: function(data, pos, update, focus) {

        // vars
        const width = g.getWidth() - (process.env.BOARD == "BANGLEJS2" ? 0 : 30);
        const bottom = g.getHeight() - (process.env.BOARD == "BANGLEJS2" ? 0 : 15);
        const height = bottom / (process.env.BOARD == "BANGLEJS2" ? 3.65 : 3.65) | 0;
        const value = this.data.key;
        const source = ew.apps.itag.state.dev;
        const fields = data.length;
        const margin = process.env.BOARD == "BANGLEJS2" ? 0 : 15;
        const bw = width / fields;
        if (!data[pos]) return;

        // get scale
        let scale = (process.env.BOARD == "BANGLEJS2" ? 0.9 : 1.1);
        //for (let i in data)
        //   if (scale < 100 - Math.abs(data[i][value]) - 0) scale = 100 - Math.abs(data[i][value]);
        //scale = 1 // (height - (bottom / 10)) / ((scale) ? scale : 1);
        let rssi = ew.apps.itag.state.def.set.rssi;
        let limits = source[data[pos]].live
        let abs_pos = (source[data[pos]][value] ^ (source[data[pos]][value] >> 31)) - (source[data[pos]][value] >> 31);
        let abs_posL = (source[data[this.data.posL]][value] ^ (source[data[this.data.posL]][value] >> 31)) - (source[data[this.data.posL]][value] >> 31);
        if (update) {

            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - height + 0, margin + 2 + (this.data.posL * bw), bottom - height + 5);
            // top dot - create current
            g.setCol(1, 14);

            if (fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);
            limits = source[data[this.data.posL]].live;

            // style 1
            if (!rssi) {
                // bar - clear previus 
                g.setCol(1, limits ? 4 : 13);
                g.fillRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - (limits ? 50 : 50 - source[data[this.data.posL]].oflc), margin + 2 + (this.data.posL * bw), bottom);
                // bar - highlight current
                g.setCol(1, 14);
                limits = source[data[pos]].live;
                g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - (limits ? 50 : 50 - source[data[pos]].oflc), margin + 2 + (pos * bw), bottom);
            }
            // style 0
            else {
                //limits color coding
                g.setCol(1, limits ? 4 : 13);
                // bar - clear previus
                g.drawRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - (limits ? ((100 - abs_posL) * scale) : 50 - source[data[this.data.posL]].oflc), margin + 2 + (this.data.posL * bw), bottom);
                // bar - highlight current 
                g.setCol(1, 14);
                limits = source[data[pos]].live;
                g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - (limits ? ((100 - abs_pos) * scale) : 50 - source[data[pos]].oflc), margin + 2 + (pos * bw), bottom);
            }
            this.data.posL = pos;
            ew.apps.itag.state.lastId = data[pos];
        }

        // first draw
        else {

            // dot highlight current
            g.setCol(1, 14);
            if (1 < fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);

            // bar - draw bars
            for (let i in data) {
                if (fields < i) break;
                limits = source[data[i]].live;
                g.setCol(1, limits ? 4 : 13);
                if (rssi) {
                    let abs_i = (source[data[i]][value] ^ (source[data[i]][value] >> 31)) - (source[data[i]][value] >> 31);
                    g.fillRect(margin + 2 + (i * bw) + bw - 2, bottom - (limits ? ((100 - abs_i) * scale) : 50 - source[data[i]].oflc), margin + 2 + (i * bw), bottom);
                }
                else
                    g.fillRect(margin + 2 + (i * bw) + bw - 2, bottom - (limits ? 50 : 50 - source[data[i]].oflc), margin + 2 + (i * bw), bottom);
            }
            // bar - highlight curent
            g.setCol(1, 14);
            limits = source[data[pos]].live;
            if (rssi)
                g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - (limits ? ((100 - abs_pos) * scale) : 50 - source[data[pos]].oflc), margin + 2 + (pos * bw), bottom);
            else
                g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - (limits ? 50 : 50 - source[data[pos]].oflc), margin + 2 + (pos * bw), bottom);
        }

        return [source[data[pos]].rssi, data[pos], source[data[pos]].name, source[data[pos]].oflc];
    },
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        if (ew.apps.itag.state.focus || (ew.apps.itag.state.def.set.persist && ew.face.appCurr === "itag-scan") /*|| (ew.face.appCurr.startsWith("itag") && !ew.face.pageCurr)*/ )
            return;

        else {
            if (ew.face.appCurr === "itag-scan") ew.UI.btn.img("main", "_main", 6, "pause", "Paused", 4, 15, 2);
            ew.apps.itag.state.time = (getTime() | 0);
            ew.apps.itag.stopScan();
        }
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
