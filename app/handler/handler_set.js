// *** settings ***

// ---- tasks ----

ew.sys.cron={
	event:{
		//date:()=>{ setTimeout(() =>{ ew.sys.cron.emit('dateChange',Date().getDate());ew.sys.cron.event.date();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate()+1)-Date()));},
		hour:()=>{setTimeout(() =>{ ew.sys.cron.emit('hour',Date().getHours());ew.sys.cron.event.hour();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate(),Date().getHours()+1,0,1)-Date()));},
		//min: ()=>{setTimeout(() =>{ ew.sys.cron.emit('min',Date().getMinutes());ew.sys.cron.event.min();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate(),Date().getHours(),Date().getMinutes()+1)-Date()));},
		//sec:()=>{setTimeout(() =>{ ew.sys.cron.emit('sec',Date().getSeconds());ew.sys.cron.event.sec();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate(),Date().getHours(),Date().getMinutes(),Date().getSeconds()+1)-Date()));},
	},
	task:{

	}
};
ew.sys.cron.event.hour();


// === handle settings ===

ew.do.update.settings = function() {
	//save apps def state
	if (global.ew) {
		
		// ---- save defaults ----
		let defaults = {};
		if (ew.def) defaults.sys = ew.def;
		Object.keys(ew.apps).forEach(appKey => {
			const app = ew.apps[appKey];
			if (app.state && app.state.def) {
				defaults[appKey] = app.state.def;
			}
		});
		require('Storage').write('ew.json', defaults);
		
		// ---- save logs ----
		Object.keys(ew.logger).forEach(appKey => {
			try{ ew.logger[appKey].saveStats(); }
			catch (error) { console.log(`ew error: ${error}, ${appKey} has no saveStats()`); }
		});
	}
};


ew.do.reset.settings = function() {
	ew.def = { "name":"new", "off": {}, "touchtype": "0", "acctype": "0", "hr24": 1, "timezone": "3", "rfTX": -4, "cli": 1, "acc": 0, "bri": 7, "buzz": 1, "scrn": 1, "bpp": 4, "info": 1, "txt": 0, "size": 0.75 };
	
	
	ew.do.update.settings();
	require('Storage').erase('ERROR');

};


// === defaults === 

if (require('Storage').readJSON('ew.json', 1) != undefined && require('Storage').readJSON('ew.json', 1).sys) {
	ew.def = require('Storage').readJSON('ew.json', 1).sys;
}else ew.def=0;

// ---- first run ----

if (!ew.def || ew.def.name == "eucLight") {
	ew.do.reset.settings();
	setTimeout(() => { reset(); }, 3000);
}

ew.is = {
	bt: 0,
	ondc: 0,
	btsl: 0,
	boot: getTime(),
	lowBattery:0
};

// ---- buzzer ----

ew.sys.buzz={};

if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "Magic3" || process.env.BOARD == "ROCK")
ew.sys.buzz.type={na:[15,15,15],ok:15,ln:80,error:[50,25,50,25,50],on:40,off:[20,25,20]};
else
ew.sys.buzz.type={ok:[20,40,20],na:25,ln:80,error:[50,25,50,25,50],on:40,off:[20,25,20]};

//buz={ok:[20,40,20],na:25,ln:80,on:40,off:[20,25,20]};
ew.sys.buzz.sys = digitalPulse.bind(null,ew.pin.BUZZ,ew.pin.BUZ0);
ew.sys.buzz.alrm = digitalPulse.bind(null,ew.pin.BUZZ,ew.pin.BUZ0);
ew.sys.buzz.euc = digitalPulse.bind(null,ew.pin.BUZZ,ew.pin.BUZ0);
if (ew.def.buzz) ew.sys.buzz.nav = digitalPulse.bind(null,ew.pin.BUZZ,ew.pin.BUZ0);
else ew.sys.buzz.nav=function(){return true;};

// ---- battery ----

ew.sys.batt = function(i, c) {
	let v = 4.20 / 0.60 * analogRead(ew.pin.BAT);
	let l = 3.5,
		h = 4.15;
	let hexString = ("0x" + (0x50000700 + (ew.pin.BAT * 4)).toString(16));
	poke32(hexString, 2); // disconnect pin for power saving, otherwise it draws 70uA more 		let per=(100 * (v - l) / (h - l) | 0);
	let per=(100 * (v - l) / (h - l) | 0);
	// stable battery indicator support 
	if (i === "info" && !g.isOn  ) ew.is.batS=( c? per: (v <= l) ? 0 : (h <= v) ? 100 : per );
	if (per <= 0) { ew.is.lowBattery=1;ew.sys.emit('battery','low');}
	if (10 <= per && ew.is.lowBattery ) { ew.is.lowBattery=0; ew.sys.emit('battery','ok');}
	if (i === "info") {
		return {
			"volt":v.toFixed(2),
			"percent": c? per :((v <= l) ? 0 : (h <= v) ? 100 : per),
			"low":l,
			"hi":h
		};
	}
	else if (i) {
		return ( c? per: (v <= l) ? 0 : (h <= v) ? 100 : per );
	}
	else return +v.toFixed(2);
};

ew.sys.on('hour', function(){ew.sys.batt("info")});

// ----  sleep ----

ew.do.sysSleep = function() {
	ew.do.update.settings();
	//NRF.disconnect();
	require("Storage").write("devmode", "shutdown");
	ew.sys.acc.off();
	ew.face.go("main", -1);
	setTimeout(()=>{E.reboot();},500);
};

// ---- reboot ----

ew.do.sysReboot = function() {
	g.clear();
	g.flip();
	ew.do.update.settings();
	ew.face.go("main", -1);
	setTimeout(()=>{reset();},500);
};

ew.do.update.acc = function() {
	if (ew.def.acc) ew.sys.acc.on();
	else ew.sys.acc.off();
};


ew.do.fileRead = function(file, name) {
	let got = require("Storage").readJSON([file + ".json"], 1);
	if (got == undefined) return false;
	if (name || name == 0) {
		if (require("Storage").readJSON([file + ".json"], 1)[name])
			return require("Storage").readJSON([file + ".json"], 1)[name];
		else return false;
	}
	else return require("Storage").readJSON([file + ".json"], 1);
};
ew.do.fileWrite = function(file, name, value, value2, value3) {
	let got = require("Storage").readJSON([file + ".json"], 1);
	if (got == undefined) got = {};
	if (!value && value != 0) delete got[name]; //delete
	else {
		if ((value2 || value2 == 0) && got[name])
			if (value3 || value3 == 0) got[name][value][value2] = value3;
			else got[name][value] = value2;
		else
			got[name] = value;
	}
	require("Storage").writeJSON([file + ".json"], got);
	return true;
};

if (!ew.def.addr) ew.def.addr = NRF.getAddress();
//
//E.setTimeZone(ew.def.timezone);
E.setDST(60, 120, 4, 0, 2, 0, 180, 4, 0, 9, 0, 240); //Greece-Athens- we have a time which is 2 hours ahead of GMT in winter (EET) and 3 hours in summer (EEST)


if (ew.def.size) { ew.UI.size.txt = ew.def.size;
    ew.UI.size.sca = ew.def.size * (process.env.BOARD == "BANGLEJS2" ? 0.9 : 1.1); }
    
