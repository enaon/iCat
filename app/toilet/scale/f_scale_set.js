//scale settings

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(ew.UI.nav.next);

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        ew.def.face.off[ew.face.appCurr] = this.offms;

        this.page = 1;
        this.page1();

        this.bar();
    },
    show: function(o) {},
    page1: function(batt, id) {
        this.page = 1;
        // header
        ew.UI.ele.ind(0, 0, 0);
        ew.UI.c.start(1, 0);
        ew.UI.ele.fill("_main", 12, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "SCALE", ew.apps.kitty.state.def.is.scale ? "ON" : "OFF", 15, ew.apps.kitty.state.def.is.scale ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 2, "MAX", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
        ew.UI.btn.c2l("main", "_2x3", 3, "MIN", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
        ew.UI.btn.c2l("main", "_2x3", 4, "SENCE", ew.apps.scale.state.value.tolerance, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
        ew.UI.btn.c2l("main", "_2x3", 5, "MOVE", ew.apps.scale.state.value.sensitivity, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
        ew.UI.btn.c2l("main", "_2x3", 6, "", "", 1);
        ew.UI.c.end();
        //
        ew.UI.c.main._2x3 = (i, l) => {

            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);

                if (l)
                    ew.face.go("scale_calib", 0);
                else {
                    ew.apps.kitty.state.def.is.scale = 1 - ew.apps.kitty.state.def.is.scale;
                    ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "HOLD FOR", "SCALE SETUP", 0, 15);
                    ew.UI.btn.c2l("main", "_2x3", 1, "SCALE", ew.apps.kitty.state.def.is.scale ? "ON" : "OFF", 15, ew.apps.kitty.state.def.is.scale ? 4 : 1);
                    ew.UI.btn.c2l("main", "_2x3", 2, "MAX", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //3
                    ew.UI.btn.c2l("main", "_2x3", 3, "MIN", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //6
                    ew.UI.btn.c2l("main", "_2x3", 4, "SENCE", ew.apps.scale.state.value.tolerance, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
                    ew.UI.btn.c2l("main", "_2x3", 5, "MOVE", ew.apps.scale.state.value.sensitivity, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);

                    if (ew.apps.kitty.state.def.is.scale) {
                        ew.apps.scale.start();
                    }
                    else {
                        ew.apps.scale.stop();
                        ew.apps.kitty.state.def.auto.light = 0;
                        ew.apps.kitty.state.def.auto.clean = 0;
                        ew.apps.kitty.state.def.auto.pause = 0;
                    }
                }
            }
            else if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET MAX", "SAND WEIGHT (KG)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max / 100, dn: 14, up: 40, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.UI.btn.c2l("main", "_2x3", 2, "MAX", b / 10, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //6
                    ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max = b * 100;
                };
            }
            else if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET MIN", "SAND WEIGHT (KG)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min / 100, dn: 5, up: 15, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.UI.btn.c2l("main", "_2x3", 3, "MIN", b / 10, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //6
                    ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min = b * 100;
                };
            }
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "TRIGGER TOLLERANCE", "WEIGTH (GRAMS)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.scale.state.value.tolerance / 10, dn: 40, up: 150, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.apps.scale.state.value.tolerance = b * 10;
                    ew.UI.btn.c2l("main", "_2x3", 4, "SENCE", ew.apps.scale.state.value.tolerance, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
                };
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "MOVE SENSITIVIY", "WEIGTH (GRAMS)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.scale.state.value.sensitivity, dn: 5, up: 20, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.apps.scale.state.value.sensitivity = b;
                    ew.UI.btn.c2l("main", "_2x3", 5, "MOVE", b, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
                };
            }

        };
    },
    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);
        //ew.UI.btn.c2l("main", "_bar", 6,  ew.face.appCurr.toUpperCase(), "",15, 1, 1.3);
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", ew.face.appCurr.split("-")[0].toUpperCase(), 15, 0, 0.8, 1, 1);

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
