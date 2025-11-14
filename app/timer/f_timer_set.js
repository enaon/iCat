//itag connected viewer

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
    ew.face.go("timer",0,ew.apps.timer.state.pos);
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        ew.def.face.off[ew.face.appCurr] = this.offms;

        this.timer=ew.apps.timer.state.pos;
        this.page=1;
        this.page1();

        this.bar();
    },
    show: function(o) {},
    page1: function(batt, id) {
        this.page=1;
        // header
        ew.UI.ele.ind(1, 2, 0, 0);

        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 9, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "BUZ", ew.apps.timer.state.def[this.timer].buzz?"ON":"OFF", 15, ew.apps.timer.state.def[this.timer].buzz?4:6);
        ew.UI.btn.c2l("main", "_2x3", 2, "BUZR", ew.apps.timer.state.def[this.timer].buzzRep , 15, 1);
        //ew.UI.btn.c2l("main", "_2x3", 3, "BUZD", ew.apps.timer.state.def[this.timer].buzzDelay , 15, 1);
        ew.UI.btn.c2l("main", "_2x3", 4, "REP", ew.apps.timer.state.def[this.timer].rep+"", 15, 1);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.timer.state.def[this.timer].buzz=1-ew.apps.timer.state.def[this.timer].buzz;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "BUZZER", ew.apps.timer.state.def[this.timer].buzz?"ENABLED":"DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "BUZ", ew.apps.timer.state.def[this.timer].buzz?"ON":"OFF", 15, ew.apps.timer.state.def[this.timer].buzz?4:6);
            }
            if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "< BUZZ REPEAT >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.timer.state.def[this.timer].buzzRep, dn: 1, up: 120, tmp: 0, fire: 1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val = ew.apps.timer.state.def[this.timer].buzzRep;
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    ew.apps.timer.state.def[this.timer].buzzRep = val;
                    ew.UI.btn.c2l("main", "_2x3", 2, "BUZR", ew.apps.timer.state.def[this.timer].buzzRep , 15, 1);
                };
            }
            if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.persist == undefined) ew.apps.itag.state.def.set.persist = 0;
                ew.apps.itag.state.def.set.persist = 1 - ew.apps.itag.state.def.set.persist;

                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PERSIST MODE", ew.apps.itag.state.def.set.persist ? "ENABLED" : "DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 3, "PER", ew.apps.itag.state.def.set.persist ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.persist ? 13 : 1);
            }
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "<  REPEAT  >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.timer.state.def[this.timer].rep, dn: 0, up: 10, tmp: 0, fire: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val = ew.apps.timer.state.def[this.timer].rep;
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    ew.apps.timer.state.def[this.timer].rep = val;
                    ew.UI.btn.c2l("main", "_2x3", 4, "REP", ew.apps.timer.state.def[this.timer].rep+"" , 15, 1);
                };
            }
          

        };
    },
    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.btn.c2l("main", "_bar", 6,  ew.face.appCurr.toUpperCase(), "",15, 0, 1.3);
        
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
