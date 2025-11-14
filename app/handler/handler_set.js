// *** settings ***

// ---- tasks ----

ew.sys.cron = {
	event: {
		//date:()=>{ setTimeout(() =>{ ew.sys.emit('dateChange',Date().getDate());ew.sys.cron.event.date();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate()+1)-Date()));},
		hour: () => {
			setTimeout(() => {
				ew.sys.emit('hour', Date().getHours());
				ew.sys.cron.event.hour();
			}, (Date(Date().getFullYear(), Date().getMonth(), Date().getDate(), Date().getHours() + 1, 0, 1) - Date()));
		},
		//min: ()=>{setTimeout(() =>{ ew.sys.emit('min',Date().getMinutes());ew.sys.cron.event.min();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate(),Date().getHours(),Date().getMinutes()+1)-Date()));},
		//sec:()=>{setTimeout(() =>{ ew.sys.emit('sec',Date().getSeconds());ew.sys.cron.event.sec();},(Date(Date().getFullYear(),Date().getMonth(),Date().getDate(),Date().getHours(),Date().getMinutes(),Date().getSeconds()+1)-Date()));},
	},
	task: {

	}
};
ew.sys.cron.event.hour();


// === handle settings ===

ew.sys.updt = function(i) {
 	if (i) {
		i = Number(i); 
		setTimeout(function(){
			E.reboot();
		}, i+2000);
		
	}
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
			try { ew.logger[appKey].saveStats(); }
			catch (error) { console.log(`ew error: ${error}, ${appKey} has no saveStats()`); }
		});
	}
	return "updated";
};


ew.sys.reset = function(c) {
	ew.def = {
		"bt": {
			"phyC": "1mbps",
			"phyA": "1mbps",
			"uart": 1,
			"conn": 1,
			"adv": 1,
			"rfTX": 0,
			"intA": 1500,
			"intC": "auto",
			"mtu" :100,
			"pair": 0,
			"code":"123456",
		},
		"face": {
			"info": 1,
			"buzz": 1,
			"scrn": 1,
			"txt": 0,
			"size": 0.85,
			"buzz": 1,
			"bri": 7,
			"off": {},
			"bpp": 4
		},
		"time": {
			"hr24": 1,
			"timezone": "3",
		},
		"dev": {
			"touchtype": "0",
			"acctype": "0",
			"acc": 1,
			"tilt":1, //0|1
			"tap": 2, //0|2
			"firm": process.env.VERSION,
			"board": process.env.BOARD
		},
		"name": "new",
		"role": ["watch"],
		"noWd":0, // -- no watchDog --
		"frce":0 // -- force name update --
	};

	require('Storage').erase('ERROR');
	if (c === "All") require('Storage').write('ew.json', ew.def);
	else ew.sys.updt();

};


// === defaults === 

if (require('Storage').readJSON('ew.json', 1) != undefined && require('Storage').readJSON('ew.json', 1).sys) {
	ew.def = require('Storage').readJSON('ew.json', 1).sys;
}
else ew.def = 0;

// ---- first run ----

if (!ew.def || ew.def.name == "eucLight") {
	ew.sys.reset();
	setTimeout(() => { reset(); }, 3000);
}

ew.is = {
	bt: 0,
	ondc: 0,
	btsl: 0,
	boot: getTime(),
	lowBattery: 0
};

// ---- buzzer ----

ew.sys.buzz = {};

//if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "Magic3" || process.env.BOARD == "ROCK")
ew.sys.buzz.type = { na: [15, 15, 15], ok: 15, ln: 80, error: [50, 25, 50, 25, 50], alert: [100, 50, 50, 50, 100], on: 40, off: [20, 25, 20] };
//else
//	ew.sys.buzz.type = { ok: [20, 40, 20], na: 15, ln: 80, error: [50, 25, 50, 25, 50], on: 40, off: [20, 25, 20] };

//buz={ok:[20,40,20],na:25,ln:80,on:40,off:[20,25,20]};
ew.sys.buzz.sys = digitalPulse.bind(null, ew.pin.BUZZ, ew.pin.BUZ0);
ew.sys.buzz.alrm = digitalPulse.bind(null, ew.pin.BUZZ, ew.pin.BUZ0);
ew.sys.buzz.euc = digitalPulse.bind(null, ew.pin.BUZZ, ew.pin.BUZ0);
if (ew.def.face.buzz) ew.sys.buzz.nav = digitalPulse.bind(null, ew.pin.BUZZ, ew.pin.BUZ0);
else ew.sys.buzz.nav = function() { return true; };


// ----  sleep ----

ew.sys.sleep = function() {
	ew.sys.updt();
	//NRF.disconnect();
	require("Storage").write("devmode", "shutdown");
	setTimeout(() => {
		if (process.env.BOARD == "BANGLEJS2") Bangle.softOff();
		else E.reboot();
	}, 1500);
};

// ---- reboot ----

ew.sys.reboot = function() {
	ew.sys.updt();
	setTimeout(() => {
		g.clear();
		g.flip();
		if (process.env.BOARD == "BANGLEJS2") E.reboot();
		else reset();
	}, 1000);
};


ew.sys.fileRead = function(file, name) {
	let got = require("Storage").readJSON([file + ".json"], 1);
	if (got == undefined) return false;
	if (name || name == 0) {
		if (require("Storage").readJSON([file + ".json"], 1)[name])
			return require("Storage").readJSON([file + ".json"], 1)[name];
		else return false;
	}
	else return require("Storage").readJSON([file + ".json"], 1);
};
ew.sys.fileWrite = function(file, name, value, value2, value3) {
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

if (!ew.def.bt.addr) ew.def.bt.addr = NRF.getAddress();
//
//E.setTimeZone(ew.def.timezone);
E.setDST(60, 120, 4, 0, 2, 0, 180, 4, 0, 9, 0, 240); //Greece-Athens- we have a time which is 2 hours ahead of GMT in winter (EET) and 3 hours in summer (EEST)


if (ew.def.face.size && ew.UI) {
	ew.UI.size.txt = ew.def.face.size;
	ew.UI.size.sca = ew.def.face.size * (process.env.BOARD == "BANGLEJS2" ? 0.7 : 0.9);
}

// ---- auto save defaults ----
ew.sys.on('hour', function(x){
    if (x === 0) {
        setTimeout=(()=>{
        ew.sys.updt();
        },120000);
	}	
});