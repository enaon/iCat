//charging notify


ew.sys.cPin = {
	start: function() {
		if (ew.tid.charge) return false; 
		ew.is.chargeTick = 0;
		ew.tid.charge = setWatch(function(s) {
			if (process.env.BOARD == "MAGIC3" ||process.env.BOARD == "ROCK")
				s.state = 1 - s.state;
			ew.is.ondc = s.state;
			ew.sys.emit('charge', s);
		}, ew.pin.CHRG, { repeat: true, debounce:100, edge: 0 });
		return true; 
	},
	stop: function() {
		if (ew.tid.charge) clearWatch(ew.tid.charge);
		ew.tid.charge=0;
		return true; 
	}

};

if (process.env.BOARD != "BANGLEJS2")
	ew.sys.cPin.start();
else{
	Bangle.on('charging', function(charger) {
		//print(charging);
		let s={};
		let r=D25.read();
		if(charger) {
			s.state=r?false:true;
			s.full=r;
		}else{
			s.state=false;
			s.full=false;
		}
		ew.is.ondc=s.state;
		ew.sys.emit('charge', s);
		let hexString = ("0x" + (0x50000700 + (D25 * 4)).toString(16));
		poke32(hexString, 2);
		
	});
}

if (process.env.BOARD == "DSD6") {
	ew.sys.on('charge', (s) => {
		//"ram";
		ew.is.chargeTick++;
		if (ew.tid.chargeDelay) clearTimeout(ew.tid.chargeDelay);
		ew.tid.chargeDelay = setTimeout((s) => {
			ew.is.chargeTick = 0;
			ew.tid.chargeDelay = 0;
		}, 1000, s.state);
		if (3 < ew.is.chargeTick && s.state && ew.tid.chargeDelay) {
			clearTimeout(ew.tid.chargeDelay);
			ew.tid.chargeDelay = 0;
		}
	});
}
else {
	ew.sys.on('charge', (s) => {
		//print("s",s);
	    ew.sys.buzz.sys(s.state?200:[100, 80, 100]);
		if (ew.face.appCurr==ew.def.face.main ) ew.face[0].init();
	    ew.UI.ele.fill("_bar",6,0);
		ew.UI.btn.ntfy(1, 4, 0, "_bar", 6, s.full?"FULL":s.state?"CHARGING ON":"CHARGING OFF", s.full?"BATTERY":ew.sys.batt(0)+"V",  s.full?0:15, s.full?15:s.state?4:13);
	});

}

