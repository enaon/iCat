E.setFlags({ pretokenise: 1 });
ew.def.touchtype = "816";
ew.is.tpT = 0;
// 0xA5 the rock has auto sleep if 254 is 0.
ew.sys.TC = {
	x: 0,
	y: 0,
	loop: 0,
	act: { main: {}, bar: {}, titl: {} },
	val: { cur: 0, up: 0, dn: 0 },
	start: function() {
		"ram";
		digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
		if (ew.tid.TC) { clearWatch(ew.tid.TC);	ew.tid.TC = 0; }
		setTimeout(() => {
			i2c.writeTo(0x15, 236, 0); //MotionMask 7/4/1
			i2c.writeTo(0x15, 0xF5, 35); //lp scan threshold
			i2c.writeTo(0x15, 0xF6, 3); //lp scan range
			i2c.writeTo(0x15, 0xF7, 7); //lp scan freq
			i2c.writeTo(0x15, 0xF8, 50); //lp scan current
			i2c.writeTo(0x15, 0xF9, 2); //auto sleep timeout
			i2c.writeTo(0x15, 0xFA, 17); //gesture mode
			i2c.writeTo(0x15, 254, 1); //auto sleep off
			i2c.writeTo(0x15, 0);
			//print("wake");
			this.init();
		}, 200);

	},
	init: function() {
		if (ew.tid.TC) return;
		ew.tid.TC = setWatch(function(s) {
			"ram";
			//i2c.writeTo(0x15,0);
			var tp = i2c.readFrom(0x15, 7);
			if (ew.sys.TC.dbg) print("touch input:", tp);
			if (ew.face.pageCurr >= 0) {
				ew.face.off();
				if (ew.is.slide) {
					if (180 < (((tp[5] & 0x0F) << 8) | tp[6])) {
						if (!ew.sys.TC.tid) {
							ew.sys.TC.tid = setInterval(function() {
								ew.sys.TC.bar();
							}, 30);
						}
					 	if (tp[1] == 5) { 
							ew.sys.buzz.nav(ew.sys.buzz.type.ok)
					 		let side= (g.getWidth()/2 <tp[4] )?1:0;
					 		if (ew.sys.TC.val.reverce) side=1-side;
					 		side?ew.sys.TC.val.cur++:ew.sys.TC.val.cur--;
							if (ew.sys.TC.val.up < ew.sys.TC.val.cur) ew.sys.TC.val.cur = ew.sys.TC.val.up;
							else if (ew.sys.TC.val.cur < ew.sys.TC.val.dn) ew.sys.TC.val.cur = ew.sys.TC.val.dn;
							ew.UI.nav.bar( side ? 1 : -1, ew.sys.TC.val.cur );

					 	}
						if (tp[1] != 2) return;
					}
				}
				const a=tp[1];
				const  dir=['na','dn','up','next','back'];
				if (a != 5 && a!=12)
				ew.UI.nav[dir[a]]( this.x + (this.x / 10), this.y );
				else ew.UI.c.xy( tp[4], (((tp[5] & 0x0F) << 8) | tp[6]), a == 12 ? 1 : 0);
				
			}
			else if (tp[1] == 5) {
				if ((getTime() | 0) - ew.is.tpT < 1) {
					ew.sys.buzz.nav(ew.sys.buzz.type.ok)
					ew.face.go(ew.face.appCurr, 0);
				}
				else ew.is.tpT = getTime() | 0;
			}
		}, ew.pin.touch.INT, { repeat: true, edge: "falling" });
	},
	bar: function() {
		var tp = i2c.readFrom(0x15, 7);
		if (ew.is.slide && 180 < (((tp[5] & 0x0F) << 8) | tp[6])) {
			if (tp[2]) {
				if (this.st) {
					this.st = 0;
					this.x = tp[4];
					return;
				}
				if (this.x != tp[4]) {
					if (this.val.reverce) this.val.tmp = this.x > tp[4] ? this.val.tmp - (tp[4] - this.x) : this.val.tmp + (this.x - tp[4]);
					else this.val.tmp = this.x < tp[4] ? this.val.tmp + (tp[4] - this.x) : this.val.tmp - (this.x - tp[4]);
					let len = 15;
					let step = Math.round(this.val.tmp / len);
					if (0 <step && step < 3) step = 1;
					else if (-3 < step && step < 0 ) step = -1;
					else if (step) step = Math.round(step * 1.5);
					if (step) {
						if (len < this.val.tmp || this.val.tmp < -len) {
							//this.val.cur=this.val.cur+(step* (step==1||step==-1?1:Math.abs(step*2))   ); this.val.tmp=0;
							this.val.cur = this.val.cur + step;
							this.val.tmp = 0;
							if (this.val.up < this.val.cur) this.val.cur = this.val.up;
							else if (this.val.cur < this.val.dn) this.val.cur = this.val.dn;
							ew.sys.buzz.nav(15);
							ew.UI.nav.bar( this.x < tp[4] ? 1 : -1, this.val.cur );
						}
					}
					this.x = tp[4];
				}
			}
			else {
				this.x = tp[4];
				this.st = 1;
			}
		}
		else if (!ew.is.slide) {
			if (ew.sys.TC.tid) clearInterval(ew.sys.TC.tid);
			ew.sys.TC.st = 1;
			ew.sys.TC.tid = 0;
		}
	},
	stop: function() {
		"ram";
		i2c.writeTo(0x15, 254, 0); //auto sleep on
		i2c.writeTo(0x15, 0);
		return true;
	}
};
