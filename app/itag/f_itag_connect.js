//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.face[0] = {
    run: false,
    tid:0,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;
        
        // -- device --
        this.dev = ew.apps.itag.state.def.store[ew.apps.itag.state.ble.id];
        
        // -- name --
        ew.UI.btn.c2l("main", "_header", 6, this.dev.name, "", 15, 4, 1.5);

        ew.apps.itag.stopScan();
        if (this.tidC) clearTimeout(this.tidC);
        
        // ---- tag type: itag ----
        if (this.dev.board === undefined && !ew.apps.itag.state.connected && !ew.apps.itag.state.ble.gatt.connected) {
            this.tidC = setTimeout(() => { ew.apps.itag.conn(this.dev.id,"0"); }, 800);
            ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "CONNECTING", "", 0, 15);
        }
         // ---- tag type: ewtag ----
        else if (this.dev.board != undefined && (!ew.comm.mstr.connection || (ew.comm.mstr.connection && !ew.comm.mstr.connection.connected))) {
            this.tidC = setTimeout(() => {
                //  ---- connect(deviceId, phy, mtu, rssiHandler) ----
                ew.comm.mstr.connect(this.dev.id,(this.dev.phy===2?"coded":"1mbps"),this.dev.board===3?45:0, ew.apps.itag.state.def.set.rssiHandler).then(response => {
                    if (ew.face.appCurr === "itag-connect") {
                        ew.UI.btn.ntfy(1, 0.5, 0, "_bar", 6, "CONNECTED", "", 0, 15);
                    }
                }).catch(e=>{
                    ew.face.go("itag-scan", 0);
                    ew.UI.btn.ntfy(1, 0.5, 0, "_bar", 6, "TOO FAR", "", 15, 13);
                });
            }, 800);
            ew.UI.btn.ntfy(1, 10, 0, "_bar", 6, "CONNECTING", "", 0, 15);
        }
        else this.bar();

        this.info(this.dev.batt, this.dev.id.split(" ")[0]);
        this.run=true;
    },
    show: function() {
        if (!this.run) return;

        if (ew.comm.mstr.rssi){
            ew.UI.btn.i2l("main", "_main", 6, ew.comm.mstr.rssi+" ", "dBm", 15, 1, 3);
            g.flip();
        }
        if (this.tid) { clearTimeout(this.tid);}
        this.tid = setTimeout(()=> {
            this.tid=0;
            this.show();
        }, 250);
    },
    info: function(batt, id) {
        if (!ew.apps.itag.state.connected) {
            ew.UI.btn.i2l("main", "_main", 6, "WAIT", "fill", 15, 1, 2);
            g.flip();
        }
        else {
            ew.UI.ele.fill("_main", 6, 1);
            g.flip();
        }

    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";
        if ((ew.UI.ntid)) {
            clearTimeout(ew.UI.ntid);
            ew.UI.ntid = 0;
        }
        ew.is.bar = 1;
        ew.UI.ele.fill("_bar", 6, 0);

        // reset UI control, bar only
        ew.UI.c.start(0, 1);

        if (!ew.apps.itag.state.connected && (!ew.comm.mstr.connection || ew.comm.mstr.connection && !ew.comm.mstr.connection.connected)) {
            ew.UI.btn.img("bar", "_bar", 6, "power", "", 15, 13);

        }
        else {
            ew.UI.btn.img("bar", "_bar", 4, "alarm", "ALERT", 15, ew.apps.itag.state.alert ? 4 : 1);
            ew.UI.btn.img("bar", "_bar", 5, "power", "DISC", 15, 13);
        }
        ew.UI.c.end();

        // bar handler
        ew.UI.c.bar._bar = (i, l) => {
            if (ew.face[0].dbg) console.log("button: ", i);
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (i == 4) {

                if (this.dev.board != undefined) {

                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.6, 0, "_bar", 6, "SENT", "", 0, 15);

                    ew.comm.mstr.eW((l ? "apps.ewtag.sound.siren" : "apps.ewtag.sound.bell"), null, "s").then(response => {
                        ew.UI.btn.ntfy(1, 0.5, 0, "_bar", 6, response.s.toUpperCase(), "", 0, 15);
                    });

                }
                else {
                    ew.apps.itag.state.alert = 1 - ew.apps.itag.state.alert;
                    ew.UI.btn.img("bar", "_bar", 4, "alarm", "ALERT", 15, ew.apps.itag.state.alert ? 4 : 1);
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.6, 0, "_bar", 6, "ALERT", ew.apps.itag.state.alert ? "ON" : "OFF", 0, 15);
                    ew.apps.itag.state.ble.alert.writeValue(ew.apps.itag.state.alert ? 1 : 0);
                }
            }
            if (i == 5 || i == 6) {
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "DISCONNECTING", "", 0, 15);
                if (this.dev.board != undefined) {
                    if (l) {
                        ew.comm.mstr.disconnect().then(r => {
                            ew.face.go("itag-scan", 0);
                            ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, r.m.toUpperCase(), "", 0, 15);
                        });
                        return;
                    }
                    ew.comm.mstr.eW("sys.updt", "15000", "u").then(r => {
                        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, r.r.toUpperCase(), "", 0, 15);
                        return ew.comm.mstr.disconnect();
                    }).then(r => {
                        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, r.m.toUpperCase(), "", 0, 15);
                        setTimeout(()=>{ew.face.go("itag-scan", 0);},1000);
                    });

                }
                else
                    ew.apps.itag.state.ble.gatt.disconnect();

            }
        };
    },
    
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        if (ew.apps.itag.tid.con) {
            clearTimeout(ew.apps.itag.tid.con);
            ew.apps.itag.tid.con = 0;
        }

        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
