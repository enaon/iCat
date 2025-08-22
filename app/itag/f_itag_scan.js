//itag scan viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("main", 0);
});

ew.face[0] = {
    data: { source: 0, name: 0, key: 0, key_1: 0, key_2: 0, key_3: 0, lowLimit: 0, hiLimit: 0, fields: 0, totLowField: 0, ref: 0, style: 0, lastPosition: 0 },
    gatt: {},
    run: false,
    offms: (ew.def.off[ew.face.appCurr]) ? ew.def.off[ew.face.appCurr] : 60000,
    init: function(o) {
        if (ew.apps.itag.state.ble.gatt.connected){
            ew.face.go("itag_connect",0);
            return;
            }
        this.data.key = "rssi";
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.btn.c2l("main", "_main", 6, "WAIT", "", 15, 0, 0.9);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (ew.apps.itag.state.ble.gatt.connected){
                if (ew.apps.itag.state.dev[this.data.lastPosition].id != ew.apps.itag.state.ble.gatt.device.id) 
                    ew.apps.itag.state.ble.next=ew.apps.itag.state.dev[this.data.lastPosition].id
                ew.apps.itag.state.ble.gatt.disconnect()
                ew.notify.alert("info", { body:"DISCONNECTING", title: ew.apps.itag.state.ble.gatt.device.id.split(" ")[0] }, 0, 0);
                
            }else 
                ew.apps.itag.conn(ew.apps.itag.state.dev[this.data.lastPosition].id);
            
                
            };
        /*if (!this.data.started && ew.def.info) {
            ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LAST 24HOURS", "ACTIVITY", 15, 1);
            this.data.started = 1;
        }
        else*/
        ew.apps.itag.scan();
        this.bar();
        //this.run=1

    },
    show: function(s) {
        if (!this.run) return;
        
        this.bar();
        this.tid=setTimeout(function(t){
			t.tid=-1;
			t.show();
		},1000,this);
    },

    info: function(rssi, id, name) {
        //"ram";
        g.setCol(0, 15);
        g.fillRect({ x: 0, y: 70, x2: 235, y2: 180, r: 10 });

        /*if ( ew.def.info ) {
			g.setFont("Teletext10x18Ascii");
            g.setCol(1, 1);
            g.drawString("GRAMS", 60 - g.stringWidth("GRAMS") / 2, 75);
            g.drawString("SEC", 180 - g.stringWidth("SEC") / 2, 75);
        }
        */

        // values
        g.setCol(1, 4);
        g.setFont("LECO1976Regular22", 3);
        let l = g.stringWidth(rssi) / 2;
        g.drawString(rssi, 100 - l, 95);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("rssi", 100 + 10 + l - g.stringWidth("g") / 2, 125);

        // id
        g.setCol(1, 0);
        //g.setFont("LECO1976Regular22");
        g.drawString(id, 120 - g.stringWidth(id) / 2, 156); //
        g.flip();

    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";

        if (ew.apps.itag.state.dev.length === 0) {
            print("bar exit");
            //this.scan();
            return;
        }
        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });

        // graph the bar
        if (ew.apps.itag.state.dev.length ) {
            let v = this.graph(ew.apps.itag.state.dev, this.data.lastPosition, 0, this.data.key);
            this.info(v[0], v[1].split(" ")[0], v[2]);
        }
       
        // set the bar control
        ew.sys.TC.val = { cur: this.data.lastPosition, dn: 0, up: ew.apps.itag.state.dev.length - 1, tmp: 0, reverce: 0, loop: this.data.loop };
        ew.UI.c.tcBar = (a, b) => {
            //"ram";
            let v = this.graph(ew.apps.itag.state.dev, b, 1, this.data.key);
            if (!v) { return; }
            g.flip();

            // call info
            if (ew.tid.barDo) clearTimeout(ew.tid.barDo);
            ew.tid.barDo = setTimeout((v) => {
                ew.tid.barDo = 0;
                this.info(v[0], v[1].split(" ")[0], v[2]);
            }, 25, v);
        };
        ew.temp.bar = 1;

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
        const fields = ew.apps.itag.state.dev.length;
        const margin = 15;
        const bw = width / fields;
        if (!data[pos] ) return;

        // get scale
        let scale = 0;
        //for (let i in data)
         //   if (scale < 100 - Math.abs(data[i][value]) - 0) scale = 100 - Math.abs(data[i][value]);
        scale = 1// (height - (bottom / 10)) / ((scale) ? scale : 1);

        let limits = data[pos].live

        if (update) {

            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 2 + (this.data.lastPosition * bw) + bw - 2, bottom - height + 0, margin + 2 + (this.data.lastPosition * bw), bottom - height + 5);
            // top dot - create current
            g.setCol(1, 14);

            if ( fields) g.fillRect(margin + 2 + (pos * bw) + bw - 2, bottom - height + 0, margin + 2 + (pos * bw), bottom - height + 5);
            limits = data[this.data.lastPosition].live;

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
                limits = data[i].live;
                g.setCol(1, limits ? 4 : 13);
                g.fillRect(margin + 2 + (i * bw) + bw - 2, bottom - ((100 - Math.abs(data[i][value])) * scale), margin + 2 + (i * bw), bottom);
            }
            // bar - highlight curent
            g.setCol(1, 14);
            g.drawRect(margin + 2 + (pos * bw) + bw - 2, bottom - ((100 - Math.abs(data[pos][value])) * scale), margin + 2 + (pos * bw), bottom);

        }
        g.flip();
        return [data[pos].rssi, data[pos].id, data[pos].name];

        //return data[pos][value];
    },
    clear: function(o) {
        ew.temp.bar = 0; /*TC.removeAllListeners();*/
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
