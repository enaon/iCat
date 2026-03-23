ew.apps.euc = {
	dbg: 1,
	// states, def object is reboot persistent.
	state: {
		dash: {
			"info": { "get": { "makr": "Kingsong", "modl": "S18", "firm": "0216", "serl": "KSS181W200730B019", "manD": "07-30-2020", "colr": "WHITE", "id": "KS-S18-0216", "mac": "64:69:4e:75:89:4d public", "name": "S18" }, "tRdT": 4983, "on": 1, "mtrL": 0, "gyro": 0, "mtrH": 0, "cpuR": 46 },
			"trip": { "totl": 6454.631, "last": 0, "left": 0, "topS": 0, "avrS": 0, "time": 1, "pwm": 100 },
			"auto": { "offT": 14400, "onC": { "HL": 3, "led": 1, "beep": 0, "unlk": 0, "lift": 0, "talk": 0, "pass": 0, "clrM": 0 }, "onD": { "HL": 2, "led": 2, "beep": 0, "lock": 0, "lift": 0, "talk": 0, "off": 0 } },
			"live": { "spd": 0, "volt": 80.22, "amp": 0.27, "bat": 82, "tmp": 7, "tmpM": 6, "pwm": 0 },
			"opt": { "lght": { "HL": 3, "strb": 0, "led": 0, "city": 0 }, "bat": { "hi": 417, "low": 330, "pack": 1.25, "mAh": 1110 }, "ride": { "mode": 0, "rolA": 0, "pTlt": -5 }, "horn": { "en": 0, "mode": 4 }, "lock": { "en": 0, "pass": "", "pLck": 0, "far": 83, "near": 65, "pass2": "", "passOld": "" }, "unit": { "fact": { "spd": 1, "dist": 1 }, "ampR": 0, "mile": 0 }, "snd": { "vol": 1 }, "snsr": { "lift": 1, "fan": 0, "chrg": 0 }, "tpms": "1136ed" },
			"alrt": { "mode": 0, "pwr": 0, "warn": { "code": 0, "txt": 0 }, "spd": { "cc": 0, "top": 0, "max": 20, "one": { "val": 10, "en": 0 }, "two": { "val": 25, "en": 0 }, "thre": { "val": 45, "en": 0 }, "tilt": { "val": 50, "en": 0 }, "hapt": { "low": 30, "hi": 45, "step": 1, "en": 0 } }, "amp": { "cc": 0, "hapt": { "low": -10, "hi": 20, "step": 1, "en": 0 } }, "bat": { "cc": 0, "hapt": { "low": 15, "hi": 50, "step": 1, "en": 0 } }, "tmp": { "cc": 0, "hapt": { "low": 50, "hi": 75, "step": 1, "en": 1 } }, "pwm": { "cc": 0, "en": 0, "val": 0, "hapt": { "low": 50, "hi": 80, "step": 1, "en": 1 } } }
		},
		tout: { "horn": 0, "loop": 0, "alive": 0, "reconnect": 0, "busy": 0 },
		ntid: { "horn": 0 },
		is: { "run": 0, "chrg": 0, "night": 1, "day": [7, 19], "buzz": 0, "horn": 0, "busy": 0 },
		status: "OFF",
		proxy: 0,
		temp: {},
		scanSlot: {},
		log: {
			trip: [0, 0, 0], //hour/day/month
			ampL: [],
			batL: [],
			almL: []
		},
		// auto saved object (def)
		def: {
			log: {
				trip: [0, 0, 0], //hour/day/month
				ampL: [],
				batL: [],
				almL: []
			},
			dash: {
				face: "digital"
			},
			garage: {
				slot: 1, //selected slot
				slot1: {
					rssi: -64,
					name: "KS-S180531",
					type: "KingSong",
					id: "64:69:4e:75:89:4d public"
				}, //saved wheel no1
				slot2: {}, //saved wheel no2 
			}
		}
	},
	help: {
		temp: {}

	},
	updateDash: function(slot) {
		//this.state.def.garage["slot" + slot] = this.state.dash
		//require('Storage').write('eucSlot' + slot + '.json', this.state.dash); 

	},
	wri: (err) => { if (this.dbg) console.log("EUC write, not connected", err); },


	tgl: () => {
		let euc = ew.apps.euc;
		let def = euc.state.def;

		if (euc.dbg) console.log("euc toggle");

		ew.face.off();

		if (euc.state.tout.reconnect) {
			clearTimeout(euc.state.tout.reconnect);
			euc.state.tout.reconnect = 0;
		}
		if (euc.state.tout.loop) {
			clearTimeout(euc.state.tout.loop);
			euc.state.tout.loop = 0;
		}
		if (euc.state.tout.alive) {
			clearTimeout(euc.state.tout.alive);
			euc.state.tout.alive = 0;
		}
		if (euc.state.tout.busy) {
			clearTimeout(euc.state.tout.busy);
			euc.state.tout.busy = 0;
		}
		if (euc.state.status != "OFF") {
			//buzzer.nav([90, 60, 90]);
			//log
			//if (euc.state.def.log.trip[0] && 0 < euc.state.dash.trip.totl - euc.state.def.log.trip[0])
			//ew.do.fileWrite("logDaySlot" + ew.def.dash.slot, Date().getHours(), (euc.state.dash.trip.totl - euc.state.def.log.trip[0]) + ((ew.do.fileRead("logDaySlot" + ew.def.dash.slot, Date().getHours())) ? ew.do.fileRead("logDaySlot" + ew.def.dash.slot, Date().getHours()) : 0));
			euc.state.def.log.trip[0] = 0;
			//ew.def.dash.accE = 0;
			euc.mac = 0;
			euc.state.status = "OFF";
			//acc.off();
			euc.wri("end");
			setTimeout(() => {
				//print("log");
				//if (euc.state.def.log.trip[1] && 0 < euc.state.dash.trip.totl - euc.state.def.log.trip[1]) {
				//	//print("week");
				//	ew.do.fileWrite("logWeekSlot" + ew.def.dash.slot, Date().getDay(), (euc.state.dash.trip.totl - euc.state.def.log.trip[1]) + ((ew.do.fileRead("logWeekSlot" + ew.def.dash.slot, Date().getDay())) ? ew.do.fileRead("logWeekSlot" + ew.def.dash.slot, Date().getDay()) : 0));
				//}
				//if (euc.state.def.log.trip[2] && 0 < euc.state.dash.trip.totl - euc.state.def.log.trip[2]) {
				//	ew.do.fileWrite("logYearSlot" + ew.def.dash.slot, Date().getMonth(), (euc.state.dash.trip.totl - euc.state.def.log.trip[2]) + ((ew.do.fileRead("logYearSlot" + ew.def.dash.slot, Date().getMonth())) ? ew.do.fileRead("logYearSlot" + ew.def.dash.slot, Date().getMonth()) : 0));
				//}
				euc.updateDash(euc.state.def.garage.slot);
				euc.state.def.log.trip = [0, 0, 0];
				//if (face.appCurr=="dashOff") face.go('dashOff',0);
				//if (ew.def.acc) acc.on(1);

			}, 1000);

			return;
		}
		else {
			//buzzer.nav(100);
			//def.log.trip = [0, 0, 0];
			//NRF.setTxPower(ew.do.maxTx);

			// ---- get device BT id address ----
			euc.mac = (euc.mac) ? euc.mac : def.garage["slot" + [def.garage.slot]].id;

			if (!euc.mac) {
				face.go('euc_scan', 0);
				return;
			}
			else {
				// **** init connection ****
				euc.state.status = "ON";
				euc.state.temp = { count: 0, loop: 0, last: 0, rota: 0 };

				// ---- load wheel module ----
				eval(require('Storage').read('ew_m_euc_' + def.garage["slot" + def.garage.slot].type));

				// ---- load wheel proxy support ----
				/*if (ew.def.prxy && require('Storage').read('proxy' + euc.state.dash.info.get.makr)) {
					eval(require('Storage').read('proxy' + euc.state.dash.info.get.makr));
				}*/

				//if (euc.state.dash.info.get.makr !== "Kingsong" || euc.state.dash.info.get.makr !== "inmotionV11") euc.state.dash.trip.topS = 0;

				// ---- start wheel connection ----
				//NRF.setConnectionInterval(100)
				//NRF.connect("ca:6b:b3:41:cd:81 random", { minInterval:7.5, maxInterval: 100}).then(function(g) {
				//gatt = g;
				//});
				NRF.requestDevice({ filters: [{ namePrefix: '' }]}).then(function(device) {
				//return print( device);
				  ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "DUMMY", "CONNECTED", 15, 1);
				  return device.gatt.connect();
				}).then(function(g) {
				  global.dummyGatt = g;
				  setTimeout(()=>{ 
				  	ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "EUC", "STARTING", 15, 1);

				  	ew.apps.euc.conn(ew.apps.euc.mac); 
				  	setTimeout(()=>{ global.dummyGatt.disconnect()},10000);
				  },200)
				  console.log("Done!");
				  
				}).catch(function (){
					ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "DUMMY ", "FAILED", 15, 13);
					
        });

			}
		}
	},
	dummy:()=>{
		
		NRF.requestDevice({ filters: [{ namePrefix: '' }] }).then(function(device) {
		//return print( device);
		  return device.gatt.connect();
		}).then(function(g) {
		  this.dummyGatt = g;
		  console.log("Done!");
		  
		});
				

			
		
	},
	off: (err) => {
		let euc = ew.apps.euc;
		if (euc.dbg) console.log("euc.off :", err);
		if (euc.state.tout.reconnect) {
			clearTimeout(euc.state.tout.reconnect);
			euc.state.tout.reconnect = 0;
		}
		if (euc.state.tout.loop) {
			clearTimeout(euc.state.tout.loop);
			euc.state.tout.loop = 0;
		}
		if (euc.state.tout.alive) {
			clearTimeout(euc.state.tout.alive);
			euc.state.tout.alive = 0;
		}
		if (euc.state.tout.busy) {
			clearTimeout(euc.state.tout.busy);
			euc.state.tout.busy = 0;
		}
		//
		if (euc.state.status != "OFF") {
			if (euc.dbg) console.log("EUC: Restarting");
			if (err === "Connection Timeout") {
				euc.state.status = "LOST";
				if (euc.def.dash.rtr < euc.state.is.run) {
					euc.tgl();
					return;
				}
				euc.state.is.run = euc.state.is.run + 1;
				//if (euc.state.dash.opt.lock.en == 1) buzzer.nav(250);
				//else buzzer.nav([250, 200, 250, 200, 250]);
				euc.state.tout.reconnect = setTimeout(() => {
					euc.state.tout.reconnect = 0;
					if (euc.state.status != "OFF") euc.conn(euc.mac);
				}, 5000);
			}
			else if (err === "Disconnected" || err === "Not connected") {
				euc.state.status = "FAR";
				euc.state.tout.reconnect = setTimeout(() => {
					euc.state.tout.reconnect = 0;
					if (euc.state.status != "OFF") euc.conn(euc.mac);
				}, 1000);
			}
			else {
				euc.state.status = "RETRY";
				euc.state.tout.reconnect = setTimeout(() => {
					euc.state.tout.reconnect = 0;
					if (euc.state.status != "OFF") euc.conn(euc.mac);
				}, 2000);
			}
		}
		else {
			if (euc.dbg) console.log("EUC OUT:", err);
			/*if (euc.aOff == 0 || euc.aOff == 1) {
				euc.state.dash.auto.onD.off = euc.aOff;
				delete euc.aOff;
			}
			if (euc.aLck == 0 || euc.aLck == 1) {
				euc.state.dash.auto.onD.lock = euc.aLock;
				delete euc.aLck;
			}
			*/
			//euc.off = function(err) { if (euc.dbg) console.log("EUC off, not connected", err); };
			euc.wri = function(err) { if (euc.dbg) console.log("EUC write, not connected", err); };
			euc.conn = function(err) { if (euc.dbg) console.log("EUC conn, not connected", err); };
			euc.cmd = function(err) { if (euc.dbg) console.log("EUC cmd, not connected", err); };
			euc.state.is.run = 0;
			euc.state.temp = 0;
			//global["\xFF"].bleHdl = [];
			//if (euc.state.proxy) euc.state.proxy.e();
			//NRF.setTxPower(ew.def.rfTX);
			if (euc.gatt && euc.gatt.connected) {
				if (euc.dbg) console.log("ble still connected");
				euc.gatt.disconnect();
			}
			if (euc.dbg) console.log("EUC: out");
		}
	}
};



