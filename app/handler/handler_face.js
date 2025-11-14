//face

ew.face={
	appCurr:"none",
	appPrev:"none",
	pageCurr:-1,
	pagePrev:-1,	
	pageArg:"",
	faceSave:-1,
	mode:0,
	offid:0,
	offms:-1,
	off:function(t){ 
		if (ew.face.dbg) console.log ("in ew.face.off(t)",t);
		if (this.pageCurr===-1) return;
		if (this.offid) {clearTimeout(this.offid); this.offid=0;}
		this.offms=(t)?t:ew.face[this.pageCurr].offms;
		this.offid=setTimeout((c)=>{
			ew.face.offid=0; 
			ew.face.go(this.appCurr,-1);
		},this.offms,this.pageCurr);
	},
	go:function(app,page,arg){
		//arg= arg||this.pagArg;
		if(!g.isOn) ew.sys.batt("info").percent;
		this.appPrev=this.appCurr;
		this.pagePrev=this.pageCurr;
		this.appCurr=app;
		this.pageCurr=page;
		if (this.pagePrev==-1&&g.isOn) {g.clear();g.off();return;}
		if (this.pagePrev!=-1) {
			ew.face[this.pagePrev].clear(); 
		}
		if (this.pageCurr==-1 && this.pagePrev!=-1) {
			ew.sys.TC.stop();	
			/*if (process.env.BOARD == "BANGLEJS2"){
				this.pageCurr=0;
				g.off();	
				return;
			}*/
			ew.sys.acc.go=0;
			ew.face[this.pagePrev].off();
			if (this.offid) {clearTimeout(this.offid); this.offid=0;}
			if (this.appCurr!=this.appPrev) {
				if (ew.face[app]) {
					ew.face[0]=ew.face[ew.face.appCurr][0];ew.face[1]=ew.face[ew.face.appCurr][1];
				}else eval(require('Storage').read("ew_f_"+app));	
			}
			return;
		}
		if (this.appCurr!=this.appPrev) {
			ew.face[2]=0;ew.face[5]=0;
			this.appRoot=[this.appPrev,this.pagePrev,this.pageArg];
			if (ew.face[app]) {
				ew.face[0]=ew.face[ew.face.appCurr][0];ew.face[1]=ew.face[ew.face.appCurr][1];
			}else eval(require('Storage').read("ew_f_"+app));
		} 
		this.off();
		ew.face[page].init(arg);	
		if(!g.isOn) {
			ew.sys.TC.start();
			g.on();
		}
		ew.face[page].show(arg);
		//this.pageArg="";
		if(arg) this.pageArg=arg;
	}
};

