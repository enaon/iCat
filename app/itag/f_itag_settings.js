//itag viewer

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
      
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.btn.c2l("main", "_main", 6, "WAIT", "", 15, 0, 0.9);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            
            };

        this.bar();

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

        if (ew.apps.itag.state.def.dev.length === 0) {

            //this.scan();
            return;
        }
        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });

        // graph the bar
        if (ew.apps.itag.state.def.dev.length > 1) {
            let v = this.graph(ew.apps.itag.state.def.dev, this.data.lastPosition, 0, this.data.key);
            this.info(v[0], v[1].split(" ")[0], v[2]);
        }
        else if (ew.apps.itag.state.def.dev.length === 1)
            this.info(ew.apps.itag.state.def.dev[0].rssi, ew.apps.itag.state.def.dev[0].id.split(" ")[0]);

        // set the bar control
        ew.sys.TC.val = { cur: this.data.lastPosition, dn: 0, up: ew.apps.itag.state.def.dev.length - 1, tmp: 0, reverce: 0, loop: this.data.loop };
        ew.UI.c.tcBar = (a, b) => {
            //"ram";
            let v = this.graph(ew.apps.itag.state.def.dev, b, 1, this.data.key);
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

    
    clear: function(o) {
        ew.temp.bar = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
