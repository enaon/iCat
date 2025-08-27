//charging notify
ew.is.chargeTick=0;
ew.tid.charge = setWatch(function(s) {
	if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "Magic3" || process.env.BOARD == "ROCK")
			s.state = 1 - s.state;
	ew.is.ondc = s.state;
	ew.sys.emit('charge', s);
}, ew.pin.CHRG, { repeat: true, debounce: 100, edge: 0 });

if (process.env.BOARD == "DSD6") {
	ew.sys.on('charge', (s) => {
		"ram";
		ew.is.chargeTick++;
		if (ew.tid.chargeDelay) clearTimeout(ew.tid.chargeDelay);
		ew.tid.chargeDelay = setTimeout((s) => {
			ew.is.chargeTick = 0;
			ew.tid.chargeDelay = 0;
		}, 1000, s.state);
		if (3 < ew.is.chargeTick && s.state && ew.tid.chargeDelay ) {
				clearTimeout(ew.tid.chargeDelay);
				ew.tid.chargeDelay = 0;
		}
	});
}
else {
	ew.sys.on('charge', (s) => {
		let co;
		if (s.state) {
			ew.sys.buzz.nav(200);
			ew.sys.acc.off();
		}
		else {
			ew.sys.buzz.nav([100, 80, 100]);
			ew.do.update.acc();
		}
		if (ew.face.pageCurr < 0 || ew.face.batt) {
			//g.clear();
			g.setCol(0, (ew.is.ondc) ? 4 : 0);
			g.fillRect(0, 0, 240, 280);
			g.setCol(1, 11);
			let img = require("heatshrink").decompress(atob("wGAwJC/AA0D///4APLh4PB+AP/B/N/BoIAD/gPHBwv//wPO/4PH+F8gEHXwN8h4PIKgwP/B/4P/B/4PbgQPOg4POh+AB7sfB50/H5wPPv4PO/4PdgIPP94PNgfPB5sHB5+PB5sPB50fBgQPLjwPOn0OB5t8jwPNvAPO/APNgPwB53gB5sDB5/AB5sHwAPNh+Aj//4APLYAIPMj4POnwhBB5k8AgJSBB5V8LoQPL/BtDB5TRCKQIPJZwIEBSAIPJXwIEBMQQPJ4AEBKQIPJg4PCvAPKRgP+MQQPNYgYPKMQR/KLoMBMQIPLjxiCB5ccMQQPLnjeBB5reBB5zhDB5TeBB5reBB5s8B5s4bwIPMvDeBB5reBB5oDCB5d5B517bwIPNZwIPMu4PO/7OBB7oGCB5f+B738B7sBZwQPcGQQPMZwQPbgDOCB5gADB/4P/B/4PY/4AGB69/Bwv+B538B44Ar"));
			g.drawImage(img, 60, 30);
			g.setFont("Vector", 30);
			g.drawString(ew.sys.batt("info").percent+ "%", 125 - (g.stringWidth(ew.sys.batt("info").percent+ "%") / 2), 180);
			g.setFont("Vector", 20);
			g.drawString(ew.sys.batt("info").volt+ " V", 125 - (g.stringWidth(ew.sys.batt("info").volt+ " V") / 2), 230);
			g.flip();
			if (ew.face.offid) clearTimeout(ew.face.offid);
			ew.face.offid = setTimeout(() => {
				ew.face.pageCurr = -1;
				ew.face.batt = 0;
				g.clear();
				g.off();
				ew.face.offid = 0;
			}, 2000);
			if (!g.isOn) {
				ew.face.batt = 1;
				ew.face.pageCurr = 0;
				g.on();
			}
		}

	});
}
