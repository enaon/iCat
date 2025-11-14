//bangle.js 2 
ew.def.dev.touchtype = "b2";
//Bangle.js 2 has no auto-standby mode. 
ew.sys.TC = {
	x: 0,
	y: 0,
	run: 0,
	val: { cur: 0, up: 0, dn: 0, follow: 1 },
	start: function() {
		Bangle.setLCDPower(1)
		//Bangle.setOptions({lockTimeout:0})
		digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
		ew.sys.TC.init();
	},
	init: function() {
		if (this.run) return;
		this.run = 1;
		/*Bangle.on('swipe', function(LR, UD) {
			let tp = Bangle.touchRd(1, 7);
			//if (ew.sys.TC.dbg) console.log("tc swipe data:", tp)

			if (ew.is.slide && 116 < tp[5] && UD != -1) return;
			ew.face.off();
			if (LR == 0) {
				if (UD == -1) ew.UI.nav.up(tp[3], tp[5]);
				else ew.UI.nav.dn();
			}
			else {
				if (LR == -1) ew.UI.nav.next();
				else ew.UI.nav.back();
			}
		});
		*/
		/*	Bangle.on('touch', function(side) {
				ew.face.off();
				let tp = Bangle.touchRd(1, 7);
				const TCval=ew.sys.TC.val;
				if (ew.sys.TC.dbg) console.log("tc touch data:", tp)

				if (ew.is.slide && 116 < tp[5]) {

					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					if (TCval.reverce) side = side == 2 ? 1 : 2;
					side == 2 ? TCval.cur++ : TCval.cur--;

					if (TCval.up < TCval.cur) TCval.cur =(TCval.loop) ? TCval.dn : TCval.up;
					else if (TCval.cur < TCval.dn) TCval.cur = (TCval.loop) ? TCval.up: TCval.dn;
					ew.UI.c.tcBar(side===2 ? 1 : -1, TCval.cur);

				}
				else
					ew.UI.c.xy(tp[3], tp[5], tp[0] == 12 ? 1 : 0);
			});
		*/
		Bangle.on('drag', (data) => {
			//if (2<ew.sys.TC.dbg) console.log("tc drag data:", data)

			// ---- slider ----
			if (ew.is.slide && 116 < data.y) ew.sys.TC.bar(data);

			// ---- nav ----
			else if (!ew.sys.TC.nav && data.b) {
				
				// ---- long press ----
				if (!ew.sys.TC.nav.tid) {
					if (ew.sys.TC.dbg) console.log("tc nav tid");
					ew.sys.TC.tid = setTimeout(function(data) {
						ew.sys.buzz.nav(25);
						ew.sys.TC.nav = 1;
						ew.UI.c.xy(data.x, data.y, 1);
					}, 1000, data);
				}
				
				// ---- gestures ----
				if (data.dy <= -3) {
					ew.UI.nav.up(data.x, data.y);
					ew.sys.TC.nav = 1;
					ew.face.off();
				}
				else if (3 <= data.dy) {
					ew.UI.nav.dn();
					ew.sys.TC.nav = 1;
					ew.face.off();
				}
				else if (data.dx <= -3) {
					ew.UI.nav.next();
					ew.sys.TC.nav = 1;
					ew.face.off();
				}
				else if (3 <= data.dx) {
					ew.UI.nav.back();
					ew.sys.TC.nav = 1;
					ew.face.off();
				}

			}

			// ---- short press ----
			else if (!data.b) {
				if (ew.sys.TC.tid) {
					clearTimeout(ew.sys.TC.tid);
					ew.sys.TC.tid = 0;
				}
				//if (2<ew.sys.TC.dbg) console.log("tc btn:", data)
				if (!ew.sys.TC.nav) {
					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					ew.UI.c.xy(data.x, data.y, 0);
				}
				ew.sys.TC.nav = 0;

			}

		});
	},
	follow: function(data) {
		this.step = 1;
		this.long = 1;
		this.val.cur = this.seg;
		ew.UI.c.tcBar(0, this.seg);
	},
	bar: function(data) {
		//if (ew.sys.TC.nav) {ew.sys.TC.nav=0; return;}
		if (data.dy) return;
		if (data.b) {
			//this.step = 0;
			this.seg = (data.x * (this.val.up - this.val.dn) / 176) | 0;

			if (!this.tid) {
				if (ew.sys.TC.dbg) console.log("tc tid");
				this.tid = setTimeout(function(data) {
					ew.sys.buzz.nav(25);
					ew.sys.TC.follow();
				}, 1000, data);
			}
			if (this.long) {
				if (ew.sys.TC.dbg) console.log("tc long");
				this.follow()
			}
			else {
				if (ew.sys.TC.dbg) console.log("tc else");
				if (this.val.reverce) this.val.tmp = this.val.tmp - data.dx;
				else this.val.tmp = this.val.tmp + data.dx;
				let len = this.val.len || 20;
				this.step = this.val.tmp / len | 0;
				if (this.step) {
					this.val.cur = this.val.cur + this.step;
					this.val.tmp = 0;
					if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
					else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
					ew.sys.buzz.nav(15);
					ew.UI.c.tcBar(this.x < data.x ? 1 : -1, this.val.cur);
				}

			}
		}
		else {
			if (ew.sys.TC.dbg) console.log("tc data.b=0:", data);

			if (this.tid) {
				clearTimeout(this.tid);
				this.tid = 0;
			}
			this.long = 0;
			if (!this.step) {
				let side = (data.x < 88) ? -1 : 1;
				if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
				else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
				ew.UI.c.tcBar(side, this.val.cur);
			}
			this.step = 0;
			//	this.st = 1;
			ew.face.off();
			//	this.len = 20;
		}
	},
	stop: function() {
		digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
		setTimeout(() => { Bangle.touchWr(ew.pin.touch.SLP, 3); }, 100);
		return true;
	}
};
