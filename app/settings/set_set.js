E.setFlags({ pretokenise: 1 });
//
ew.UI.nav.next.replaceWith((x, y) => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	eval(require("Storage").read("ew_f_set_apps"));
	ew.face[0].bar();
});
ew.UI.nav.back.replaceWith((x, y) => {
	//"jit";
	if (ew.face[0].page == "set1-info") {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		ew.face[0].d1();
		if (ew.UI.ntid) {
			clearTimeout(ew.UI.ntid);
			ew.UI.ntid = 0;
		}
		ew.face[0].bar();
		return;
	}
	ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
//

ew.face[0].d1 = function() {
	ew.face[0].page = "set";
	ew.UI.ele.ind(1, 3, 0);
	ew.UI.c.start(1, 0);
	ew.UI.ele.fill("_main", 9, 0);

	ew.UI.btn.img("main", "_2x3", 1, ew.def.bt.adv ? "bt" : "plane", "BT", 15, ew.def.bt.adv ? ew.def.bt.phyA === "coded" ? 13 : 4 : 1);
	g.drawImage((ew.def.bt.rfTX == -8) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAPgAEQACIABEAAiAARAAIgAHz74=")) : (ew.def.bt.rfTX == 0) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4ADEABiAAxAfYgPsQEWICLEBFiAixARYgIsQHz74=")) : E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AARAAIgAEQD6IDFEBiiAxRfYovsUUWKKLFFFiiixRRYoosUXz74=")), (process.env.BOARD == "BANGLEJS2") ? 38 : 55, (process.env.BOARD == "BANGLEJS2") ? 31 : 65);
	ew.UI.btn.img("main", "_2x3", 2, "themes", "FACE", 15, 6);
	//ew.UI.btn.img("main", "_2x3", 3, "bri", ew.def.face.bri, 15, 6, (process.env.BOARD == "BANGLEJS2") ? 0.6 : 1, 1);
	ew.UI.btn.cInd("main", "_2x3", 3, ew.def.face.bri, "BRI", 15, 6, 0.9);
	ew.UI.btn.img("main", "_2x3", 4, ew.def.face.buzz ? "buzzOn" : "buzzOff", "BUZZ", ew.def.face.buzz ? 15 : 3, ew.def.face.buzz ? 4 : 1);
	//ew.UI.btn.img("main", "_2x3", 4, ew.def.face.buzz ? "buzzOn" : "buzzOff", "BUZZ", ew.def.face.buzz ? 15 : 3, ew.def.face.buzz ? 4 : 1);
	ew.UI.btn.img("main", "_2x3", 5, "wakeScreen", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
	ew.UI.btn.img("main", "_2x3", 6, "power", "PWR", 15, 6);
	//ew.UI.btn.img("main", "_2x3", 5, "info", "ABOUT", 15, 6);
	ew.UI.c.end();
	//
	ew.UI.c.main._2x3 = (i, l) => {
		if (i == 1) {
			if (l) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				if (ew.def.bt.rfTX === -8) ew.def.bt.rfTX = 0;
				else if (ew.def.bt.rfTX === 0) ew.def.bt.rfTX = ew.is.maxTx;
				else if (ew.def.bt.rfTX === ew.is.maxTx) ew.def.bt.rfTX = -8;
				NRF.setTxPower(ew.def.bt.rfTX);
				ew.UI.btn.img("main", "_2x3", 1, ew.def.bt.adv ? "bt" : "plane", "BT", 15, ew.def.bt.adv ? ew.def.bt.phyA === "coded" ? 13 : 4 : 1);
				g.drawImage((ew.def.bt.rfTX == -8) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAPgAEQACIABEAAiAARAAIgAHz74=")) : (ew.def.bt.rfTX == 0) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4ADEABiAAxAfYgPsQEWICLEBFiAixARYgIsQHz74=")) : E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AARAAIgAEQD6IDFEBiiAxRfYovsUUWKKLFFFiiixRRYoosUXz74=")), (process.env.BOARD == "BANGLEJS2") ? 38 : 55, (process.env.BOARD == "BANGLEJS2") ? 31 : 65);
				ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, ew.def.bt.rfTX == -8 ? "TX MIN" : ew.def.bt.rfTX == 0 ? "TX MED" : "TX MAX", "", 0, 15);

			}
			else {
				if (!ew.def.bt.adv) {
					ew.def.bt.adv = 1;
					ew.def.bt.phyA = "1mbps"

				}
				else if (ew.def.bt.phyA === "1mbps") {
					ew.def.bt.phyA = "coded"

				}
				else if (ew.def.bt.phyA === "coded") {
					ew.def.bt.adv = 0;
				}
				ew.comm.updt();
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				//if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "BLUETOOTH", ew.def.bt.uart ? "ENABLED" : "DISABLED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 1, ew.def.bt.adv ? "bt" : "plane", "BT", 15, ew.def.bt.adv ? ew.def.bt.phyA === "coded" ? 13 : 4 : 1);
				g.drawImage((ew.def.bt.rfTX == -8) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAPgAEQACIABEAAiAARAAIgAHz74=")) : (ew.def.bt.rfTX == 0) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4ADEABiAAxAfYgPsQEWICLEBFiAixARYgIsQHz74=")) : E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AARAAIgAEQD6IDFEBiiAxRfYovsUUWKKLFFFiiixRRYoosUXz74=")), (process.env.BOARD == "BANGLEJS2") ? 38 : 55, (process.env.BOARD == "BANGLEJS2") ? 31 : 65);
				if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "BLUETOOTH", ew.def.bt.adv?ew.def.bt.phyA == "1mbps"?"1MBIT":"CODED":"DISABLED", 0, 15);
				else g.flip();
			}
		}
		else if (i == 2) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			eval(require('Storage').read('ew_f_set_theme'));
			if (ew.UI.ntid) {
				clearTimeout(ew.UI.ntid);
				ew.UI.ntid = 0;
				ew.face[0].bar();
			}
		}
		else if (i == 3) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, " < BRIGHTNESS >", "", 15, 6, 1);
			ew.is.slide = 1;
			ew.sys.TC.val = { cur: ew.def.face.bri, dn: 1, up: (process.env.BOARD == "BANGLEJS2") ? 10 : 7, tmp: 0 , len:10 };
			ew.UI.c.tcBar = (a, b) => {
				ew.UI.btn.ntfy(0, 3, 1);
				ew.UI.btn.cInd("main", "_2x3", 3, b, "BRI", 15, 6, 0.9);
				g.bri.set(b);
			};
		}
		else if (i == 4) {
			ew.sys.buzz.sys(ew.sys.buzz.type.ok);
			ew.def.face.buzz = 1 - ew.def.face.buzz;
			if (ew.def.face.buzz) ew.sys.buzz.nav = digitalPulse.bind(null, ew.pin.BUZZ, ew.pin.BUZ0);
			else ew.sys.buzz.nav = function() { return true; };
			if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "HAPTIC", ew.def.face.buzz ? "ENABLED" : "DISABED", 0, 15);
			ew.UI.btn.img("main", "_2x3", 4, ew.def.face.buzz ? "buzzOn" : "buzzOff", "BUZZ", ew.def.face.buzz ? 15 : 3, ew.def.face.buzz ? 4 : 1);
		}

		else if (i == 5) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			if (process.env.BOARD == "BANGLEJS2") {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.is.bar = 1;
				ew.is.slide = 0;
				ew.UI.btn.ntfy(0, 1.5, 1, "_bar", 6, "", "", 15, 0);
				ew.UI.c.start(0, 1);
	    		ew.UI.ele.fill("_bar", 6, 0);
				ew.UI.btn.img("bar", "_bar", 4, "tilt", "TILT", 15, ew.def.dev.tilt ? 4 : 1, 1.5);
				ew.UI.btn.img("bar", "_bar", 5, "dtap", "DTAP", 15, ew.def.dev.tap ? 4 : 1, 1.5);
				ew.UI.c.end();
				ew.UI.c.bar._bar = (i) => {
					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					ew.UI.btn.ntfy(0, 2, 1, "_bar", 6, "", "", 15, 0);
					if (i == 4) {
						ew.def.dev.tilt = 1 - ew.def.dev.tilt;
						ew.UI.btn.img("bar", "_bar", 4, "tilt", "TILT", 15, ew.def.dev.tilt ? 4 : 1);
						ew.def.dev.acc = ew.def.dev.tilt + ew.def.dev.tap ? 1 : 0;
						ew.UI.btn.img("main", "_2x3", 5, "wakeScreen", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
						ew.sys.acc.updt(ew.def.dev.tilt + ew.def.dev.tap);
						if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "TILT", ew.def.dev.tilt ? "ENABLED" : "DISABED", 0, 15);

					}
					else if (i == 5) {
						ew.def.dev.tap = 2 - ew.def.dev.tap;
						ew.UI.btn.img("bar", "_bar", 5, "dtap", "DTAP", 15, ew.def.dev.tap ? 4 : 1);
						ew.def.dev.acc = ew.def.dev.tilt + ew.def.dev.tap ? 1 : 0;
						ew.UI.btn.img("main", "_2x3", 5, "wakeScreen", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
						ew.sys.acc.updt(ew.def.dev.tilt + ew.def.dev.tap);
						if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "DOUBLE TAP", ew.def.dev.tap ? "ENABLED" : "DISABED", 0, 15);

					}
				};
			}
			else {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.def.dev.acc = 1 - ew.def.dev.acc;
				if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "WAKE ON TWIST", ew.def.dev.acc ? "ENABLED" : "DISABED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 5, "wakeScreen", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
				ew.sys.acc.updt(ew.def.dev.accM);
			}
		}

		else if (i == 6) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.is.bar = 1;
			ew.is.slide = 0;
			ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "", "", 15, 0);
			ew.UI.c.start(0, 1);
			ew.UI.btn.img("bar", "_bar", 4, "restart", "RST", 15, 6);
			ew.UI.btn.img("bar", "_bar", 5, "power", "OFF", 15, 13);
			ew.UI.c.end();
			ew.UI.c.bar._bar = (i) => {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				if (i == 4) {
					ew.UI.btn.ntfy(1, 5, 0, "_bar", 6, "REBOOTING", "", 15, 13);
					ew.sys.reboot();
				}
				else if (i == 5) {
					ew.UI.btn.ntfy(1, 5, 0, "_bar", 6, "SLEEP MODE", "", 15, 13);
					ew.sys.sleep();
				}
			};
		}
		/*else if (i == 5) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.btn.ntfy(0, 10, 1, "_bar", 6, "", "", 15, 0);
			ew.UI.c.start(1, 1);
			ew.UI.c.end();
			let s = (getTime() - ew.is.boot) | 0;
			let d = 0;
			let h = 0;
			let m = 0;
			if (s > 864000) {
				ew.is.boot = getTime();
				s = (getTime() - ew.is.boot) | 0;
			}
			while (s > 86400) {
				s = s - 86400;
				d++;
			}
			while (s > 3600) {
				s = s - 3600;
				h++;
			}
			while (s > 60) {
				s = s - 60;
				m++;
			}
			ew.UI.btn.img("bar", "_main", 15, "kitty_bw1", "", 10, 0);
 
			ew.face[0].page = "set1-info";
			if (ew.UI.ntid) clearTimeout(ew.UI.ntid);
			ew.UI.ntid = setTimeout(() => {
				ew.UI.ntid = 0;
				ew.UI.txt.block("_main", 15, "\n" + "K.I.T.T.Y v2.0" + "\n\n" + "MEM: " + process.memory().free + "/" + process.memory().total + "\n" + "IMG: " + process.version + "-" + process.env.BOARD + "\n\n" + "UP: " + d + "D-" + h + "H-" + m + "M" + "\n" + "TEMP: " + E.getTemperature() + "\n\n" + "TOTAL: " + ew.apps.kitty.state.def.is.total + "\n\n" + "NAME: " + ew.def.name, 30, 15, 1, 1);
				g.setFont("Vector", 18);
				let time=Date().toString().split(" ");
				g.drawString( time[0]+" "+time[1]+ " "+time[2]+" "+time[4], 120 - g.stringWidth( time[0]+" "+time[1]+ " "+time[2]+" "+time[4] ) /2, 245);
				g.flip();
			}, 500);

		}
		*/
	};
};

ew.face[0].d1();
