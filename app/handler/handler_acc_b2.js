//bangle JS2 acc handler 
/*

var c = Bangle.accelRd(0x18); // CNTL1
Bangle.accelWr(0x18, c &~0x80);
Bangle.accelWr(0x19, 0x08);
//Bangle.accelWr(0x19, 0xc3);
Bangle.accelWr(0x18, c);


*/
ew.def.dev.acctype = "b2";

ew.sys.acc = {
	state: 0,
	tap: { t1: 0, t2: 0, t4: 0, t8: 0, t16: 0, t32: 0 },
	tid: 0,
	regDump: function(reg) {
		val = Bangle.accelRd(reg, 1)[0];
		return val.toString(10) + " 0x" + val.toString(16) + " %" + val.toString(2);
	},
	coords: function() {
		coords = new Int16Array(Bangle.accelRd(0x06, 8).buffer);
		return { x: coords[0], y: coords[1], z: coords[2] };
	},
	start: function(i) {
		if (!i) {
			this.stop();
			return;
		}
		if (ew.tid.acc) {
			clearWatch(ew.tid.acc);
			ew.tid.acc = 0;
		}
		Bangle.accelWr(0x18, 0x0a); // CNTL1 Off (top bit)
		//Bangle.accelWr(0x19, 0x80); // CNTL2 Software reset
		Bangle.accelWr(0x1a, 0x98); // CNTL3 12.5Hz tilt, 400Hz tap, 0.781Hz motion detection
		Bangle.accelWr(0x1b, 0x00); // ODCNTL - 12.5Hz acceleration output data rate, filtering low-pass ODR/9

		Bangle.accelWr(0x1c, 0); // INC1 disabled
		Bangle.accelWr(0x1d, 0); // INC2 disabled
		//Bangle.accelWr(0x1e,0); // INC3 disabled
		Bangle.accelWr(0x1f, 0); // INC4 disabled
		Bangle.accelWr(0x20, 0); // INC5 disabled
		Bangle.accelWr(0x21, 0); // INC6 disabled

		Bangle.accelWr(0x23, 3); // WUFC wakeupi detect counter
		Bangle.accelWr(0x27, 0x1A); // restore TTL to def 

		Bangle.accelWr(0x30, 0x01); // ATH low wakeup detect threshold
		Bangle.accelWr(0x35, 0x2b); // LP_CNTL 4x averaging of samples reserved ok
		//Bangle.accelWr(0x3e, 0x00); // clear the buffer		

		// ---- tilt  low current ----			
		if (i === 1) {
			//Bangle.accelWr(0x18, 0x01); //standby mode-low current-int1-tilt
			Bangle.accelWr(0x22, 0x01); //tilt state timer (0 to 255 counts)
			Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			//Bangle.accelWr(0x32,0x0C); //22 degrees -default value 
			//Bangle.accelWr(0x32,0x03); //6 degrees
			Bangle.accelWr(0x32, 0x08); //14.5 degrees
			Bangle.accelWr(0x33, 0x2A); //TILT_ANGLE_HL -default value 
			//Bangle.accelWr(0x33, 0x1E); //TILT_ANGLE_HL
			Bangle.accelWr(0x1f, 0x01); //tilt report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x18, 0x81); //opp mode-low current-int1-tilt
		}

		// ---- tap  low curent----			
		else if (i === 2) {
			//Bangle.accelWr(0x18, 0x04); //standby mode-low current-int1-2g-tap
			//Bangle.accelWr(0x18, 0x0C); //standby mode-low current-int1-4g-tap
			//Bangle.accelWr(0x18, 0x1C); //standby mode-low current-int1-8g-tap
			Bangle.accelWr(0x1f, 0x04); //tap report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x2A, 0x00); // TLT = 0 (no delay)
			Bangle.accelWr(0x2B, 0x14); // TWS = 40ms (small window)
			//Bangle.accelWr(0x24, 0x03); //enable tap/double tap reporting
			Bangle.accelWr(0x24, 0x01); //enable only tap reporting
			//Bangle.accelWr(0x18, 0x84); //opp mode-low current-int1-2g-tap
			Bangle.accelWr(0x18, 0x8C); //opp mode-low current-int1-4g-tap
			//Bangle.accelWr(0x18, 0x9C); //opp mode-low current-int1-8g-tap

		}
		// ---- tilt & tap  low curent ----
		else if (i === 3) {
			//Bangle.accelWr(0x18, 0x05); //standby mode-low current-int1-tilt-2g
			//Bangle.accelWr(0x18, 0x0D); //standby mode-low current-int1-tilt-4g
			//Bangle.accelWr(0x18, 0x0D); //standby mode-low current-int1-tilt-8g
			Bangle.accelWr(0x22, 0x01); //tilt state timer (0 to 255 counts)
			//Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			Bangle.accelWr(0x19, 0x3f); //tilt axis mask 0x3f
			//Bangle.accelWr(0x32,0x0C); //22 degrees -default value 
			//Bangle.accelWr(0x32,0x03); //6 degrees
			Bangle.accelWr(0x32, 0x08); //14.5 degrees
			Bangle.accelWr(0x33, 0x2A); //TILT_ANGLE_HL -default value 
			//Bangle.accelWr(0x33, 0x1E); //TILT_ANGLE_HL
			Bangle.accelWr(0x2A, 0x00); // TLT = 0 (no delay)
			Bangle.accelWr(0x2B, 0x14); // TWS = 40ms (small window)
			Bangle.accelWr(0x1f, 0x05); //tilt -tap report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			//Bangle.accelWr(0x18, 0x85); //opp mode-low current-int1-tilt-2g
			//Bangle.accelWr(0x18, 0xAD); //opp mode-low current-int1-tilt-4g
			//Bangle.accelWr(0x18, 0x9D); //opp mode-low current-int1-tilt-8g
			Bangle.accelWr(0x18, 0x81); //opp mode-low current-int1-tilt

		}

		// ---- banglejs2 orig ----
		else if (i === "bangle") {
			Bangle.accelWr(0x22, 0x00); //tilt state timer (0 to 255 counts)
			Bangle.accelWr(0x19, 0x3f); //tilt axis mask 
			//Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			//Bangle.accelWr(0x32, 0x0C); //22 degrees
			//Bangle.accelWr(0x33, 0x2A); //TILT_ANGLE_HL -default value 
			Bangle.accelWr(0x27, 0x1A); // restore TTL to def 
			Bangle.accelWr(0x2A, 0x00); //28 // TLT = 0 (no delay)
			Bangle.accelWr(0x2B, 0x14); // A0 TWS = 40ms (small window)			
			Bangle.accelWr(0x18, 0xad); //opp mode-low current-4g-tap-enable
			return "bangle";
		}

		// ---- tilt & tap  hi curent ----
		else if (i === 4) {
			//Bangle.accelWr(0x18, 0x45); //standby mode-high current-int1-2g-tap-tilt
			Bangle.accelWr(0x22, 0x01); //tilt state timer (0 to 255 counts)
			Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			Bangle.accelWr(0x32, 0x0C); //22 degrees
			//Bangle.accelWr(0x32,0x03); //6 degrees
			Bangle.accelWr(0x1f, 0x05); //tap-tilt report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x18, 0xC5); //opp mode-high current-int1-2g-tap-tilt-enable
		}

		// ----  moton detect high current  ----
		else if (i === 5) {
			//Bangle.accelWr(0x18, 0x42); //standby mode-high current-int1-2g-motion detect
			Bangle.accelWr(0x1f, 0x02); //motion report on int1
			//Bangle.accelWr(0x1f,0x06); //tap-motion report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x18, 0x62); //opp mode-hi current-int1-2g-motion detect
		}

		// ---- tilt  high current ----			
		else if (i === 6) {
			//Bangle.accelWr(0x18, 0x41); //standby mode-high current-int1-2g-tilt
			Bangle.accelWr(0x22, 0x01); //tilt state timer (0 to 255 counts)
			Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			Bangle.accelWr(0x32, 0x0C); //22 degrees
			//Bangle.accelWr(0x32,0x03); //6 degrees
			Bangle.accelWr(0x1f, 0x01); //tilt report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x18, 0xC1); //opp mode-high current-int1-2g-tilt
		}
		this.state = i ? i : 6;
		if (ew.sys.acc.dbg) console.log("acc, this.state:", this.state);

		ew.tid.acc = setWatch((s) => {
			//if (this.dbg)
				if (s.state) {
					let state = Bangle.accelRd(0x10, 4);
					if (ew.sys.acc.dbg) console.log("acc, reg state, state[2]:", state, state[2]);
					// tilt
					if (state[3] === 1) {
						if (!ew.def.dev.tilt || !ew.face[0]) return;
						if (state[0] === 8) {
							Bangle.accelWr(0x19, 0x37); //tilt axis mask - banglejs2
							if (!g.isOn) {
								if (ew.def.dev.bl) g.bri.set(ew.def.face.bri);
								ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
							}
							else ew.face.off();
							//ew.sys.emit("acc", "face", 1);
						}
						else {

							Bangle.accelWr(0x19, 0x08); //tilt axis mask - banglejs2
							let tout = ew.def.face.off[ew.face.appCurr];
							if (!tout || (tout && tout <= 60000))
								ew.face.off(1500);
							//ew.sys.emit("acc", "face", 0);
						}
					}
					// tap
					else {
						if (!ew.def.dev.tap || !ew.face[0]) return;
						// single
						if (state[3] === 4) {
							let dir = state[2];
							if (!this.tid) {
								this.tid = setTimeout(() => {
									this.tid = 0;

									this.tap = { t1: 0, t2: 0, t4: 0, t8: 0, t16: 0, t32: 0 };
								}, 300);
							}
							if (ew.sys.acc.dbg) console.log("acc, this.tap:", this.tap);
							this.tap["t" + dir]++;
							if (dir === 32 || dir === 1 || dir === 4) this.tap = { t1: 0, t2: 0, t4: 0, t8: 0, t16: 0, t32: 0 };
							else if (!g.isOn && this.tap.t2 === 2 || this.tap.t8 === 2 || (this.tap.t2 === 1 && this.tap.t8 === 1)) ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
							//else if (!ew.def.dev.bl && process.env.BOARD == "BANGLEJS2" ) {ew.def.dev.bl=1;g.bri.set(ew.def.face.bri);} 
							else if (ew.def.dev.ttap && this.tap.t16 === 2) ew.sys.btnL("torch");
							//ew.sys.emit("tap", state[2]);
						}
						// double
						else if (state[3] === 8 && state[2] == 2) {
							if (ew.sys.acc.dbg) console.log("acc, double tap:" + state);
							if (!g.isOn) {
								ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
							}
							else ew.face.off();
							//ew.sys.emit("tap", "double", state[2]);
						}
					}

				}
			Bangle.accelRd(0x17);
			//if (ew.sys.acc.dbg) console.log("acc, regdump:", ew.sys.acc.regDump(0x17));
		}, ew.pin.acc.INT, { repeat: true, edge: "both" });
	},
	stop: function(app) {
		this.state = 0;

		if (ew.tid.acc) {
			clearWatch(ew.tid.acc);
			ew.tid.acc = 0;
		}
		//Bangle.accelWr(0x7f, 0x00);
		Bangle.accelWr(0x18, 0x00);
		//Bangle.accelWr(0x19, 0x00);
		Bangle.accelWr(0x19, 0x80);

	},
	updt: function(mode) {
		/*	if (ew.def.dev.acc) 
				ew.sys.acc.start(mode);
			else 
				ew.sys.acc.stop();
		*/
	}
};

