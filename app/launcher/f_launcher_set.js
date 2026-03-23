// launcher_set face - QUICK LINKS SETTINGS

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].page = ew.face[0].page == 1 ? 2 : 1;
    ew.face[0].init();
});

ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].page = ew.face[0].page == 1 ? 2 : 1;
    ew.face[0].init();
});

ew.face[0] = {
    run: false,
    page: 1,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 15000,

    init() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        if (!ew.apps.launcher.state.selP){
            ew.UI.nav.dn();
            ew.UI.btn.ntfy(1, 1, 0, "_bar", 6,"NO APP", "SELECTED", 15, 13);
            return;
        }

        // Πάρε το τρέχον επιλεγμένο app από το launcher
        this.selectedApp = null;
        this.curL = ew.apps.launcher.state[ew.apps.launcher.state.curL];
        this.selectedIdx = ew.apps.launcher.state.def.pos;
        if (this.selectedIdx < this.curL.length) {
            this.selectedApp = this.curL[this.selectedIdx];
        }

        if (this.page === 1) {
            this.page1();
        }
        else {
            this.page2();
        }
        this.bar();

        this.run = true;
    },

    show() {},

    page1() {
        ew.UI.ele.ind(1, 2, 0, 15);

        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 12, 0);

        print("page", this.selectedApp)
        // Δείξε το επιλεγμένο app
        if (this.selectedApp) {
            ew.UI.btn.c2l("main", "_header",6, this.selectedApp.name, "", 15, 0 , 1);
        }
        else {
            ew.UI.btn.c2l("main", "_header", 6, "NO APP", "", 15, 13 , 1);
        }

        // Τα 3 κουμπιά για quick links
        ew.UI.btn.c2l("main", "_2x3", 4, "LEFT", "", 15, 1, 0.6);
        ew.UI.btn.c2l("main", "_2x3", 5, "BTN", "", 15, 1, 0.6);
        ew.UI.btn.c2l("main", "_2x3", 6, "RIGHT", "", 15, 1, 0.);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i, l) => {
            if (!l) return; // Μόνο long press

            ew.sys.buzz.nav(ew.sys.buzz.type.ok);

            // Θέσε το quick link
            if (i >= 4 && i <= 6) {
                let position = i === 4 ? "left" : (i === 5 ? "btnL" : "rght");
                
                ew.def.face[position]=this.selectedApp.id;
                //ew.apps.launcher.link(position, this.selectedApp);
                ew.UI.btn.ntfy(1, 1, 0, "_bar", 6,
                    "QUICK LINK SET", position.toUpperCase(), 0, 15);

            }
        };
    },

    page2() {
        ew.UI.ele.ind(2, 2, 0, 15);

        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 12, 0);

        let links = ew.apps.launcher.state.def.link;

        // Δείξε τα τρέχοντα quick links
        ew.UI.btn.c2l("main", "_2x3", 1, "LEFT", links.l ? links.l.name : "EMPTY", 15, links.l ? 4 : 1, 0.7);
        ew.UI.btn.c2l("main", "_2x3", 2, "CENTER", links.c ? links.c.name : "EMPTY", 15, links.c ? 4 : 1, 0.7);
        ew.UI.btn.c2l("main", "_2x3", 3, "RIGHT", links.r ? links.r.name : "EMPTY", 15, links.r ? 4 : 1, 0.7);

        // Κουμπί για clear
        ew.UI.btn.c2l("main", "_2x3", 5, "CLEAR", "ALL", 15, 13, 1.5);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i, l) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);

            if (i == 5) {
                // Clear all quick links
                ew.apps.launcher.state.def.link = { left: null, center: null, right: null };
                ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "QUICK LINKS", "CLEARED", 15, 13);
                this.init();
            }
            else if (i >= 1 && i <= 3) {
                // Clear specific quick link
                let position = i === 1 ? "l" : (i === 2 ? "c" : "f");
                ew.apps.launcher.link(position, null);
                ew.UI.btn.ntfy(1, 1, 0, "_bar", 6,
                    position.toUpperCase(), "CLEARED", 15, 13);
                this.init();
            }
        };
    },

    bar() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);

        let pageText = this.page === 1 ? "SET" : "VIEW";
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", "", 15, 0,1.4,0,0);
        
        //ew.UI.btn.c2l("main", "_bar", 6, pageText, "", 15, 1, 1.3);
    },

    clear() {
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
    },

    off() {
        g.off();
    }
};
