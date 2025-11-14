//main

ew.UI.nav.next.replaceWith(()=>{
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if (ew.UI.ntid) {clearTimeout(ew.UI.ntid);ew.UI.ntid=0;}
	ew.face.go("timer",0);
});
ew.UI.nav.back.replaceWith(()=>{
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if (ew.UI.ntid) {clearTimeout(ew.UI.ntid);ew.UI.ntid=0;}
		ew.face.go("itag-scan",0);
});
if (ew.def.face.bri<3) ew.UI.theme.current= ew.UI.theme.white;
ew.UI.theme.current= ew.UI.theme.dark;
ew.face[0] = {
	offms: (ew.def.face.off[ew.face.appCurr])?ew.def.face.off[ew.face.appCurr]:10000,
	old:ew.def.face.bpp?0:1,
	init: function(){
		if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;

		//g.clear(1);
		this.startTime=getTime();
		this.v=ew.sys.batt(1);
		ew.UI.c.start(1,1);ew.UI.c.end();
		this.gui=process.env.BOARD=="BANGLEJS2"?
		{
			top:[0,0,179,45],
			note:[0,40,179,45],
			date:[6,12,110,40],
			dateN:[0,42,110,44],
			bat:[110,11,174,40],
			batN:[110,42,176,44],
			hour:[0,44,94,123],
			min:[89,44,176,123],
			//min:[80,45,155,115],
			sec:[155,44,176,123],

			btm:[0,115,179,122],
			secY:[65,90],
			time:[84,93,57],
			dots:[89,80],
			txt:18*ew.UI.size.txt,
			txtS:12*ew.UI.size.txt,
			txtM:25*ew.UI.size.txt,
			txtL:60*ew.UI.size.txt
		}
		:{
			top:[0,20,239,54],
			note:[0,55,239,90],
			sec:[202,75,239,185],
			hour:[1,75,100,185],
			min:[99,75,202,185],
			btm:[0,176,239,200],
			bat:[145,30,225,55],
//			batN:[140,55,239,65],
			batN:[140,55,230,65],
			date:[0,30,145,55],
//			dateN:[0,55,140,65],
			dateN:[10,55,125,65],			
			dots:[100,133],
			time:[89,111,105],
			secY:[108,138],
			txt:25*ew.UI.size.txt,
			txtS:18*ew.UI.size.txt,
			txtM:32*ew.UI.size.txt,
			txtL:85*ew.UI.size.txt
		};
        ew.UI.ele.ind(0,0,0,0);

		//top
		
		g.setCol(1,ew.UI.theme.current.clock.top);
		g.fillRect(this.gui.top[0],this.gui.top[1],this.gui.top[2],this.gui.top[3]); 
		g.setCol(1,ew.UI.theme.current.clock.back);
		g.fillRect({x:this.gui.note[0],y:this.gui.note[1],x2:this.gui.note[2],y2:this.gui.note[3],r:0}); 
		g.fillRect({x:this.gui.btm[0],y:this.gui.btm[1],x2:this.gui.btm[2],y2:this.gui.btm[3],r:0}); 
		//g.fillRect(this.gui.btm[0],this.gui.btm[1],this.gui.btm[2],this.gui.btm[3]); 
		g.setCol(0,0);
		if (this.old)g.flip();
		this.hour=-1;
		this.min=-1;
		this.sec=-1;
		this.batt=-1;
		 this.bt=-1;
		 this.vol=50;
		this.time();
		this.bat();
		this.date();
		this.bar();
		g.setFont("Vector",this.gui.txtL);

		if (ew.apps.itag && ew.apps.itag.state.ble.focus)
			ew.UI.btn.ntfy(1, 5, 0, "_bar", 6,"FOCUS IS ON",ew.apps.itag.state.def.store[ew.apps.itag.state.ble.focus].name.toUpperCase(), 15, 13);
		//else ew.UI.btn.ntfy(1,3,0,"_bar",6,ew.def.name,". . . . . . . . .",11,0,0);g.flip();
		else if (ew.is.bt==6||ew.is.bt==3) this.hid();
		else if (process.env.BOARD==="BANGLEJS2" && ew.def.face.info && ew.face.appPrev === "main") 
			ew.UI.btn.ntfy(1,2,0,"_bar",6,"AWAKE","",0,15);
		else {
			ew.UI.btn.ntfy(0,3,1);
			ew.UI.btn.c2l("bar","_bar",6,"eucWatch",ew.def.name,15,4,1.8);
			
		}

		this.run=true;
	},
	show : function(){
		if (ew.def.face.bri<3) ew.UI.theme.current= ew.UI.theme.white;
		else ew.UI.theme.current= ew.UI.theme.dark;
		if (!this.run) return;
		if (this.batt!=ew.is.ondc ){
			this.bat();
		}
		if (this.bt!=ew.is.bt ){
			this.date();
		}
		this.time();
	
	if (ew.tid.time) clearTimeout(ew.tid.time);
		
	ew.tid.time=setTimeout(()=>{
			ew.tid.time= 0;
			this.show();
		},g.isOn?250:60000,);
	},
	bar:function(){
		if (ew.is.bt==6||ew.is.bt==3){this.hid();return;}
		//ew.UI.ele.ind(2,4,0,0);
		ew.UI.ele.fill("_bar",6,4);
		ew.UI.c.start(1,1);
		if (ew.def.hid){
			ew.UI.ele.coord("main","_main",3);
			ew.UI.c.main._main=(i)=>{ 
				ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			    if (i==3) {
				    this.hid();
				}   
			};
		}
		ew.UI.c.end();
		
	},
	date:function(){
	 //if (ew.is.bt != this.bt){
			this.bt=ew.is.bt;
			this.ring=0;
			var colbt=ew.UI.theme.current.clock.dateB;
			if (this.bt==1)  colbt=14;
			else if (this.bt==2)  colbt=9;
			else if (this.bt==3)  colbt=11;
			else if (this.bt==5)  colbt=15;
			else if (this.bt==6)  colbt=4;
			g.setCol(0,colbt);
			g.fillRect(this.gui.dateN[0],this.gui.dateN[1],this.gui.dateN[2],this.gui.dateN[3]); 
			g.setCol(0,ew.UI.theme.current.clock.top);
			g.fillRect(this.gui.date[0],this.gui.date[1],this.gui.date[2],this.gui.date[3]); 
			g.setCol(1,ew.UI.theme.current.clock.dateF);
			//g.setFont("Teletext10x18Ascii",2);
			g.setFont("LECO1976Regular22",1.5)
			//g.setFont("Vector",this.gui.txtM);
			g.drawString(this.d[2]+" "+this.d[0].toUpperCase(), ((this.gui.date[2]-this.gui.date[0])/2-(g.stringWidth(this.d[2]+" "+this.d[0].toUpperCase()))/2) ,this.gui.date[1]); //date
			if (this.old)g.flip();
	//	}
	},
	bat:function(){
			this.batt=ew.is.ondc;
			this.v=ew.sys.batt(1);
			if (this.batt==1) g.setCol(0,9);
			else if (this.v<=20) g.setCol(0,13);
			else g.setCol(0,ew.UI.theme.current.clock.batB);
			//g.fillRect(162,20,235,60);//batt
			g.fillRect(this.gui.batN[0],this.gui.batN[1],this.gui.batN[2],this.gui.batN[3]); 
			
			g.setCol(0,ew.UI.theme.current.clock.top);
			g.fillRect(this.gui.bat[0],this.gui.bat[1],this.gui.bat[2],this.gui.bat[3]); 
			
			
			g.setCol(1,ew.UI.theme.current.clock.batF);
			if (this.v<=0) {g.setFont("Vector",this.gui.txt);g.drawString("EMPTY",this.gui.bat[2]-5-(g.stringWidth("EMPTY")),this.gui.bat[1]); 
			}else if (this.v<100) {
				g.setFont("Vector",this.gui.txtM);
				g.drawString(this.v,this.gui.bat[2]-(g.stringWidth(this.v)),this.gui.bat[1]);
				g.drawImage((this.batt==1)?require("heatshrink").decompress(atob("jEYwIKHiACEnACHvACEv/AgH/AQcB/+AAQsAh4UBAQUOAQ8EAQgAEA==")):require("heatshrink").decompress(atob("jEYwIEBngCDg//4EGgFgggCZgv/ASUEAQQaBHYPgJYQ=")),this.gui.bat[0],this.gui.bat[1]-3);
				//g.drawImage(this.image("batteryMed"),212,12);
			}else  {
				g.setFont("Vector",this.gui.txt);
				g.drawString("FULL",this.gui.bat[2]-(g.stringWidth("FULL")),this.gui.bat[1]); 
			} 
	},	
	hid:function(){
		ew.UI.btn.ntfy(0,3,1);
		ew.UI.c.start(0,1);
		ew.UI.btn.img("bar","_bar",1,"volDn","",0,4);
		ew.UI.btn.img("bar","_bar",2,"playPause","",0,15);
		ew.UI.btn.img("bar","_bar",3,"volUp","",0,4);
		//ew.UI.ele.coord("bar","_bar",2);
		ew.UI.ele.coord("bar","_bar",3);
		ew.UI.c.end();
		ew.UI.c.bar._bar=(i,l)=>{ 
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		    if (i==1) {
		    	if (l) { 
		    		ew.UI.btn.ntfy(1,1,0,"_bar",6,"LONG HOLD:","PREV",0,15);g.flip();
		    		if (ew.is.bt==6)
		    			ew.is.hidM.do("prev");
		    		else  ew.gbSend({ "t": "music", "n": "previous" });
		    		
		    	}else {
		    		if (ew.is.bt==6)
		    			ew.is.hidM.do("volumeDown");
		    		else  {
		    			ew.UI.btn.img("bar","_bar",1,"volDn","",11,4);
	    				ew.UI.btn.ntfy(0,0.5,1);
		    			ew.gbSend({ "t": "music", "n": "volumedown" });
		    			
		    		}
		    	}
		    }    else if (i==2) {
		    	if (l) { 
		    		ew.UI.btn.ntfy(1,1,0,"_bar",6,"LONG HOLD:","MUTE",0,15);g.flip();
		    		if (ew.is.bt==6)
		    			ew.is.hidM.do("mute");
		    		else  ew.gbSend({ "t": "music", "n": "pause" });
		    	}else {
		    		if (ew.is.bt==6)
		    			ew.is.hidM.do("playpause");
		    		else {
		    			ew.UI.btn.img("bar","_bar",2,gb.is.state=="play"?"pause":"play","",11,0);
		    			ew.UI.btn.ntfy(0,1,1);
		    			if (gb.is.state!="play"){
		    				gb.is.state="play";
		    				ew.gbSend({ "t": "music", "n": "play" });
		    			}else{
		    				gb.is.state="pause";
		    				ew.gbSend({ "t": "music", "n": "pause" });
		    			}
		    		}
		    	}
		    }    else if (i==3) {
		    	if (l){
		    		ew.UI.btn.ntfy(1,1,0,"_bar",6,"LONG HOLD:","NEXT",0,15,0);g.flip();
		    		if (ew.is.bt==6)
		    			ew.is.hidM.do("next");
		    		else  ew.gbSend({ "t": "music", "n": "next" });

		        }else {
		    		if (ew.is.bt==6)
		        		setTimeout(()=>{ew.is.hidM.do("volumeUp");},0);
   		    		else  {
   		    			ew.gbSend({ "t": "music", "n": "volumeup" });
   		    			ew.UI.btn.img("bar","_bar",3,"volUp","",11,4);
	    				ew.UI.btn.ntfy(0,0.5,1);
   		    		}
		        }
		    }
			
		};
	},

	time:function(){
		//minutes
		//this.timeStart=getTime();
		this.d=(Date()).toString().split(' ');
		this.t=(this.d[4]).toString().split(':');
		this.s=(this.t[2]).toString().split('');
		this.fmin=ew.UI.theme.current.clock.minF;
		this.fhr=ew.UI.theme.current.clock.hrF;
		this.bmin=ew.UI.theme.current.clock.minB;this.fsec=ew.UI.theme.current.clock.secF;this.bsec=ew.UI.theme.current.clock.secB;
		//minutes
		if (this.t[1]!=this.min ){
			this.min=this.t[1];
			//g.setFontLECO1976Regular42();
			g.setFont("LECO1976Regular22",3)
			//g.setFont("Vector",this.gui.txtL);
			//this.fmin=ew.UI.theme.current.clock.minF;
			//this.fhr=ew.UI.theme.current.clock.hrF;
			if (global.alrm) {
				if (alrm.buzz!=-1) {this.bmin=1;this.fmin=13;this.fsec=13;this.bsec=1;}
				else if (alrm[1].tmr!==-1||alrm[2].tmr!==-1||alrm[3].tmr!==-1) {this.bmin=5;this.fsec=15;this.bsec=0;}
				else  {this.bmin=1;this.fsec=15;this.bsec=1;}
			}//else {this.bmin=ew.UI.theme.current.clock.minB;this.fsec=ew.UI.theme.current.clock.secF;this.bsec=ew.UI.theme.current.clock.secB;}
			g.setCol(0,this.bmin);
			g.fillRect({x:this.gui.min[0],y:this.gui.min[1],x2:this.gui.min[2],y2:this.gui.min[3],r:0}); 
			g.setCol(1,this.fmin);
			g.drawString(this.t[1],this.gui.time[1],this.gui.time[2]);
			if (this.old)g.flip();
		}
		//seconds
		if (process.env.BOARD!="BANGLEJS2"){
			g.setCol(0,this.bsec);
			g.fillRect({x:this.gui.sec[0],y:this.gui.sec[1],x2:this.gui.sec[2],y2:this.gui.sec[3],r:10}); 
			g.setCol(1,this.fsec);//
			g.setFontLECO1976Regular22();
			//g.setFont("Vector",this.gui.txtS);
			let sec=(ew.def.time.hr24)?"24":(this.t[0]<12)?"AM":"PM";
			g.drawString(sec,this.gui.sec[2]-5-(g.stringWidth(sec)),this.gui.secY[0]); //hours mode
			g.setFontLECO1976Regular22();
			//g.setFont("Vector",this.gui.txt);
			g.drawString(this.s[0]+this.s[1],this.gui.sec[2]-5-(g.stringWidth(this.s[0]+this.s[1])),this.gui.secY[1]); //seconds
		}
		g.setCol(1,this.s[1] % 2 == 0?this.fsec:this.bsec);
		g.fillRect(this.gui.dots[0]-3,this.gui.dots[1]-10,this.gui.dots[0]+3,this.gui.dots[1]-5);
		g.fillRect(this.gui.dots[0]-3,this.gui.dots[1]+5,this.gui.dots[0]+3,this.gui.dots[1]+10);
		if (this.run) g.flip();
		else if (this.old) g.flip();
		//hours
		if (this.t[0]!=this.hour){
			this.hour=this.t[0];
			g.setCol(0,this.bmin);
			g.fillRect({x:this.gui.hour[0],y:this.gui.hour[1],x2:this.gui.hour[2],y2:this.gui.hour[3],r:10}); 
			g.setCol(1,this.fhr);
			g.setFont("LECO1976Regular22",3);
			//g.setFontLECO1976Regular42();
			//g.setFont("Vector",this.gui.txtL);
			if (ew.def.time.hr24) {
				g.drawString(this.hour,this.gui.time[0]-(g.stringWidth(this.hour)),this.gui.time[2]); //hours
			} else {	
				this.hour=(this.hour<10)?(this.hour=="00")?12:this.hour[1]:(this.hour<13)?this.hour:this.hour-12;
				g.drawString(this.hour,this.gui.time[0]-(g.stringWidth(this.hour)),this.gui.time[2]); //hours
			}
			//g.fillRect(this.gui.dots[1]-2,115,this.gui.dots[1]+2,119);
			//g.fillRect(this.gui.dots[1]-2,135,this.gui.dots[1]+2,139);
			if (this.old)g.flip();
		}
	//console.log("cpu time:", getTime()-this.timeStart);

	},
	tid: 0,
	run:false,
	clear : function(){
		if  (process.env.BOARD==="BANGLEJS2" && ew.face.appCurr==="main" && ew.face.appPrev === "main" && ew.face.pageCurr === -1){
			ew.UI.btn.ntfy(1,2,0,"_bar",6,"SLEEP","",0,15);
				console.log("keep clock");
			return true;
		}
		this.run=false;
		if (ew.tid.time) {clearTimeout(ew.tid.time);
		ew.tid.time=0;}
		return true;
	},
	off: function(){
		g.off();
	}
};

//touch

