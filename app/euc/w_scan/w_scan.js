//touch
tcNext.replaceWith(() => { buzzer.nav(buzzer.buzz.na); });
tcBack.replaceWith(() => {
	buzzer.nav(buzzer.buzz.ok);
	face.go(scan.app, 0);
});
//scan face-used by dash/repellent
if (!global.scan) {
	scan = {
		mac: [],
		run: 0,
		app: "dash",
		go: function(app, filter) {
			if (this.run) return;
			scan.run = 1;
			this.app = app;
			this.slot = "";
			scan.found = [];
			if (scan.tid) {	clearTimeout(scan.tid);	scan.tid = 0;}
			NRF.setScan(function(devices) {
				if (app=="dashScan"){
					if (euc.dash.info.get.makr=="Kingsong") {
						if (devices.shortName&&devices.shortName.startsWith("KSN")&&!scan.found.includes(E.toJS([devices.id,devices.shortName])) ) scan.found.push(E.toJS([devices.id,devices.shortName]));
						if (devices.name&&devices.name.startsWith("KS")&&!scan.found.includes(E.toJS([devices.id,devices.name])) )  scan.found.push(E.toJS([devices.id,devices.name]));
					}else if (!scan.found.includes(E.toJS([devices.id,devices.name]))) scan.found.push(E.toJS([devices.id,devices.name]));
				}else{
				 if (!scan.found.includes(E.toJS([devices.id,devices.name,devices.manufacturerData]))) scan.found.push(E.toJS([devices.id,devices.name,devices.manufacturerData]));
				}
			}, { filters: filter, active: true });
			scan.tid = setTimeout(() => {
				scan.tid = 0;
				NRF.setScan();
				if (scan.found != "" && scan.found != undefined) {
					if (scan.app == "dashScan") {
						euc.dash.info.get.mac = 0;
					}else if (app == "eucLight"){
					
					
					}else if (app == "repellent") {
						ew.do.fileWrite("setting", app + "Mac", scan.found[0].split("|")[0]);
						ew.do.fileWrite("setting", app + "Name", scan.found[0].split("|")[1].replace(/\0/g, ''));
						ew.do.fileWrite("setting", app + "Go", "0");
					}
					scan.mac = scan.found;
				}
				else scan.mac = [];
				face[0].start = 1;
				scan.run = 0;
				if (face.appCurr != "w_scan") {
					scan.go = 0;
					scan = 0;
				}
			}, 2500);
		}
	};
}
face[0] = {
	offms: (ew.def.off[face.appCurr]) ? ew.def.off[face.appCurr] : 30000,
	g: w.gfx,
	go: 0,
	init: function(service) {
		this.go = 0;
		this.start = 1;
		this.inloop = 0;
		this.serv = service;
		scan.go(face.appPrev, this.serv);
		this.bar();
		this.line = 0;
		this.top = 50;
		this.run = true;
	},
	bar: function() {
		if (scan.run) {
			if (this.inloop != 1) {
				this.inloop = 1;
				UI.ele.ind(1, 1, 0);
				UI.ele.title("WAIT 5 SECS", 15, 0);
				UI.btn.img("main", "_main", 12, "scan", "SCANNING", 11, 1);
			}
		}
		else if (scan.mac.length) {
			if (this.inloop != 2) {
				this.inloop = 2;
				UI.btn.c2l("main", "_main", 12, "", "", 15, 6);
				UIc.start(1, 1);
				for (var entry = this.line; entry < this.line + 4 && entry < scan.mac.length; entry++) {
					let name;
					let mdata=0;
					if (3 < entry) return;
					if (JSON.parse(scan.mac[entry])[1]) name = E.toString(JSON.parse(scan.mac[entry])[1].replace(/\0/g, ''));
					else name = JSON.parse(scan.mac[entry])[0].substring(0, 17);
					if (JSON.parse(scan.mac[entry])[2]) mdata=E.toString(JSON.parse(scan.mac[entry])[2]);
					
					if (ew.dbg) console.log("scan button:", entry+1,scan.mac);
					UI.btn.c2l("main", "_4x1", entry + 1, name.toUpperCase()+(mdata?" "+mdata:""), "", 15, 1,1.1);
				}
				UI.ele.title((entry) + "/" + scan.mac.length, 15, 4);
				//this.g.flip();
				UIc.end();

				UIc.main._4x1 = (i) => {
					if (ew.dbg) console.log("scan results:", i, scan.mac, scan.mac[i - 1][0]);
					buzzer.nav(buzzer.buzz.ok);
					if (scan.app=="dashScan"){
						this.mac = JSON.parse(scan.mac[i - 1])[0];
						this.name = (JSON.parse(scan.mac[i - 1])[1] != "undefined") ? JSON.parse(scan.mac[i - 1])[1].replace(/\0/g, '') : "NA";
						ew.do.fileWrite("dash", "slot" + require("Storage").readJSON("dash.json", 1).slot + "Name", this.name);
						euc.mac = this.mac;
						euc.tgl();
					}else if (scan.app=="eucLight"){
						
						print("eL");
						
					}
					return;
				};
				return;
			}
		}
		else {
			if (this.inloop != 3) {
				this.inloop = 3;
				UI.ele.title("NOT FOUND", 15, 13);
				UIc.start(1, 1);
				UI.btn.c2l("main", "_main", 12, "TAP TO\n\nRESCAN", "", 15, 1);
				UIc.end();
				UIc.main._main = (i) => {
					if (i == 12) {
						buzzer.nav(buzzer.buzz.ok);
						UIc.start(1, 1);
						UIc.end();
						face[0].init(face[0].serv);
						face[0].show();

					}
				};
				this.done = 0;
				return;
			}
		}
	},
	show: function(o) {
		if (!this.run) return;
		if (!UI.ntid) this.bar();
		else this.inloop = 0;

		this.tid = setTimeout(function(t) {
			t.tid = -1;
			t.show(o);
		}, 500, this);
	},
	tid: -1,
	run: false,
	clear: function() {
		this.run = false;
		if (this.tid >= 0) clearTimeout(this.tid);
		if (this.loop >= 0) clearInterval(this.loop);
		//if (scan && !scan.run) global.scan = 0;
		this.tid = -1;
		return true;
	},
	off: function() {
		this.g.off();
		this.clear();
	}
};
