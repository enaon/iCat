E.setFlags({ pretokenise: 1 });
//touch
ew.UI.nav.next.replaceWith(() => {
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if ((ew.UI.ntid)) {
		clearTimeout(ew.UI.ntid);
		ew.UI.ntid = 0;
	}
	//eval(require("Storage").read("ew_f_set_dash"));
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

	ew.UI.btn.c2l("main", "_3x1", 1, "SCANNER", "", 15, 1, 1.3);
	ew.UI.btn.c2l("main", "_3x1", 2, "TIMERS", "", 15, 1, 1.3);
	ew.UI.c.main._3x1 = (i, l) => {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);

		if (i == 1) 
			ew.face.go("itag-scan",0);
		else if (i == 2) 
			ew.face.go("timer",0);
					
	
};
ew.UI.c.end();
//
