ew.UI.nav.next.replaceWith(()=>{
	if ( ew.apps.euc.state.status!="OFF"){
    if ( ew.apps.euc.state.status!="READY") {ew.sys.buzz.nav(ew.sys.buzz.type.na);return;}
		ew.sys.buzz.nav(ew.sys.buzz.type.na);
		//face.go('dash'+require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Maker'],0);
	}else 
		ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.UI.nav.back.replaceWith(()=>{
	ew.sys.buzz.nav(ew.sys.buzz.type.na);
	//ew.face.go(ew.def.face.main,0);
});
//
//simple dash
ew.face[0] = {
	run:false,

	offms: (ew.def.face.off[ew.face.appCurr])?ew.def.face.off[ew.face.appCurr]:15000,
	old:ew.def.bpp?0:1,
	init: function(o){ 
		
		//long press euc toggle
		if ((ew.face.appPrev==="euc"&& ew.face.pagePrev!=-1) || ew.apps.euc.state.status==="OFF"){
			ew.apps.euc.tgl();
			
		}
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
		
		ew.UI.c.start(1,0);
		ew.UI.c.end();
		
		this.spdC=process.env.BOARD=="BANGLEJS2"?[0,0,15,13]:[15,14,15,14];
		this.spdCB=process.env.BOARD=="BANGLEJS2"?[15,14,13,13]:[0,0,13,14];
		this.ampC=[1,0,13,13];
		this.tmpC=[11,14,13,13];
		this.batC=[4,9,13,13];
		this.indP=1;
		this.indD=1;
		this.gui=process.env.BOARD=="BANGLEJS2"?
			{
			spd:[0,0,180,114],
			spdm:70,
			center:90,
			batTop:[0,120,179,130],
			bat:[15,135,165,145],
			batOut:[10,130,170,150],
			//tmp:[30,260,210,275],
			clock:[10,155,160,170],

			txt:140*ew.UI.size.txt,
			txt1:20*ew.UI.size.txt,
			txtBat:14,
			
			topr:[122,20,239,70],
		 }:
		 {
			spd:[0,20,240,190],
			spdm:120,
			center:120,
			batTop:[0,190,240,200],
			bat:[15,205,225,225],
			batOut:[10,200,230,230],
			tmp:[30,260,210,275],
			clock:[10,240,230,280],
			txt:200*ew.UI.size.txt,
			txt1:40*ew.UI.size.txt,
			txtBat:20,
			topr:[122,20,239,70],
		}
		this.spd=ew.apps.euc.state.dash.live.spd-1;
		this.spdF=ew.apps.euc.state.dash.opt.unit.fact.spd*((ew.apps.euc.state.def.dash.mph)?0.625:1);
		this.trpF=ew.apps.euc.state.dash.opt.unit.fact.dist*((ew.apps.euc.state.def.dash.mph)?0.625:1);
		
		
		//ew.UI.ele.fill("_main",3,1);
		//ew.UI.ele.ind(2,10,1);

		//this.bar();
		this.run=true;
		//ew.apps.euc.on('refresh',ew.face[0].show);
	},
	show : function(s){
		"ram";
		//if (!ew.face[0].run) return;
		if (ew.apps.euc.state.status=="READY") {
			if (ew.face[0].conn!=ew.apps.euc.state.status) {ew.face[0].conn=ew.apps.euc.state.status;this.bar();}
			if (ew.face[0].spd!=Math.round(ew.apps.euc.state.dash.live.spd)) ew.face[0].spdf();
			else if (ew.face[0].bat!=ew.apps.euc.state.dash.live.bat&&!ew.UI.ntid){
				ew.face[0].barBat();
			}
		//	else if (ew.face[0].tmp!=ew.apps.euc.state.dash.live.tmp.toFixed(1)&&!ew.UI.ntid )
		//		ew.face[0].barTemp();
			else if (60 < getTime()-ew.face[0].time )
				this.barClock();
		} else  if (ew.apps.euc.state.status!=ew.face[0].conn) {
				//if (ew.apps.euc.state.status=="OFF"){ ew.face.go("dashGarage",0); return;}
				this.bar();
	  			ew.UI.btn.c2l("main","_main",6,ew.apps.euc.state.status,0,15,0,0.7); //4
				ew.face[0].conn=ew.apps.euc.state.status;
				ew.face[0].spd=-1;ew.face[0].time=0;ew.face[0].amp=-1;ew.face[0].tmp=-1;ew.face[0].volt=-1;ew.face[0].bat=-1;ew.face[0].trpL=-1;ew.face[0].lock=2;ew.face[0].run=true;
		}
		//if (!ew.face[0].old)
		this.tid=setTimeout(function(t){
			let tm=getTime();
			t.indP=t.indP+t.indD;
			ew.UI.ele.ind(t.indP,6,0,ew.apps.euc.state.status=="READY"?11:14);
			if (5<t.indP) t.indD=-1;
			else if (t.indP<2) t.indD=1;
			g.flip();
			t.tid=0;
			t.show();
			if (ew.dbg) print("simple dash, time in loop",getTime()-tm);
		},20,this);
	},
	spdf: function(){
		"ram";
		if ( Math.abs(ew.apps.euc.state.dash.live.spd-this.spd) <3 ) this.spd =Math.round(ew.apps.euc.state.dash.live.spd);
		else if (ew.apps.euc.state.dash.live.spd<this.spd) this.spd=Math.round(this.spd-(this.spd-ew.apps.euc.state.dash.live.spd)/2); 
		else this.spd=Math.round(this.spd+(ew.apps.euc.state.dash.live.spd-this.spd)/2); 
		g.setCol(1,this.spdCB[ew.apps.euc.state.dash.alrt.spd.cc]);
		g.fillRect(this.gui.spd[0],this.gui.spd[1],this.gui.spd[2],this.gui.spd[3]);
		g.setCol(0,this.spdC[ew.apps.euc.state.dash.alrt.spd.cc]);
		if (100 <= this.spd) {
			if (120 < this.spd)  this.spd=120;
			g.setFontVector(this.gui.txt-30);
		}else 
			g.setFontVector(this.gui.txt);	  
		g.drawString(Math.round(this.spd*this.spdF),this.gui.center+5-(g.stringWidth(Math.round(this.spd*this.spdF))/2),this.gui.spdm-(this.gui.txt/2)); 
		//if (this.old)g.flip();
		g.flip();
	},
	barBat: function(){
		this.bat=ew.apps.euc.state.dash.live.bat;
		g.setCol(0,0);
		g.fillRect({x:this.gui.batTop[0],y:this.gui.batTop[1],x2:this.gui.batTop[2],y2:this.gui.batTop[3],r:0});	
		g.setCol(0,this.batC[ew.apps.euc.state.dash.alrt.bat.cc]);
		g.fillRect({x:this.gui.batOut[0],y:this.gui.batOut[1],x2:this.gui.batOut[2],y2:this.gui.batOut[3],r:17});	

		let rel=(this.gui.bat[2]-this.gui.bat[0])/100;
		g.setCol(1,1);
		//g.fillRect({x:this.gui.bat[0]+(this.bat*rel)-5,y:this.gui.bat[1],x2:this.gui.bat[2],y2:this.gui.bat[3],r:10});
		g.fillRect({x:this.gui.bat[0],y:this.gui.bat[1],x2:this.gui.bat[2],y2:this.gui.bat[3],r:10});

		g.setCol(0,15);
		//g.fillRect({x:this.gui.bat[0],y:this.gui.bat[1],x2:this.gui.bat[0]+(this.bat*rel),y2:this.gui.bat[3],r:10});	
		g.fillRect({x:this.gui.bat[0]+3,y:this.gui.bat[1]+2,x2:this.gui.bat[0]+(this.bat*rel)-3,y2:this.gui.bat[3]-2,r:10});	

		g.setFontVector(this.gui.txtBat);
		g.setCol(0,2);
		g.drawString("|    |    |    |",this.gui.center-(g.stringWidth("|    |    |    |")/2),this.gui.bat[1]);
		
		g.flip();
	},
	barTemp: function(){
		this.tmp=ew.apps.euc.state.dash.live.tmp.toFixed(1);
		//g.setCol(0,this.tmpC[ew.apps.euc.state.dash.alrt.tmp.cc]);
		g.setCol(0,10);
		let rel=(this.gui.tmp[2]-this.gui.tmp[0])/100;
		g.fillRect({x:this.gui.tmp[0],y:this.gui.tmp[1],x2:this.gui.tmp[0]+(this.tmp*rel),y2:this.gui.tmp[3],r:10});	
		g.setCol(1,6);
		g.fillRect({x:this.gui.tmp[0]+(this.tmp*rel),y:this.gui.tmp[1],x2:this.gui.tmp[2],y2:this.gui.tmp[3],r:10});	
		g.flip();

	},
	barClock: function(){
		this.time=getTime();
		g.setCol(0,0);
		g.fillRect(this.gui.clock[0],this.gui.clock[1],this.gui.clock[2],this.gui.clock[3]);
		g.setCol(1,11);
		g.setFontVector(this.gui.txt1);
		let d=(Date()).toString().split(' ');
		let t=(d[4]).toString().split(':');
		if (!ew.def.hr24) {
			t[0]=(t[0]<10)?(t[0]=="00")?12:t[0][1]:(t[0]<13)?t[0]:t[0]-12;
		}
		g.drawString((t[0]+":"+t[1]),this.gui.center-(g.stringWidth((t[0]+":"+t[1]))/2),this.gui.clock[1]+5); 
		g.flip();
	},

	bar:function(){
		"ram"
		ew.UI.ele.fill("_bar",6,0);
		ew.UI.c.start(0,1);
		ew.UI.c.end();
		if ( ew.apps.euc.state.status!="READY") {
			if ( ew.apps.euc.state.status=="ON"){
	  			ew.UI.ele.fill("_bar",6,0); //4
			}else{
				ew.UI.c.start(0,1);
				ew.UI.btn.c2l("bar","_bar",6,"CANCEL",0,15,13,1.2); //4
				ew.UI.c.end();
				ew.UI.c.bar._bar=(i)=>{ 
					ew.sys.buzz.nav(ew.sys.buzz.type.ok);
					ew.apps.euc.tgl();
				};
			}
			return;
		}
		ew.face[0].barBat();
		//ew.face[0].barTemp();
		ew.face[0].barClock();

	/*	img = require("heatshrink").decompress(atob(_icon.battS));
 		g.setCol(1,0);
		w.gfx.drawImage(img, 42,203, { scale: 1 * ew.UI.size.sca });
 		img = require("heatshrink").decompress(atob(_icon.tempS));
 		g.setCol(1,0);
		w.gfx.drawImage(img, 40,245, { scale: 1 * ew.UI.size.sca });   
*/
 		//g.setFontVector(45);
    	//g.setCol(1,0);
		//g.drawString("  |  |  |", 10,200); 
		//w.gfx.flip();
	},
	clear : function(o){
		ew.is.bar=0;
		this.run=false;
		if (this.tid) clearTimeout(this.tid);this.tid=0;
 		if (this.ntid) clearTimeout(this.ntid);this.ntid=0;
		return true;
	},
	off: function(o){
		g.off();this.clear(o);
	}
};
/*
ew.UI.c.start(1,1);
ew.UI.ele.coord("main","_2x2",1);
ew.UI.ele.coord("main","_2x2",2);
//ew.UI.ele.coord("main","_bar",6);
ew.UI.c.end();


ew.UI.c.main._2x2=(i)=>{ 
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	if (i==1) ew.apps.euc.state.def.dash.clkS=1-ew.apps.euc.state.def.dash.clkS;
	else if (i==2) ew.apps.euc.state.def.dash.batS=1-ew.apps.euc.state.def.dash.batS;
};

*/