//init
/*
if (Boolean(require("Storage").read('eucSlot' + require("Storage").readJSON("dash.json", 1).slot + '.json'))) {
	this.state.dash = require("Storage").readJSON('eucSlot' + require("Storage").readJSON("dash.json", 1).slot + '.json', 1);
}
else
	this.state.dash = require("Storage").readJSON("eucSlot.json", 1);
ew.def.dash.slot = require("Storage").readJSON("dash.json", 1).slot;
*/

//ew.UI.icon.euc="mEwwIjgn/8AgUB///wAFBg4FB8AFBh/BwfwCwUBwAYCv4FB/wFB/eAgPfEQPhAoOHwED4InBwfAgYsCgfAg4FCgPgg/AH4Xgh44CgHwh1gAgMMuEePId4jgWDnAFCEAIFDj8AAoUDJgM4ngQBLAM8n+Ag/wgP8AoXgAoIRCHoM8DoRJBFIYABAphNDgl4h1wAoMGuEPTAQ3BOIcDO4J9ERIcBR4S5BHoUAAoQPCAoI4DAqIAVA==";
//ew.UI.icon.euc="mEwwkAxAA/AF2M9/ICqfO//+/AWR53853v94XQxnuFgPM/3v/gtQ/4ABAYPs5gUMzOZCYQsB93s93uCpWJzOf/OZ5gVB93MMAPsFhW5C4gsB5gAB53+IRQUBz//zOcCoS8BMYIXHz+5C4W/C4jTCVYIXH/4XBCgIwBzOYBonPYBAVCz+bDAIWFC4P/C5GfLgWZA4OPLQgXBMA4PBFgmNawQqCBoJgHXgJDEFwQXDxi/JzO73BODE4PPFQaVBC4+73e6C4YsBGQIXDVgQXH3YvFC4pHIC4oUCxwXDxgXIxe7zYXFJYYXMPAYXIPBAXFCgPoC4x4J3LuCCgIACCQfM54YHbAIXHO4beEC47xCeAQQC5wFB/zwIC4gADLgPP//sSBGZzYXG9/uRgJcBxzhBAAuJF4pZC/ijC5/u9wXJPAXMLQP+FgfO9hgHC4nM93sH4RJB/3OAQJ4Jz/sLIYABDgJFBb4IXILIPuZgpcBFhAACXQQEBxzVD94sJC4ZZCx/vFJYAHx3ox3u95KFABaDB9gXBWw4AKCYIACIyYVBIiIvECqYA/AGQA==";