//set up bangle once

Bangle.accelWr(0x18, 0x2c); //standby mode-high current-int1-2g-tap-tilt
Bangle.accelWr(0x22, 0x00); //tilt state timer (0 to 255 counts)
Bangle.accelWr(0x19, 0x3f); //tilt axis mask 
//Bangle.accelWr(0x19, 0x08); //tilt axis mask 
//Bangle.accelWr(0x32, 0x0C); //22 degrees
//Bangle.accelWr(0x33, 0x2A); //TILT_ANGLE_HL -default value 
Bangle.accelWr(0x27, 0x1A); // restore TTL to def 
Bangle.accelWr(0x2A, 0x00); //28 // TLT = 0 (no delay)
Bangle.accelWr(0x2B, 0x14); // A0 TWS = 40ms (small window)			
Bangle.accelWr(0x1f, 0x00); //tap-tilt report on int1
Bangle.accelWr(0x1c, 0x00); //enable int1
//Bangle.accelWr(0x18, 0xac); //opp mode-low current-4g-tap-enable
Bangle.accelWr(0x18, 0xad);

ew.is.ttm=0;

Bangle.on('twist', function() {
	if (!ew.def.dev.tilt || !ew.face[0]) return;
	if (ew.sys.acc.dbg) console.log("acc, on twist");
	let tilt = Bangle.accelRd(0x10, 2);
	//console.log("twist :", tilt);



	if (tilt[1] === 32 || tilt[1] === 16 || (tilt[0] != 8 && tilt[0] != 1)) {
		if (tilt[0] === 32 && tilt[1] === 4 && ew.apps.torch && ew.apps.torch.state.def.led && ew.apps.torch.state.def.twst) {
			if (1 < (getTime() |0) - ew.is.ttm){
				ew.is.ttm=getTime() |0;
				ew.is.torch=ew.apps.torch.tgl();
				//console.log("torch act");
				return;
			}
			//console.log("torch ign");
			return;
		}
		//console.log("exit");
		return;
	}

	//Bangle.accelWr(0x19, 0x37);
	if (!g.isOn) {
		if (ew.def.dev.bl) g.bri.set(ew.def.face.bri);
		ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
	}
	else ew.face.off();


});

