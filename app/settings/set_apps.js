//touch
ew.UI.nav.next.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if ((ew.UI.ntid)) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	//eval(require("Storage").read("ew_f_set_dash"));
	ew.face[0].bar();
});
ew.UI.nav.back.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if ((ew.UI.ntid)) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	eval(require("Storage").read("ew_f_set_set"));
	ew.face[0].bar();
});
//
ew.face[0].page = "app";
ew.UI.ele.ind(2, 3, 0);
ew.UI.ele.fill("_main", 9, 0);
ew.UI.c.start(1, 0);
	ew.UI.btn.img("main", "_2x3", 1, "bangle", "", 15, 1);
	ew.UI.btn.c2l("main", "_2x3", 2, "LOG", "", 15, 1, 1);
	//ew.UI.btn.c2l("main", "_3x1", 2, "TIMERS", "", 15, 1, 1.3);
	
ew.UI.c.end();
//
ew.UI.c.main._3x1 = (i, l) => {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);

		if (i == 1) 
			ew.face.go("itag-scan",0);
		else if (i == 2) 
			ew.face.go("timer",0);
					
	
};



ew.UI.c.main._2x3 = (i) => {
	//"jit";
	if (i == 1) {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		if (process.env.BOARD != "BANGLEJS2") {
			ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "BANGLE2.JS", "ONLY", 15, 13);
			g.flip();
			return;
		}
		setTimeout(()=>{ew.sys.updt();Bangle.showLauncher()},100);; //ew.face.go('calc',0);
	}
	else if (i == 2) {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		ew.face.go('view_cycles', 0, { source: "month", style: 1, loop: 1 });
	}
	else if (i == 3) {
		//ew.UI.btn.ntfy(1,1.5,0,"_bar",6,"NOT","AVAILABLE",15,13);g.flip();
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		//check for corruption
		if (require("Storage").read("tpmsLog" + tpms.def.id + ".json", 1) && !require("Storage").readJSON("tpmsLog" + tpms.def.id + ".json", 1)) {
			require("Storage").erase("tpmsLog" + tpms.def.id + ".json", 1);
			delete tpms.def.list[tpms.def.id];
			tpms.def.id = Object.keys(tpms.def.list)[0];
			if (!Object.keys(tpms.def.list)[tpms.def.pos]) tpms.def.pos = 0;
		}
		let sensor = Object.keys(tpms.def.list)[tpms.def.pos];
		if (!sensor) {
			//ew.UI.ele.fill("main","_log",8,"< TOTAL >","",15,6,0.6);
			g.clear();
			tpms.def.int = 1;
			tpms.scan();
			ew.ew.UI.c.start(1, 1);
			ew.ew.UI.c.end();
			ew.UI.btn.c1l("main", "_log", 5, "SCANNING", "", 15, 6, 0.6);
			//ew.UI.btn.c1l("main","_log",5,"SCANNING","",15,6,0.6);
			return;
		}

		ew.UI.ele.ind(tpms.def.pos + 1, Object.keys(tpms.def.list).length, 0, Object.keys(tpms.def.list).length == 1 ? 6 : 0);
		ew.face.go('viewLogs', 0, { data: "tpmsLog" + sensor, name: sensor, key: "psi", lowL: tpms.def.list[sensor].lowP, hiL: tpms.def.list[sensor].hiP });
		tcNext.replaceWith(() => {
			if (tpms.def.pos + 1 < Object.keys(tpms.def.list).length) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				tpms.def.pos++;
				let sensor = Object.keys(tpms.def.list)[tpms.def.pos];
				face[0].posLast = 0;
				ew.UI.ele.ind(tpms.def.pos + 1, Object.keys(tpms.def.list).length, 0, 0);
				g.flip();
				ew.face.go('viewLogs', 0, { data: "tpmsLog" + sensor, name: sensor, key: "psi", lowL: tpms.def.list[sensor].lowP, hiL: tpms.def.list[sensor].hiP });
				return;
			}
			ew.sys.buzz.nav(ew.sys.buzz.type.na);
		});
		tcBack.replaceWith(() => {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			if (0 < tpms.def.pos) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				tpms.def.pos--;
				let sensor = Object.keys(tpms.def.list)[tpms.def.pos];
				face[0].posLast = 0;
				ew.UI.ele.ind(tpms.def.pos + 1, Object.keys(tpms.def.list).length, 0, 0);
				ew.face.go('viewLogs', 0, { data: "tpmsLog" + sensor, name: sensor, key: "psi", lowL: tpms.def.list[sensor].lowP, hiL: tpms.def.list[sensor].hiP });
				return;
			}
			ew.face.go('settings', 0, 2);
		});
		ew.ew.UI.c.main._log = (i) => {
			if (i == 1) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				if (tpms.def.pos + 1 < Object.keys(tpms.def.list).length) tpms.def.pos++;
				else tpms.def.pos = 0;
				let sensor = Object.keys(tpms.def.list)[tpms.def.pos];
				face[0].posLast = 0;
				ew.UI.ele.ind(tpms.def.pos + 1, Object.keys(tpms.def.list).length, 0, 0);

				ew.face.go('viewLogs', 0, { data: "tpmsLog" + sensor, name: sensor, key: "psi", lowL: tpms.def.list[sensor].lowP, hiL: tpms.def.list[sensor].hiP });

			}
			else if (i == 3) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.temp.bar = 0;
				ew.UI.btn.ntfy(0, 2, 1);
				ew.ew.UI.c.start(0, 1);
				//ew.UI.btn.img("bar", "_bar", 4, "scan", "", 15, 1);
				ew.UI.btn.img("bar", "_bar", 4, "settings", "SET", 15, 12);
				ew.UI.btn.img("bar", "_bar", 5, "trash", "DEL", 15, 13);
				ew.ew.UI.c.end();
				ew.ew.UI.c.bar._bar = (i) => {
					if (i == 5) {
						ew.sys.buzz.nav(ew.sys.buzz.type.ok);
						ew.UI.btn.ntfy(0, 2, 1);
						ew.ew.UI.c.start(0, 1);
						ew.UI.btn.c2l("bar", "_bar", 6, "DELETE?", "", 15, 13, 1.5);
						//ew.UI.btn.img("bar", "_bar", 6, "trash", "CONFIRM", 15, 13);
						ew.ew.UI.c.end();
					}
					if (i == 6) {
						ew.ew.UI.c.start(0, 1);
						ew.ew.UI.c.end();
						ew.UI.btn.ntfy(0, 1, 1);
						ew.sys.buzz.nav(ew.sys.buzz.type.ok);
						ew.UI.btn.c2l("bar", "_bar", 6, "DELETED", "", 15, 13, 1.5);
						let sensor = Object.keys(tpms.def.list)[tpms.def.pos];
						if (require("Storage").read("tpmsLog" + sensor + ".json", 1)) require("Storage").erase("tpmsLog" + sensor + ".json", 1);
						delete tpms.def.list[sensor];
						tpms.def.id = Object.keys(tpms.def.list)[0] ? Object.keys(tpms.def.list)[0] : 0;
						tpms.def.pos = 0;
					}
					if (i == 4) {



					}

				};
			}
			else
				ew.sys.buzz.nav(ew.sys.buzz.type.na);
		};
	}
	else if (i == 4) {
		if (ew.is.bt != 6) {
			ew.sys.buzz.nav(ew.sys.buzz.type.na);
			if (!ew.def.hid) {
				ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ENABLE HID", "ON BT MENU", 15, 13);
				g.flip();
			}
			else {
				ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PHONE IS NOT", "CONNECTED", 15, 13);
				g.flip();
			}
			return;
		}
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		ew.face.go('hid', 0);
	}
	else if (i == 5) {
		ew.sys.buzz.nav(ew.sys.buzz.type.na);
	}
	else if (i == 6) {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		ew.face.go('esplay', 0, 2);
	}
};
