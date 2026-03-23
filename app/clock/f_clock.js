//main

ew.UI.nav.next.replaceWith(() => {
	if (ew.def.face.main !== "clock") { ew.sys.buzz.nav(ew.sys.buzz.type.na); return; }
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if (ew.UI.ntid && !ew.is.UIpri) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	if (ew.def.face.rght) ew.face.go(ew.def.face.rght, 0);
	else ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SET APP IN", "LAUNCHER", 15, 13);
});
ew.UI.nav.back.replaceWith(() => {
	if (ew.def.face.main !== "clock") { ew.sys.buzz.nav(ew.sys.buzz.type.na); return; }
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if (ew.UI.ntid && !ew.is.UIpri) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	if (ew.def.face.left) ew.face.go(ew.def.face.left, 0);
	else ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SET APP IN", "LAUNCHER", 15, 13);

});

//if (ew.def.face.bri<3) ew.UI.theme.current= ew.UI.theme.white;
ew.UI.theme.current = ew.UI.theme.dark;

ew.face[0] = {
	offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 15000,
	old: ew.def.face.bpp ? 0 : 1,

	init: function() {
		if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;

		this.startTime = getTime();
		this.v = ew.sys.batt(1);

		ew.UI.c.start(1, 1);
		ew.UI.c.end();

		this.ewA = [];

		this.gui = process.env.BOARD == "BANGLEJS2" ? {
			top: [0, 0, 176, 34],
			date: [7, 6, 85, 29],
			bat: [110, 4, 156, 28],
			time24: [84, 92, 51],
			time12: [63, 73, 51],
			btm: [0, 31, 176, 120],
			main: [0, 35, 176, 117],
			hour: [0, 37, 94, 114],
			min: [85, 37, 176, 114],
			dots: [87, 71],
			txt: 18 * ew.UI.size.txt,
			txtS: 12 * ew.UI.size.txt,
			txtM: 25 * ew.UI.size.txt,
			txtL: 65 * ew.UI.size.txt
		} : {
			top: [0, 20, 239, 54],
			bat: [145, 30, 225, 55],
			date: [0, 30, 145, 55],
			time24: [89, 111, 105],
			time12: [69, 91, 105],
			btm: [0, 176, 239, 200],
			main: [0, 55, 240, 170],
			hour: [1, 75, 100, 185],
			min: [99, 75, 202, 185],
			dots: [100, 133],
			txt: 25 * ew.UI.size.txt,
			txtS: 18 * ew.UI.size.txt,
			txtM: 32 * ew.UI.size.txt,
			txtL: 85 * ew.UI.size.txt
		};
		ew.UI.ele.ind(0, 0, 0, 0);

		this.hour = -1;
		this.min = -1;
		this.sec = -1;
		this.batt = -1;
		this.bt = -1;

		g.setCol(0, 0);
		g.fillRect(this.gui.top[0], this.gui.top[1], this.gui.top[2], this.gui.top[3]);

		g.setCol(0, 1);
		g.fillRect({ x: this.gui.btm[0], y: this.gui.btm[1], x2: this.gui.btm[2], y2: this.gui.btm[3], r: 6 });

		//first run
		this.bat();
		this.date();
		this.time();
		if (!ew.UI.ntid) this.bar();

		this.run = true;

	},

	show: function() {
		if (!this.run) return;
		if (this.batt != ew.is.ondc) {
			this.bat();
		}
		if (this.bt != ew.is.bt) {
			this.date();
		}
		this.time();
		if (ew.tid.time) clearTimeout(ew.tid.time);
		ew.tid.time = setTimeout(() => {
			ew.tid.time = 0;
			this.show();
		}, g.isOn ? 250 : this.next());
	},

	next: function() {
		const now = new Date();
		const seconds = now.getSeconds();
		return (60 - seconds) * 1000;
	},

	bar: function() {
		if (ew.is.UIpri) { ew.notify.alert("error",ew.notify.log.error[0], 1, 1);return;}
		if (ew.UI.ntid) return;
		ew.UI.ele.fill("_bar", 6, 0);
		
		this.gEW();
		
		ew.UI.c.start(1, 1);
		let  len = this.ewA.length;
		
		if (0 < len) {
			// max of 3 apps in drawer
			let pos=[];
			if (len === 1) pos=[6];
			else if (len === 2) pos=[4,5];
			else pos=[1,2,3];
			
			for (let app in this.ewA) {
				ew.UI.btn.img("bar", "_bar", pos[app], "ew_i_" + this.ewA[app].id + ".img", this.ewA[app].id.toUpperCase(), 15, 4, 1.3, 0, 1);
				if (2 < app) break;
			}

			ew.UI.c.bar._bar = (i, l) => {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.face.go(this.ewA[pos.indexOf(i)].id, 0, "jump")
			};
		}
		else if (this.v < 25)
			ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LOW BATTERY", "CHARGE ME", 15, 13);

		ew.UI.c.end();


	},

	date: function() {
		this.bt = ew.is.bt;
		this.d = (Date()).toString().split(' ');
		this.ring = 0;
		var colbt = ew.UI.theme.current.clock.dateB;
		if (this.bt == 1) colbt = 14;
		else if (this.bt == 2) colbt = 9;
		else if (this.bt == 3) colbt = 11;
		else if (this.bt == 5) colbt = 15;
		else if (this.bt == 6) colbt = 4;
		g.setCol(0, colbt);
		g.setCol(0, ew.UI.theme.current.clock.top);
		g.fillRect(this.gui.date[0], this.gui.date[1], this.gui.date[2], this.gui.date[3]);
		g.setCol(1, ew.UI.theme.current.clock.dateF);
		g.setFont("LECO1976Regular22");
		g.drawString(this.d[2] + " " + this.d[0].toUpperCase(), this.gui.date[0], this.gui.date[1]); //date
		//g.flip();

	},

	bat: function() {
		this.batt = ew.is.ondc;
		this.v = ew.sys.batt(1);

		//color tagging
		if (this.batt === 1) g.setCol(0, 9);
		else if (this.v <= 25) g.setCol(0, 13);
		else g.setCol(0, ew.UI.theme.current.clock.batB);

		g.setCol(0, ew.UI.theme.current.clock.top);
		g.fillRect(this.gui.bat[0], this.gui.bat[1], g.getWidth(), this.gui.bat[3]);

		g.setCol(1, ew.UI.theme.current.clock.batF);
		g.setFontAlign(1, -1);

		if (this.v <= 0) {
			g.setFont("Vector", this.gui.txtM);
			g.drawString("EMPTY", this.gui.bat[2], this.gui.bat[1]);

			//}else if (this.v<100) {
		}
		else {
			//if (100<this.v) this.v=100;
			g.setFont("Vector", this.gui.txtM);
			g.drawString(this.v, this.gui.bat[2], this.gui.bat[1]);
			g.drawImage((this.batt) ? require("heatshrink").decompress(atob("jEYwIKHiACEnACHvACEv/AgH/AQcB/+AAQsAh4UBAQUOAQ8EAQgAEA==")) : require("heatshrink").decompress(atob("jEYwIEBngCDg//4EGgFgggCZgv/ASUEAQQaBHYPgJYQ=")), this.gui.bat[2], this.gui.bat[1], { scale: 0.75 });
			//g.drawImage(this.image("batteryMed"),212,12);
		}
		/*else  {
			g.setFont("Vector",this.gui.txtM);
			g.drawString("FULL",this.gui.bat[2],this.gui.bat[1]); 
		} 
		*/
		g.setFontAlign(-1, -1);
		//g.flip();
	},

	time: function() {

		//setup time
		this.d = (Date()).toString().split(' ');
		this.t = (this.d[4]).toString().split(':');
		this.s = (this.t[2]).toString().split('');


		if (this.t[1] != this.min) {


			this.fmin = ew.UI.theme.current.clock.minF;
			this.fhr = ew.UI.theme.current.clock.hrF;
			this.bmin = ew.UI.theme.current.clock.minB;
			this.fsec = ew.UI.theme.current.clock.secF;
			this.bsec = ew.UI.theme.current.clock.secB;

			this.min = this.t[1];
			g.setCol(0, 6);
			g.fillRect({ x: this.gui.main[0], y: this.gui.main[1], x2: this.gui.main[2], y2: this.gui.main[3], r: 6 });

			//hours
			this.hour = this.t[0];
			g.setCol(1, this.fhr);
			//g.setFont("Vector",this.gui.txtL);
			//if (0.9 < ew.def.face.size ) g.setFont("LECO1976Regular14",5);// g.setFont("LECO1976Regular22",3);
			if (0.9 < ew.def.face.size) g.setFont("LECO1976Regular22", 3);
			else g.setFont("LECO1976Regular42");
			//else  g.setFont("LECO1976Regular14",4);//g.setFont("LECO1976Regular42",1);
			g.setFontAlign(1, -1);

			if (ew.def.time.hr24) {
				this.gui.time = this.gui.time24;
				g.drawString(this.t[0], this.gui.time[0], this.gui.time[2]); //hours
			}
			else {
				this.gui.time = this.gui.time12;
				this.hour = (this.t[0] < 10) ? (this.t[0] == "00") ? 12 : this.t[0][1] : (this.t[0] < 13) ? this.t[0] : this.t[0] - 12;
				g.drawString(this.t[0], this.gui.time[0], this.gui.time[2]); //hours
			}
			g.setFontAlign(-1, -1);

			//minutes
			this.min = this.t[1];
			g.setCol(1, this.fmin);
			g.drawString(this.t[1], this.gui.time[1], this.gui.time[2]);
		}
		//dots
		let dotsY;
		if (0.9 < ew.def.face.size) dotsY = this.gui.dots[1] + 3;
		else dotsY = this.gui.dots[1];
		g.setCol(1, this.s[1] % 2 == 0 ? this.fsec : this.bsec);
		g.fillRect(this.gui.dots[0] - 3, dotsY - 10, this.gui.dots[0] + 3, dotsY - 5);
		g.fillRect(this.gui.dots[0] - 3, dotsY + 5, this.gui.dots[0] + 3, dotsY + 10);
		if (this.run) g.flip();


		//console.log("cpu time:", getTime()-this.timeStart);

	},
	// Scan custom apps from ew.apps
	gEW() {
		this.ewA = [];
		for (let appName in ew.apps) {

			if (typeof ew.apps[appName] === 'object' && ew.apps[appName] !== null && ew.apps[appName].state && ew.apps[appName].state.run) {
				this.ewA.push({
					id: appName
				});
			}
		}
	},


	tid: 0,
	run: false,
	clear: function() {
		if (process.env.BOARD === "BANGLEJS2" && ew.face.appCurr === "clock" && ew.face.appPrev === "clock" && ew.face.pageCurr === -1) return true;
		this.run = false;
		if (ew.tid.time) {
			clearTimeout(ew.tid.time);
			ew.tid.time = 0;
		}
		return true;
	},
	off: function() {
		g.off();
	}
};

//touch
