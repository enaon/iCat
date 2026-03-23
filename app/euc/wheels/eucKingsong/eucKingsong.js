//Kingsong euc module

ew.apps.euc.buff=[];
ew.apps.euc.wri = (i) => { if (this.dbg) console.log("not connected yet"); if (i == "end") this.off(); return; };
ew.apps.euc.cmd = (no, val) => {
	//"ram";
	switch (no) {
		//euc.wri("getParamA");
		case "manual":
			return val;
		case "getModel":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 20, 90, 90];
		case "getSerial":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 20, 90, 90];
		case "getAlarms":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 152, 20, 90, 90];
		case "doHorn":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 20, 90, 90];
		case "doBeep":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 124, 20, 90, 90];
		case "setLiftOnOff":
			return [170, 85, val ? 1 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 126, 20, 90, 90];
			//power
		case "getPowerOff":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 20, 90, 90];
		case "setPowerOff":
			return [170, 85, 1, 0, (val & 255), ((val >> 8) & 255), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 20, 90, 90];
		case "doPowerOff":
			return [170, 85, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 20, 90, 90];
			//leds
		case "setLights":
			if (!val) val = euc.state.is.night ? 3 : 2;
			return [170, 85, 17 + val, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 20, 90, 90];
		case "getStrobe":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 20, 90, 90];
		case "setStrobeOnOff":
			return [170, 85, val ? 1 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 20, 90, 90];
		case "getLedMagic":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 20, 90, 90];
		case "setLedMagicOnOff":
			return [170, 85, val ? 1 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 20, 90, 90];
		case "getLedRide":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109, 20, 90, 90];
		case "setLedRideOnOff":
			return [170, 85, val ? 1 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 20, 90, 90];
		case "getSpectrum":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 20, 90, 90]; // to b checked
		case "setSpectrumOnOff":
			return [170, 85, val ? 1 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 20, 90, 90];
		case "getSpectrumMode":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 20, 90, 90];
		case "setSpectrumMode":
			return [170, 85, val ? val : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 151, 20, 90, 90];
			//BT music mode
		case "getBTMusic":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 20, 90, 90];
		case "setBTMusicOnOff":
			return [170, 85, val ? 1 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 20, 90, 90];
			//voice
		case "getVoice":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 74, 20, 90, 90];
		case "setVoiceOnOff":
			return [170, 85, val ? val : 0, val ? 0 : 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 20, 90, 90];
		case "setVoiceVolUp":
			return [170, 85, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 149, 20, 90, 90];
		case "setVoiceVolDn":
			return [170, 85, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 149, 20, 90, 90];
			//gyro
		case "doCalibrate":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 20, 90, 90];
		case "getCalibrateTilt":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 20, 90, 90];
		case "setCalibrateTilt":
			return [170, 85, 1, 0, val & 255, (val >> 8) & 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 20, 90, 90];
			//ride mode 0=hard,1=med,2=soft
		case "setRideMode":
			return [170, 85, val ? val : 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 135, 20, 90, 90];
		case "getRideParamA":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 146, 20, 90, 90];
		case "getRideParamB":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 147, 20, 90, 90];
		case "getRideParamC":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 148, 20, 90, 90];
			//lock
		case "doUnlock":
			return val;
		case "doLockOnce":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71, 20, 90, 90];
		case "getLockOnce":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 72, 20, 90, 90];
		case "doLock":
			return [170, 85, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 93, 20, 90, 90];
		case "getLock":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 20, 90, 90];
		case "getPass":
			return [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 20, 90, 90];
		case "setPass":
			return [170, 85, 48 + Number(euc.state.dash.opt.lock.pass[0]), 48 + Number(euc.state.dash.opt.lock.pass[1]), 48 + Number(euc.state.dash.opt.lock.pass[2]), 48 + Number(euc.state.dash.opt.lock.pass[3]), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 65, 20, 90, 90];
		case "setPassClear":
			return [170, 85, 48 + Number(euc.state.dash.opt.lock.pass[0]), 48 + Number(euc.state.dash.opt.lock.pass[1]), 48 + Number(euc.state.dash.opt.lock.pass[2]), 48 + Number(euc.state.dash.opt.lock.pass[3]), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 20, 90, 90];
		case "setPassSend":
			return [170, 85, 48 + Number(euc.state.dash.opt.lock.pass[0]), 48 + Number(euc.state.dash.opt.lock.pass[1]), 48 + Number(euc.state.dash.opt.lock.pass[2]), 48 + Number(euc.state.dash.opt.lock.pass[3]), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 20, 90, 90];
		case "setPassChange":
			return [170, 85, 48 + Number(euc.state.dash.opt.lock.pass[0]), 48 + Number(euc.state.dash.opt.lock.pass[1]), 48 + Number(euc.state.dash.opt.lock.pass[2]), 48 + Number(euc.state.dash.opt.lock.pass[3]), 48 + Number(euc.state.dash.opt.lock.passOld[0]), 48 + Number(euc.state.dash.opt.lock.passOld[1]), 48 + Number(euc.state.dash.opt.lock.passOld[2]), 48 + Number(euc.state.dash.opt.lock.passOld[3]), 0, 0, 0, 0, 0, 0, 65, 20, 90, 90]; //rf 43
		case "setSpeedLimits":
			return [170, 85, euc.state.dash.alrt.spd.one.en ? euc.state.dash.alrt.spd.one.val : 0, 0, euc.state.dash.alrt.spd.two.en ? euc.state.dash.alrt.spd.two.val : 0, 0, euc.state.dash.alrt.spd.thre.val, 0, euc.state.dash.alrt.spd.tilt.val, 0, 49, 50, 51, 52, 53, 54, 133, 20, 90, 90];
		default:
			return [];
	}
};
ew.apps.euc.help.temp.city = function() {
	const euc=ew.apps.euc;
	// "ram";
	if (euc.state.dash.live.amp < -1 && euc.state.dash.opt.lght.HL === 1) {
		euc.wri("setLights", 3);
		euc.state.dash.opt.lght.HL = 3;
	}
	else if (euc.state.is.night && euc.state.dash.live.amp >= 0) {
		if (15 < euc.state.dash.live.spd && euc.state.dash.opt.lght.HL !== 1) {
			euc.wri("setLights", 1);
			euc.state.dash.opt.lght.HL = 1;
		}
		else if (euc.state.dash.live.spd < 10 && euc.state.dash.opt.lght.HL !== 3) {
			euc.wri("setLights", 3);
			euc.state.dash.opt.lght.HL = 3;
		}
	}
	else if (euc.state.dash.live.amp >= 0) {
		if (35 < euc.state.dash.live.spd && !euc.state.dash.opt.lght.strb) {
			euc.wri("setStrobeOnOff", 1);
			euc.state.dash.opt.lght.strb = 1;
		}
		else if (euc.state.dash.live.spd < 30 && euc.state.dash.opt.lght.strb) {
			euc.wri("setStrobeOnOff", 0);
			euc.state.dash.opt.lght.strb = 0;
		}
		else if (15 < euc.state.dash.live.spd && euc.state.dash.opt.lght.HL !== 1) {
			euc.wri("setLights", 1);
			euc.state.dash.opt.lght.HL = 1;
		}
		else if (euc.state.dash.live.spd < 10 && euc.state.dash.opt.lght.HL !== 3) {
			euc.wri("setLights", 3);
			euc.state.dash.opt.lght.HL = 3;
		}
	}
};
ew.apps.euc.help.temp.inpk = function(event) {
	const euc=ew.apps.euc;
	// "ram";
	let inpk = JSON.parse(E.toJS(event.target.value.buffer));
	/*if (ew.is.bt == 5) {
		NRF.updateServices({ 0xffe0: { 0xffe1: { value: inpk, notify: true } } });
		//if (ew.dbg&&ew.log) { 
		//	ew.log.unshift("Proxy from wheel: "+" "+Date()+" "+E.toJS(inpk));
		//	if (100<ew.log.length) ew.log.pop();
		//}
	}
	*/
	if (inpk[0] == 188) return;
	euc.state.is.alert = 0;
	if (8 < euc.dbg) console.log("INPUT :", inpk);
	if (inpk[16] == 169) {
		if (euc.dbg == 4) console.log("INPUT :", inpk);
		euc.help.temp.one(inpk);
	}
	else if (inpk[16] == 185) { //trip-time-max_speed
		if (euc.dbg == 5) console.log("INPUT :", inpk);
		euc.help.temp.two(inpk);
	}
	else if (inpk[16] == 245) {
		if (euc.dbg == 6) console.log("INPUT :", inpk);
		euc.state.dash.info.mtrL = inpk[6]; //motorLine
		euc.state.dash.info.gyro = inpk[7];
		euc.state.dash.info.mtrH = inpk[8]; //motorHolzer
		euc.state.dash.info.cpuR = inpk[14]; //cpuRate
		//euc.state.dash.info.outR=inpk[15]; //outputRate
		euc.state.dash.live.pwm = inpk[15];
		if (euc.state.dash.trip.pwm < euc.state.dash.live.pwm) euc.state.dash.trip.pwm = euc.state.dash.live.pwm;
	}
	else if (inpk[16] == 246) {
		if (euc.dbg == 7) console.log("INPUT :", inpk);
		euc.help.temp.thre(inpk);
	}
	else
		euc.help.temp.resp(inpk);
	//haptic
	if (euc.state.dash.alrt.pwm.hapt.en && (euc.state.dash.alrt.pwr || euc.state.dash.alrt.pwm.hapt.hi <= euc.state.dash.live.pwm)) {
		buzzer.sys( 60);
		euc.state.is.alert = 0;
	}
	else if (!euc.state.is.buzz && euc.state.is.alert) {
		if (!w.gfx.isOn && (euc.state.dash.alrt.spd.cc || euc.state.dash.alrt.amp.cc || euc.state.dash.alrt.pwr)) ew.face.go(ew.is.dash[ew.def.dash.ew.face], 0);
		euc.state.is.buzz = 1;
		if (20 <= euc.state.is.alert) euc.state.is.alert = 20;
		var a = [100];
		while (5 <= euc.state.is.alert) {
			a.push(200, 500);
			euc.state.is.alert = euc.state.is.alert - 5;
		}
		for (let i = 0; i < euc.state.is.alert; i++) a.push(200, 150);
		buzzer.euc( a);
		setTimeout(() => { euc.state.is.buzz = 0; }, 3000);
	}
};
//
ew.apps.euc.help.temp.one = (inpk) => {
	const euc=ew.apps.euc;
	//speed
	euc.state.dash.live.spd = (inpk[5] << 8 | inpk[4]) / 100;
	euc.state.dash.alrt.spd.cc = (euc.state.dash.alrt.spd.hapt.hi <= euc.state.dash.live.spd) ? 2 : (euc.state.dash.alrt.spd.hapt.low <= euc.state.dash.live.spd) ? 1 : 0;
	if (euc.state.dash.alrt.spd.hapt.en && euc.state.dash.alrt.spd.cc == 2)
		euc.state.is.alert = 1 + Math.round((euc.state.dash.live.spd - euc.state.dash.alrt.spd.two.val) / euc.state.dash.alrt.spd.hapt.step);
	//amp
	this.amp = inpk[11] << 8 | inpk[10];
	if (32767 < this.amp) this.amp = this.amp - 65536;
	euc.state.dash.live.amp = (this.amp / 100);
	euc.state.log.ampL.unshift(Math.round(euc.state.dash.live.amp));
	if (20 < euc.state.log.ampL.length) euc.state.log.ampL.pop();
	euc.state.dash.alrt.amp.cc = (euc.state.dash.alrt.amp.hapt.hi <= euc.state.dash.live.amp || euc.state.dash.live.amp <= euc.state.dash.alrt.amp.hapt.low) ? 2 : (euc.state.dash.live.amp <= -0.5 || 15 <= euc.state.dash.live.amp) ? 1 : 0;
	if (euc.state.dash.alrt.amp.hapt.en && euc.state.dash.alrt.amp.cc == 2) {
		if (euc.state.dash.alrt.amp.hapt.hi <= euc.state.dash.live.amp) euc.state.is.alert = euc.state.is.alert + 1 + Math.round((euc.state.dash.live.amp - euc.state.dash.alrt.amp.hapt.hi) / euc.state.dash.alrt.amp.hapt.step);
		else euc.state.is.alert = euc.state.is.alert + 1 + Math.round(-(euc.state.dash.live.amp - euc.state.dash.alrt.amp.hapt.low) / euc.state.dash.alrt.amp.hapt.step);
	}
	//volt
	euc.state.dash.live.volt = (inpk[3] << 8 | inpk[2]) / 100;
	euc.state.dash.live.bat = Math.round(100 * (euc.state.dash.live.volt * (100 / (16 * euc.state.dash.opt.bat.pack)) - euc.state.dash.opt.bat.low) / (euc.state.dash.opt.bat.hi - euc.state.dash.opt.bat.low));
	euc.state.log.batL.unshift(euc.state.dash.live.bat);
	if (20 < euc.state.log.batL.length) euc.state.log.batL.pop();
	euc.state.dash.alrt.bat.cc = (50 <= euc.state.dash.live.bat) ? 0 : (euc.state.dash.live.bat <= euc.state.dash.alrt.bat.hapt.low) ? 2 : 1;
	if (euc.state.dash.alrt.bat.hapt.en && euc.state.dash.alrt.bat.cc == 2) euc.state.is.alert++;
	//temp
	euc.state.dash.live.tmp = (inpk[13] << 8 | inpk[12]) / 100;
	euc.state.dash.alrt.tmp.cc = (euc.state.dash.alrt.tmp.hapt.hi - 5 <= euc.state.dash.live.tmp) ? (euc.state.dash.alrt.tmp.hapt.hi <= euc.state.dash.live.tmp) ? 2 : 1 : 0;
	if (euc.state.dash.alrt.tmp.hapt.en && euc.state.dash.alrt.tmp.cc == 2) euc.state.is.alert++;
	//total mileage
	euc.state.dash.trip.totl = ((inpk[6] << 16) + (inpk[7] << 24) + inpk[8] + (inpk[9] << 8)) / 1000;
	euc.state.log.trip.forEach(function(val, pos) { if (!val) euc.state.log.trip[pos] = euc.state.dash.trip.totl; });
	//mode
	euc.state.dash.opt.ride.mode = inpk[14];
	//City lights 
	if (euc.state.dash.opt.lght.city && euc.state.dash.live.spd) {
		euc.help.temp.city();
	}
	euc.emit("refresh");
};
ew.apps.euc.help.temp.two = (inpk)=> {
	const euc=ew.apps.euc;
	
	euc.state.dash.trip.last = ((inpk[2] << 16) + (inpk[3] << 24) + inpk[4] + (inpk[5] << 8)) / 1000;
	euc.state.dash.trip.time = Math.round((inpk[7] << 8 | inpk[6]) / 60);
	euc.state.dash.trip.topS = Math.round((inpk[9] << 8 | inpk[8]) / 100); ///////
	//euc.state.dash.opt.lght.HL=inpk[10]-17;
	euc.state.dash.opt.lght.HL = inpk[10] - 17;
	euc.state.dash.info.on = inpk[11]; //onOffState
	euc.state.dash.opt.snsr.fan = inpk[12];
	euc.state.dash.opt.snsr.chrg = inpk[13];
	euc.charge = euc.state.dash.opt.snsr.chrg ? 1 : 0;
	euc.state.dash.live.tmpM = Math.round((inpk[15] << 8 | inpk[14]) / 100);
};
ew.apps.euc.help.temp.thre = (inpk) => {
	const euc=ew.apps.euc;

	euc.state.dash.alrt.spd.max = (inpk[3] << 8 | inpk[2]) / 100;
	euc.state.dash.info.tRdT = (inpk[13] << 8 | inpk[12]);
	euc.state.dash.alrt.warn.code = (inpk[15] << 8 | inpk[14]);
	if (euc.state.dash.alrt.warn.code) euc.state.dash.alrt.warn.txt = euc.help.temp.faultAlarms(euc.state.dash.alrt.warn.code);
	euc.state.dash.alrt.pwr = (euc.state.dash.alrt.spd.max < euc.state.dash.alrt.spd.tilt.val && euc.state.dash.alrt.spd.max - 5 < euc.state.dash.live.spd) ? 1 : 0;
	euc.state.log.almL.unshift(euc.state.dash.alrt.pwr);
	if (20 < euc.state.log.almL.length) euc.state.log.almL.pop();
	//haptic
	if (euc.state.dash.alrt.pwr == 1) euc.state.is.alert++;
};
//
ew.apps.euc.help.temp.rspF = {};

