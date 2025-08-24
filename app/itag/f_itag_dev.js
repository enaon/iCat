//itag scan viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-scan", 0);
    
});

ew.face[0] = {
    data: { source: 0, name: 0, key: 0, key_1: 0, key_2: 0, key_3: 0, lowLimit: 0, hiLimit: 0, fields: 0, totLowField: 0, ref: 0, style: 1, lastPosition: 0 },
    gatt: {},
    run: false,
    offms: (ew.def.off[ew.face.appCurr]) ? ew.def.off[ew.face.appCurr] : 60000,
    init: function(o) {
        ew.def.off[ew.face.appCurr]=this.offms;
        ew.UI.ele.ind(2, 2, 0, 2);

        this.data.key = "batt";
        ew.UI.c.start(1, 1);
        ew.UI.c.end();
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
        g.setCol(0, 15);
        g.fillRect({ x: 0, y: 60, x2: 235, y2: 175, r: 10 });

        // values
        g.setCol(1, 4);
        g.setFont("LECO1976Regular22", 3);
        let l = g.stringWidth(batt) / 2;
        g.drawString(batt, 100 - l, 95);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("%", 125 + l - g.stringWidth("%") / 2, 127);

        // id
        g.setCol(1, 0);
        //g.setFont("LECO1976Regular22");
        g.drawString(id, 120 - g.stringWidth(id) / 2, 156); //
        // name
        ew.UI.btn.c2l("main", "_headerS", 6, name, "", 15, 0, 1.5);


    },
    catName: function(targetId) {
        // Βρες τη γάτα με το συγκεκριμένο ID
        const cat = ew.apps.itag.state.def.find(item => item.id === targetId);

        // Έλεγξε αν βρέθηκε γάτα και αν το όνομα δεν είναι "Unknown"
        if (cat && cat.name !== "Unknown") {
            return cat.name;
        }

        // Επιστροφή null αν δεν βρεθεί ή αν το όνομα είναι "Unknown"
        return null;
        /*
        // Παράδειγμα χρήσης:
        const catData = ew.apps.itag.state.def.store;
        const targetId = "ff:ff:11:bb:13:c1 public";
        const catName = getCatNameById(catData, targetId);
        */
    },

    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";

        if (ew.apps.itag.state.def.length === 0) {
            ew.UI.btn.c2l("main", "_main", 6, "WAIT", "", 15, 0, 2);

            print("bar exit");
            //return;
        }
        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });

        // graph the bar
        if (ew.apps.itag.state.def.length) {
            let v = this.graph(ew.apps.itag.state.def, this.data.lastPosition, 0, this.data.key);
            this.info(v[0], v[1].split(" ")[0], this.catName(v[1]));
        }

        // set the bar control
        ew.sys.TC.val = { cur: this.data.lastPosition, dn: 0, up: ew.apps.itag.state.def.length - 1, tmp: 0, reverce: 0, loop: this.data.loop };
        ew.UI.c.tcBar = (a, b) => {
            //"ram";
            let v = this.graph(ew.apps.itag.state.def, b, 1, this.data.key);
            if (!v) { return; }
            //g.flip();

            // call info
                ew.tid.barDo = 0;
                this.info(v[0], v[1].split(" ")[0], this.catName(v[1]));

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
        const fields = ew.apps.itag.state.def.length;
        const margin = 15;
        const bw = width / fields;
        if (!data[pos]) return;

        // get scale
        let scale =0;
        for (let i in data)
           if (scale < 100 - Math.abs(data[i][value]) - 0) scale = 100 - Math.abs(data[i][value]);
        
        scale =(height - (bottom / 10)) / ((scale) ? scale : 1);

        let limits = 1;//data[pos].live

        if (update) {

            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 2 + (this.data.lastPosition * bw) + bw - 2, bottom - height + 0, margin + 2 + (this.data.lastPosition * bw), bottom - height + 5);
            // top dot - create current
            g.setCol(1, 14);

            if (fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);
            limits = 1;//data[this.data.lastPosition].live;

            // style 1
            if (this.data.style) {
                // bar - clear previus 
                g.setCol(1, limits ? 4 : 13);
                g.fillRect(margin + 2 + (this.data.lastPosition * bw) + bw - 2, bottom - ((100 - Math.abs(data[this.data.lastPosition][value])) * scale), margin + 2 + (this.data.lastPosition * bw), bottom);
                // bar - highlight current
                g.setCol(1, 14);
                g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - ((100 - Math.abs(data[pos][value])) * scale), margin + 2 + (pos * bw), bottom);
            }
            // style 0
            else {
                //limits color coding
                g.setCol(1, limits ? 4 : 13);
                // bar - clear previus
                g.drawRect(margin + 2 + (this.data.lastPosition * bw) + bw - 2, bottom - ((100 - Math.abs(data[this.data.lastPosition][value])) * scale), margin + 2 + (this.data.lastPosition * bw), bottom);
                // bar - highlight current 
                g.setCol(1, 14);
                g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - ((100 - Math.abs(data[pos][value])) * scale), margin + 2 + (pos * bw), bottom);
            }

            this.data.lastPosition = pos;

        }

        // first draw
        else {
            // dot highlight current
            g.setCol(1, 14);
            if (1 < fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);

            // bar - draw bars
            for (let i in data) {
                if (fields < i) break;
                limits = 1;//data[i].live;
                g.setCol(1, limits ? 4 : 13);
                g.fillRect(margin + 2 + (i * bw) + bw - 2, bottom - ((100 - Math.abs(data[i][value])) * scale), margin + 2 + (i * bw), bottom);
            }
            // bar - highlight curent
            g.setCol(1, 14);
            g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - ((100 - Math.abs(data[pos][value])) * scale), margin + 2 + (pos * bw), bottom);

        }
        //g.flip();
        return [data[pos].batt, data[pos].id, data[pos].name];

        //return data[pos][value];
    },
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        ew.apps.itag.stopScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
