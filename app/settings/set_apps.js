E.setFlags({ pretokenise: 1 });
//touch
ew.UI.nav.next.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if ((ew.UI.ntid)) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	eval(require("Storage").read("ew_f_set_dash"));
	ew.face[0].bar();
});
ew.UI.nav.back.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if ((ew.UI.ntid)) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	eval(require("Storage").read("ew_f_set_set"));
	ew.face[0].bar();
});
//
ew.face[0].page = "app";
ew.UI.ele.ind(2, 3, 0);
ew.UI.ele.fill("_main", 9, 0);
ew.UI.c.start(1, 0);

	ew.UI.btn.c2l("main", "_3x1", 1, "START CLEAN", "", 15, 6, 1.3);
	ew.UI.btn.c2l("main", "_3x1", 2, "EMPTY SAND", "", 15, 1, 1.3);
	ew.UI.c.main._3x1 = (i, l) => {
		if (i == 1) {
			if (l) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.sys.emit("button", "long");
			}
			else {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "HOLD TO", "START CLEAN", 15, 6);
			}
		}
		else if (i == 2) {
			if (l) {
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
				ew.sys.emit("button", "triple");
			}
			else 
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);

			ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "HOLD TO", "EMPTY SAND", 15, 6);
					
	};
}
ew.UI.c.end();
//
