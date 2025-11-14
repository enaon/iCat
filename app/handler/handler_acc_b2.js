//bangle JS2 acc handler 
ew.def.dev.acctype = "b2";

ew.sys.acc = {
	state: 0,
	tap:{t1:0,t2:0,t4:0,t8:0,t16:0,t32:0},
	tid:0,
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
		Bangle.accelWr(0x7f, 0x00);
		Bangle.accelWr(0x19, 0x00);
		Bangle.accelWr(0x19, 0x80);


		// ---- tilt  low current ----			
		if (i === 1) {
			Bangle.accelWr(0x18, 0x01); //standby mode-low current-int1-tilt
			Bangle.accelWr(0x22, 0x01); //tilt state timer (0 to 255 counts)
			Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			//Bangle.accelWr(0x32,0x0C); //22 degrees -default value 
			//Bangle.accelWr(0x32,0x03); //6 degrees
			Bangle.accelWr(0x32, 0x08); //14.5 degrees
			Bangle.accelWr(0x33,0x2A);//TILT_ANGLE_HL -default value 
			//Bangle.accelWr(0x33, 0x1E); //TILT_ANGLE_HL
			Bangle.accelWr(0x1f, 0x01); //tilt report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x18, 0x81); //opp mode-low current-int1-tilt
		}
		
		// ---- tap  low curent----			
		else if (i === 2) {
			//Bangle.accelWr(0x18, 0x04); //standby mode-low current-int1-2g-tap
			Bangle.accelWr(0x18, 0x0C); //standby mode-low current-int1-4g-tap
			//Bangle.accelWr(0x18, 0x1C); //standby mode-low current-int1-8g-tap
			Bangle.accelWr(0x1f, 0x04); //tap report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			 Bangle.accelWr(0x2A, 0x00); // TLT = 0 (no delay)
			Bangle.accelWr(0x2B, 0x08); // TWS = 40ms (small window)
			//Bangle.accelWr(0x24, 0x03); //enable tap/double tap reporting
			Bangle.accelWr(0x24, 0x01); //enable only tap reporting
			//Bangle.accelWr(0x18, 0x84); //opp mode-low current-int1-2g-tap
			Bangle.accelWr(0x18, 0x8C); //opp mode-low current-int1-4g-tap
			//Bangle.accelWr(0x18, 0x9C); //opp mode-low current-int1-8g-tap

		}
		// ---- tilt & tap  low curent ----
		else if (i ===3) {
			//Bangle.accelWr(0x18, 0x05); //standby mode-low current-int1-tilt-2g
			Bangle.accelWr(0x18, 0x0D); //standby mode-low current-int1-tilt-4g
			//Bangle.accelWr(0x18, 0x0D); //standby mode-low current-int1-tilt-8g
			Bangle.accelWr(0x22, 0x01); //tilt state timer (0 to 255 counts)
			Bangle.accelWr(0x19, 0x08); //tilt axis mask 
			//Bangle.accelWr(0x32,0x0C); //22 degrees -default value 
			//Bangle.accelWr(0x32,0x03); //6 degrees
			Bangle.accelWr(0x32, 0x08); //14.5 degrees
			Bangle.accelWr(0x33,0x2A);//TILT_ANGLE_HL -default value 
			//Bangle.accelWr(0x33, 0x1E); //TILT_ANGLE_HL
			Bangle.accelWr(0x2A, 0x00); // TLT = 0 (no delay)
			Bangle.accelWr(0x2B, 0x08); // TWS = 40ms (small window)
			Bangle.accelWr(0x1f, 0x05); //tilt -tap report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			//Bangle.accelWr(0x18, 0x85); //opp mode-low current-int1-tilt-2g
			Bangle.accelWr(0x18, 0x8D); //opp mode-low current-int1-tilt-4g
			//Bangle.accelWr(0x18, 0x9D); //opp mode-low current-int1-tilt-8g

		}

		// ---- tilt & tap  hi curent ----
		else if (i === 4) {
			Bangle.accelWr(0x18, 0x45); //standby mode-high current-int1-2g-tap-tilt
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
			Bangle.accelWr(0x18, 0x42); //standby mode-high current-int1-2g-motion detect
			Bangle.accelWr(0x1f, 0x02); //motion report on int1
			//Bangle.accelWr(0x1f,0x06); //tap-motion report on int1
			Bangle.accelWr(0x1c, 0x30); //enable int1
			Bangle.accelWr(0x18, 0x62); //opp mode-hi current-int1-2g-motion detect
		}

		// ---- tilt  high current ----			
		else if (i === 6) {
			Bangle.accelWr(0x18, 0x41); //standby mode-high current-int1-2g-tilt
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

		ew.tid.acc = setWatch((s)=>{
			if (s.state) {
				let state = Bangle.accelRd(0x10, 4);
				if (ew.sys.acc.dbg) console.log("acc, reg state, state[2]:", state, state[2]);
				// tilt
				if (state[3] === 1) {
					if (state[0] === 8) {
						Bangle.accelWr(0x19, 0x37); //tilt axis mask - good on the DSD6
						if (!g.isOn) {
							ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
						}
						else ew.face.off();
						//ew.sys.emit("acc", "face", 1);
					}
					else {

						Bangle.accelWr(0x19, 0x08); //tilt axis mask - good on the DSD6
						let tout = ew.def.face.off[ew.face.appCurr];
						if (!tout || (tout && tout <= 60000))
							ew.face.off(1500);
						//ew.sys.emit("acc", "face", 0);
					}
				}
				// tap
				else {
					// single
					if (state[3] === 4 ) {
						let dir= state[2];
						if (!this.tid) {
        					this.tid=setTimeout(()=>{
        						this.tid=0;
								
        						this.tap={t1:0,t2:0,t4:0,t8:0,t16:0,t32:0};
        					},300);
    					}
						if (ew.sys.acc.dbg) console.log("acc, this.tap:",this.tap);
    					this.tap["t"+dir] ++;
    					if (dir === 32 || dir === 1 || dir === 4 )  this.tap={t1:0,t2:0,t4:0,t8:0,t16:0,t32:0};
    					else if (!g.isOn && this.tap.t2===2 || this.tap.t8===2 || (this.tap.t2===1 && this.tap.t8===1) ) ew.face.go(ew.face.appCurr,0, ew.face.pageArg);
						else if (this.tap.t16===2) ew.sys.emit("button","long");
						//ew.sys.emit("tap", state[2]);
					}
					// double
					else if (state[3] === 8 && state[2] == 2){
						if (ew.sys.acc.dbg) console.log("acc, double tap:"+state);
						if (!g.isOn) {
							ew.face.go(ew.face.appCurr, 0, ew.face.pageArg);
						}else ew.face.off();
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
		Bangle.accelWr(0x7f, 0x00);
		Bangle.accelWr(0x18, 0x00);
		Bangle.accelWr(0x19, 0x00);
		Bangle.accelWr(0x19, 0x80);
		//		Bangle.accelWr(0x1A,0x00); //cntrl3 slow
	},
	updt: function(mode) {
			if (ew.def.dev.acc) 
				ew.sys.acc.start(mode);
			else 
				ew.sys.acc.stop();
	}
};



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
