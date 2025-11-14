// ---- time ----



if (process.env.BOARD == "DSD6") {
	ew.sys.dcV = function(i) {
		let v = 6.61207596594 * analogRead(ew.pin.CHRG);
		//poke32(0x50000700 + ew.pin.BAT * 4, 2);
		let hexString = ("0x" + (0x50000700 + (ew.pin.CHRG * 4)).toString(16));
		poke32(hexString, 2); // disconnect pin for power saving, otherwise it draws 70uA more	
		//poke32(0x50000708, 2); // disconnect pin for power saving, otherwise it draws 70uA more
		if (i) return Math.round((v * 100 - 330) * (100 / (420 - 330)));
		else return Number(v.toFixed(2));
	};
}


if (process.env.BOARD == "NANO") {
	ew.sys.batt = function(i, c) {
		let l = 3.5,
			h = 4.15;
		let v = E.getVDDH();
		let per = (100 * (v - l) / (h - l) | 0);
		if (i === "info" && !g.isOn) ew.is.batS = (c ? per : (v <= l) ? 0 : (h <= v) ? 100 : per);
		if (per <= 0) {
			ew.is.lowBattery = 1;
			ew.sys.emit('battery', 'low');
		}
		if (10 <= per && ew.is.lowBattery) {
			ew.is.lowBattery = 0;
			ew.sys.emit('battery', 'ok');
		}
		if (i === "info") {
			return {
				"volt": v.toFixed(2),
				"percent": c ? per : ((v <= l) ? 0 : (h <= v) ? 100 : per),
				"low": l,
				"hi": h
			};
		}
		else if (i) {
			return (c ? per : (v <= l) ? 0 : (h <= v) ? 100 : per);
		}
		else return +v.toFixed(2);
	};
}
else {
	ew.sys.batt = function(i, c) {
		let v = (process.env.BOARD == "BANGLEJS2") ?
			13.245 * analogRead(ew.pin.BAT)
			:4.20 / 0.60 * analogRead(ew.pin.BAT);
		let l = 3.5,
			h = 4.15;
		let hexString = ("0x" + (0x50000700 + (ew.pin.BAT * 4)).toString(16));
		poke32(hexString, 2); // disconnect pin for power saving, otherwise it draws 70uA more 	
		let per = (100 * (v - l) / (h - l) | 0);
		// stable battery indicator support 
		if (i === "info" && !g.isOn) ew.is.batS = (c ? per : (v <= l) ? 0 : (h <= v) ? 100 : per);
		if (per <= 0) {
			ew.is.lowBattery = 1;
			ew.sys.emit('battery', 'low');
		}
		if (10 <= per && ew.is.lowBattery) {
			ew.is.lowBattery = 0;
			ew.sys.emit('battery', 'ok');
		}
		if (i === "info") {
			return {
				"volt": v.toFixed(2),
				"percent": c ? per : ((v <= l) ? 0 : (h <= v) ? 100 : per),
				"low": l,
				"hi": h
			};
		}
		else if (i) {
			return (c ? per : (v <= l) ? 0 : (h <= v) ? 100 : per);
		}
		else return +v.toFixed(2);
	};
	ew.sys.on('hour', function() { ew.sys.batt("info"); });

}