ew.apps.euc.help.temp.rspF.one = function(inpk) {


};

ew.apps.euc.help.temp.resp = function(inpk) {
	const euc=ew.apps.euc;

	// "ram";
	if (2 < euc.dbg) print("id, responce:",inpk[16], inpk);
	if (inpk[16] == 63)
		euc.state.dash.auto.offT = inpk[5] << 8 | inpk[4];
	else if (inpk[16] == 67) {
		if (2 < euc.dbg) print("bt pass:", inpk);
		if (inpk[6] == 1) {
			if (inpk[2] == 255) euc.state.dash.opt.lock.pass = "";
			else euc.state.dash.opt.lock.pass = "" + (inpk[2] - 48) + (inpk[3] - 48) + (inpk[4] - 48) + (inpk[5] - 48);
		}
	}
	else if (inpk[16] == 70) {
		if (2 < euc.dbg) print("bt pass state:", inpk);
		euc.help.temp.pass = inpk[2];
	}
	else if (inpk[16] == 72)
		euc.state.dash.info.oldM = inpk[2];
	else if (inpk[16] == 74)
		euc.state.dash.opt.lght.sprm = inpk[2]; //spectrum
	else if (inpk[16] == 76)
		euc.state.dash.opt.snsr.lift = inpk[2];
	else if (inpk[16] == 77)
		euc.state.dash.opt.lght.sprM = inpk[2]; //spectrum Mode
	else if (inpk[16] == 82)
		euc.state.dash.info.mdId = inpk[2]; //modeId
	else if (inpk[16] == 85)
		euc.state.dash.opt.lght.strb = inpk[2];
	else if (inpk[16] == 88)
		euc.state.dash.opt.snd.BTMc = inpk[2]; //BTMusic
	else if (inpk[16] == 107)
		euc.state.dash.opt.lang = inpk[2];
	else if (inpk[16] == 110)
		euc.state.dash.opt.lght.led = 1 - inpk[2];
	else if (inpk[16] == 138 && inpk[2] == 0) {
		//if ( inpk[2] == 0 )  {
		euc.state.dash.opt.ride.pTlt = ((inpk[5] & 0xff) << 8) | (inpk[4] & 0xff); //pedal tilt
		if (32767 < euc.state.dash.opt.ride.pTlt) euc.state.dash.opt.ride.pTlt = euc.state.dash.opt.ride.pTlt - 65536;
		//}
	}
	else if (inpk[16] == 162)
		euc.state.dash.opt.ride.mode = inpk[4];
	else if (inpk[16] == 172 || inpk[16] == 173 || inpk[16] == 174){ //Prapam
		if (2 < euc.dbg) print("in ", inpk[16]);
	}else if (inpk[16] == 179) {
		let wc = { "W": "WHITE", "B": "BLACK", "S": "SILVER GRAY", "Y": "YELLOW", "R": "RED", "D": "RUBBER BLACK", "C": "CUSTOM" };
		let model = {
			"14D": [1, 340, 420, 680, 840],
			"16D": [1, 340, 420, 680, 840, 520],
			"16S": [1, 680, 840, 0, 420],
			"16X": [1.25, 777, 1554],
			"18A": [1, 0, 0, 0, 520, 680, 1360, 840, 1680],
			"18S": [1, 0, 0, 680, 1360, 840, 1680],
			"18L": [1.25, 0, 1036, 0, 1554],
			"S18": [1.25, 1110],
			"S20": [1.875, 2220],
			"S22": [1.875, 2220],
			"SA0": [1.875, 2220],
			"SA1": [1.875, 2220],
			"SA2": [1.875, 2220]
		};
		//global.lala = inpk;
		euc.state.dash.info.get.serl = E.toString(inpk.slice(2, 16), inpk.slice(17, 20));
		euc.state.dash.info.get.manD = E.toString(inpk[11], inpk[12], "-", inpk[13], inpk[14], "-20", inpk[9], inpk[10]);
		euc.state.dash.info.get.colr = wc[E.toString(inpk[8])];
		euc.state.dash.info.get.modl = E.toString(inpk.slice(4, 7));
		euc.state.dash.opt.bat.mAh = model[euc.state.dash.info.get.modl][inpk[7] - 48];
		euc.state.dash.opt.bat.pack = model[euc.state.dash.info.get.modl][0];
		wc = 0;
		model = 0;

	}
	else if (inpk[16] == 181) {
		if (inpk[4] == 0 || inpk[4] == 255)
			euc.state.dash.alrt.spd.one.en = 0;
		else {
			euc.state.dash.alrt.spd.one.val = inpk[4];
			euc.state.dash.alrt.spd.one.en = 1;
		}
		if (inpk[6] == 0)
			euc.state.dash.alrt.spd.two.en = 0;
		else {
			euc.state.dash.alrt.spd.two.val = inpk[6];
			euc.state.dash.alrt.spd.two.en = 1;
		}
		euc.state.dash.alrt.spd.thre.val = inpk[8];
		euc.state.dash.alrt.spd.tilt.val = inpk[10];
		euc.state.dash.alrt.spd.tilt.val = inpk[10];
	}
	else if (inpk[16] == 187) {
		if (!euc.state.dash.info.get.name) {
			euc.state.dash.info.get.id = E.toString(inpk.slice(2, inpk.indexOf(0)));
			if (euc.state.dash.info.get.id.split("-")) {
				euc.state.dash.info.get.firm = euc.state.dash.info.get.id.split("-")[2];
				euc.state.dash.info.get.name = euc.state.dash.info.get.id.split("-")[1];
				ew.do.fileWrite("dash", "slot" + require("Storage").readJSON("dash.json", 1).slot + "Model", euc.state.dash.info.get.name);
			}
		}
	}
	else if (inpk[16] == 201)
		euc.lala = inpk;
	else if (inpk[16] == 231){ //speedPswd
		if (2 < euc.dbg) print("in 231");
	}else if (inpk[16] == 95) {
		if (inpk[2] == 1) {
			let r1 = (Math.random() * 10) | 0;
			let r2 = (Math.random() * 10) | 0;
			let r3 = (Math.random() * 10) | 0;
			let i1 = inpk[8] == 0 ? 5 : inpk[8] - 48;
			let i2 = inpk[4] == 0 ? 1 : inpk[4] - 48;
			let i3 = inpk[6] == 0 ? 4 : inpk[6] - 48;
			let i4 = r1 + r2 + r3;
			let i5 = (i2 + i4 + i3 + i1) % 10;
			let i6 = i4 + i5;
			let i7 = (i3 + i6 + i1) % 10;
			euc.help.temp.lockKey = [170, 85, 0, 0, 0, 0, 0, 0, 0, 0, 48 + i5, 48 + r1, 48 + i7, 48 + r2, 48 + (i6 + i7 + i1) % 10, 48 + r3, 93, 20, 90, 90];
		}
		else
			euc.help.temp.lockKey = 0;
		if (1 < euc.dbg) console.log("EUC module: got lock status, lock key:", inpk[2], euc.help.temp.lockKey);
		euc.state.dash.opt.lock.en = inpk[2];

	}
	if (ew.dbg&&ew.log) { 
		ew.log.unshift("Proxy from wheel: "+" "+Date()+" "+E.toJS(inpk));
		if (100<ew.log.length) ew.log.pop();
	}
};


