//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 600000,
    init: function() {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;
	    
        ew.is.bri = ew.def.face.bri;
        g.bri.set( (process.env.BOARD == "BANGLEJS2")?10:7);
        ew.UI.btn.c2l("main", "_header", 6, "" , "", 3, 15, 3);
        ew.UI.btn.img("main", "_main", 12, "torch" , "", 3, 15, 1);
        this.bar();

    },
    show: function(o) {
    },
   
    bar: function() {
        ew.UI.btn.c2l("main", "_bar", 6, "" , "", 3, 15);
        ew.UI.c.start(1, 1);
        ew.UI.c.end();
        
    },
    clear: function(o) {
        g.bri.set(ew.is.bri);
        return true;
    },
    off: function(o) {
        g.bri.set(ew.is.bri);
        g.off();
        return true;
    }
};
