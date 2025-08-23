//itag connected viewer

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
        ew.def.off[ew.face.appCurr]=this.offms;
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.btn.c2l("main", "_main", 6, "WAIT", "", 15, 0, 0.9);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            
            };

        this.bar();
        this.info(50,ew.apps.itag.state.ble.id)
    },
    show: function(s) {
        if (!this.run) return;
        
        this.bar();
        this.tid=setTimeout(function(t){
			t.tid=-1;
			t.show();
		},1000,this);
    },

    info: function(batt, id, name) {
        //"ram";
        g.setCol(0, 15);
        g.fillRect({ x: 0, y: 70, x2: 235, y2: 180, r: 10 });

        // values
        g.setCol(1, 4);
        g.setFont("LECO1976Regular22", 3);
        let l = g.stringWidth(batt) / 2;
        g.drawString(batt, 100 - l, 95);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("%", 100 + 10 + l - g.stringWidth("%") / 2, 125);

        // id
        g.setCol(1, 0);
        //g.setFont("LECO1976Regular22");
        g.drawString(id, 120 - g.stringWidth(id) / 2, 156); //
        g.flip();

    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";

        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });


        // reset UI control, bar only
        ew.UI.c.start(0, 1);
        ew.UI.btn.c2l("bar", "_bar", 4, "ALERT", "", 15, ew.apps.itag.state.alert?13:4, 0.9);
        ew.UI.btn.c2l("bar", "_bar", 5, "DIS", "", 15, 13, 0.9);
        ew.UI.c.end();

        // bar handler
        ew.UI.c.bar._bar = (i) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (i==4){
                ew.apps.itag.state.alert=1-ew.apps.itag.state.alert;
                ew.UI.btn.c2l("bar", "_bar", 4, "ALERT", "", 15, ew.apps.itag.state.alert?13:4, 0.9);
                ew.notify.alert("info", { title:"ALERT", body: ew.apps.itag.state.alert?"ON":"OFF" }, 0, 0);
                ew.apps.itag.state.ble.alert.writeValue(ew.apps.itag.state.alert?1:0);
            }
            if (i==5){
                ew.apps.itag.state.ble.gatt.disconnect();
                ew.notify.alert("info", { title:"DISCONNECTING", body: "" }, 0, 0);
            }
            print("buttonn",i);
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
