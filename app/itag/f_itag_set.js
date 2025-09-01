//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-scan", 0);
});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-scan", 0);

});

ew.face[0] = {
    run: false,
    offms: (ew.def.off[ew.face.appCurr]) ? ew.def.off[ew.face.appCurr] : 60000,
    init: function() {
        ew.def.off[ew.face.appCurr] = this.offms;
        // header
        ew.UI.btn.c2l("main", "_ind", 6, "SETTINGS", "", 15, 0, 0.8);

        this.phyMode = ["1MBIT", "CODED", "1MBIT + CODED", "2MBIT"]
        ew.UI.c.start(1, 0);
        ew.UI.ele.fill("_main", 9, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "PHY", ew.apps.itag.state.def.set.phy.toString(), 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 4, "MIN", ew.apps.itag.state.def.set.minInterval, 15, 1);
        ew.UI.btn.c2l("main", "_2x3", 5, "MAX", ew.apps.itag.state.def.set.maxInterval, 15, 1);
        ew.UI.btn.c2l("main", "_2x3", 6, "LAT", ew.apps.itag.state.def.set.slaveLatency, 15, 1);

        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.itag.state.def.set.phy++;
                if (2 < ew.apps.itag.state.def.set.phy) ew.apps.itag.state.def.set.phy = 0;
                if (ew.def.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PHY MODE", ew.face[0].phyMode[ew.apps.itag.state.def.set.phy], 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "PHY", ew.apps.itag.state.def.set.phy.toString(), 15, 6);
            }
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "MAX INTERVAL", "(MILLISECONDS)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.itag.state.def.set.minInterval, dn: 15, up: ew.apps.itag.state.def.set.maxInterval, tmp: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val=ew.apps.itag.state.def.set.minInterval
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b
                    ew.sys.TC.val.cur = val;
                    //
                    ew.UI.btn.c2l("main", "_2x3", 4, "MIN", val, 15, 1);
                    ew.apps.itag.state.def.set.minInterval = val;
                };
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "MAX INTERVAL", "(MILLISECONDS)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.itag.state.def.set.maxInterval, dn: ew.apps.itag.state.def.set.minInterval, up: 500, tmp: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val=ew.apps.itag.state.def.set.maxInterval
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b
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
                    let val=ew.apps.itag.state.def.set.slaveLatency
                    ew.UI.btn.ntfy(0, 2, 1);
                    val = b
                    ew.sys.TC.val.cur = val;
                    ew.UI.btn.c2l("main", "_2x3", 6, "LAT", val, 15, 1);
                    ew.apps.itag.state.def.set.slaveLatency = val;
                };
            }

        }


        //this.bar();
        //this.info( )
    },
    show: function(o) {},
    getVal: function(val) {
        const device = ew.apps.itag.state.def.store.find(item => item.id === ew.apps.itag.state.ble.id);
        return device ? device[val] : null;
    },
    info: function(batt, id) {
        g.setCol(0, 1);
        g.fillRect({ x: 0, y: 55, x2: 235, y2: 180, r: 10 });
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 3);

        if (!ew.apps.itag.state.connected) {
            ew.UI.btn.c2l("main", "_main", 6, "WAIT", "", 15, 1, 2)
            return;
        }


        // values
        let l = g.stringWidth(batt) / 2;
        g.drawString(batt, 120 - l, 85);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("%", 140 + l - g.stringWidth("%") / 2, 115);

        // id
        g.setCol(1, 14);
        //g.setFont("LECO1976Regular22");
        g.drawString(id, 120 - g.stringWidth(id) / 2, 156); //

        g.flip();


    },
    bar: function() {
        ew.UI.bar();
        ew.is.bar = 0;
    },


    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
