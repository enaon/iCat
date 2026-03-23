//clock set time/date

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].page=ew.face[0].page=="time"?"date":ew.face[0].page=="date"?"year":"time";
    ew.face[0].bar();
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face[0].page=ew.face[0].page=="year"?"date":ew.face[0].page=="date"?"time":"year";
    ew.face[0].bar();
});

ew.face[0] = {
	offms: (ew.def.face.off[ew.face.appCurr])?ew.def.face.off[ew.face.appCurr]:60000,

	init: function(){
		if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;

		//get Date
		this.d=(Date()).toString().split(' ');
		this.t=(this.d[4]).toString().split(':');
		this.m=Date().getMonth();
        this.month=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

        //ew.UI.ele.fill("_main", 9, 6);

    	this.bar();
	},

	show : function(){
		return;
	},
	
    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.c.end();
        this[this.page||"time"]();
        ew.UI.ele.fill("_bar", 6, 0);
        ew.UI.btn.img("bar", "_bar", 6, "ew_i_"+ew.face.appCurr.split("-")[0]+".img", ew.face.appCurr.split("-")[0].toUpperCase(), 15, 0,0.8,1,1);
        
        //ew.UI.btn.c2l("main", "_bar", 6,  ew.face.appCurr.toUpperCase(), "",15, 1, 1.3);
        
    },

	time:function(){
        //ew.UI.ele.ind(1,3,0,15);

	    this.page="time";

		ew.UI.c.start(1,0);
		ew.UI.ele.fill("_main", 12, 0);
        ew.UI.btn.c2l("main", "_header", 6, "Time", "", 15, 0, 1.5);
        ew.UI.ele.ind(1,3,0,15);
        ew.UI.btn.c2l("main", "_main", 7, this.t[0],"", 3,1,3,10,"LECO1976Regular22");
        ew.UI.btn.c2l("main", "_main", 8, this.t[1],"", 3,1,3,10,"LECO1976Regular22");
		ew.UI.c.end();

        ew.UI.c.main._main = (i) => {
            if (i == 7) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.c2l("main", "_main", 7, this.t[0],"", 15,4,3,10,"LECO1976Regular22");
                ew.UI.btn.c2l("main", "_main", 8, this.t[1],"", 5,1,3,10,"LECO1976Regular22");
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6,  "< SET HOUR >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: Number(this.t[0]), dn: 0, up: 23, tmp: 0, fire: 1 ,len:15,loop:1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    this.set=1;
                    let val = this.t[1];
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    this.t[0] = val;
                    ew.UI.btn.c2l("main", "_main", 7, this.t[0],"", 15,4,3,10,"LECO1976Regular22");

                };
            }
            else if (i == 8) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.c2l("main", "_main", 7, this.t[0],"", 5,1,3,10,"LECO1976Regular22");
                ew.UI.btn.c2l("main", "_main", 8, this.t[1],"", 15,4,3,10,"LECO1976Regular22");
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6,  "< SET MIN >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: Number(this.t[1]), dn: 0, up: 59, tmp: 0, fire: 1 ,len:10, loop:1  };
                ew.UI.c.tcBar = (a, b, r) => {
                    this.set=1;
                    let val = this.t[1];
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    this.t[1] = val;
                    ew.UI.btn.c2l("main", "_main", 8, this.t[1],"", 15,4,3,10,"LECO1976Regular22");

                };
            }

        };
	},
	
	date:function(){
        ew.UI.btn.c2l("main", "_header", 6, "Date", "", 15, 0, 1.5);
	    this.page="date";
    	ew.UI.c.start(1,0);
            ew.UI.btn.c2l("main", "_main", 7, this.month[this.m],"", 3,1,2,10,"LECO1976Regular22");
            ew.UI.btn.c2l("main", "_main", 8, this.d[2],"", 3,1,2,10,"LECO1976Regular22");
            ew.UI.ele.ind(2,3,0,15);
		ew.UI.c.end();

        ew.UI.c.main._main = (i) => {
            if (i == 7) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.c2l("main", "_main", 7, this.month[this.m],"", 15,4,2,10,"LECO1976Regular22");
                ew.UI.btn.c2l("main", "_main", 8, this.d[2],"", 5,1,2,10,"LECO1976Regular22");
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6,  "< SET MONTH >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: this.m, dn: 0, up: 11, tmp: 0, fire: 1 ,len:15,loop:1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    this.set=1;
                    let val = this.m;
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    this.m = val;
                    ew.UI.btn.c2l("main", "_main", 7, this.month[this.m],"", 15,4,2,10,"LECO1976Regular22");

                };
            }
            else if (i == 8) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.c2l("main", "_main", 7, this.month[this.m],"", 5,1,2,10,"LECO1976Regular22");
                ew.UI.btn.c2l("main", "_main", 8, this.d[2],"", 15,4,2,10,"LECO1976Regular22");
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6,  "< SET DAY >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: Number(this.d[2]), dn: 1, up: 31, tmp: 0, fire: 1 ,len:10, loop:1  };
                ew.UI.c.tcBar = (a, b, r) => {
                    this.set=1;
                    let val = this.d[2];
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    this.d[2] = val;
                    ew.UI.btn.c2l("main", "_main", 8, this.d[2],"", 15,4,2,10,"LECO1976Regular22");

                };
            }

        };
	},
	year:function(){
        ew.UI.btn.c2l("main", "_header", 6, "Year", "", 15, 0, 1.5);
	    this.page="year";
	    
    	ew.UI.c.start(1,0);
            ew.UI.btn.c2l("main", "_main", 9, this.d[3],"", 3,1,3,10,"LECO1976Regular22");
            ew.UI.ele.ind(3,3,0,15);
		ew.UI.c.end();

        ew.UI.c.main._main = (i) => {
            if (i == 9) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.UI.btn.c2l("main", "_main", 9, this.d[3],"", 15,4,3,10,"LECO1976Regular22");
                ew.UI.btn.ntfy(1, 3, 0, "_bar", 6,  "< SET YEAR >", "", 15, 6, 1);
                ew.is.slide = 1;
                ew.sys.TC.val = { cur: Number(this.d[3]), dn: 2026, up: 2050, tmp: 0, fire: 1 ,len:10,loop:1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    this.set=1;
                    let val = this.d[3];
                    ew.UI.btn.ntfy(0, 2, 1);
                    if (11 < r && ew.sys.TC.val.dn < val && val < ew.sys.TC.val.up) val = val + (a * (20 < r ? 10 : 5));
                    else val = b;
                    ew.sys.TC.val.cur = val;
                    this.d[3] = val;
                    ew.UI.btn.c2l("main", "_main", 9, this.d[3],"", 15,4,3,10,"LECO1976Regular22");

                };
            }

        };
	},	
	tid: 0,
	run:false,
	clear : function(){
    	if (this.set){    
            let d = new Date();
            d.setDate(this.d[2]);
            d.setMonth(this.m);
            d.setFullYear(this.d[3]);
            d.setHours(this.t[0]);
            d.setMinutes(this.t[1]);
            d.setSeconds(0);
            setTime(d.getTime() / 1000);
    	}
    	return true;
	},
	off: function(){
		g.off();
	}
};


