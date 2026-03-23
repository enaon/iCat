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
	Bangle.on('charging', function(charging) {
		//print(charging);
		ew.is.ondc=charging;
		let s={state:charging};
		ew.sys.emit('charge', s);
	});
}

if (process.env.BOARD == "DSD6") {
	ew.sys.on('charge', (s) => {
		"ram";
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
	    ew.sys.buzz.nav(s.state?200:[100, 80, 100]);
	    ew.UI.ele.fill("_bar",6,0)
	    ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, s.state?"CHARGING ON":"CHARGING OFF", ew.sys.batt(0)+"V", 15, s.state?4:1);
	});

}
