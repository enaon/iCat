//charging notify


ew.sys.cPin = {
	start: function() {
		if (ew.tid.charge) return false; 
		ew.is.chargeTick = 0;
		ew.tid.charge = setWatch(function(s) {
			if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "BANGLEJS2" || process.env.BOARD == "ROCK")
				s.state = 1 - s.state;
			ew.is.ondc = s.state;
			ew.sys.emit('charge', s);
		}, ew.pin.CHRG, { repeat: true, debounce:100, edge: 0 });
		return true; 
	},
	stop: function() {
		if (ew.tid.charge) clearWatch(ew.tid.charge)
		ew.tid.charge=0;
		return true; 
	}

}

ew.sys.cPin.start();

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
	    if (ew.tid.time) {clearTimeout(ew.tid.time);ew.tid.time=0;}
		ew.face.go("charge",0,s);
	});

}
