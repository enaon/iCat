//settings
//
ew.UI.nav.next.replaceWith((x, y) => {
	ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith((x, y) => {

	ew.sys.buzz.nav(ew.sys.buzz.type.na);
});



ew.face[0] = {
	run: false,
	btn: {},
	data:{
		img:{
			restart:"lEuwIFCiAKDmAEDuAED+ADCgIEDgYEDg//4AEBh//BQU///8Agf/AgMfAgOACYQZCg/x//gFgU/DwXwh/4IAUHAgUwgYoCiEBAgQAB/xSD/1+AgV+/wECv4EBngEDCAN/DwJJBn4EODAIBBDoV8AgIxEv47DAgpvBgP+n4EC/k/OgJeBj50BNAJvCj50BGAXwUYPDQwMDR4KQBgIECEoN//5rCVwi4ECgISB",
			//power:"mEwwIdagfAAodD4YKD4fDBgUHAoPgAoMfAoP4AoM/wfB/gFBvwjBvwFB/gFBn4FB/AFBj8AgPwAoMPwED8AFBg/AAYIBJg4TB4EB8AFLh5fD+AFTAAQFSGoIEBHYYFKSQRpDVIYHBTwRVB+AFBPoKJBUgSVCUgShCAQk/wEBBwUfJQIaCg///4sCgYFBbwYFBLgcPG4QAXA=",
			bt:"mEwwIXUgYFFwAFE4AFE8AFE/AFE/gFE/wFE/4FE74qCgUD54qCg8D44qCh+D4fwAoXDAocD8YRDgPzDocA/YpDgF/Gok/IIkfJokPLIkHFwQFHCIodFFIo1FIIhNFLIplFOIp9FRIqVFUI6tFXIrFFaIrdFdIr/IABY=",
			plane:"lkwwIPMg4FE/AKE4AFDtwEDg1gAocjAgcDnAFDmOAAgUBxgKDjAbChkBwwJC8EMmAEBh8A4IbC+EEjAKDsBCC7/+g//4EN//gv//wFAEgUMgw0DsBQDgQKEkAKDg0EBQfgFYf4FYf8IIMGhhBDoJMDhhMCh0A4YhC4BtDPAOOPAifDgYaCAAMzRwcCPoQABsyvEXQl8AgcPDQcAuD/XABYA=",
			themes:"mEwwIHEgfwAocH/AFDh/8Aocf/wFDn//Aod/Aon//8PAQPBAomDAQMfAQMH//+AoP+BwIFC/gCE+AuB/Ef4AuC+EfwAuC8AFBgIFB4AFBgYFBwAFBFwJGBAoIuCAoQuCAoQuCAonwoAFBGgPgFIQLB4IFBQIJgB4EeRoJgB4Ecg+D/wFBjE/8P8h5XC+H4AoQzB+AFD/lAAoJdBIoIFDKIIFfQIIpDApB+BAoZsBAoX4PAPANIPwAoR1B+CtDcQaHCYAL3CTwIAC",
			buzzOff:"mEwwIdag/gEAIFEuAFBhwDBA4MAn18gPAAoP4j8DwEABAMDw4KBBAMBxwiCAQMcEQQCBnACBhgCBFwUYEoQFDgPYMgQlBzAFDg4aCAoMOAokcAok4AolwAongAoZUBAoZUBAoZUBAoZUBAoZdBAoZdBAoZdBAoVgRgMGKwPBRgMDQwODRgiDCgAFBQYQFCj//AAIaBn4FERgQACXYQABEoMYS4RdBAoZdCbYQuBboRPCIoL/TAAo",
			buzzOn:"mEwwIdag/gApMOuAFDn18Aof4j4ECgPAgeAAoIDBA4IiCAQIkChwCBEgUMKoQCBjACKBwUcAogaFAv4FEsACBgx8BPQQDBQwaMCTAYFH/4ACAozRNjCOCAo8MJITdHJIYAXA",
			wakeScreen:"mEwwJC/AAkPwAECgP//AFCg///4FCj4FBCQU/AoPgAoN/4Ef+AFB/wZBDwMB/gCCgUDBwV+h0HDQU/jkP4AsCvg/Dh/8j5JDAokH/k+Igf4Aoc//E8AoRbBvhhEAoUD//wjAnBwIFBEIRaEn/AgIFDJ4QFIKoQdDAoibDgECbfA=",
			tilt:"mEwwIYWAok4Aok8Aok+Aok/Agn/wAFCv//4AFC/4FGCIfwDonwFIUD8Hwnkf4EH+HwnE/8EPAoMQn/wh4RBgEfAoIdBEAQFNsAFEHAYF/ArSgBAAIFGg4FD8EDAoa6DAEAA=",
			dtap:"nE4wIvsgf/4AGDn///gGD/4BCCYXwgEPCoUPwEAgIJBgEeCIV4AQM8AwQDC+EB/+Ah4XB8EP//wg+AgfAn+B/gEBgeA/EAj8B4EHgfggEH4HghwXBD4VwjglBFoU4jg+EnEYHQJZBnkYTwJvCjgQBuEP4fwhwGBsAcBvEGAwNAnEAjkCEwVwgATCAAJFCAwaBBgYFCKwIGBJ4IGBKYQGCBQQQCAxAlEAywpJHxJMGLQxoHOwyECAwaSCAwagCAwauCAwcAvwFEAFwA==",
			info:"mE3wIcZn////+AoIEBAAOAgIFD4ED4AOBgfgg+ADYXwh4hDvEOAoc4AoscgEBD4McAoIhBgEYAoMHAoIMBAoPwAoYRCAoQdChAFBAAQjCApcBJ4I1FAoQ1CAoY1BAvBHFAoU8SoRZBTYytFXIqNDM4LRB/EPaILdB/kf/4OBj/+n/4DQUPvAmDh6zCEIQFEFYYABXIQAkA==",
			haptic:"mEwwI52jlwAYMOnEevAFBAYMfvgFBn34h++AoN9+EH74FB/fggfPAoPz4AFFCIodFFIMD4ApBGIMP+A1Dj/4GoccnA1DnEcGoYFBGoYFDCIodFFIo1HIIZrlSoahFVorp1A=",
			txt:"mEwwJC/ABEH/4AC8EPAofwAosfAof4ApnAkfEgYFCkOEAocxxgFC+AsBh4FCAQIFC+P8n+PBYQFBCIYFECIwdEFIvx+OPCIfhw4LC/Pj4+fL5oFEQZaVFa/Y",
			power:"lkuwIKHgP4AocfwAKN+P4+AJCz+fBYMH/P5/wKB/4KBCAMfBQP/wED/0fw/8gF/4P4n/gg/wFYIbB/w2BBAXABQM/wP8BQMD/AIBAIWD/BMC/k/JgUP4fwBQd+BQUH8/gBQV+BSJwCBQQABBQw2BAAI2CAoRBBRgUfNYKbDMQIFBMQQEBMQMPEwV/AIQlBQYIQBSIIXBCAN/4EB//An4pBh//AAIdCAgISBCAP/HIQQCaoa5BAoU/IYQAEA=",
		}
	},
	offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 25000,
	init: function(o) {
		ew.face.faceSave = [ew.face.appPrev, ew.face.pagePrev, ew.face.pageArg];
		//eval(require('Storage').read(o == 1 ? 'ew_f_set_set' : o == 2 ? 'ew_f_set_apps' : 'ew_f_set_dash'));

		this.bar();

		ew.face[0].page = "set";
		ew.UI.ele.ind(0, 0, 0, 0);
		ew.UI.c.start(1, 0);
		ew.UI.ele.fill("_header", 6, 0);
		ew.UI.ele.fill("_main", 12, 0);

		ew.UI.btn.img("main", "_2x3", 1, ew.def.bt.adv ? "bt.face" : "plane.face", "BT", 15, ew.def.bt.adv ? ew.def.bt.phyA === "coded" ? 13 : 4 : 1);
		g.drawImage((ew.def.bt.rfTX == -8) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAPgAEQACIABEAAiAARAAIgAHz74=")) : (ew.def.bt.rfTX == 0) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4ADEABiAAxAfYgPsQEWICLEBFiAixARYgIsQHz74=")) : E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AARAAIgAEQD6IDFEBiiAxRfYovsUUWKKLFFFiiixRRYoosUXz74=")), (process.env.BOARD == "BANGLEJS2") ? 38 : 55, (process.env.BOARD == "BANGLEJS2") ? 22 : 65);
		ew.UI.btn.img("main", "_2x3", 2, "themes.face", "FACE", 15, 6);
		ew.UI.btn.cInd("main", "_2x3", 3, ew.def.face.bri, "BRI", 15, 6, 0.9);
		ew.UI.btn.img("main", "_2x3", 4, ew.def.face.buzz ? "buzzOn.face" : "buzzOff.face", "BUZZ", ew.def.face.buzz ? 15 : 3, ew.def.face.buzz ? 4 : 1);
		ew.UI.btn.img("main", "_2x3", 5, "wakeScreen.face", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
		ew.UI.btn.img("main", "_2x3", 6, "power.face", "PWR", 15, 6);
		//ew.UI.btn.img("main", "_2x3", 5, "info.face", "ABOUT", 15, 6);
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
					ew.UI.btn.img("main", "_2x3", 1, ew.def.bt.adv ? "bt.face" : "plane.face", "BT", 15, ew.def.bt.adv ? ew.def.bt.phyA === "coded" ? 13 : 4 : 1);
					g.drawImage((ew.def.bt.rfTX == -8) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAPgAEQACIABEAAiAARAAIgAHz74=")) : (ew.def.bt.rfTX == 0) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4ADEABiAAxAfYgPsQEWICLEBFiAixARYgIsQHz74=")) : E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AARAAIgAEQD6IDFEBiiAxRfYovsUUWKKLFFFiiixRRYoosUXz74=")), (process.env.BOARD == "BANGLEJS2") ? 38 : 55, (process.env.BOARD == "BANGLEJS2") ? 22 : 65);
					ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, ew.def.bt.rfTX == -8 ? "TX MIN" : ew.def.bt.rfTX == 0 ? "TX MED" : "TX MAX", "", 0, 15);

				}
				else {
					if (!ew.def.bt.adv) {
						ew.def.bt.adv = 1;
						ew.def.bt.phyA = "1mbps";

					}
					else if (ew.def.bt.phyA === "1mbps") {
						ew.def.bt.phyA = "coded";

					}
					else if (ew.def.bt.phyA === "coded") {
						ew.def.bt.adv = 0;
					}
					ew.comm.updt();
					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					//if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "BLUETOOTH", ew.def.bt.uart ? "ENABLED" : "DISABLED", 0, 15);
					ew.UI.btn.img("main", "_2x3", 1, ew.def.bt.adv ? "bt.face" : "plane.face", "BT", 15, ew.def.bt.adv ? ew.def.bt.phyA === "coded" ? 13 : 4 : 1);
					g.drawImage((ew.def.bt.rfTX == -8) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAPgAEQACIABEAAiAARAAIgAHz74=")) : (ew.def.bt.rfTX == 0) ? E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4ADEABiAAxAfYgPsQEWICLEBFiAixARYgIsQHz74=")) : E.toArrayBuffer(atob("EyCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AARAAIgAEQD6IDFEBiiAxRfYovsUUWKKLFFFiiixRRYoosUXz74=")), (process.env.BOARD == "BANGLEJS2") ? 38 : 55, (process.env.BOARD == "BANGLEJS2") ? 22 : 65);
					if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "BLUETOOTH", ew.def.bt.adv ? ew.def.bt.phyA == "1mbps" ? "1MBIT" : "CODED" : "DISABLED", 0, 15);
					else g.flip();
				}
			}
			else if (i == 2) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				eval(require('Storage').read('ew_f_q.panel_theme'));
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
				ew.sys.TC.val = { cur: ew.def.face.bri, dn: 1, up: (process.env.BOARD == "BANGLEJS2") ? 10 : 7, tmp: 0 ,len:10};
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
				ew.UI.btn.img("main", "_2x3", 4, ew.def.face.buzz ? "buzzOn.face" : "buzzOff.face", "BUZZ", ew.def.face.buzz ? 15 : 3, ew.def.face.buzz ? 4 : 1);
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
					ew.UI.btn.img("bar", "_bar", 4, "tilt.face", "TILT", 15, ew.def.dev.tilt ? 4 : 1);
					ew.UI.btn.img("bar", "_bar", 5, "dtap.face", "DTAP", 15, ew.def.dev.tap ? 4 : 1);
					ew.UI.c.end();
					ew.UI.c.bar._bar = (i) => {
						ew.sys.buzz.nav(ew.sys.buzz.type.ok);
						ew.UI.btn.ntfy(0, 2, 1, "_bar", 6, "", "", 15, 0);
						if (i == 4) {
							
							ew.def.dev.tilt = 1 - ew.def.dev.tilt;
							ew.UI.btn.img("bar", "_bar", 4, "tilt.face", "TILT", 15, ew.def.dev.tilt ? 4 : 1);
							ew.def.dev.acc = ew.def.dev.tilt + ew.def.dev.tap ? 1 : 0;
							ew.UI.btn.img("main", "_2x3", 5, "wakeScreen.face", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
							ew.sys.acc.updt(ew.def.dev.tilt + ew.def.dev.tap);
							if (ew.def.face.info) {ew.is.bar = 0;ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "TILT", ew.def.dev.tilt ? "ENABLED" : "DISABED", 0, 15);}

						}
						else if (i == 5) {
							ew.def.dev.tap = 2 - ew.def.dev.tap;
							ew.UI.btn.img("bar", "_bar", 5, "dtap.face", "DTAP", 15, ew.def.dev.tap ? 4 : 1);
							ew.def.dev.acc = ew.def.dev.tilt + ew.def.dev.tap ? 1 : 0;
							ew.UI.btn.img("main", "_2x3", 5, "wakeScreen.face", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
							ew.sys.acc.updt(ew.def.dev.tilt + ew.def.dev.tap);
							if (ew.def.face.info) {ew.is.bar = 0;ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "DOUBLE TAP", ew.def.dev.tap ? "ENABLED" : "DISABED", 0, 15);}

						}
					};
				}
				else {
					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					ew.def.dev.acc = 1 - ew.def.dev.acc;
					if (ew.def.face.info) ew.UI.btn.ntfy(1, 0, 0, "_bar", 6, "WAKE ON TWIST", ew.def.dev.acc ? "ENABLED" : "DISABED", 0, 15);
					ew.UI.btn.img("main", "_2x3", 5, "wakeScreen.face", "WAKE", ew.def.dev.acc ? 15 : 3, ew.def.dev.acc ? 4 : 1);
					ew.sys.acc.updt(ew.def.dev.accM);
				}
			}

			else if (i == 6) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.is.bar = 1;
				ew.is.slide = 0;
				ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "", "", 15, 0);
				ew.UI.c.start(0, 1);
				ew.UI.ele.fill("_bar", 6, 0);
				ew.UI.btn.img("bar", "_bar", 4, "restart.face", "RST", 15, 6);
				ew.UI.btn.img("bar", "_bar", 5, "power.face", "OFF", 15, 13);
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

		};
		

	},
	show: function(s) {
		
	},
	clear: function(o) {
		ew.is.slide = 0;
		if (this.tid) clearTimeout(this.tid);
		this.tid = 0;
		return true;
	},
	bar: function() {
		ew.is.bar = 0;
		ew.UI.c.start(0, 1);
		ew.UI.c.end();
        ew.UI.ele.fill("_bar", 6, 0);
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", ew.face.appCurr.split("-")[0].toUpperCase(), 15, 0,0.8,1,1);
		//ew.UI.btn.c2l("main", "_bar", 6, ew.face.appCurr.toUpperCase(), "", 15, 1, 1.3);

	},

	off: function(o) {
		g.off();
		this.clear(o);
	}
};
//
