//itag connect set

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-connect", 0);
});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-connect", 0);

});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,

    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;

        this.conn = ew.apps.itag.state.ble.ffe1;

        this.dev = ew.apps.itag.state.def.store[ew.apps.itag.state.ble.id];
        if (this.dev.board != undefined)
            this.ewtag();
        else
            this.itag();

    },
    show: function(o) { return; },

    ewtag: function() {

        this.phyMode = ["1mbps", "2mbps", "coded", "coded,1mbps", "1mbps,coded"];

        ew.comm.mstr.get("ew.bt", "full", "b").then(r => {
            if (r.s === 'ok') {
                this.phy = r.v.phyA;
                this.rfTX = r.v.rfTX;
                this.int = r.v.intA;
                this.uart = r.v.uart;

                ew.UI.ele.ind(0, 0, 0, 0);
                ew.UI.ele.fill("_main", 9, 0);

                ew.UI.c.start(1, 0);
                ew.UI.btn.c2l("main", "_2x3", 1, "GAIN", r.v.rfTX + "dB", 15, 4);
                ew.UI.btn.c2l("main", "_2x3", 2, "UART", r.v.uart ? "ON" : "OFF", 15, 4);
                ew.UI.btn.c2l("main", "_2x3", 3, "INT", r.v.intA, 15, 4);
                //ew.UI.btn.c2l("main", "_2x3", 5, "RBT", "", 15, 13);
                if (this.dev.board != 3) ew.UI.btn.c2l("main", "_2x3", 6, "PHY", r.v.phyA.substring(0, 3).toUpperCase(), 15, 4);
            }
            ew.comm.mstr.get("ew.frce", null, "f").then(r => {
                if (r.s === 'ok') {
                    print("frce", r.v, r)
                    this.frce = r.v;
                    ew.UI.btn.c2l("main", "_2x3", 4, "FORCE", r.v ? "ON" : "OFF", 15, r.v ? 13 : 1);
                }
                ew.UI.c.end();
            });

        });

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                const options = (this.dev.board === 3 ? ["-4", "0", "+4"] : ["-8", "-4", "0", "+4", "+8"])
                const currentIndex = options.indexOf(this.rfTX);
                const nextIndex = (currentIndex + 1) % options.length;
                const newValue = options[nextIndex];

                ew.comm.mstr.set("ew.bt.rfTX", newValue, "b").then(r => {
                    if (r.s == "ok") {
                        this.rfTX = r.v;
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "GAIN", r.v + " DECIBEL", 0, 15);
                        ew.UI.btn.c2l("main", "_2x3", 1, "GAIN", r.v + "dB", 15, 4);
                    }
                    else {
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", "", 15, 13);
                    }
                });
            }

            else if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                this.uart = 1 - this.uart;
                ew.comm.mstr.set("ew.bt.uart", this.uart, "b").then(r => {
                    if (r.s == "ok") {
                        this.uart = r.v;
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "NORDIC UART", r.v ? "ENABLED" : "DISABLED", 0, 15);
                        ew.UI.btn.c2l("main", "_2x3", 2, "UART", r.v ? "ON" : "OFF", 15, 4);
                    }
                    else
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", "", 0, 15);

                });
            }
            else if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "INTERVAL", "-MS-", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: this.int, dn: 300, up: 60000, tmp: 0 };
                ew.UI.c.tcBar = (a, b, r) => {
                    let val = this.int
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b
                    ew.sys.TC.val.cur = val;
                    //
                    ew.UI.btn.c2l("main", "_2x3", 3, "INT", val, 15, 4);
                    this.int = val;
                };
            }
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                this.frce = 1 - this.frce
                ew.comm.mstr.set("ew.frce", this.frce, "f").then(r => {
                    if (r.s === 'ok') {
                        this.frce = r.v;
                        ew.UI.btn.c2l("main", "_2x3", 4, "FORCE", r.v ? "ON" : "OFF", 15, r.v ? 13 : 1);
                        if (this.frce) {
                            ew.comm.mstr.set("ew.name", this.dev.name, "n").then(r => {
                                if (r.s == "ok" && ew.def.face.info)
                                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "NAME SET", "", 0, 15);
                                else if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", "", 0, 15);
                            });
                        }
                    }
                });
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.comm.mstr.G("E.reboot", null, "u").then(r => {
                    if (r.s == "ok" && ew.def.face.info)
                        ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "REBOOT", "", 0, 15);
                    else if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", "", 0, 15);
                });
            }
            else if (i == 6) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (this.phy === "1mbps") this.phy = "coded";
                else this.phy = "1mbps";

                print("phy", this.phy);
                ew.comm.mstr.set("ew.bt.phyA", this.phy, "b").then(r => {
                    print(r);
                    if (r.s == "ok") {
                        this.phy = r.v;
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PHY MODE", r.v.toUpperCase(), 0, 15);
                        ew.UI.btn.c2l("main", "_2x3", 6, "PHY", r.v.substring(0, 3).toUpperCase(), 15, 4);
                    }
                    else
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", r.s.toUpperCase(), 0, 15);

                });
                return;
            }
        };
    },

    itag: function() {

        ew.UI.ele.ind(0, 0, 0, 0);
        ew.UI.ele.fill("_main", 9, 0);
        
        ew.UI.c.start(1, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "SLNT", this.dev.silent?"ON":"OFF", 15, this.dev.silent?4:1);
        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {

            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                this.dev.silent = 1 - this.dev.silent;
                ew.UI.btn.c2l("main", "_2x3", 1, "SLNT", this.dev.silent?"ON":"OFF", 15, this.dev.silent?4:1);
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SILENT ", this.dev.silent ? "ENABLED" : "DISABLED", 0, 15);
                ew.apps.itag.state.ble.silence.writeValue( (this.dev.silent ? 0 : 1) );
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
        if (this.dev.board != undefined) ew.comm.mstr.set("ew.bt.intA", this.int, "i");
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
