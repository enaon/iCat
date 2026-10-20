ew.def.dev.touchtype = "716";
ew.sys.TC = {
	dbg: 0,
	tid: 0,
	tim: 0,
	tmp:0,
	x: 0,
	y: 0,
	do: 0,
	st: 1,
	bt: 1,
	rp: 0,
	loop: 25,
	val: { cur: 0, up: 0, dn: 0 },
	slide: function(tp) {
		//"jit";

		this.bt = 0;
		this.rp = 0;
		let dx =  (this.x < tp[4] ? (tp[4] - this.x) : - (this.x - tp[4]));
		this.tmp += (this.val.reverce?-dx:dx);

		let lim = (150 / (this.val.up - this.val.dn)) | 0;
		let len = this.val.len || lim < 15 ? 15: 35 < lim ? 35 : lim;
		let step = (this.tmp / len) | 0;

		if (step) {
			let abs = (step < 0 ? -step : step);
			this.val.cur += (abs < 3 ? step : (abs * step / 1.3) | 0);
			this.tmp = 0;
			if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
			else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
			ew.sys.buzz.nav(10);
			ew.UI.c.tcBar(this.x < tp[4] ? 1 : -1, this.val.cur);
		}
		this.x = tp[4];
	},
	fire: function(tp) {
		//"jit";
		this.rp++;
		ew.sys.buzz.nav(10);
		this.bt = 0;
		let side = (g.getWidth() / 2 < tp[4]) ? 1 : 0;
		if (this.val.reverce) side = 1 - side;
		side ? this.val.cur++ : this.val.cur--;
		if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
		else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
		ew.UI.c.tcBar(side ? 1 : -1, this.val.cur, this.rp);

	},
	tap: function(tp) {
		//"jit";
		this.tmp = 0;
		this.bt = 0;
		ew.sys.buzz.nav(10)
		let side = (g.getWidth() / 2 < tp[4]) ? 1 : 0;
		if (this.val.reverce) side = 1 - side;
		side ? this.val.cur++ : this.val.cur--;
		if (this.val.up < this.val.cur) this.val.cur = (this.val.loop) ? this.val.dn : this.val.up;
		else if (this.val.cur < this.val.dn) this.val.cur = (this.val.loop) ? this.val.up : this.val.dn;
		//ew.UI.c.tcBar(side ? 1 : -1, this.val.cur);
		setTimeout(()=>{ew.UI.c.tcBar(side ? 1 : -1, this.val.cur);},5);

	},
	nav: function(tp) {
		//"jit";
		if (tp[3] === 0 || tp[3] === 128) {
			if (this.dbg) print("TC dbg: touch input in main:", tp);
			if (tp[2] == 1 && this.st) {
				//print("start",this.do,this.st, tp)
				this.st = 0;
				this.do = 1;
				this.aLast = -1;
				//this.x = ((tp[3] & 0x0F) << 8) | tp[4];
				this.x = tp[4];
				this.y = ((tp[5] & 0x0F) << 8) | tp[6];
				this.time = getTime();
				return;
			}
			if (this.do && getTime() - this.time > 1 && tp[2] == 1) {
				//print("hold",this.do,this.st, tp)
				this.do = 0;
				ew.UI.c.xy(this.x + (this.x / 10), this.y, 1);
				ew.face.off();
			}
			else if (this.do && tp[2] == 1) {
				var a = 0;
				if ((((tp[5] & 0x0F) << 8) | tp[6]) >= this.y + 30) a = 1;
				else if ((((tp[5] & 0x0F) << 8) | tp[6]) <= this.y - 30) a = 2;
				else if ( tp[4] <= this.x - 20) a = 3;
				else if ( tp[4] >= this.x + 20) a = 4;				
				if (a != 0 && this.aLast != a) {
					if (this.dbg) console.log("TC dbg: in main, gesture:", a);
					this.aLast = a;
					this.do = 0;
					//this.st=0;
					ew.face.off();
					const dir = ['na', 'dn', 'up', 'next', 'back'];
					ew.UI.nav[dir[a]](this.x + (this.x / 10), this.y);
				}
				return;
			}
		}
		else if (tp[3] == 64 && !this.st) {
			if (this.do === 1) {
				this.do = 0;
				ew.face.off();
				if (ew.UI.ntid && !ew.is.bar && (180 < (((tp[5] & 0x0F) << 8) | tp[6]))) {
					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					ew.UI.rtb();
					return;
				}
				ew.UI.c.xy(this.x + (this.x / 10), this.y);
			}
			this.aLast = 0;
			this.st = 1;
			this.time = 0;
		}
	},
	init: function() {
		//"jit";
		var tp = i2c.readFrom(0x15, 7);
		if (tp == Uint8Array(7) || (tp[3] == 64 && this.st)) return;
		if (2 < this.dbg) console.log("TC dbg: tp,this.st :", tp, this.st);

		if (ew.is.slide) {
			if (180 < (((tp[5] & 0x0F) << 8) | tp[6])) {
				if (this.dbg) print("TC dbg: touch input in bar:", tp);

				if (tp[2]) {

					if (this.st) {
						this.st = 0;
						this.y = ((tp[5] & 0x0F) << 8) | tp[6];
						this.x = tp[4];
						return;
					}
					if (this.x != tp[4]) {
						if (this.tim) {
							clearTimeout(this.tim);
							this.tim = 0
						};
						this.slide(tp);
					}
					else {
						this.bt = 1;
						if (this.val.fire) {
							if (!this.tim && !this.rp)
								this.tim = setTimeout(() => {
									this.rp = 1;
									this.tim = 0;
								}, 300)
							if (this.rp)
								this.fire(tp)
						}
					}
				}
				else {
					this.st = 1;
					this.rp = 0;
					if (this.tim) {
						clearTimeout(this.tim);
						this.tim = 0
					};
					if (this.bt)
						this.tap(tp);

					//ew.face.off();
				}
				if (this.dbg) console.log("TC dbg: in bar return, tp:", tp);

				return;
			} 
		}
		else if (this.do) this.st = 0;

		this.nav(tp);
	},
	start: function() {
		//	"ram";
		if (this.tid) clearInterval(this.tid);
		digitalPulse(ew.pin.touch.RST, 1, [10, 100]); //touch wake
		i2c.writeTo(0x15, 0);
		this.st = 1;
		this.tid = setInterval(function() {
			ew.sys.TC.init();
		}, this.loop);
	},
	stop: function() {
		//"ram";
		if (this.tid) clearInterval(this.tid);
		this.tid = 0;
		digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
		setTimeout(() => { i2c.writeTo(0x15, ew.pin.touch.SLP, 3); }, 100);
		this.aLast = 0;
		this.st = 1;
		this.time = 0;
	}
};
