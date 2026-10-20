// ---- Light controll ----

ew.apps.light = {
    state: {
        isOn : false,
        isDimming: false,
        tid: { loop: 0, scan: 0 },
        pin: {
            warm: D6,
            cold: D8,
        },

        def: {
            bri:{
                warm:0,
                cold:0,
                both:0
            }
        },
    },
    mode: function(mode){
      //sellect warm,cold,both  
    },
    toggle: function (color) {
        //this,state.isOn = !this.state.isOn;
        //this.apply(color);
    },
    
    apply: function(color) {
        //var val = this.state.isOn ? this.state.bri[color?"color":] : 0;
        //analogWrite(this.state.pin.warm, val, { freq: 100 });
    },
    
    dim: function (color) {
        //if (!isOn) isOn = true; // Άναψε το αν ήταν σβηστό
        //brightness += 0.05;
        //if (brightness > 1) brightness = 0.1; // Κάνει κύκλο (από χαμηλά πάλι)
        //applyLight(color);
    },

    scanStart: function() {
        NRF.setScan(function(device) {



        }, {
            filters: [
                { manufacturerData: { 0x0105: {} } }, // itag
                { manufacturerData: { 0x0590: {} } }, //espruino

            ],
            //phy: phy[phyR],
            interval: 100,
            window: 100,
            active: false
        });
    },
    scanLoop: function() {
        this.scanStart();
        this.state.tid.scan = setTimeout(() => {
            this.state.tid.scan = 0;
            NRF.setScan();
            this.state.tid.loop = setTimeout(() => {
                this.state.tid.loop = 0
                this.scanLoop()
            }, 10000);


        }, 1000)

    }

}
