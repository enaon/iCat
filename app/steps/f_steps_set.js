// steps set

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        ew.def.face.off[ew.face.appCurr] = this.offms;

        /*this.data = Object.assign({
            hrm: 0,
            stepGoal: 10000,
            stepGoalNotification: false
        }, require("Storage").readJSON("health.json", true) || {});
        this.dataString=["OFF","3","10","ALL"]
        */
        this.page = 1;
        this.page1();
        this.bar();
    },
    show: function(o) {},
    page1: function(batt, id) {
        this.page = 1;
        // header
        ew.UI.ele.ind(0, 0, 0, 0);
        ew.UI.ele.fill("_main", 12, 0);

        ew.UI.c.start(1, 1);
        ew.UI.btn.c2l("main", "_2x3", 1, "TOP", ew.apps.steps.state.def.topL, 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 2, "BTM", ew.apps.steps.state.def.btmL, 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 3, "STRD", ew.apps.steps.state.def.strd, 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 4, "DIST", ew.apps.steps.state.def.dist ? "ON" : "OFF", 15, ew.apps.steps.state.def.dist ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 5, "ACT", ew.apps.steps.state.def.act?"ON" : "OFF" , 15, ew.apps.steps.state.def.act?4 :1);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "< TOP LIMMIT >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.steps.state.def.topL, dn: 6000, up: 15000, tmp: 0, fire: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    ew.apps.steps.state.def.topL = val;
                    ew.UI.btn.c2l("main", "_2x3", 1, "TOP", ew.apps.steps.state.def.topL, 15, 6);
                };
            }
            else if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "< BTM LIMMIT >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.steps.state.def.btmL, dn: 500, up:2000, tmp: 0, fire: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    ew.apps.steps.state.def.btmL = val;
                    ew.UI.btn.c2l("main", "_2x3", 2, "BTM", ew.apps.steps.state.def.btmL, 15, 6);
                };
            }
            else if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "STRIDE LENGTH", "< IN METERS >", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.steps.state.def.strd*100, dn: 50, up:200, tmp: 0, fire: 1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    ew.apps.steps.state.def.strd = val/100;
                    ew.UI.btn.c2l("main", "_2x3", 3, "STRD", ew.apps.steps.state.def.strd, 15, 6);
                };
            }            
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.steps.state.def.dist = 1 - ew.apps.steps.state.def.dist;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SHOW", ew.apps.steps.state.def.dist ? "DISTANCE" : "STEPS", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 4, "DIST", ew.apps.steps.state.def.dist ? "ON" : "OFF", 15, ew.apps.steps.state.def.dist ? 4 : 1);
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.steps.state.def.act===undefined )ew.apps.steps.state.def.act=0;
                ew.apps.steps.state.def.act = 1 - ew.apps.steps.state.def.act;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ACTIVE ONLY", ew.apps.steps.state.def.act ? "TRUE" : "FALSE", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 5, "ACT", ew.apps.steps.state.def.act?"ON" : "OFF" , 15, ew.apps.steps.state.def.act?4 :1);
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
        let myprofile = require("Storage").readJSON("myprofile.json",1)
        if (myprofile) {
            myprofile.strideLength = ew.apps.steps.state.def.strd;
            require("Storage").writeJSON("myprofile.json", myprofile);
        }
        return true;
    },
    off: function(o) {
        g.off();
    }
};
