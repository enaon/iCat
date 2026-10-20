//ewtag face

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);

    if (ew.UI.ntid && !ew.is.UIpri) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }

});
ew.UI.nav.back.replaceWith(ew.UI.nav.next);

ew.face[0] = {
    run: false,
    //page: 1,
    val:0,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
   
    init: function(o) {
        ew.def.face.off[ew.face.appCurr] = this.offms;

        //ew.UI.ele.ind(0, 0, 0, 15);
        ew.UI.ele.fill("_main", 15, 0);


        ew.UI.c.start(1, 1);
        ew.UI.btn.c2l("main", "_2x1",1 , "Apple", "", 15, ew.apps.ewtag.state.def.iTag?4:1,1.2);
        ew.UI.btn.c2l("main", "_2x1",2 , "Google", "", 15, ew.apps.ewtag.state.def.gTag?4:1,1.2);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._2x1 = (i, l) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (i==1){
                if (!ew.apps.ewtag.state.def.iKey){
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "APPLE KEY", "IS MISSING", 15, 13);
                    return;    
                }
                
               ew.apps.ewtag.state.def.iTag=1-ew.apps.ewtag.state.def.iTag; 
                ew.UI.btn.c2l("main", "_2x1",1 , "Apple", "", 15, ew.apps.ewtag.state.def.iTag?4:1,1.2);
                ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "APPLE", ew.apps.ewtag.state.def.iTag?"ENABLED":"DISABLED", 0, 15);

            }else{
                if (!ew.apps.ewtag.state.def.gKey){
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "GOOGLE KEY", "IS MISSING", 15, 13);
                    return;    
                }    
                ew.apps.ewtag.state.def.gTag=1-ew.apps.ewtag.state.def.gTag; 
                ew.UI.btn.c2l("main", "_2x1",2 , "Google", "", 15, ew.apps.ewtag.state.def.gTag?4:1,1.2);
                ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "GOOGLE", ew.apps.ewtag.state.def.gTag?"ENABLED":"DISABLED", 0, 15);
            }

        };

        this.bar();
        this.run = 0;

    },
    show: function(s) {
        if (!this.run) return;

        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(function(t) {
            t.tid = 0;
            t.show();
        }, 1000, this);
    },

    bar: function(timer) {
        if (ew.UI.ntid) return; 
        
        ew.UI.ele.fill("_bar", 6, 0);
        ew.UI.btn.c2l("bar", "_bar", 6, "SET", "TAG MODE", 15, 0, 1.2);

        ew.is.slide = 0;
        ew.UI.c.start(0, 1);
        //ew.UI.btn.img("bar", "_bar", 4, "pause", "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 4 : 1);
        ew.UI.c.end();

       
    },
    clear: function(o) {
        ew.apps.ewtag.init();
        ew.comm.updt();
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;

        return true;
    },
    off: function(o) {
        g.off();
    }
};
