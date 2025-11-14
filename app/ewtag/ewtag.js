ew.apps.ewtag = {
	tid: { siren: 0, blink: 0 },
	state: {
		
		ble: {},
		data: { batt: 29 },
		//def: {store:[], pos:0, set:{phy: 0, minInterval: 15, maxInterval: 100, slaveLatency: 4, persist:0 }},
	},
	set: function(s) {},
	get: function(s) {
		return ew.def.bt;
	},
	init: function(s) {
		NRF.setServices({
			0xffe0: {
				0xffe1: {
					value: [0x01],
					maxLen: 20,
					writable: true,
					onWrite: function(evt) {
						ew.sys.emit("BTRX", evt.data);
					},
					readable: true,
					notify: true,
					description: "ew"
				}
			}
		}, { advertise: ['0xffe0'], uart: true });
	},
	send: function(a) {
		NRF.updateServices({
			0xffe0: {
				0xffe1: {
					value: a,
					notify: true
				}
			}
		});
	},
	adv: function(data) {
		NRF.setAdvertising({}, {
			name: "eC-" + ew.def.name,
			manufacturer: 0x0590,
			manufacturerData: ew.sys.batt(1) + "-" + ew.sys.batt(),
			connectable: true,
			scannable: true,
			phy: "1mbps"
		});
	},
	conn: function(c) {


		//ew.apps.ewtag.stopScan();
		/* NRF.requestDevice({ filters: [{ id: c }] }).then(function(device) {
		     global.devi=device;
		     return device.gatt.connect({
		         minInterval:ew.apps.ewtag.state.def.set.minInterval,
		          maxInterval:ew.apps.ewtag.state.def.set.maxInterval,
		             //minInterval: (-95 < ew.apps.ewtag.state.dev.find(item => item.id === c).rssi) ? 30 : 50,
		             //maxInterval: (-95 < ew.apps.ewtag.state.dev.find(item => item.id === c).rssi) ? 100 : 200,
		             phy: phy[ew.apps.ewtag.state.def.set.phy],
		             slaveLatency:ew.apps.ewtag.state.def.set.slaveLatency
		     });
		 }).then(function(ga) {*/


		NRF.connect(c, {
			minInterval: 7.5,
			maxInterval: 50,
			phy: "1mbps",
			slaveLatency: 8
		}).then(function(ga) {
			ew.apps.ewtag.state.ble.gatt = ga;
			if (ew.apps.ewtag.dbg) console.log("getting service...");

			// Χειρισμός αποσύνδεσης
			ga.device.on('gattserverdisconnected', function(reason) {
				ew.apps.ewtag.state.connected = 0;
				if (ew.apps.ewtag.dbg) console.log("disconnected: " + reason);
			});

			return ga.getPrimaryService(0xffe0);
		}).then(function(service) {

			if (ew.apps.ewtag.dbg) console.log("getting characteristic...");
			ew.apps.ewtag.state.ble.ffe0 = service;

			// Προσπάθεια λήψης του χαρακτηριστικού 0xffe1
			return service.getCharacteristic(0xffe1).catch(function(e) {
				if (ew.apps.ewtag.dbg) console.log("Characteristic 0xffe1 not available:", e);
				return null; // Επιστροφή null αντί να απορριφθεί η Promise
			});
		}).then(function(characteristic) {
			if (characteristic) {
				ew.apps.ewtag.state.ble.ffe1 = characteristic;
				characteristic.on('characteristicvaluechanged', ew.apps.ewtag.receive);
				if (ew.apps.ewtag.dbg) console.log("starting notifications...");
				return characteristic.startNotifications().then(function() {
					if (ew.apps.ewtag.dbg) console.log("waiting for notifications");
					return characteristic;
				}).catch(function(e) {
					if (ew.apps.ewtag.dbg) console.log("Notifications not supported:", e);
					return characteristic;
				});
			}
			else {
				if (ew.apps.ewtag.dbg) console.log("Skipping notifications - characteristic not available");
				return null;
			}
		}).then(function() {


			ew.apps.ewtag.state.connected = 1;
			if (ew.apps.ewtag.dbg) console.log("Connected");
		}).catch(function(e) {
			if (ew.apps.ewtag.dbg) console.log("ewtag disconnected: catch Error: " + e);

		});

	},
	receive: function(data) {
		if (ew.apps.ewtag.dbg) console.log("notification incoming data string: ", data.target.value.buffer);
		if (ew.apps.ewtag.dbg) console.log("notification incoming data string: ", E.toString(data.target.value.buffer));
	},
	blink: function(){
			if (ew.apps.ewtag.tid.blink) clearInterval(ew.apps.ewtag.tid.blink);
			ew.apps.ewtag.tid.blink=0;
			var count=0;
			ew.apps.ewtag.tid.blink=setInterval(function() {
			count++;
			digitalPulse(ew.pin.BL,1,[100,50,100,50,100])
			if (20<count){
				clearInterval(ew.apps.ewtag.tid.blink);
				ew.apps.ewtag.tid.blink=0;
			}
			},1000);
	},
	sound: {
		bell: function() {
			ew.apps.ewtag.blink();

			var highNote = 4500;
			var lowNote = 3000;
			var dur = 180;
			var shortPause = 50;
			var longPause = 100;
			// Ding
			analogWrite(ew.pin.BUZZ, 0.5, { freq: highNote });
			setTimeout(() => {
				pinMode(ew.pin.BUZZ, "output");
				digitalWrite(ew.pin.BUZZ, 0);
				setTimeout(() => {
					// Dong (1)
					analogWrite(ew.pin.BUZZ, 0.5, { freq: lowNote });
					setTimeout(() => {
						pinMode(ew.pin.BUZZ, "output");
						setTimeout(() => {
							// Dong (2)
							analogWrite(ew.pin.BUZZ, 0.5, { freq: lowNote });
							setTimeout(() => {
								pinMode(ew.pin.BUZZ, "output");
								digitalWrite(ew.pin.BUZZ, 0);
							}, dur);
						}, shortPause);
					}, dur);
				}, longPause);
			}, dur);
			return "Bell";
		},


		siren: function() {
			ew.apps.ewtag.blink();
			var freq = 3000;
			var goingUp = true;
			if (ew.apps.ewtag.tid.siren) clearInterval(ew.apps.ewtag.tid.siren);
			ew.apps.ewtag.tid.siren=0;
			var count = 0;
			ew.apps.ewtag.tid.siren = setInterval(function() {
				analogWrite(ew.pin.BUZZ, 0.5, { freq: freq });

				if (goingUp) {
					freq += 50;
					if (freq >= 5000) goingUp = false;
				}
				else {
					freq -= 50;
					if (freq <= 2000) goingUp = true;
				}
				count++;
				if (1000 < count) {
					clearInterval(ew.apps.ewtag.tid.siren);
					ew.apps.ewtag.tid.siren = 0;
					pinMode(ew.pin.BUZZ, "output");
					digitalWrite(ew.pin.BUZZ, 0);

				}
			}, 10);
			return "Siren";

		},
		whistle: function() {
			ew.apps.ewtag.blink();
			var startFreq = 3800; // Ξεκινάει ψηλά (σαν σφύριγμα)
			var midFreq = 3200; // Κατεβαίνει λίγο (για το "ding")
			var endFreq = 2800; // Κατεβαίνει περισσότερο (για το "dong")
			var slideDuration = 400; // Χρόνος για την ολίσθηση (πιο γρήγορα)
			var sustainDuration = 50; // Χρόνος που κρατάει η νότα
			var pauseBetween = 50; // Παύση μεταξύ ding και dong

			// 1. Ολίσθηση από το ψηλό (startFreq) στο midFreq ("ding") - ΚΑΤΕΒΑΣΙΜΟ
			for (let i = 0; i <= slideDuration; i++) {
				let t = i / slideDuration;
				let currentFreq = startFreq - t * (startFreq - midFreq);
				setTimeout(function() {
					analogWrite(ew.pin.BUZZ, 0.5, { freq: currentFreq });
				}, i);
			}

			// 2. Κράτα το "ding" για λίγο
			setTimeout(function() {
				// Σταμάτα προσωρινά για παύση (pauseBetween)
				pinMode(ew.pin.BUZZ, "output");
				digitalWrite(ew.pin.BUZZ, 0);

				// 3. Μετά την παύση, ολίσθηση από το midFreq ("ding") στο endFreq ("dong") - ΚΑΤΕΒΑΣΙΜΟ
				setTimeout(function() {
					for (let i = 0; i <= slideDuration; i++) {
						let t = i / slideDuration;
						let currentFreq = midFreq - t * (midFreq - endFreq);
						setTimeout(function() {
							analogWrite(ew.pin.BUZZ, 0.5, { freq: currentFreq });
						}, i);
					}
					// 4. Κράτα το "dong" για λίγο και σταμάτα
					setTimeout(function() {
						pinMode(ew.pin.BUZZ, "output");
						digitalWrite(ew.pin.BUZZ, 0);
					}, slideDuration + sustainDuration);
				}, pauseBetween); // Χρησιμοποιούμε FINALLY το pauseBetween εδώ!
			}, slideDuration + sustainDuration);
			return "Whistle";
		}


	}

};
if (require('Storage').readJSON('ew.json', 1).ewtag) {
	ew.apps.ewtag.state.def = require('Storage').readJSON('ew.json', 1).ewtag;

}
