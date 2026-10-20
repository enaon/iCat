//torch set
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
    ew.face.go("torch",0);
});

ew.face[0] = {
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        ew.def.face.off[ew.face.appCurr] = this.offms;
        this.page1();
        this.bar();
    },
    show: function(o) {},
    page1: function(batt, id) {
        this.page=1;
        // header
        ew.UI.ele.ind(0,0, 0, 0);

        ew.UI.c.start(1, 1);
        ew.UI.ele.fill("_main", 12, 0);
        ew.UI.btn.c2l("main", "_2x3", 1, "DTAP", ew.def.dev.ttap?"ON":"OFF", 15, ew.def.dev.ttap?4:6);
        ew.UI.btn.c2l("main", "_2x3", 2, "MODE", ew.apps.torch.state.def.led?"LED":"SCRN", 15, ew.apps.torch.state.def.led?4:6);
        
        if ( ew.apps.torch.state.def.led ){
            ew.UI.btn.c2l("main", "_2x3", 3, "PER", ew.apps.torch.state.def.per?"ON":"OFF", 15, ew.apps.torch.state.def.per?13:6);
            //if (ew.apps.torch.state.def.per) 
            ew.UI.btn.c2l("main", "_2x3", 4, "TMR", ew.apps.torch.state.def.tmr, 15, 6);
            ew.UI.btn.c2l("main", "_2x3", 5, "TWT",ew.apps.torch.state.def.twst?"ON":"OFF", 15, ew.apps.torch.state.def.twst?4:6);


        }
        ew.UI.c.end();

        ew.UI.c.main._2x3 = (i) => {
            if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.def.dev.ttap==undefined) ew.def.dev.ttap=0;
                ew.def.dev.ttap = 1-ew.def.dev.ttap;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, " TAP MODE",ew.def.dev.ttap?"ENABLED":"DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "DTAP", ew.def.dev.ttap?"ON":"OFF", 15, ew.def.dev.ttap?4:6);
                return;
            }
            if (i == 2) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.torch.state.def.led=!ew.apps.torch.state.def.led
                ew.face[0].page1();
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ACTIVE:",ew.apps.torch.state.def.led?"LED MODE":"SCREEN MODE", 0, 15);
                //ew.UI.btn.c2l("main", "_2x3", 2, "MODE", ew.apps.torch.state.def.led?"LED":"SCRN", 15, ew.apps.torch.state.def.led?4:6);
                return;
            }
            if (i == 3) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.torch.state.def.per=!ew.apps.torch.state.def.per
                ew.face[0].page1();
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PERSIST:",ew.apps.torch.state.def.per?"ENABLED":"DISABLED", 0, 15);
                //ew.UI.btn.c2l("main", "_2x3", 3, "PER", ew.apps.torch.state.def.per?"ON":"OFF", 15, ew.apps.torch.state.def.per?4:6);

            } 
            if (i == 4) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, " < TIME IN SEC >", "", 15, 6, 1);
				ew.is.slide = 1;
				ew.sys.TC.val = { cur: ew.apps.torch.state.def.tmr, dn: 1, up:  120, tmp: 0 ,len:10};
				ew.UI.c.tcBar = (a, b) => {
					ew.UI.btn.ntfy(0, 3, 1);
					ew.apps.torch.state.def.tmr=b;
					ew.UI.btn.c2l("main", "_2x3", 4, "TMR", b, 15, 6);
					
				};
				return;
			}
			if (i == 5) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.torch.state.def.twst=!ew.apps.torch.state.def.twst;
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TWIST MODE",ew.apps.torch.state.def.twst?"ENABLED":"DISABLED", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 5, "TWT",ew.apps.torch.state.def.twst?"ON":"OFF", 15, ew.apps.torch.state.def.twst?4:6);
                return;
            }
        };
    },
    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);
        //ew.UI.btn.c2l("main", "_bar", 6,  ew.face.appCurr.toUpperCase(), "",15, 0, 1.3);
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", ew.face.appCurr.split("-")[0].toUpperCase(), 15, 0,0.8,1,1);

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