// install icon
if (!require('Storage').read("ew_i_euc.img")) {
    let icon="mEwwkAxAA/AF2M9/ICqfO//+/AWR53853v94XQxnuFgPM/3v/gtQ/4ABAYPs5gUMzOZCYQsB93s93uCpWJzOf/OZ5gVB93MMAPsFhW5C4gsB5gAB53+IRQUBz//zOcCoS8BMYIXHz+5C4W/C4jTCVYIXH/4XBCgIwBzOYBonPYBAVCz+bDAIWFC4P/C5GfLgWZA4OPLQgXBMA4PBFgmNawQqCBoJgHXgJDEFwQXDxi/JzO73BODE4PPFQaVBC4+73e6C4YsBGQIXDVgQXH3YvFC4pHIC4oUCxwXDxgXIxe7zYXFJYYXMPAYXIPBAXFCgPoC4x4J3LuCCgIACCQfM54YHbAIXHO4beEC47xCeAQQC5wFB/zwIC4gADLgPP//sSBGZzYXG9/uRgJcBxzhBAAuJF4pZC/ijC5/u9wXJPAXMLQP+FgfO9hgHC4nM93sH4RJB/3OAQJ4Jz/sLIYABDgJFBb4IXILIPuZgpcBFhAACXQQEBxzVD94sJC4ZZCx/vFJYAHx3ox3u95KFABaDB9gXBWw4AKCYIACIyYVBIiIvECqYA/AGQA==";
	require('Storage').write("ew_i_euc.img", require("heatshrink").decompress(atob(icon)));
}

