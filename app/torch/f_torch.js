//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 600000,
    init: function(i) {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        this.mode = i;
        this.batt=ew.sys.batt();

    },
    show: function(i) {

        if (i === "long") {
            ew.apps.torch.tgl();
            ew.face.go(ew.def.face.main, 0);
            ew.face.off(1);
        }
        else {
            if (ew.apps.torch.state.def.led) ew.apps.torch.tgl("ON");
            this.info();
        }
    },
    info: function() {
        if (!ew.apps.torch.state.def.led) {
            ew.is.bri = ew.def.face.bri;
            g.bri.set((process.env.BOARD == "BANGLEJS2") ? 10 : 7);
            //ew.UI.btn.c2l("main", "_header", 6, "" , "", 3, 15, 3);
            ew.UI.btn.img("main", "_main", 15, "ew_i_torch.img", "", 3, 15, 2);
        }
        else {
            ew.UI.ele.fill("_main", 15, 0);
            ew.UI.btn.c2l("main", "_header", 6, "TORCH", "", 3, 0, 1);
            //ew.UI.ele.ind(0,0, 15, 15);
            ew.UI.c.start(1, 0);
            ew.UI.btn.cInd("main", "_main", 9, ew.apps.torch.state.isOn ? ew.apps.torch.state.def.lvl : 0, "BRI", 15, ew.apps.torch.state.isOn ? 8 <= ew.apps.torch.state.def.lvl ? 13 : 4 : 1, 1.5, 0, 0, 30);
            ew.UI.c.end();

            ew.UI.c.main._main = (i, l) => {
                if (i == 9) {
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    let state = ew.apps.torch.tgl();
                    ew.UI.btn.cInd("main", "_main", 9, state ? ew.apps.torch.state.def.lvl : 0, "LEVEL", 15, state ? 8 <= ew.apps.torch.state.def.lvl ? 13 : 4 : 1, 1.5, 0, 0, 30);
                    this.bar();

                }
            }
        }
        this.bar();

    },
    bar: function() {
        if (!ew.apps.torch.state.def.led) {
            ew.UI.btn.c2l("main", "_bar", 6, "", "", 3, 15);
            ew.UI.c.start(1, 1);
            ew.UI.c.end();
            return;
        }

        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        if (!ew.apps.torch.state.isOn) {
            ew.UI.ele.fill("_bar", 6, 0);
            ew.is.slide = 0;
            return;
        }
        ew.UI.btn.c2l("bar", "_bar", 6, " <   LEVEL    >", "", 15, 0, 1.4);
        ew.is.slide = 1;
        ew.sys.TC.val = { cur: ew.apps.torch.state.def.lvl, dn: 1, up: 10, tmp: 0, len: 10 };
        ew.UI.c.tcBar = (a, b) => {
            if (b) {
			    ew.apps.torch.state.isOn=true;

                let per = 1;
                if (3.8 <= this.batt)  per =  (0.9 / (this.batt - 2.9));

                analogWrite(ew.apps.torch.state.def.pin, (b/10) * per, { freq: 4000 });

            }
            else {

                digitalWrite(ew.apps.torch.state.def.pin, 0);
                ew.apps.torch.state.isOn = false;
            }
            ew.apps.torch.state.def.lvl = b;
            ew.UI.btn.cInd("main", "_main", 9, b | 0, "BRI", 15, ew.apps.torch.state.isOn ? 8 <= ew.apps.torch.state.def.lvl ? 13 : 4 : 1, 1.5, 0, 0, 30);
        };


    },
    clear: function(o) {
        ew.is.slide = 0;
        if (ew.apps.torch.state.def.led && !ew.apps.torch.state.def.per && this.mode != "long") ew.apps.torch.tgl("OFF");
        if (!ew.apps.torch.state.def.led) g.bri.set(ew.is.bri);
        return true;
    },
    off: function(o) {
        if (!ew.apps.torch.state.def.led) g.bri.set(ew.is.bri);
        g.off();
        return true;
    }
};
