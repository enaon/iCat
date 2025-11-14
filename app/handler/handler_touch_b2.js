//bangle.js 2 
ew.def.dev.touchtype = "b2";
//Bangle.js 2 has no auto-standby mode. 
ew.sys.TC = {
	x: 0,
	y: 0,
	run: 0,
	tid: { nav: 0, fire: 0 },
	val: { cur: 0, up: 0, dn: 0, follow: 1 },
	start: function() {
		//Bangle.setLCDPower(1);
		//Bangle.setOptions({lockTimeout:0})
		digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
		if (!this.run) this.init();
	},
	init: function() {
		this.run = 1;
		Bangle.on('drag', (data) => {
			if (1 < this.dbg) console.log("tc drag data:", data);
			if (this.dbg) console.log("tc start",this.nav);
			// ---- slider ----
			if (ew.is.slide && 116 < data.y) this.bar(data);

			// ---- nav ----
			else if (data.b && !this.nav) {
				if (this.dbg) console.log("tc drag nav:", data);

				if (this.tid.fire) {
					if (this.dbg) console.log("tc bar clear fire tid");
					clearInterval(this.tid.fire);
					this.tid.fire = 0;
					this.long = 0
				}

				// ---- gestures ----
				if (data.dy <= -3) {
					ew.UI.nav.up(data.x, data.y);
					this.nav = 1;
					ew.face.off();
				}
				else if (3 <= data.dy) {
					ew.UI.nav.dn();
					this.nav = 1;
					ew.face.off();
				}
				else if (data.dx <= -3) {
					ew.UI.nav.next();
					this.nav = 1;
					ew.face.off();
				}
				else if (3 <= data.dx) {
					ew.UI.nav.back();
					this.nav = 1;
					ew.face.off();
				}

				// ---- long press ----
				else if (!this.tid.nav) {
					if (this.dbg) console.log("tc nav long:", data);

					this.tid.nav = setTimeout((data) => {
						this.tid.nav=0;
						if (this.dbg) console.log("tc nav long fire:", data);
						this.nav = 1;
						ew.UI.c.xy(data.x, data.y, 1);
					}, 1000, data);
				}
			}

			// ---- short press ----
			else if (!data.b) {
				if (this.tid.nav) {
					if (this.dbg) console.log("tc nav long clear:", data);
					clearTimeout(this.tid.nav);
					this.tid.nav = 0;
				}

				if (!this.nav) {
					if (this.dbg) console.log("tc nav short fire:", data);
					if (ew.UI.ntid && !ew.is.UIpri && !ew.is.bar ) {
	        			clearTimeout(ew.UI.ntid);
	        			ew.UI.ntid = 0;
	        			ew.UI.rtb();
					}
					else ew.UI.c.xy(data.x, data.y, 0);
				}
				this.nav = 0;
			}
		});
	},
	move: function(data) {
		"ram";
		this.step = 1;
		this.long = 1;

		// ---- rapid fire mode ----
		if (this.val.fire) {
			if (this.dbg) console.log("tc: move fire mode");
			let fire = 1;
			if (!this.tid.fire) this.tid.fire = setInterval(() => {
				fire++;
				this.val.cur = this.val.cur + this.side
				if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
				else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
				ew.UI.c.tcBar(this.side, this.val.cur, fire);

			}, 50, fire);

		// ---- follow finger mode ----
		}
		else {
			if (this.dbg) console.log("tc: move follow mode");
			if (this.seg > this.val.up) this.seg = this.val.up;
			else if (this.seg < this.val.dn) this.seg = this.val.dn;
			this.val.cur = this.seg;
			ew.UI.c.tcBar(0, this.seg);
		}

	},
	bar: function(data) {
		"ram";
		if (data.dy) return;

		// ---- finger on screen ----
		if (data.b) {
			this.seg = this.val.dn + ((data.x - 5) * (this.val.up - this.val.dn) / 140) | 0;

			//this.seg = this.val.dn + (data.x * (this.val.up - this.val.dn) / 176) | 0;
			//this.seg = (data.x * (this.val.up - this.val.dn) / 176) | 0;
			this.side = (data.x < 88) ? -1 : 1;

			// ---- long mode start ----
			if (!this.tid.nav) {
				if (this.dbg) console.log("tc: bar tid");
				this.tid.nav = setTimeout(() => {
					ew.sys.buzz.nav(25);
					this.move();
				}, 1000, data);
			}

			// ---- long mode ----
			if (this.long) {
				if (this.dbg) console.log("tc: bar long");
				this.move();
			}

			// ---- slide mode ----
			else {

				if (this.dbg) console.log("tc: bar else");
				if (this.val.reverce) this.val.tmp = this.val.tmp - data.dx;
				else this.val.tmp = this.val.tmp + data.dx;
				let len = this.val.len || 20;
				this.step = this.val.tmp / len | 0;
				if (this.step) {
					if (this.tid.nav) {
						if (this.dbg) console.log("tc bar clear move tid");
						clearTimeout(this.tid.nav);
						this.tid.nav = 0;
					}
					if (this.dbg) console.log("tc: bar step", this.step);
					this.val.cur = this.val.cur + this.step;
					this.val.tmp = 0;
					if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
					else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
					ew.sys.buzz.nav(15);
					ew.UI.c.tcBar(this.side, this.val.cur);
				}
			}
		}

		// ---- finger off screen ----
		else {
			if (this.dbg) console.log("tc data.b=0:", data);

			if (this.tid.nav) {
				if (this.dbg) console.log("tc bar clear move tid");
				clearTimeout(this.tid.nav);
				this.tid.nav = 0;
			}

			if (this.tid.fire) {
				if (this.dbg) console.log("tc bar clear fire tid");
				clearInterval(this.tid.fire);
				this.tid.fire = 0;
			}

			this.long = 0;

			// ---- tap mode ----
			if (!this.step) {
				this.val.cur = this.val.cur + this.side;
				if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
				else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
				ew.UI.c.tcBar(this.side, this.val.cur);
			}
			this.step = 0;
			ew.face.off();
		}
	},
	stop: function() {
		if (this.dbg) console.log("tc stop");

		if (this.tid.nav) {
			if (this.dbg) console.log("tc stop  clear move tid");
			clearTimeout(this.tid.nav);
			this.tid.nav = 0;
		}

		if (this.tid.fire) {
			if (this.dbg) console.log("tc stop clear fire tid");
			clearInterval(this.tid.fire);
			this.tid.fire = 0;
		}
		setTimeout(()=>{
			digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
			setTimeout(() => { Bangle.touchWr(ew.pin.touch.SLP, 3); ew.sys.TC.nav = 0; }, 100);
		},200);
		return true;
	}
};
