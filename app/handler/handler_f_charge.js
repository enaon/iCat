//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 30000,
    init: function(o) {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;
	    this.charge=o.state;
	    ew.sys.buzz.nav(this.charge?200:[100, 80, 100]);

        ew.UI.btn.c2l("main", "_header", 6, "" , "", 3, this.charge?4:0, 3);
        ew.UI.btn.c2l("main", "_main", 12, ew.sys.batt(1)+"%" , "", 15,  this.charge?4:0, 3);
        this.bar();

    },
    show: function(o) {
         return true;
    },
   
    bar: function() {
        ew.UI.btn.c2l("main", "_bar", 6, ew.sys.batt(0)+"V" , "", 3,  this.charge?4:0,2);
        ew.UI.c.start(1, 1);
        ew.UI.c.end();
        
    },
    clear: function(o) {
        return true;
    },
    off: function(o) {
        g.off();
        return true;
    }
};
