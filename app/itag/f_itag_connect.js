//itag connected viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.face.go("main", 0);
});

ew.face[0] = {
    data: { source: 0, name: 0, key: 0, key_1: 0, key_2: 0, key_3: 0, lowLimit: 0, hiLimit: 0, fields: 0, totLowField: 0, ref: 0, style: 0, lastPosition: 0 },
    gatt: {},
    run: false,
    offms: (ew.def.off[ew.face.appCurr]) ? ew.def.off[ew.face.appCurr] : 60000,
    init: function(o) {
        ew.def.off[ew.face.appCurr]=this.offms;
        // name
        ew.UI.btn.c2l("main", "_headerS", 6, this.getVal("name") , "", 15, 0, 1.5);
        
        if (!ew.apps.itag.state.connected)
            ew.UI.btn.ntfy(1,10,0,"_bar",6,"CONNECTING","" ,0,15); 

        else this.bar();
        this.info(this.getVal("batt"),ew.apps.itag.state.ble.id.split(" ")[0] )
    },
    show: function(s) {

    },
    getVal:function (val){
         const device = ew.apps.itag.state.def.find(item => item.id === ew.apps.itag.state.ble.id);
        return device ? device[val] : null; 
    },
    info: function(batt, id) {
        g.setCol(0, 1);
        g.fillRect({ x: 0, y: 60, x2: 235, y2: 180, r: 10 });
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 3);

        if (!ew.apps.itag.state.connected){
            ew.UI.btn.c2l("main","_main",6,"WAIT","",15,1,2)
          return;  
        }

       
        // values
        let l = g.stringWidth(batt) / 2;
        g.drawString(batt, 120 - l, 95);

        // units
        g.setFont("Teletext10x18Ascii");
        g.drawString("%", 140 + l - g.stringWidth("%") / 2, 125);

        // id
        g.setCol(1, 14);
        //g.setFont("LECO1976Regular22");
        g.drawString(id, 120 - g.stringWidth(id) / 2, 156); //
        
        g.flip();


    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";
        if ((ew.UI.ntid)) {
	    	clearTimeout(ew.UI.ntid);
	    	ew.UI.ntid = 0;
    	}
        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });


        // reset UI control, bar only
        ew.UI.c.start(0, 1);
        
         if (!ew.apps.itag.state.connected){
            ew.UI.btn.img("bar", "_bar", 6, "power", "", 15, 13);

         }else {
        ew.UI.btn.img("bar", "_bar", 4, "alarm", "ALERT", 15, ew.apps.itag.state.alert? 4:1);
        ew.UI.btn.img("bar", "_bar", 5, "power", "DISC", 15, 13);
         }
        ew.UI.c.end();

        // bar handler
        ew.UI.c.bar._bar = (i) => {
            if (ew.face[0].dbg) console.log("button: ",i);
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (i==4){
                ew.apps.itag.state.alert=1-ew.apps.itag.state.alert;
                ew.UI.btn.img("bar", "_bar", 4, "alarm", "ALERT", 15, ew.apps.itag.state.alert?4:1);
                if (ew.def.info) ew.UI.btn.ntfy(1,1,0,"_bar",6,"ALERT",ew.apps.itag.state.alert?"ON":"OFF" ,0,15); 
                ew.apps.itag.state.ble.alert.writeValue(ew.apps.itag.state.alert?1:0);
            }
            if (i==5 || i==6){
                ew.apps.itag.state.ble.gatt.disconnect();
            }
        };
    },

    
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
