E.setFlags({ pretokenise: 1 });
//dash  Options
//ew.UI.nav.next.replaceWith(new Function("x", "y",'setTimeout(()=>{'+ew.UI.c.raw.main+ew.UI.c.raw.bar+'},0);'));
ew.UI.nav.next.replaceWith((x, y) => {
	//if (ew.face[0].page == "dash2") {
	ew.sys.buzz.nav(ew.sys.buzz.type.na);
	return;
	//}
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	ew.face[0].d2();
	if (ew.UI.ntid) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
		ew.face[0].bar();
	}
});
ew.UI.nav.back.replaceWith((x, y) => {
	if (ew.face[0].page == "dash1") {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		eval(require("Storage").read("ew_f_set_apps"));
		if (ew.UI.ntid) {
			clearTimeout(ew.UI.ntid);
			ew.UI.ntid = 0;
		}
		ew.face[0].bar();
		//ew.apps.kitty.state.update();
		return;
	}
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	ew.face[0].d1();
	if (ew.UI.ntid) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	ew.face[0].bar();
});
//
ew.face[0].page = "dash1";


ew.face[0].d1();
ew.face[0].d2 = function() {
	ew.face[0].page = "dash2";
	ew.UI.ele.ind(4, 4, 0);
	ew.UI.c.start(1, 0);
	ew.UI.btn.c2l("main", "_2x3", 1, "TOF", ew.apps.kitty.state.def.is.tof ? "ON" : "OFF", 15, ew.apps.kitty.state.def.is.tof ? 4 : 1);
	ew.UI.btn.c2l("main", "_2x3", 2, "FULL", ew.apps.kitty.state.def.tof.full, 15, ew.apps.kitty.state.def.is.tof ? 6 : 1);
	ew.UI.btn.c2l("main", "_2x3", 3, "EMPTY", ew.apps.kitty.state.def.tof.empty, 15, ew.apps.kitty.state.def.is.tof ? 6 : 1);
	ew.UI.btn.c2l("main", "_2x3", 4, "SCALE", ew.apps.kitty.state.def.is.scale ? "ON" : "OFF", 15, ew.apps.kitty.state.def.is.scale ? 4 : 1);
	ew.UI.btn.c2l("main", "_2x3", 5, "MAX", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
	ew.UI.btn.c2l("main", "_2x3", 6, "MIN", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1);
	ew.UI.c.end();
	//
	ew.UI.c.main._2x3 = (i, l) => {
		if (i == 1) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			if (l)
				ew.face.go("ToF", 0);
			else {
				ew.apps.kitty.state.def.is.tof = 1 - ew.apps.kitty.state.def.is.tof;
				ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "HOLD FOR", "ToF SETUP", 0, 15);
				ew.UI.btn.c2l("main", "_2x3", 1, "ToF", ew.apps.kitty.state.def.is.tof ? "ON" : "OFF", 15, ew.apps.kitty.state.def.is.tof ? 4 : 1);
				ew.UI.btn.c2l("main", "_2x3", 2, "FULL", ew.apps.kitty.state.def.tof.full, 15, ew.apps.kitty.state.def.is.tof ? 6 : 1);
				ew.UI.btn.c2l("main", "_2x3", 3, "EMPTY", ew.apps.kitty.state.def.tof.empty, 15, ew.apps.kitty.state.def.is.tof ? 6 : 1);
			}
		}
		else if (i == 2) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET TOF", "FULL (CM)", 15, 6, 1);
			ew.is.bar = 1;
			ew.sys.TC.val = { cur: ew.apps.kitty.state.def.tof.full * 10, dn: 250, up: 450, tmp: 0 };
			ew.UI.c.tcBar = (a, b) => {
				ew.UI.btn.ntfy(0, 2, 1);
				ew.UI.btn.c2l("main", "_2x3", 2, "FULL", b / 10, 15, ew.apps.kitty.state.def.is.tof ? 6 : 1);
				ew.apps.kitty.state.def.tof.full = b / 10;
			};
		}
		else if (i == 3) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET TOF", "EMPTY (CM)", 15, 6, 1);
			ew.is.bar = 1;
			ew.sys.TC.val = { cur: ew.apps.kitty.state.def.tof.empty * 10, dn: 250, up: 450, tmp: 0 };
			ew.UI.c.tcBar = (a, b) => {
				ew.UI.btn.ntfy(0, 2, 1);
				ew.UI.btn.c2l("main", "_2x3", 3, "EMPTY", b / 10, 15, ew.apps.kitty.state.def.is.tof ? 6 : 1);
				ew.apps.kitty.state.def.tof.empty = b / 10;
			};
		}
		else if (i == 4) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);

			if (l)
				ew.face.go("scale_calib", 0);
			else {
				ew.apps.kitty.state.def.is.scale = 1 - ew.apps.kitty.state.def.is.scale;
				ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "HOLD FOR", "SCALE SETUP", 0, 15);
				ew.UI.btn.c2l("main", "_2x3", 4, "SCALE", ew.apps.kitty.state.def.is.scale ? "ON" : "OFF", 15, ew.apps.kitty.state.def.is.scale ? 4 : 1);
				ew.UI.btn.c2l("main", "_2x3", 5, "MAX", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //3
				ew.UI.btn.c2l("main", "_2x3", 6, "MIN", ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min / 1000, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //6
			}
		}
		else if (i == 5) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET MAX", "SAND WEIGHT (KG)", 15, 6, 1);
			ew.is.bar = 1;
			ew.sys.TC.val = { cur: ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max / 100, dn: 15, up: 40, tmp: 0 };
			ew.UI.c.tcBar = (a, b) => {
				ew.UI.btn.ntfy(0, 2, 1);
				ew.UI.btn.c2l("main", "_2x3", 5, "MAX", b / 10, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //6
				ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].max = b * 100;
			};
		}
		else if (i == 6) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "SET MIN", "SAND WEIGHT (KG)", 15, 6, 1);
			ew.is.bar = 1;
			ew.sys.TC.val = { cur: ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min / 100, dn: 5, up: 15, tmp: 0 };
			ew.UI.c.tcBar = (a, b) => {
				ew.UI.btn.ntfy(0, 2, 1);
				ew.UI.btn.c2l("main", "_2x3", 6, "MIN", b / 10, 15, ew.apps.kitty.state.def.is.scale ? 6 : 1); //6
				ew.apps.kitty.state.def.sand[ew.apps.kitty.state.def.is.sandType].min = b * 100;
			};
		}
	};
};
