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
    offms: (ew.def.off[ew.face.appCurr]) ? ew.def.off[ew.face.appCurr] : 60000,
    init: function(o) {
        ew.def.off[ew.face.appCurr] = this.offms;
        ew.UI.ele.ind(2, 2, 0, 2);

        this.data.key = "batt";
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 6);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.ble.focus == ew.apps.itag.state.def.store[this.data.posL].id) {
                    ew.apps.itag.state.ble.focus = 0;
                    ew.apps.itag.stopScan()
                }else {
                    ew.apps.itag.state.ble.focus = ew.apps.itag.state.def.store[this.data.posL].id;
                    ew.apps.itag.scan()
                
                }let v = this.graph(ew.apps.itag.state.def.store, this.data.posL, 1, this.data.key);
                this.info(v[0], v[1].split(" ")[0], v[2]);
                if (ew.def.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6,ew.apps.itag.state.def.store[this.data.posL].name.toUpperCase(), (!ew.apps.itag.state.ble.focus)?"UNFOCUS":"FOCUS", (!ew.apps.itag.state.ble.focus)?0:15, (!ew.apps.itag.state.ble.focus)?15:13);

            }
        };
        
        if (ew.apps.itag.state.ble.focus) 
            this.data.posL= ew.apps.itag.state.def.store.findIndex(item => item.id === ew.apps.itag.state.ble.focus);
        this.bar();
        //this.run=1

    },
    show: function(s) {
        if (!this.run) return;

        this.bar();
        this.tid = setTimeout(function(t) {
            t.tid = -1;
            t.show();
        }, 1000, this);
    },

    info: function(batt, id, name, last) {
        //"ram";
        g.setCol(0, (ew.apps.itag.state.ble.focus && id===ew.apps.itag.state.ble.focus.split(" ")[0])?13:1);
        g.fillRect({ x: 0, y: 55, x2: 235, y2: 180, r: 10 });

        // values
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 3);
        let l = g.stringWidth(batt) / 2;
        g.drawString(batt, 120 - l, 85);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("%", 140 + l - g.stringWidth("%") / 2, 117);

        // id
        g.setCol(1, 14);
        //g.setFont("LECO1976Regular22");
        g.drawString(id, 120 - g.stringWidth(id) / 2, 156); //

        // name
        ew.UI.btn.c2l("main", "_headerS", 6, name, "", 15, 0, 1.5);

    },
    catName: function(targetId) {
        const cat = ew.apps.itag.state.def.store.find(item => item.id === targetId);

        if (cat && cat.name !== "Unknown") {
            return cat.name;
        }
        return null;
    },

    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";

        if (ew.apps.itag.state.def.store.length === 0) {
            ew.UI.btn.c2l("main", "_main", 6, "WAIT", "", 15, 0, 2);

            print("bar exit");
            //return;
        }
        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });

        // graph the bar
        if (ew.apps.itag.state.def.store.length) {
            let v = this.graph(ew.apps.itag.state.def.store, this.data.posL, 0, this.data.key);
            this.info(v[0], v[1].split(" ")[0], v[2]);
        }

        // set the bar control
        ew.sys.TC.val = { cur: this.data.posL, dn: 0, up: ew.apps.itag.state.def.store.length - 1, tmp: 0, reverce: 0, loop: 1 };
        ew.UI.c.tcBar = (a, b) => {
            //"ram";
            let v = this.graph(ew.apps.itag.state.def.store, b, 1, this.data.key);
            if (!v) { return; }
            //g.flip();

            // call info
            ew.tid.barDo = 0;
            this.info(v[0], v[1].split(" ")[0], v[2]);

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
        const width = g.getWidth() - 30;
        const bottom = g.getHeight() - 15;
        const height = bottom / (process.env.BOARD == "BANGLEJS2" ? 3.3 : 3.3) | 0;
        const value = this.data.key;
        const fields = ew.apps.itag.state.def.store.length;
        const margin = 15;
        const bw = width / fields;
        if (!data[pos]) return;

        // get scale
        let scale = 0;
        for (let i in data)
            if (scale < data[i][value] - 0) scale = data[i][value];
        scale = (height - (bottom / 10)) / ((scale) ? scale : 1);

        const limitsP = (ew.apps.itag.state.ble.focus == data[pos].id)?1:0; //data[pos].live
        const limitsLp = (ew.apps.itag.state.ble.focus == data[this.data.posL].id)?1:0; //data[pos].live
        if (update) {

            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - height + 0, margin + 2 + (this.data.posL * bw), bottom - height + 5);
            // top dot - create current
            g.setCol(1, 14);

            if (fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);
           

            // style 1
            if (this.data.style) {
                // bar - clear previus 
                g.setCol(1, limitsLp ? 13 : 1);
                g.fillRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - (data[this.data.posL][value] * scale), margin + 2 + (this.data.posL * bw), bottom);
                limits = (ew.apps.itag.state.ble.focus == data[pos].id)?1:0; //data[pos].live
                // bar - highlight current
                g.setCol(1, limitsP ? 13 : 4);
                g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - (data[pos][value] * scale), margin + 2 + (pos * bw), bottom);
            }
            // style 0
            else {
                //limits color coding
                g.setCol(1, limitsLp ? 13 : 4);
                // bar - clear previus
                g.drawRect(margin + 2 + (this.data.posL * bw) + bw - 2, bottom - (data[this.data.posL][value] * scale), margin + 2 + (this.data.posL * bw), bottom);
                // bar - highlight current 
                 g.setCol(1, limitsP ? 13 : 4);
                g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - (data[pos][value] * scale), margin + 2 + (pos * bw), bottom);
            }

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
                let limits = (ew.apps.itag.state.ble.focus === data[i].id)?1:0;  
                g.setCol(1, limits ? 13 : 1);
                g.fillRect(margin + 2 + (i * bw) + bw - 2, bottom - (data[i][value] * scale), margin + 2 + (i * bw), bottom);
            }
            // bar - highlight curent
            g.setCol(1, limitsP ? 13 : 4);
            g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - (data[pos][value] * scale), margin + 2 + (pos * bw), bottom);

        }
        //g.flip();
        return [data[pos].batt, data[pos].id, data[pos].name];

        //return data[pos][value];
    },
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
