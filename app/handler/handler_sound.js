//sounds

ew.sys.sound = {

	/*error() {
	  this.playMelody([
	    {freq: 2000, dur: 100},
	    {freq: 1200, dur: 100},
	    {freq: 600, dur: 200}
	  ]);
	},
	success() {
	  this.playMelody([
	    {freq: 1000, dur: 60},
	    {freq: 1300, dur: 60},
	    {freq: 1600, dur: 150}
	  ]);
	},*/
	warning() {
		if (!ew.pin.SND) return;
		this.playMelody([
			{ freq: 2500, dur: 60 },
			{ freq: 0, dur: 40 }, // σιωπή – βάζουμε freq:0 αλλά δεν θα παίξει, απλά μετράει χρόνο
			{ freq: 2500, dur: 60 }
		]);
	},
	/*
		stop(){
			this.playMelody([
	    		{freq: 1400, dur: 80},
	    		{freq: 900, dur: 150}
			]);
		},
		start() {
		  this.playMelody([
		    {freq: 900, dur: 80},
		    {freq: 1400, dur: 120}
		  ]);
		},*/
	notification() {
		if (!ew.pin.SND) return;
		this.playMelody([
			{ freq: 1600, dur: 70 },
			{ freq: 2000, dur: 70 },
			{ freq: 2500, dur: 150 }
		]);
	},
	action() {
		if (!ew.pin.SND) return;
		this.playMelody([
			{ freq: 1800, dur: 60 },
			{ freq: 2400, dur: 80 },
			{ freq: 1500, dur: 150 }
		]);
	},
	alert() {
		if (!ew.pin.SND) return;
		this.playMelody([
			{ freq: 2000, dur: 100 },
			{ freq: 1000, dur: 100 },
			{ freq: 2000, dur: 100 },
			{ freq: 1000, dur: 100 },
			{ freq: 2000, dur: 100 },
			{ freq: 1000, dur: 100 }
		]);
	},


	on() {
		if (!ew.pin.SND) return;
		this.playMelody([
			{ freq: 1800, dur: 300 },
			{ freq: 1700, dur: 150 }
		]);
	},

	off() {
		if (!ew.pin.SND) return;
		this.playMelody([
			{ freq: 2400, dur: 80 },
			{ freq: 1500, dur: 150 }
		]);
	},

	/*off() {
		this.playMelody([
			{ freq: 1200, dur: 80 },
			{ freq: 700, dur: 160 }
		]);
	},

	on() {
		this.playMelody([
			{ freq: 800, dur: 80 },
			{ freq: 1200, dur: 140 }
		]);
	},*/
	siren() {
		if (!ew.pin.SND) return;
		var freq = 3000;
		var goingUp = true;
		if (ew.tid.siren) clearInterval(ew.tid.siren);
		ew.tid.siren = 0;
		var count = 0;
		ew.tid.siren = setInterval(function() {
			analogWrite(ew.pin.SND, 0.5, { freq: freq });

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
				clearInterval(ew.tid.siren);
				ew.tid.siren = 0;
				pinMode(ew.pin.SND, "output");
				digitalWrite(ew.pin.SND, 0);

			}
		}, 10);
		//return "Siren";

	},
	bell() {
		if (!ew.pin.SND) return;
		var highNote = 4500;
		var lowNote = 3000;
		var dur = 180;
		var shortPause = 50;
		var longPause = 100;
		// Ding
		analogWrite(ew.pin.SND, 0.5, { freq: highNote });
		setTimeout(() => {
			pinMode(ew.pin.SND, "output");
			digitalWrite(ew.pin.SND, 0);
			setTimeout(() => {
				// Dong (1)
				analogWrite(ew.pin.SND, 0.5, { freq: lowNote });
				setTimeout(() => {
					pinMode(ew.pin.SND, "output");
					setTimeout(() => {
						// Dong (2)
						analogWrite(ew.pin.SND, 0.5, { freq: lowNote });
						setTimeout(() => {
							pinMode(ew.pin.SND, "output");
							digitalWrite(ew.pin.SND, 0);
						}, dur);
					}, shortPause);
				}, dur);
			}, longPause);
		}, dur);
		//return "Bell";
	},
	playMelody(melody, duty) {
		if (!ew.pin.SND) return;
		if (!duty) duty = 0.5;
		let time = 0;
		melody.forEach(note => {
			setTimeout(() => {
				analogWrite(ew.pin.SND, duty, { freq: note.freq });
			}, time);
			time += note.dur;
		});
		// Σβήσιμο στο τέλος
		setTimeout(() => {
			pinMode(ew.pin.SND, "output");
			digitalWrite(ew.pin.SND, 0);
		}, time);
	}
};