Bangle.on('faceUp', function(up) {
	if (!ew.def.dev.tilt || !ew.face[0]) return;
	if (ew.sys.acc.dbg) console.log("acc, on faceUp:", up);
	if (up) {
		return;
		if (!g.isOn) {
			if (ew.def.dev.bl) g.bri.set(ew.def.face.bri);
			ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
		}
		else ew.face.off();
	}
	else {
		let tilt = Bangle.accelRd(0x10);
		if (tilt === 8) { ew.face.off(); return; }
		let tout = ew.def.face.off[ew.face.appCurr];
		if (!tout || (tout && tout <= 60000))
			ew.face.off(1500);
	}

});


Bangle.on('tap', function(data) {
	if (!ew.def.dev.tap) return;

	let dir = data.dir;
	if (!ew.sys.acc.tid) {
		ew.sys.acc.tid = setTimeout(() => {
			ew.sys.acc.tid = 0;
			ew.sys.acc.tap = { "front": 0, "back": 0, "top": 0, "bottom": 0, "left": 0, "right": 0 };
		}, 400);
	}
	if (ew.sys.acc.dbg) console.log("acc, on tap:", ew.sys.acc.tap);
	ew.sys.acc.tap[dir]++;
	if (dir === "back" || dir === "top" || dir === "left") {
		if (ew.sys.acc.tid) clearTimeout(ew.sys.acc.tid)
		ew.sys.acc.tap = { "front": 0, "back": 0, "top": 0, "bottom": 0, "left": 0, "right": 0 };
		ew.sys.acc.tid = 0;
	}
	else if (!g.isOn && ew.sys.acc.tap.front === 2 || ew.sys.acc.tap.bottom === 2 || (ew.sys.acc.tap.front === 1 && ew.sys.acc.tap.bottom === 1)) {
		if (ew.def.dev.bl) g.bri.set(ew.def.face.bri);
		ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
	}
	else if (ew.def.dev.ttap && ew.sys.acc.tap.right === 2) ew.sys.btnL("torch");
});