ew.apps.euc.help.temp.faultAlarms = function(code) {
	const euc=ew.apps.euc;

	//if (code==218) 
	//	euc.state.log.evnt={"spd":euc.state.dash.live.spd,"pwm":euc.state.dash.live.pwm};
	switch (code) {
		case 202:
			return 'overcurrent error';
		case 203:
			return 'motor blocked';
		case 217:
			return 'hall sensor error';
		case 218:
			return 'Overpower wanring';
		case 220:
			return 'overvoltage error';
		case 232:
			return 'lift sensor error';
		default:
			return code;
	}
};
//start
ew.apps.euc.conn = function(mac) {
	//"ram";
	const euc=ew.apps.euc;
	
	if (euc.gatt && euc.gatt.connected) {
		if (euc.dbg) console.log("ble allready connected");
		euc.gatt.disconnect();
		return;
	}
	//connect 
	NRF.connect(mac, { minInterval: 7.5, maxInterval: 100 })
		.then(function(g) {
			euc.gatt=g;
			return g.getPrimaryService(0xffe0);
		}).then(function(s) {
			//print("s",s);
			return s.getCharacteristic(0xffe1);
		}).then(function(c) {
			//print("s",c);
			c.on('characteristicvaluechanged', euc.help.temp.inpk);
			euc.gatt.device.on('gattserverdisconnected', euc.off );
			return c;
		}).then(function(c) {
			if (euc.dbg) console.log("EUC module Kingsong connected");
			
			euc.lala= function(n,v){
				euc.buff.push([n,v])
			};
			euc.test=()=>{
				
				if 	(euc.buff[0]){
					euc.do(euc.buff[0][0],euc.buff[0][1])
					euc.buff.shift();
				} 
				if (euc.status!="OFF"){
					euc.tout.buffer=setTimeout(()=>{
					euc.test();
					},500);
				}
				
			};
			//euc.test();
	
			
			ew.apps.euc.wri = function(n, v) {
				const euc=ew.apps.euc;
				
				if (euc.tout.busy) {
					clearTimeout(euc.tout.busy);
					euc.tout.busy = setTimeout(() => { euc.tout.busy = 0; }, 70);
					return;
				}
				euc.tout.busy = setTimeout(() => { euc.tout.busy = 0; }, 100);
				if (n === "proxy") {
					c.writeValue(v).then(function() {  

					}).catch(euc.off);
				}
				else if (n == "hornOn") {
					euc.state.is.horn = 1;
					if (euc.tout.horn) {
						clearTimeout(euc.tout.horn);
						euc.tout.horn = 0;
					}
					c.writeValue(euc.cmd(euc.state.dash.auto.onC.talk?"doHorn":"doBeep")).then(function() {
						return c.writeValue(euc.cmd("setStrobeOnOff", 1));
					}).then(function() {
						if (euc.ntid.horn) 	clearInterval(euc.ntid.horn);
						euc.ntid.horn = setInterval(() => {
							if (!BTN1.read()) {
								clearInterval(euc.ntid.horn);
								euc.ntid.horn = 0;
								euc.state.is.horn = 0;
								c.writeValue(euc.cmd("setStrobeOnOff", 0));
							}
						}, 200);
					});
				}
				else if (n == "hornOff") {
					euc.state.is.horn = 0;
					return;
				}
				else if (n === "start") {
					euc.state = "READY";
					c.startNotifications().then(function() {
						return c.writeValue(euc.cmd("getModel"));
					}).then(function() {
						if (euc.state.dash.auto.onC.pass) return c.writeValue(euc.cmd("setPassSend"));
					}).then(function() {
						if (euc.state.dash.auto.onC.unlk) return c.writeValue(euc.cmd("getLock"));
					}).then(function() {
						if (euc.state.dash.auto.onC.led) return c.writeValue(euc.cmd("setLedRideOnOff", euc.state.dash.auto.onC.led - 1));
					}).then(function() {
						if (euc.state.dash.auto.onC.HL) return c.writeValue(euc.cmd("setLights", euc.state.dash.auto.onC.HL));
					}).then(function() {
						return c.writeValue(euc.cmd("getAlarms"));
					}).then(function() {
						if (euc.state.dash.auto.onC.lift) return c.writeValue(euc.cmd("setLiftOnOff", 2 - euc.state.dash.auto.onC.lift));
					}).then(function() {
						if (euc.state.dash.auto.onC.talk) return c.writeValue(euc.cmd("setVoiceOnOff", 2 - euc.state.dash.auto.onC.talk));
					}).then(function() {
						if (euc.state.dash.opt.lock.en && euc.state.dash.auto.onC.unlk && euc.help.temp.lockKey) {
							let onceUL = euc.help.temp.lockKey;
							onceUL[16] = 71;
							return c.writeValue(euc.cmd("doUnlock", onceUL));
						}
					}).then(function() {
						euc.state.is.run = 1;
						
						if (2 < euc.dbg) print("EUC module start: passstate:", euc.help.temp.pass);
						if (euc.help.temp.pass) {
							euc.state.dash.opt.lock.pass2 = euc.state.dash.opt.lock.pass;
							euc.state.dash.opt.lock.pass = "";
							ew.face.go("dashKingsong", 0);
							return;
						}
					}).then(function() {
						if (!euc.state.dash.info.get.serl) return c.writeValue(euc.cmd("getSerial"));
					}).catch(euc.off);
				}
				else if (euc.state == "OFF" || n == "end") {
					if (euc.gatt && euc.gatt.connected) {
						c.writeValue(euc.cmd((euc.state.dash.auto.onD.lock) ? "doLock" : "na")).then(function() {
							if (euc.state.dash.auto.onD.off) return c.writeValue(euc.cmd("doPowerOff"));
						}).then(function() {
							if (euc.state.dash.auto.onD.HL) return c.writeValue(euc.cmd("setLights", euc.state.dash.auto.onD.HL));
						}).then(function() {
							if (euc.state.dash.auto.onD.led) return c.writeValue(euc.cmd("setLedRideOnOff", euc.state.dash.auto.onD.led - 1));
						}).then(function() {
							if (euc.state.dash.auto.onD.lift) return c.writeValue(euc.cmd("setLiftOnOff", 2 - euc.state.dash.auto.onD.lift));
						}).then(function() {
							if (euc.state.dash.auto.onD.talk) return c.writeValue(euc.cmd("setVoiceOnOff", 2 - euc.state.dash.auto.onD.talk));
						}).then(function() {
							euc.state.is.run = 0;
							return euc.gatt.disconnect();
						}).catch(euc.off);
					}
					else {
						euc.state = "OFF";
						euc.off("not connected");
						return;
					}
				}
				else {
					if (euc.dbg) console.log("EUC module wri:", euc.cmd(n, v));
					c.writeValue(euc.cmd(n, v)).then(function() {}).catch(euc.off);
				}
				return true;
			};
			if (!ew.do.fileRead("dash", "slot" + ew.do.fileRead("dash", "slot") + "Mac")) {
				euc.state.dash.info.get.mac = euc.mac;
				euc.updateDash(require("Storage").readJSON("dash.json", 1).slot);
				ew.do.fileWrite("dash", "slot" + ew.do.fileRead("dash", "slot") + "Mac", euc.mac);
			}
			if (global["\xFF"].bleHdl && global["\xFF"].bleHdl[54] && global["\xFF"].bleHdl[54].value.buffer[0] == 170 && global["\xFF"].bleHdl[54].value.buffer[1] == 85) {
				setTimeout(() => {
					if (euc.dbg) print("EUC module Kingsong is ready");
					euc.state = "READY";
					c.startNotifications().then(function() {
						return euc.state.dash.auto.onC.talk ? euc.wri("setVoiceOnOff", 2 - euc.state.dash.auto.onC.talk) : "ok";
					});
				}, 500);
			}
			else {
				buzzer.nav([90, 40, 150]);
				euc.wri("start");
			}
			//reconect
		}).catch(euc.off);
};
/*
		//
		case "getLogin":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,69,20,90,90];
		case "getOldMode":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,20,90,90];
		case "setOldMode":return [170,85,val?1:0,0,0,0,0,0,0,0,0,0,0,0,0,0,124,20,90,90];
		case "setNumRV":return [170,85,58,163,0,0,0,0,0,0,0,0,0,0,0,0,99,20,90,90];
		case "setNumSV":return [170,85,26,161,0,0,0,0,0,0,0,0,0,0,0,0,99,20,90,90];
		case "setTestMode":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,20,90,90];
		case "doUpdateFirmware":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,20,90,90]; 
		case "getScooter":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,139,20,90,90]; 
		case "getParamA":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,146,20,90,90]; 
		case "getParamB":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,147,20,90,90]; 
		case "getParamC":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,148,20,90,90]; 
		//
		case "doResetFactoryDefauts":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,20,90,90];
		case "doResetFactorySetA":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,20,90,90];
		//
		case "getTotalRideTime":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,146,20,90,90];
		case "setTotalRideTime":return [170,85,val,0,0,0,0,0,0,0,0,0,0,0,0,0,146,20,90,90];
		//
		case "getBTMusic":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,87,20,90,90];
		case "setBTMusic":return [170,85,val?1:0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,20,90,90];
		case "setMusicNext":return [170,85,0,0,255,0,0,0,0,0,0,0,0,0,0,0,149,20,90,90];
		case "setMusicPrev":return [170,85,0,0,0,255,0,0,0,0,0,0,0,0,0,0,149,20,90,90];
		//
		case "getLanguage":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,106,20,90,90];
		case "setLanguage":return [170,85,val?1:0,0,0,0,0,0,0,0,0,0,0,0,0,0,105,20,90,90];
		//
		case "getLedColor":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,91,20,90,90];

*/
