// notify set

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    
    init() {
        ew.def.face.off[ew.face.appCurr] = this.offms;

        this.page();
        this.bar();
    },
    show(o) {},
    page: function() {
        this.page = 1;
        // header
        ew.UI.ele.ind(0, 0, 0, 0);
        ew.UI.ele.fill("_main", 12, 0);

        ew.UI.c.start(1, 1);
        ew.UI.btn.c2l("main", "_2x3", 1, "ALRT", "", 15, ew.apps.notify.state.def.alrt?4:1);
        ew.UI.btn.c2l("main", "_2x3", 2, "SCRN", "", 15,ew.apps.notify.state.def.scrn? 4:1);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {

            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.notify.state.def.alrt =! ew.apps.notify.state.def.alrt;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ALERT", ew.apps.notify.state.def.alrt ? "ENABLED" : "DISABLED", 0, 15);
        ew.UI.btn.c2l("main", "_2x3", 1, "ALRT", "", 15, ew.apps.notify.state.def.alrt?4:1);
            }
            else if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.notify.state.def.scrn =! ew.apps.notify.state.def.scrn;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SCREEN-ON", ew.apps.notify.state.def.scrn ? "ENABLED" : "DISABLED", 0, 15);
        ew.UI.btn.c2l("main", "_2x3", 2, "SCRN", "", 15,ew.apps.notify.state.def.scrn? 4:1);
            }



        };
    },
    bar() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", ew.face.appCurr.split("-")[0].toUpperCase(), 15, 0, 0.8, 1, 1);

    },
    clear(o) {
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off(o) {
        g.off();
    }
};
