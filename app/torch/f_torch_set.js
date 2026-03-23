//torch set
ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("torch",0);
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        ew.def.face.off[ew.face.appCurr] = this.offms;
        this.page1();
        this.bar();
    },
    show: function(o) {},
    page1: function(batt, id) {
        this.page=1;
        // header
        ew.UI.ele.ind(0,0, 0, 0);

        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 12, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "TAP", ew.def.dev.ttap?"ON":"OFF", 15, ew.def.dev.ttap?4:6);
        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.def.dev.ttap==undefined) ew.def.dev.ttap=0;
                ew.def.dev.ttap = 1-ew.def.dev.ttap;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TAP MODE",ew.def.dev.ttap?"ENABLED":"DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "TAP", ew.def.dev.ttap?"ON":"OFF", 15, ew.def.dev.ttap?4:6);
            }
        };
    },
    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);
        //ew.UI.btn.c2l("main", "_bar", 6,  ew.face.appCurr.toUpperCase(), "",15, 0, 1.3);
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", ew.face.appCurr.split("-")[0].toUpperCase(), 15, 0,0.8,1,1);

    },
    clear: function(o) {
        ew.is.slide = 0; 
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
    }
};
