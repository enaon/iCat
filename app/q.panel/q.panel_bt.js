//bt
ew.UI.nav.next.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	ew.face[0].page = 1 - ew.face[0].page;
	ew.face[0].face();
});
ew.UI.nav.back.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	ew.face[0].page = 1 - ew.face[0].page;
	ew.face[0].face();
});
//
ew.face[0].page = 0;
ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "BT OPTIONS", "", 0, 15);
ew.face[0].face = function() {

	if (!ew.face[0].page) {

		ew.UI.ele.ind(1, 2, 0);
		//ew.UI.ele.fill("_2x3",2,0);
		//ew.UI.ele.fill("_2x3",3,0);
		ew.UI.c.start(1, 0);
		ew.UI.btn.img("main", "_2x3", 1, "cli.face", "CLI", ew.def.bt.uart ? 15 : 3, ew.def.bt.uart ? 4 : 1); //4
		ew.UI.ele.fill("_2x3", 2, 0);
		ew.UI.btn.img("main", "_2x3", 3, "key.face", "PAIR", ew.def.bt.pair ? 15 : 3, ew.def.bt.pair ? 4 : 1);

		if (ew.apps.ewtag) {
			ew.UI.btn.img("main", "_2x3", 4, "ewt.face", "eTAG", ew.apps.ewtag.state.def.eTag ? 15 : 3, ew.apps.ewtag.state.def.eTag ? 4 : 1);
			ew.UI.btn.img("main", "_2x3", 5, "apl.face", "iTAG", ew.apps.ewtag.state.def.iTag ? 15 : 3, ew.apps.ewtag.state.def.iTag ? 4 : 1);
			ew.UI.btn.img("main", "_2x3", 6, "ggl.face", "gTAG", ew.apps.ewtag.state.def.gTag ? 15 : 3, ew.apps.ewtag.state.def.gTag ? 4 : 1);
		}else{
			ew.UI.ele.fill("_2x3", 4, 0);
			ew.UI.ele.fill("_2x3", 5, 0);
			ew.UI.ele.fill("_2x3", 6, 0);
		}
		
		ew.UI.c.end();

		ew.UI.c.main._2x3 = (i) => {
			if (i == 1) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.def.bt.uart = 1 - ew.def.bt.uart;

				if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "UART", ew.def.bt.uart ? "ENABLED" : "DISABLED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 1, "cli.face", "CLI", ew.def.bt.uart ? 15 : 3, ew.def.bt.uart ? 4 : 1);
				ew.comm.init();

			}

			else if (i == 3) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.def.bt.pair = 1 - ew.def.bt.pair;

				if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SECURE CODE", ew.def.bt.pair ? ew.def.bt.code : "DISABLED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 3, "key.face", "PAIR", ew.def.bt.pair ? 15 : 3, ew.def.bt.pair ? 4 : 1);
				ew.comm.init();
				
			}
			else if (i == 4) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.apps.ewtag.state.def.eTag = 1 - ew.apps.ewtag.state.def.eTag;
				if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "EW TAG", ew.apps.ewtag.state.def.eTag ? "ENABLED" : "DISABLED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 4, "ewt.face", "eTAG", ew.apps.ewtag.state.def.eTag ? 15 : 3, ew.apps.ewtag.state.def.eTag ? 4 : 1);
				ew.comm.init();			
			}
			else if (i == 5) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);

				if (!ew.apps.ewtag.state.def.iKey) {
					ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "APPLE KEY", "IS MISSING", 15, 13);
					return;
				}

				ew.apps.ewtag.state.def.iTag = 1 - ew.apps.ewtag.state.def.iTag;
				if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "APPLE TAG", ew.apps.ewtag.state.def.iTag ? "ENABLED" : "DISABLED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 5, "apl.face", "iTAG", ew.apps.ewtag.state.def.iTag ? 15 : 3, ew.apps.ewtag.state.def.iTag ? 4 : 1);
				ew.comm.updt();			
			}
			else if (i == 6) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				if (!ew.apps.ewtag.state.def.gKey) {
					ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "GOOGLE KEY", "IS MISSING", 15, 13);
					return;
				}

				ew.apps.ewtag.state.def.gTag = 1 - ew.apps.ewtag.state.def.gTag;
				if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "GOOGLE TAG", ew.apps.ewtag.state.def.gTag ? "ENABLED" : "DISABLED", 0, 15);
				ew.UI.btn.img("main", "_2x3", 6, "ggl.face", "gTAG", ew.apps.ewtag.state.def.gTag ? 15 : 3, ew.apps.ewtag.state.def.gTag ? 4 : 1);
				ew.comm.updt();			
			}
		};
	}
	else {
		ew.UI.ele.ind(2, 2, 0);

		ew.UI.c.start(1, 0);
		//ew.UI.btn.img("main", "_2x3", 1, ".face", "CLI", ew.def.bt.uart ? 15 : 3, ew.def.bt.uart ? 4 : 1); //4
        ew.UI.btn.c2l("main", "_2x3", 1, "GAIN", ew.def.bt.rfTX + "dB", 15, 1);
		ew.UI.btn.c2l("main", "_2x3", 2, "PHY", ew.def.bt.phyA.substring(0, 3).toUpperCase(), 15, ew.def.bt.phyA == "1mbps" ? 1 : 13);
		ew.UI.btn.c2l("main", "_2x3", 3, "INT", ew.def.bt.intA, 15, 1);
		ew.UI.btn.img("main", "_2x3", 4, "info.face", "MAC", 15, 1);
		ew.UI.ele.fill("_2x3", 5, 0);
		ew.UI.ele.fill("_2x3", 6, 0);

		ew.UI.c.end();

		ew.UI.c.main._2x3 = (i) => {
			if (i == 1) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                const options =  ["-8", "-4", "0", "+4", "+8"];
                const currentIndex = options.indexOf(ew.def.bt.rfTX);
                const nextIndex = (currentIndex + 1) % options.length;
                const newValue = options[nextIndex];
				ew.def.bt.rfTX=newValue;
				
                if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "GAIN", ew.def.bt.rfTX + " DECIBEL", 0, 15);
                ew.UI.btn.c2l("main", "_2x3", 1, "GAIN", ew.def.bt.rfTX + "dB", 15, 1);
				ew.comm.updt();			
            }

			else if (i == 2) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				if (ew.def.bt.phyA === "1mbps") ew.def.bt.phyA = "coded";
				else ew.def.bt.phyA = "1mbps";

				if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "PHY MODE", ew.def.bt.phyA.toUpperCase(), 0, 15);
				ew.UI.btn.c2l("main", "_2x3", 2, "PHY", ew.def.bt.phyA.substring(0, 3).toUpperCase(), 15, ew.def.bt.phyA == "1mbps" ? 1 : 13);
				ew.comm.updt();			
			}
			else if (i == 3) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "INTERVAL", "-MS-", 15, 6, 1);
				ew.is.slide = 1;
				ew.sys.TC.val = { cur: ew.def.bt.intA, dn: 300, up: 60000, tmp: 0, fire: 1, len: 1 };
				ew.UI.c.tcBar = (a, b, r) => {
					let val = ew.def.bt.intA;
					ew.UI.btn.ntfy(0, 2, 1);
					if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (100 < r ? 50 : 25));
					else val = b;
					ew.sys.TC.val.cur = val;
					//
					ew.UI.btn.c2l("main", "_2x3", 3, "INT", val, 15, 1);
					ew.def.bt.intA = val;
				};
				
			}
			else if (i == 4) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				
			
					ew.UI.btn.ntfy(0, 4, 1);
					ew.UI.btn.c2l("bar", "_bar",6, "MAC ADDRESS", (ew.apps.ewtag&& ew.apps.ewtag.state.addr) ? ew.apps.ewtag.state.addr.split(" ")[0].toUpperCase() :NRF.getAddress().toUpperCase(), 0, 15,0.9);	
				
					
				}
		
		};

	}
};
ew.face[0].face();