/*Bangle.on('tap', function(data) {
	if ( !data.double) return;

	if (ew.def.dev.tap && data.dir === "front" ) {
		if (!g.isOn) {
			g.bri.set(ew.def.face.bri);
			ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
		}
		else ew.face.off();
	}
	else if ( data.dir=="right" && ew.def.dev.ttap ) ew.sys.emit("button", "long");


});
*/
/*

test=function()={
	
		Bangle.accelWr(0x7f,0x00); 
		Bangle.accelWr(0x19,0x00); 
		Bangle.accelWr(0x19,0x80);
		
		// ---- tilt  low current ----			
		Bangle.accelWr(0x18,0x01); //standby mode-low current-int1-2g-tilt
		Bangle.accelWr(0x22,0x01); //tilt state timer (0 to 255 counts)
		Bangle.accelWr(0x19,0x08); //tilt axis mask 
		Bangle.accelWr(0x32,0x0C); //22 degrees
		//Bangle.accelWr(0x32,0x03); //6 degrees
		Bangle.accelWr(0x1f,0x01); //tilt report on int1
		Bangle.accelWr(0x1c,0x30); //enable int1
		Bangle.accelWr(0x18,0x81); //opp mode-low current-int1-2g-tilt	
	
	
	ew.tid.acc=setWatch(function(s){
    	if (s.state){
				const state=Bangle.accelRd(0x10,4);
				print(state);
				if (state[3] === 1) {
					if (state[0]===8  ) {
						Bangle.accelWr(0x19,0x37); //tilt axis mask
						console.log("screen on");	
					}else {
						Bangle.accelWr(0x19,0x08); //tilt axis mask
						console.log("screen onf");
					}
		  	}
		Bangle.accelRd(0x17);
      }
	},D39,{ repeat: true, edge: "both" });  	
};

	


*/
