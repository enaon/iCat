// ---- (Gardena) Valve control ----

ew.apps.valve = {
    state: {
        isOn: false, // valve state, current open action timestamp, false if closed.
        tid: {tmr:false,cat:false},
        pin: {
            btn: D6,
            open: D43,
            close: D45,
            pwr: D47
        },
        def: {
            btn: true, // enable button
            snd: true, // play sound on action
            pulse: { open: 20, close: 20 }, //open- close pulse duration in ms
            onTm:0.1, // on timer (auto close) in min
            cat:6 // cat watering schedule in hours
        }
    },
    pwr: function(i) {
        if (i)
            this.state.pin.pwr.reset();
        else
            this.state.pin.pwr.set();
    },
    tgl: function() {
        if (this.state.isOn) this.close();
        else this.open();
        return this.state.isOn;
    },
    open: function(i) {
        this.state.isOn = getTime()|0;
        this.pwr(1);
        //if (this.state.def.snd) ew.sys.sound.on();

        setTimeout(() => {
            digitalPulse(this.state.pin.open, 1, this.state.def.pulse.open);
            setTimeout(() => {
                this.pwr(0);
                this.tout(i?i*1000:this.state.def.onTm*60000);
            }, this.state.def.pulse.open + 100);
        }, 20);
    },
    close: function() {
        this.state.isOn = false;
        this.pwr(1);
        //if (this.state.def.snd) ew.sys.sound.off();

        setTimeout(() => {
            digitalPulse(this.state.pin.close, 1, this.state.def.pulse.close);
            setTimeout(() => {
                this.pwr(0);
                this.tout();
            }, this.state.def.pulse.close + 100);
        }, 20);
    },
    tout: function(i){
        if (this.state.tid.tout){
            clearTimeout(this.state.tid.tout);
            this.state.tid.tout=false;
        }
        if (!i) return;
        
        this.state.tid.tout=setTimeout(()=>{
            this.state.tid.tout=false;
            this.close();
        },i);
    },
    
    cat:function(i){
        //
        if (this.state.tid.cat){
            clearTimeout(this.state.tid.cat); 
            this.state.tid.cat=false;
        }
        
        if (!i) {
            if (this.state.def.snd) ew.sys.sound.off();
            return;
        }

        if (!this.state.isOn) {
            if (this.state.def.snd) ew.sys.sound.on();
            this.open(5);
        }
        
        this.state.tid.cat=setTimeout(()=>{
            this.state.tid.cat=false;
            this.cat(1);
        },this.state.def.cat*3600*1000);
    }
    

};


// --- defaults ---
ew.apps.valve.state.def = Object.assign(
    ew.apps.valve.state.def,
    (require("Storage").readJSON("ew.json", true) || {}).valve || {}
);

pinMode(ew.apps.valve.state.pin.pwr, "opendrain");
ew.apps.valve.state.pin.pwr.set();


//   --- button ---
if (ew.apps.valve.state.def.btn) {
    ew.is.btn1Press = 0;
    ew.sys.btn1 = (x) => {
        let bat = ew.sys.batt();
        if (ew.tid.btn1long) {
            clearTimeout(ew.tid.btn1long);
            ew.tid.btn1long = 0;
        }
        if (x.state) {
            //ew.is.lastBTN1time = x.time - x.lastTime;
            ew.is.btn1Press++;

            //ew.apps.valve.tgl();

            ew.tid.btn1long = setTimeout(() => {
                ew.tid.btn1long = 0;
                ew.is.btn1Press = 0;
                if (ew.apps.valve.state.tid.cat)
                    ew.apps.valve.cat();
                else
                    ew.apps.valve.cat(1);
                
            }, 1500);
            
        }
        // toggle
        else if (ew.is.btn1Press) {
            ew.is.btn1Press=0;
            ew.apps.valve.tgl();
        }

    };

    //pinMode(ew.apps.valve.state.pin.btn, "input_pulldown");

    ew.tid.btn1 = setWatch(ew.sys.btn1, ew.apps.valve.state.pin.btn, { repeat: true, debounce: 50, edge: 0 });
}
