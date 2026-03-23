//kitty settings

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0][(ew.face[0].page === 1) ? "page2" : "page1"]();
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

    page1: function() {
        this.page = 1;
        // header
        ew.UI.ele.ind(1, 2, 0, 15);
        ew.UI.c.start(1, 0);
        ew.UI.ele.fill("_main", 12, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "AUTO",  (ew.apps.kitty.state.def.auto.clean) ?"ON":"OFF", 15, (ew.apps.kitty.state.def.auto.clean) ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 2, "SAND", ew.apps.kitty.state.def.is.sandType, 15, 6);
        //ew.UI.btn.c2l("main", "_2x3", 3, "UVC", ew.apps.kitty.state.def.auto.uvc ? "ON" : "OFF", 15, ew.apps.kitty.state.def.auto.uvc ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 3, "PREP", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep ? "ON" : "OFF", 15, ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 4, "DELAY", ew.apps.kitty.state.def.auto.delay, 15, (ew.apps.kitty.state.def.auto.clean) ? 6 : 1);
        ew.UI.btn.c2l("main", "_2x3", 5, "SPEED", (19 - (ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].speed * 10)), 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 6, "MORE", "", 15, 6);
        ew.UI.c.end();
        //
        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (!ew.apps.kitty.state.def.is.scale) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PLEASE ENABLE", "THE SCALE", 15, 13);
                }
                else {
                    ew.apps.kitty.state.def.auto.clean = 1 - ew.apps.kitty.state.def.auto.clean;
                    if (!ew.apps.kitty.state.def.auto.clean) ew.apps.scale.clean(0);
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "AUTO CLEAN", (ew.apps.kitty.state.def.auto.clean) ? "ENABLED" : "DISABLED", 0, 15);
                    ew.UI.btn.c2l("main", "_2x3", 1, "AUTO",  (ew.apps.kitty.state.def.auto.clean) ?"ON":"OFF", 15, (ew.apps.kitty.state.def.auto.clean) ? 4 : 1);
                    ew.UI.btn.c2l("main", "_2x3", 4, "DELAY", ew.apps.kitty.state.def.auto.delay, 15, (ew.apps.kitty.state.def.auto.clean) ? 6 : 1); //4
                }
            }
            else if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.kitty.state.def.is.sandType++;
                if (5 <= ew.apps.kitty.state.def.is.sandType) ew.apps.kitty.state.def.is.sandType = 1;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SAND TYPE", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].name.toUpperCase(), 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 2, "SAND", ew.apps.kitty.state.def.is.sandType, 15, 6);
                ew.UI.btn.c2l("main", "_2x3", 5, "SPEED", (19 - (ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].speed * 10)), 15, 6); //5
                ew.UI.btn.c2l("main", "_2x3", 3, "PREP", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep ? "ON" : "OFF", 15, ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep ? 4 : 1);
            }
            /*else if (i == 3) {
            	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            	ew.apps.kitty.state.def.auto.uvc = 1 - ew.apps.kitty.state.def.auto.uvc;
            	if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TRIGGER UVC", (ew.apps.kitty.state.def.auto.uvc) ? "ENABLED" : "DISABLED", 0, 15);
            	ew.UI.btn.c2l("main", "_2x3", 3, "UVC", ew.apps.kitty.state.def.auto.uvc ? "ON" : "OFF", 15, ew.apps.kitty.state.def.auto.uvc ? 4 : 1);
            }*/
            else if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep = 1 - ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PREPARE MOTION", (ew.apps.kitty.state.def.auto.uvc) ? "ENABLED" : "DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 3, "PREP", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep ? "ON" : "OFF", 15, ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].prep ? 4 : 1);
            }
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "AUTO CLEAN", "DELAY (MINUTES)", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: ew.apps.kitty.state.def.auto.delay, dn: 1, up: 20, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.UI.btn.c2l("main", "_2x3", 4, "DELAY", b, 15, (ew.apps.kitty.state.def.auto.clean) ? 6 : 1); //6
                    ew.apps.kitty.state.def.auto.delay = b;
                };
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET SPEED", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].name.toUpperCase(), 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: (19 - (ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].speed * 10)), dn: 1, up: 9, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.UI.btn.c2l("main", "_2x3", 5, "SPEED", b, 15, 6); //5
                    ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].speed = (19 - b) / 10;
                };
                return;
            }
            else if (i == 6) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                eval(require("Storage").read("ew_f_set_more"));
                if (ew.UI.ntid) {
                    clearTimeout(ew.UI.ntid);
                    ew.UI.ntid = 0;
                }
                ew.face[0].bar();
                return;
            }
        }
    },

    page2: function(batt, id) {

        this.page = 2;
        ew.UI.ele.ind(2, 2, 0, 15);
        ew.UI.c.start(1, 0);
        ew.UI.ele.fill("_main", 12, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "VIB", (ew.apps.kitty.state.def.is.vibrator && ew.apps.kitty.state.is.vibrator.connected) ? ew.apps.kitty.state.is.vibrator.battery : "", 15, ew.apps.kitty.state.def.is.vibrator ? ew.apps.kitty.vibrator.active ? 13 : ew.apps.kitty.state.is.vibrator.connected ? 4 : 6 : 1);
        //ew.UI.btn.c2l("main", "_2x3", 2, "VOLT", "MON", 15, ew.apps.kitty.state.def.is.voltMon ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 2, "CLB", E.toJS(-ew.apps.kitty.state.def.is.clb * 100), 15, 6);
        ew.UI.btn.c2l("main", "_2x3", 3, "POWER", ew.pin.CHRG.read() ? "OFF" : "ON", 15, ew.pin.CHRG.read() ? 1 : 4);
        ew.UI.btn.c2l("main", "_2x3", 4, "LIGHT", ew.apps.kitty.state.def.auto.light?"ON":"OFF", 15, ew.apps.kitty.state.def.auto.light ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 5, "PAUSE", (ew.apps.scale.state.def.type == "down" && ew.apps.kitty.state.def.auto.pause) ?"ON":"OFF", 15, (ew.apps.scale.state.def.type == "down" && ew.apps.kitty.state.def.auto.pause) ? 4 : 1);
        ew.UI.btn.c2l("main", "_2x3", 6, "SCRN", (ew.def.face.scrn) ?"ON":"OFF", 15, (ew.def.face.scrn) ? 4 : 1);

        //ew.UI.btn.c2l("main", "_2x3", 6, "POWER", ew.pin.CHRG.read() ? "OFF" : "ON", 15, ew.pin.CHRG.read() ? 1 : 4);
        ew.UI.c.end();
        //
        //ew.apps.kitty.vibrator.device.eval('ew.is.batt(1)').then(function(data) {
        //print("Got temperature "+data)});
        ew.UI.c.main._2x3 = (i, l) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (l) {
                    ew.apps.kitty.state.def.is.vibrator = 1 - ew.apps.kitty.state.def.is.vibrator;
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "VIBRATOR", (ew.apps.kitty.state.def.is.vibrator) ? "ENABLED" : "DISABLED", 0, 15);
                    ew.UI.btn.c2l("main", "_2x3", 1, "VIB", (ew.apps.kitty.state.def.is.vibrator && ew.apps.kitty.state.is.vibrator.connected) ? ew.apps.kitty.state.is.vibrator.battery : "", 15, ew.apps.kitty.state.def.is.vibrator ? 6 : 1);
                    if (!ew.apps.kitty.state.def.is.vibrator && ew.apps.kitty.state.is.vibrator.connected) ew.apps.kitty.vibrator.disconnect();
                    else if (ew.apps.kitty.state.def.is.vibrator && !ew.apps.kitty.state.is.vibrator.connected) ew.apps.kitty.vibrator.connect();
                }
                else {
                    if (!ew.apps.kitty.state.def.is.vibrator) {
                        ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "HOLD TO ENABLE", "VIBRATOR", 0, 15);
                    }
                    else {
                        if (ew.apps.kitty.state.is.vibrator) {
                            if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "VIBRATION", ew.apps.kitty.vibrator.active ? "STOP" : "START", 15, 6);
                            ew.UI.btn.c2l("main", "_2x3", 1, "VIB", (ew.apps.kitty.state.def.is.vibrator && ew.apps.kitty.state.is.vibrator.connected) ? ew.apps.kitty.state.is.vibrator.battery : "", 15, ew.apps.kitty.state.def.is.vibrator ? ew.apps.kitty.vibrator.active ? 4 : 13 : 1);
                            ew.apps.kitty.vibrator.write(ew.apps.kitty.vibrator.active ? "turnOff" : "turnOn");
                        }
                        else {
                            ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "VIBRATOR", "NOT FOUND", 15, 13);
                        }
                    }
                }
            }
            /*else if (i == 2) {
            	if (l) {
            		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            		ew.apps.kitty.state.def.is.voltMon = 1 - ew.apps.kitty.state.def.is.voltMon;
            		if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "VOLT MONITOR", ew.apps.kitty.state.def.is.voltMon ? "ENABLED" : "DISABLED", 0, 15);
            		ew.UI.btn.c2l("main", "_2x3", 2, "VOLT", "MON", 15, ew.apps.kitty.state.def.is.voltMon ? 4 : 1);
            	}
            	else {
            		ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "HOLD TO ENABLE", "VOLT MONITOR", 0, 15);
            	}
            }*/
            else if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "BALL", "CALIBRATION", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: -ew.apps.kitty.state.def.is.clb * 100, dn: 0, up: 9, tmp: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.UI.btn.ntfy(0, 2, 1);
                    ew.UI.btn.c2l("main", "_2x3", 2, "CLB", E.toJS(b), 15, 6);
                    ew.apps.kitty.state.def.is.clb = -b / 100;
                };
            }
            else if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.kitty.toggle("power");
            }
            else if (i == 4) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (!ew.apps.kitty.state.def.is.scale) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PLEASE ENABLE", "THE SCALE", 15, 13);
                }
                else {
                    ew.apps.kitty.state.def.auto.light = 1 - ew.apps.kitty.state.def.auto.light;
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "AUTO LIGHT", ew.apps.kitty.state.def.auto.light ? "ENABLED" : "DISABLED", 0, 15);
                    ew.UI.btn.c2l("main", "_2x3", 4, "LIGHT", ew.apps.kitty.state.def.auto.light?"ON":"OFF", 15, ew.apps.kitty.state.def.auto.light ? 4 : 1);
                }
            }
            else if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.scale.state.def.type == "side") {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "NOT AVAILABLE", "FOR SIDE SCALE", 15, 13);
                }
                else if (!ew.apps.kitty.state.def.is.scale) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PLEASE ENABLE", "THE SCALE", 15, 13);
                }
                else {
                    ew.apps.kitty.state.def.auto.pause = 1 - ew.apps.kitty.state.def.auto.pause;
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "AUTO PAUSE", ew.apps.kitty.state.def.auto.light ? "ENABLED" : "DISABLED", 0, 15);
                    ew.UI.btn.c2l("main", "_2x3", 5, "PAUSE", (ew.apps.scale.state.def.type == "down" && ew.apps.kitty.state.def.auto.pause) ?"ON":"OFF", 15, (ew.apps.scale.state.def.type == "down" && ew.apps.kitty.state.def.auto.pause) ? 4 : 1);
                }
            }
            else if (i == 6) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.def.face.scrn = 1 - ew.def.face.scrn;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "AUTO SCREEN ON", ew.def.face.scrn ? "ENABLED" : "DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 6, "SCRN", (ew.def.face.scrn) ?"ON":"OFF", 15, (ew.def.face.scrn) ? 4 : 1);
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
