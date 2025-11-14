//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].page2();
});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    if (ew.face[0].page===1) ew.face.go("itag-scan",0);
    else ew.face[0].page1();

});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;

        if (ew.apps.itag.state.focus) {
            ew.face.go("itag-scan", 0);
            ew.UI.btn.ntfy(0, 1, 0, "_bar", 6, "FOCUS IS", "ENABLED", 15, 13);
            return;
        }

        this.page=1;
        this.page1();
        this.bar();
    },
    show: function(o) {},
    page1: function() {
        this.page=1;
        // header
        ew.UI.ele.ind(1, 2, 0, 0);

        this.phyMode = ["1MBPS", "CODED", "1MBPS + CODED", "2MBPS"];
        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 9, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "PHY", ew.apps.itag.state.def.set.phy.toString(), 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 2, "RSSI", ew.apps.itag.state.def.set.rssi ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.rssi ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 3, "PER", ew.apps.itag.state.def.set.persist ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.persist ? 13 : 1);
        ew.UI.btn.c2l("main", "_2x3", 4, "CLEAR", ew.apps.itag.state.def.set.keepFor, 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 5, "TMR", ew.apps.itag.state.def.set.checker ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.checker ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 6, "ALL", ew.apps.itag.state.def.set.scanAll ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.scanAll ? 13 : 1);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.phy === undefined) ew.apps.itag.state.def.set.phy = 0;
                ew.apps.itag.state.def.set.phy++;
                if (2 < ew.apps.itag.state.def.set.phy) ew.apps.itag.state.def.set.phy = 0;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PHY MODE", ew.face[0].phyMode[ew.apps.itag.state.def.set.phy], 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "PHY", ew.apps.itag.state.def.set.phy.toString(), 15, 6);
                ew.apps.itag.stopScan();
                ew.apps.itag.state.dev = {};
                ew.apps.itag.state.devA = [];
                //ew.apps.itag.scan();
            }
            if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.rssi == undefined) ew.apps.itag.state.def.set.rssi = 0;
                ew.apps.itag.state.def.set.rssi = 1 - ew.apps.itag.state.def.set.rssi;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "RSSI ON BAR", ew.apps.itag.state.def.set.rssi ? "ENABLED" : "DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 2, "RSSI", ew.apps.itag.state.def.set.rssi ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.rssi ? 4 : 1);
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
                if (ew.apps.itag.state.def.set.keepFor == undefined) ew.apps.itag.state.def.set.keepFor = 5;
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "CLEAR LIST", "(MINUTES)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.itag.state.def.set.keepFor, dn: 1, up: 120, tmp: 0, fire: 1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val = ew.apps.itag.state.def.set.keepFor;
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    ew.apps.itag.state.def.set.keepFor = val;
                    ew.UI.btn.c2l("main", "_2x3", 4, "CLEAR", ew.apps.itag.state.def.set.keepFor, 15, 6);

                };
            }
            if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.checker === undefined) ew.apps.itag.state.def.set.checker = 0;
                ew.apps.itag.state.def.set.checker = 1 - ew.apps.itag.state.def.set.checker;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "COUNTDOWN", ew.apps.itag.state.def.set.checker ? "REALTIME" : "WHEN UP", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 5, "TMR", ew.apps.itag.state.def.set.checker ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.checker ? 4 : 1);
            }
            if (i == 6) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.scanAll == undefined) ew.apps.itag.state.def.set.scanAll = 0;
                ew.apps.itag.state.def.set.scanAll = 1 - ew.apps.itag.state.def.set.scanAll;
                if (!ew.apps.itag.state.def.set.scanAll) {

                    ew.apps.itag.state.scanAll = {};
                    ew.apps.itag.state.scanAllA = [];
                }
                ew.apps.itag.state.dev = {};
                ew.apps.itag.state.devA = [];
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ITAG FILTERS", ew.apps.itag.state.def.set.scanAll ? "DISABLED" : "ENABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 6, "ALL", ew.apps.itag.state.def.set.scanAll ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.scanAll ? 13 : 1);
            }

        };
    },
    page2: function() {
        this.page=2;
        // header
        ew.UI.ele.ind(2, 2, 0, 0);

        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 9, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "AUTO", ew.apps.itag.state.def.set.auto ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.auto ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 3, "RSSI", ew.apps.itag.state.def.set.rssiHandler ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.rssiHandler ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 4, "MIN", ew.apps.itag.state.def.set.minInterval, 15, 1);
        ew.UI.btn.c2l("main", "_2x3", 5, "MAX", ew.apps.itag.state.def.set.maxInterval, 15, 1);
        ew.UI.btn.c2l("main", "_2x3", 6, "LAT", ew.apps.itag.state.def.set.slaveLatency, 15, 1);
        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.itag.state.def.set.auto = !ew.apps.itag.state.def.set.auto? 10:0;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "AUTO SCAN", ew.apps.itag.state.def.set.auto ? "ENABLED" : "DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "AUTO", ew.apps.itag.state.def.set.auto ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.auto ? 4 : 1);
                ew.apps.itag.auto(ew.apps.itag.state.def.set.auto);
            }
            if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.itag.state.def.set.rssiHandler == undefined) ew.apps.itag.state.def.set.rssiHandler = 0;
                ew.apps.itag.state.def.set.rssiHandler = 1 - ew.apps.itag.state.def.set.rssiHandler;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "RSSI ON CONNECTION", ew.apps.itag.state.def.set.rssiHandler ? "ENABLED" : "DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 3, "RSSI", ew.apps.itag.state.def.set.rssiHandler ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.rssiHandler ? 4 : 1);
            }
            if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "MAX INTERVAL", "-MS-", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.itag.state.def.set.minInterval, dn: 15, up: ew.apps.itag.state.def.set.maxInterval, tmp: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val = ew.apps.itag.state.def.set.minInterval;
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    //
                    ew.UI.btn.c2l("main", "_2x3", 4, "MIN", val, 15, 1);
                    ew.apps.itag.state.def.set.minInterval = val;
                };
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "MAX INTERVAL", "-MS-", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.itag.state.def.set.maxInterval, dn: ew.apps.itag.state.def.set.minInterval, up: 500, tmp: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val = ew.apps.itag.state.def.set.maxInterval;
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    //
                    ew.UI.btn.c2l("main", "_2x3", 5, "MAX", val, 15, 1);
                    ew.apps.itag.state.def.set.maxInterval = val;
                };
            }
            else if (i == 6) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SLAVE LATENCY", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.itag.state.def.set.slaveLatency, dn: 2, up: 8, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    let val = ew.apps.itag.state.def.set.slaveLatency;
                    ew.UI.btn.ntfy(0, 2, 1);
                    val = b;
                    ew.sys.TC.val.cur = val;
                    ew.UI.btn.c2l("main", "_2x3", 6, "LAT", val, 15, 1);
                    ew.apps.itag.state.def.set.slaveLatency = val;
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
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        if (ew.apps.itag.state.focus || (ew.apps.itag.state.def.set.persist && ew.face.appCurr === "itag-scan") || (ew.face.appCurr.startsWith("itag") && !ew.face.pageCurr)) return;
        else ew.apps.itag.stopScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
