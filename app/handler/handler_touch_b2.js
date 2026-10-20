//bangle.js 2 
ew.def.dev.touchtype = "b2";

if (global.Bangle== undefined) global.Bangle = {};

//Bangle.js 2 has no auto-standby mode. 
ew.sys.TC = {
	x: 0,
	y: 0,
	run: 0,
	tmp: 0,
	loop: 50,
	lmt: process.env.BOARD == "BANGLEJS2" ? 116 : 180,
	cent: process.env.BOARD == "BANGLEJS2" ? 88 : 120,
	tid: { nav: 0, fire: 0 ,loop : 0 },
	val: { cur: 0, up: 0, dn: 0, follow: 1 },

	init: function() {
		this.run = 1;
		Bangle.on('drag', (data) => {
			//print(data);
			// ---- slider ----
			if (ew.is.slide && this.lmt < data.y && -20 < data.dy) {
				this.bar(data);
				return;
			}

			if (this.tid.long) {
				clearTimeout(this.tid.long);
				this.tid.long = 0;
			}

			if (this.tid.fire) {
				clearInterval(this.tid.fire);
				this.tid.fire = 0;
			}

			// ---- nav - gestures & long press ----
			if (data.b && !this.nav)
				this.gest(data);

			// ---- short press ----
			if (!data.b) {
				if (!this.nav) {
					//if (ew.UI.ntid && !ew.is.UIpri && !ew.is.bar && this.lmt < data.y) {
					//if (ew.UI.ntid && ew.is.slide && this.lmt > data.y) {
					//	clearTimeout(ew.UI.ntid);
					//	ew.UI.ntid = 0;
					//	ew.UI.rtb();
					//}
					//else 
					ew.UI.c.xy(data.x, data.y, 0);
				}
				ew.face.off();
				this.nav = 0;
			}

		});
	},

	gest: function(data) {

		// ---- gestures ----
		if (data.dy <= -3) {
			ew.UI.nav.up(data.x, data.y);
			this.nav = 1;
			ew.face.off();
			return;
		}
		if (3 <= data.dy) {
			ew.UI.nav.dn(data.x, data.y);
			this.nav = 1;
			ew.face.off();
			return;
		}
		if (data.dx <= -3) {
			ew.UI.nav.next();
			this.nav = 1;
			ew.face.off();
			return;
		}
		if (3 <= data.dx) {
			ew.UI.nav.back();
			this.nav = 1;
			ew.face.off();
			return;
		}

		// ---- long press ----
		if (!this.tid.long) {
			this.tid.long = setTimeout((data) => {
				this.tid.long = 0;
				this.nav = 1;
				ew.UI.c.xy(data.x, data.y, 1);
				ew.face.off();
			}, 1000, data);
		}
		return;
	},

	move: function(data) {
		//"ram";
		this.slide = 1;
		this.long = 1;

		// ---- rapid fire mode ----
		if (this.val.fire) {
			let fire = 1;
			if (!this.tid.fire)
				this.tid.fire = setInterval(() => {
					fire++;
					this.val.cur = this.val.cur + this.side
					if (this.val.up < this.val.cur)
						this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
					else if (this.val.cur < this.val.dn)
						this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
					ew.UI.c.tcBar(this.side, this.val.cur, fire);
				}, 50, fire);

		}
		// ---- follow finger mode ----
		else {
			this.seg = this.val.dn + ((data.x - 5) * (this.val.up - this.val.dn) / 140) | 0;
			if (this.seg > this.val.up) this.seg = this.val.up;
			else if (this.seg < this.val.dn) this.seg = this.val.dn;
			this.val.cur = this.seg;
			ew.UI.c.tcBar(0, this.seg);
		}

	},

	bar: function(data) {
		//"ram";
		if (this.nav) { this.nav = 0; return; };

		// ---- finger on screen ----
		if (data.b) {

			this.side = (data.x < this.cent) ? -1 : 1;

			// ---- long mode start ----
			if (!this.tid.long && !this.long) {
				this.tid.long = setTimeout(() => {
					this.tid.long = 0;
					this.move(data);
					ew.sys.buzz.nav(25);
					ew.face.off();
				}, 1000);
			}

			// ---- long mode ----
			if (this.long) {
				this.move(data);
				return;
			}

			// ---- slide mode ----

			this.tmp += (this.val.reverce ? -data.dx : data.dx);
			let lim = (150 / (this.val.up - this.val.dn)) | 0;
			let len = this.val.len || lim < 15 ? 15 : 35 < lim ? 35 : lim;
			let step = (this.tmp / len) | 0;
			if (step) {
				this.slide = 1;
				if (this.tid.long) {
					clearTimeout(this.tid.long);
					this.tid.long = 0;
				}
				let abs = (step < 0 ? -step : step);
				this.val.cur += (abs < 3 ? step : (abs * step / 1.3) | 0);
				this.tmp = 0;
				if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
				else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
				ew.sys.buzz.nav(10);
				ew.UI.c.tcBar(step < 0?-1:1, this.val.cur);
			}

			return;
		}

		// ---- finger off screen ----
		if (this.tid.long) {
			clearTimeout(this.tid.long);
			this.tid.long = 0;
		}

		if (this.tid.fire) {
			clearInterval(this.tid.fire);
			this.tid.fire = 0;
		}

		// ---- tap mode ----
		if (!this.slide) {
			ew.sys.buzz.nav(15);
			this.val.cur = this.val.cur + this.side;
			if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
			else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
			ew.UI.c.tcBar(this.side, this.val.cur);

		}
		this.tmp = 0;
		this.slide = 0;
		this.long = 0;
		ew.face.off();
	},

	intL: function() {
		let st = 0;
		let xa;
		let ya;
		this.tid.loop = setInterval(() => {
			const tp = i2c.readFrom(0x15, 7);

			if (tp[2]) {

				if (!st) {
					xa = tp[4];
					ya = ((tp[5] & 0x0F) << 8) | tp[6];
					st = 1;
					Bangle.emit("drag", { "x": xa+(xa/10), "y": ya, "b": 1, "dx": 0, "dy": 0 });
					return;
				}
				const yb = ((tp[5] & 0x0F) << 8) | tp[6];
				if (xa != tp[4] || ya != yb) {
					Bangle.emit("drag", { "x": tp[4]+(tp[4]/10), "y": yb, "b": 1, "dx": tp[4] - xa, "dy": yb - ya });
					xa = tp[4];
					ya = yb;
				}

			}
			else if (st) {
				Bangle.emit("drag", { "x": xa+(xa/10), "y": ya, "b": 0, "dx": 0, "dy": 0 });
				st = 0;
			}

		}, this.loop);
	},

	start: function() {
		digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
		if (process.env.BOARD == "MAGIC3" && !this.tid.loop) 
			this.intL();
		if (!this.run) 
			this.init();
	},

	stop: function() {
		if (this.dbg) console.log("tc stop");

		if (this.tid.long) {
			if (this.dbg) console.log("tc stop  clear move tid");
			clearTimeout(this.tid.long);
			this.tid.long = 0;
		}

		if (this.tid.fire) {
			if (this.dbg) console.log("tc stop clear fire tid");
			clearInterval(this.tid.fire);
			this.tid.fire = 0;
		}
		
		if (this.tid.loop) {
			if (this.dbg) console.log("tc stop clear loop tid");
			clearInterval(this.tid.loop);
			this.tid.loop = 0;
		}
		
		setTimeout(() => {
			digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
			setTimeout(() => {
				if (process.env.BOARD == "MAGIC3") i2c.writeTo(0x15, ew.pin.touch.SLP, 3);
				else Bangle.touchWr(ew.pin.touch.SLP, 3);
				ew.sys.TC.nav = 0;
			}, 100);
		}, 200);
		
		return true;
	}
};
