//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-dev", 0);
});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("itag-dev", 0);

});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function(c) {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;

        if (ew.apps.itag.state.def.set.scanAll) {
            ew.face.go("itag-dev", 0);
            ew.UI.btn.ntfy(0, 1, 0, "_bar", 6, "SCAN ALL IS", "ENABLED", 15, 13);
            return;
        }
        ew.UI.ele.ind(0, 0, 0, 0);
        this.array = ew.apps.itag.state.def.set.showHidden ? ew.apps.itag.state.def.hiddenOrder : ew.apps.itag.state.def.storeOrder;
        
        this.bar();
        this.page1();
    },
    show: function(o) {return;},
            
    page1: function() {

       
        // header
        //ew.UI.ele.fill("_header", 6, 0);


        ew.UI.c.start(1, 0);
        ew.UI.ele.fill("_main", 9, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "ADD", ew.apps.itag.state.def.set.storeLock ? "OFF" : "ON", 15, ew.apps.itag.state.def.set.storeLock ? 1 : 4);
        ew.UI.btn.c2l("main", "_2x3", 2, "HIDDEN", ew.apps.itag.state.def.set.showHidden ? "ON" : "OFF", 15, ew.apps.itag.state.def.set.showHidden ? 4 : 1);
        ew.UI.btn.img("main", "_2x3", 3, "move", "MOVE", 15, 4);
        ew.UI.btn.c2l("main", "_2x3", 4, ew.apps.itag.state.def.set.showHidden ? "UNHIDE" : "HIDE", "", 15, ew.apps.itag.state.def.set.showHidden ? 4 : 9, 0.8);
        ew.UI.btn.img("main", "_2x3", 6, "trash", "DEL", 15, 13);
        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i, l) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.itag.state.def.set.storeLock = 1 - ew.apps.itag.state.def.set.storeLock;
                ew.UI.btn.c2l("main", "_2x3", 1, "ADD", ew.apps.itag.state.def.set.storeLock ? "OFF" : "ON", 15, ew.apps.itag.state.def.set.storeLock ? 1 : 4);
                if (ew.def.face.info) ew.UI.btn.ntfy(0, 1, 0, "_bar", 6, "ADDING DEVICES", ew.apps.itag.state.def.set.storeLock ? "DISABLED" : "ENABLED", 0, 15);
                return;
            }
            if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);

                ew.apps.itag.state.def.set.showHidden = 1 - ew.apps.itag.state.def.set.showHidden;
                if (!ew.apps.itag.state.def.hiddenOrder.length && ew.apps.itag.state.def.set.showHidden) {
                    ew.apps.itag.state.def.set.showHidden = 0;
                    ew.UI.btn.ntfy(0, 1, 0, "_bar", 6, "HIDDEN LIST", "IS EMPTY", 15, 13);
                    return;
                }
                ew.face.go("itag-dev", 0);
                if (ew.def.face.info) ew.UI.btn.ntfy(0, 1, 0, "_bar", 6, "HIDDEN LIST", ew.apps.itag.state.def.set.showHidden ? "ENABLED" : "DISABLED", 0, 15);
                return;
            }
            if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.itag.state.move = ew.apps.itag.state.def.set.pos;
                ew.face.go("itag-dev", 0, "move");
                if (ew.def.face.info) ew.UI.btn.ntfy(0, 0.5, 0, "_bar", 6, "MOVE", "ENABLED", 0, 15);
                return;
            }
            if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.is.bar = 1;
                ew.is.slide = 0;
                ew.UI.btn.ntfy(0, 1.5, 1, "_bar", 6, "", "", 15, 0);
                ew.UI.c.start(0, 1);
                ew.UI.btn.c2l("bar", "_bar", 6, ew.apps.itag.state.def.set.showHidden ? "PRESS TO UNHIDE" : "PRESS TO HIDE", "", 15, ew.apps.itag.state.def.set.showHidden ? 4 : 9, 1.4);
                ew.UI.c.end();
                ew.UI.c.bar._bar = (i) => {
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    if (i == 6) {
                        let array = ew.apps.itag.state.def.set.showHidden ? ew.apps.itag.state.def.hiddenOrder : ew.apps.itag.state.def.storeOrder;
                        let dev = ew.apps.itag.state.def.store[array[ew.apps.itag.state.def.set.pos]];
                        let name = dev.name;
                        let id = dev.id;
                        if (ew.apps.itag.state.def.set.showHidden) {
                            ew.apps.itag.state.def.hiddenOrder.splice(ew.apps.itag.state.def.set.pos, 1);
                            ew.apps.itag.state.def.storeOrder.push(dev.id);
                            if (!ew.apps.itag.state.def.hiddenOrder.length) ew.apps.itag.state.def.set.showHidden = 0;
                        }
                        else {
                            ew.apps.itag.state.def.storeOrder.splice(ew.apps.itag.state.def.set.pos, 1);
                            ew.apps.itag.state.def.hiddenOrder.push(dev.id);
                        }
                        ew.face.go("itag-dev", 0);
                        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, name.toUpperCase(), ew.apps.itag.state.def.set.showHidden ? "UNHIDDEN" : "HIDEN", 15, 9);
                    }
                };
                return;
            }
            if (i == 6) {
                if (l) {
                    ew.sys.buzz.nav(ew.sys.buzz.type.alert);
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    ew.is.bar = 1;
                    ew.is.slide = 0;
                    ew.UI.btn.ntfy(0, 1.5, 1, "_bar", 6, "", "", 15, 0);
                    ew.UI.c.start(0, 1);
                    ew.UI.btn.c2l("bar", "_bar", 6, "DELETE ALL ?", "", 15, 13, 1.5);
                    ew.UI.c.end();
                    ew.UI.c.bar._bar = (i) => {
                        ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                        if (i == 6) {
                            ew.apps.itag.state.def = 0;
                            ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "REBOOTING", "", 15, 13);
                            ew.sys.reboot();
                        }
                    };
                }
                else {

                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    ew.is.bar = 1;
                    ew.is.slide = 0;
                    ew.UI.btn.ntfy(0, 1.5, 1, "_bar", 6, "", "", 15, 0);
                    ew.UI.c.start(0, 1);
                    ew.UI.btn.img("bar", "_bar", 6, "trash", "DELETE?", 15, 13);
                    ew.UI.c.end();
                    ew.UI.c.bar._bar = (i) => {
                        ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                        if (i == 6) {
                            let array = ew.apps.itag.state.def.set.showHidden ? ew.apps.itag.state.def.hiddenOrder : ew.apps.itag.state.def.storeOrder;
                            let dev = ew.apps.itag.state.def.store[array[ew.apps.itag.state.def.set.pos]];
                            let name = dev.name;
                            delete ew.apps.itag.state.def.store[dev.id];
                            array.splice(ew.apps.itag.state.def.set.pos, 1);
                            //delete from scan dev list too
                            delete ew.apps.itag.state.dev[dev.id];
                            var index = ew.apps.itag.state.devA.indexOf(dev.id);
                            if (index !== -1)
                                ew.apps.itag.state.devA.splice(index, 1);
                            ew.face.go("itag-dev", 0);
                            ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, name.toUpperCase(), "DELETED", 15, 13);
                        }

                    };
                    return;
                }
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
        if (ew.apps.itag.state.focus || (ew.apps.itag.state.def.set.persist && ew.face.appCurr === "itag-scan") || (ew.face.appCurr.startsWith("itag") && !ew.face.pageCurr)) return;
        else ew.apps.itag.stopScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
