// ---- Light control ----

ew.apps.lamp = {
    state: {
        loop: 0,
        isOn: false,
        isDimming: false,
        count: 0,
        pwrb: false,
        pirT: 5000,
        ldrL: -10,
        use: { time: 0, run: 0 },
        tid: { loop: 0, scan: 0, tout: 0, dimmer: 0, burst: 0, timer: 0, ys312: 0, pwrT: 0 },
        dimmer: {
            direction: 0, // 1 (προς άναμμα), -1 (προς σβήσιμο)
            lastDirection: 1,
            normalSpeed: 0.04, // αργή ταχύτητα dimming
            burstSpeed: 0.05, // γρήγορη ταχύτητα όταν αφήνεται νωρίς
            interval: 20, // msec μεταξύ steps
            pressTime: 0, // πότε πατήθηκε
            holdThreshold: 250, // msec - αν κράτησες πάνω από αυτό, δεν κάνει burst
        },
        pin: {
            warm: D17,
            cold: D20,
            col: D06,
            dim: D08,
            tgl: D22,
            pir: D24,
            pirP: D32,
            ldrR: D02, //LDR read
            ldrP: D11, //LDR power
            pwrb: D29, //powerbank key pin
            IR: D33 //Infared -101
        },
        def: {
            slr: false,
            isPB: false, // PowerBank mode 
            oneB: false, // One Button mode 
            tmr: false, // On timer mode  
            mode: "both", // "cold", "warm", "both"
            bri: {
                max: 1,
                min: 0.006,
                last: 0.5,
                lvl: 0,
                ratio: { warm: 0.7, cold: 0.3, keep: 1 }
            },
            ldr: {
                en: 1,
                lvl: 0.15,
            },
            pir: {
                en: 0,
                snd: 0,
                max: 10,
                time: 30,
                bt: 0,
                type: "DOCI", // data pin "HL":hi/low - "DOCI":16bit digital signal
                sens: 950, //  threshold level for DOCI mode
                loop: 400, //loop in ms for DOCI mode
            },
            IR: {
                en: 0,
                pwr: null,
                mem: null,
                up: null,
                dn: null,
                mode: null,
                tmr: null,
                pir: null
            }
        }
    },
    pwrT: function() {
        //if (this.state.tid.pwrT) { clearInterval(this.state.tid.pwrT);
        //   this.state.tid.pwrT = 0; }

        this.state.pwrb = !this.state.pwrb;
        if (this.state.pwrb) {
            digitalPulse(this.state.pin.pwrb, 0, 100);
            ew.sys.sound.on();

        }
        else {
            digitalPulse(this.state.pin.pwrb, 0, [100, 200, 100]);
            ew.sys.sound.off();
        }

        return this.state.pwrb;
    },
    ldr: function(i) {
        // return if not enabled
        if (!this.state.def.ldr.en) return true;

        // get reading 
        this.state.pin.ldrP.set();
        pinMode(this.state.pin.ldrR, "input_pulldown");
        let value = analogRead(this.state.pin.ldrR);
        poke32(0x40007500, 0); //SAADC->ENABLE = 0
        let pinNum = this.state.pin.ldrP;
        poke32((pinNum < 32 ? 0x50000700 : 0x50000800) + (pinNum < 32 ? pinNum : pinNum - 32) * 4, 2);
        pinNum = this.state.pin.ldrR;
        poke32((pinNum < 32 ? 0x50000700 : 0x50000800) + (pinNum < 32 ? pinNum : pinNum - 32) * 4, 2);

        // check threshold
        if (!i) {

            if (this.state.isOn) {
                if (this.state.ldrL == -10) {
                    this.state.ldrL = value + 0.02;
                    return true;
                }
                else return (value < this.state.ldrL) ? true : false;
            }
            else
                return (value < this.state.def.ldr.lvl) ? true : false;
        }
        // set/get value
        else {
            if (i === "set") {
                if (this.state.isOn)
                    this.state.ldrL = value + 0.015;
                else {
                    this.state.def.ldr.lvl = value + 0.015;
                    ew.sys.updt(); //save settings
                    ew.sys.sound.warning();

                }
            }
            else if (i === "get")
                return value;
        }

    },
    ys312: function(i) {
        if (this.state.tid.ys312) {
            clearTimeout(this.state.tid.ys312);
            this.state.tid.ys312 = 0;
        }

        this.state.tid.ys312 = setTimeout(() => {

            if (!this.state.def.pir.en) {
                clearTimeout(this.state.tid.ys312);
                this.state.tid.ys312 = 0;
                return;
            }

            // get PIR value
            this.state.pirT = this.state.def.pir.loop;
            const value = ys312.readPIR(this.state.def.pir.sens);

            // debug
            if (this.dbg) {
                console.log("lamp: ys312 value: " + value);
                if (value < 0) console.log("error:" + value);
            }

            if (0 < value){
                this.pir();
                this.state.pirT = 150;   
            }else if (this.state.def.slr && !this.state.def.pir.snd && !this.ldr())
                this.state.pirT = 60000;
            

            if (this.dbg) console.log("lamp: ys312 loop time: " + this.state.pirT);
            this.state.tid.ys312 = 0;
            this.ys312();

        }, this.state.pirT);


    },
    pir: function() {

        if (!this.state.def.pir.en) return;
        if (this.state.def.pir.snd) ew.sys.sound.playMelody([{ freq: 2600, dur: 20 }, { freq: 3000, dur: 50 }]);
        if (!this.ldr()) return;
        if (ew.sys.batt() < 3.30) { ew.sys.sound.alert(); return; }

        if (this.state.count < this.state.def.pir.max) this.state.count++;

        this.timer();
    },
    timer: function(i) {
        if (!this.state.isOn) this.on();

        if (this.state.tid.timer) {
            clearTimeout(this.state.tid.timer);
            this.state.tid.timer = 0;
        }

        if (i === "start") this.state.count = this.state.def.pir.max;
        if (i === "stop") {
            if (this.state.def.pir.type === "DOCI") {
                this.state.pirT = 3000;
                this.ys312();
            }
            this.state.ldrL = -10;
            this.state.count = 0;
            return;
        }


        this.state.tid.timer = setTimeout(() => {
            this.state.count--;
            if (this.state.count < 0) this.state.count = 0;

            this.state.tid.timer = 0;

            if (this.state.count === 0)
                this.off();
            else
                this.timer();

        }, this.state.def.pir.time * 1000);

    },
    auto: function(i) {
        if (i === 1 || i === "0")
            this.state.def.pir.en = Number(i);
         else
            this.state.def.pir.en = 1 - this.state.def.pir.en;
        this.state.pin.pirP.write(this.state.def.pir.en ? 1 : 0);
        ew.sys.updt(); //save settings
        this.state.count = 0;
        if (!this.state.def.pir.en && this.state.tid.timer) {
            clearTimeout(this.state.tid.timer);
            this.state.tid.timer = 0;
        }
        if (this.state.def.pir.type === "DOCI") {
            this.state.pirT = this.state.def.pir.loop;
            this.ys312();
        }

        ew.sys.sound[this.state.def.pir.en ? "on" : "off"]();
        return this.state.def.pir.en;
    },

    mode: function(mode) {
        if (mode === "cold" || mode === "warm" || mode === "both") {
            this.state.def.mode = mode;
            if (this.state.isOn) {
                this.apply();
            }
        }
    },

    // Toggle on/off με smooth transition
    tgl: function() {
        if (this.state.isOn) {
            this.timer("stop");
            this.off();
        }
        else {
            if (this.state.def.tmr) this.timer("start");
            else this.on();
        }
    },

    off: function() {
        if (!this.state.isOn) return;

        if (this.state.tid.tout) {
            clearTimeout(this.state.tid.tout);
            this.state.tid.tout = 0;
        }
        this.fadeTo(0, () => {
            this.state.isOn = false;
            this.state.ldrL = -10;
        });
        let off = getTime() | 0;
        this.state.use.time += (getTime() | 0) - this.state.use.onT;
    },

    on: function() {
        if (this.state.isOn) return;
        this.state.isOn = true;

        this.state.use.onT = getTime() | 0;
        this.state.use.run++;

        let target = this.state.def.bri.last || 0.5;
        this.fadeTo(target);
    },

    dim: function(step) {
        if (!step) step = 0.05;
        if (!this.state.isOn) {
            this.state.isOn = true; // Άναψε αν ήταν σβηστό
        }

        let newBri = this.state.def.bri.lvl + step;
        if (newBri > 1) newBri = 1;
        if (newBri < 0) newBri = 0;

        this.state.def.bri.last = newBri;
        this.ldr("set");

        this.setBri(newBri);
    },

    setRatio: function(warmRatio, keep) {
        // warmRatio: 0-1, (1 = only warm, 0 = only cold)
        if (!keep) keep = 0;
        this.state.def.bri.ratio.keep = keep;

        this.state.def.bri.ratio.warm = Math.min(1, Math.max(0, warmRatio));
        this.state.def.bri.ratio.cold = 1 - this.state.def.bri.ratio.warm;

        if (!keep) {
            const max = Math.max(this.state.def.bri.ratio.warm, this.state.def.bri.ratio.cold);
            if (max > 0) {
                this.state.def.bri.ratio.warm = this.state.def.bri.ratio.warm / max;
                this.state.def.bri.ratio.cold = this.state.def.bri.ratio.cold / max;
            }
        }

        /*if (this.state.def.mode === "both" && this.state.isOn) {
            this.apply();
        }*/
    },

    apply: function() {
        let warmVal = 0;
        let coldVal = 0;

        if (this.state.def.bri.max < this.state.def.bri.lvl) this.state.def.bri.lvl = this.state.def.bri.max;

        if (!this.state.isOn) {
            warmVal = 0;
            coldVal = 0;
        }
        else if (this.state.def.mode === "warm") {
            warmVal = this.state.def.bri.lvl;
            coldVal = 0;
        }
        else if (this.state.def.mode === "cold") {
            warmVal = 0;
            coldVal = this.state.def.bri.lvl;
        }
        else if (this.state.def.mode === "both") {
            let total = this.state.def.bri.lvl;
            warmVal = total * this.state.def.bri.ratio.warm;
            coldVal = total * this.state.def.bri.ratio.cold;
        }

        if (coldVal === 0 && warmVal === 0) {
            this.state.pin.cold.mode("output");
            this.state.pin.warm.mode("output");
            this.state.isOn = false;
            return;
        }
        analogWrite(this.state.pin.warm, warmVal, { freq: 4000 });
        analogWrite(this.state.pin.cold, coldVal, { freq: 4000 });
    },

    fadeTo: function(targetValue, callback) {
        // clear intervals
        if (this.state.tid.dimmer) {
            clearInterval(this.state.tid.dimmer);
            this.state.tid.dimmer = null;
        }
        if (this.state.tid.burst) {
            clearInterval(this.state.tid.burst);
            this.state.tid.burst = null;
        }


        if (0 < targetValue) this.state.isOn = true;

        let startValue = this.getBri();
        let step = (targetValue > startValue) ? 0.05 : -0.05;
        let steps = Math.abs(Math.ceil((targetValue - startValue) / step));
        let currentStep = 0;

        this.state.tid.dimmer = setInterval(() => {
            currentStep++;
            let newValue = startValue + (step * currentStep);

            if (currentStep >= steps) {
                newValue = targetValue;
                this.setBri(newValue);
                clearInterval(this.state.tid.dimmer);
                this.state.tid.dimmer = null;
                if (callback) {
                    callback();
                }
            }
            else {
                this.setBri(newValue);
            }
        }, this.state.dimmer.interval);
    },

    // dimmer
    startDimming: function() {
        if (this.state.tid.dimmer) {
            clearInterval(this.state.tid.dimmer);
            this.state.tid.dimmer = null;
        }
        if (this.state.tid.burst) {
            clearInterval(this.state.tid.burst);
            this.state.tid.burst = null;
        }

        let current = this.getBri();

        if (current <= this.state.def.bri.min || !this.state.isOn) {
            //if (current === 0) {
            this.state.dimmer.direction = 1;
            this.state.isOn = true;
            this.setBri(this.state.def.bri.min);
            //this.setBri(0.005);
        }

        else if (current > this.state.def.bri.max - 0.1) {
            this.state.dimmer.direction = -1;
        }
        else {
            this.state.dimmer.direction = (this.state.dimmer.lastDirection === 1) ? -1 : 1;
        }

        // Αποθήκευσε την κατεύθυνση
        this.state.dimmer.lastDirection = this.state.dimmer.direction;
        this.state.dimmer.pressTime = Date.now();

        this.state.tid.dimmer = setInterval(() => {
            let current = this.getBri();
            let speed = current * this.state.dimmer.normalSpeed;
            let newValue = current + (speed * this.state.dimmer.direction);

            if (newValue >= this.state.def.bri.max) {
                newValue = this.state.def.bri.max;
                this.setBri(newValue);
                this.stopDimming(false);
            }
            else if (newValue < this.state.def.bri.min) {
                //else if (newValue < 0.005) {
                newValue = this.state.def.bri.min;
                //newValue = 0;
                this.setBri(newValue);
                this.state.isOn = true;
                this.stopDimming(false);
            }
            else {
                this.setBri(newValue);
            }
        }, this.state.dimmer.interval);
    },

    stopDimming: function(doBurst) {
        if (this.state.tid.dimmer) {
            clearInterval(this.state.tid.dimmer);
            this.state.tid.dimmer = null;
        }
        if (this.state.tid.burst) {
            clearInterval(this.state.tid.burst);
            this.state.tid.burst = null;
        }

        if (!doBurst) {
            if (this.state.def.bri.lvl > 0) {
                this.state.def.bri.last = this.state.def.bri.lvl;
                this.ldr("set");
            }
            return;
        }
        let current = this.getBri();
        let targetValue = (this.state.dimmer.direction === 1) ? this.state.def.bri.max : 0;

        //if (Math.abs(current - targetValue) < 0.02) return;

        this.state.tid.burst = setInterval(() => {
            let curr = this.getBri();
            let newValue = curr + (this.state.dimmer.burstSpeed * this.state.dimmer.direction);

            if (this.state.dimmer.direction === 1) {
                if (newValue >= targetValue) {
                    newValue = targetValue;
                    //this.state.def.bri.last = newValue;
                    this.setBri(newValue);
                    clearInterval(this.state.tid.burst);
                    this.state.tid.burst = null;
                }
                else {
                    this.setBri(newValue);
                }
            }
            else {
                if (newValue <= targetValue) {
                    newValue = targetValue;
                    this.setBri(newValue);
                    if (newValue === 0) this.state.isOn = false;
                    //else this.state.def.bri.last = newValue;
                    clearInterval(this.state.tid.burst);
                    this.state.tid.burst = null;
                    this.state.dimmer.lastDirection = this.state.dimmer.direction;
                }
                else {
                    this.setBri(newValue);
                }
            }
        }, this.state.dimmer.interval);
    },

    // buttons
    onButtonPress: function() {

        // Αν είμαστε πολύ χαμηλά, μην ακυρώσεις το τρέχον dimming
        let current = this.getBri();
        if (current < 0.1 && this.state.tid.dimmer) {
            // Συνέχισε το υπάρχον dimming προς τα πάνω
            return;
        }

        this.startDimming();
    },

    onButtonRelease: function() {
        let holdDuration = Date.now() - this.state.dimmer.pressTime;

        if (holdDuration < this.state.dimmer.holdThreshold) {
            this.stopDimming(true);
        }
        else {
            this.stopDimming(false);
        }
    },

    // brightness
    getBri: function() {
        if (!this.state.isOn) return 0;
        return this.state.def.bri.lvl;
    },

    setBri: function(value) {
        value = Math.min(1, Math.max(0, value));

        //if (value > 0) {
        //    this.state.last = value;
        //}
        this.state.def.bri.lvl = value;

        this.apply();
    },
    /*
    // BT scanner
    scanStart: function() {
        const roleMap = { "watch": 0, "litterBox": 1, "tag": 2, "pb": 3, "light": 4, "blind": 5, "pir": 6 };

        // Υπολόγισε το MY_ROLE_BIT
        let myRoleBit = 0;
        if (Array.isArray(ew.def.role)) {
            for (let i = 0; i < ew.def.role.length; i++) {
                myRoleBit |= (1 << roleMap[ew.def.role[i]]);
            }
        }
        else {
            myRoleBit = (1 << roleMap[ew.def.role]);
        }

        NRF.setScan(function(device) {
            let data = device.manufacturerData;
            if (!data || data.length < 6) return;

            let roleByte = data[0]; // ποιος είναι ο σκανισμένος
            let actByte = data[5]; // ποιους presence ζητάει

            // Ο σκανισμένος ζητάει presence για light?
            if (actByte & myRoleBit) {
                // Άναψε το φως
                if (!ew.apps.lamp.state.isOn) {
                    ew.apps.lamp.on();
                    ew.apps.lamp.timer();
                    if (ew.apps.ewtag) ew.apps.ewtag.sound.bell();
                }
            }
        }, {
            filters: [{ manufacturerData: { 0x0590: {} } }],
            interval: 100,
            window: 100,
            active: false
        });
    },

    scanLoop: function() {
        this.state.tid.scan = setTimeout(() => {
            this.state.tid.scan = 0;
            NRF.setScan();
            this.state.tid.scan = setTimeout(() => {
                this.state.tid.scan = 0;
                this.auto();
            }, this.state.loop * 1000);
        }, 3000);
    },

    auto: function(auto) {
        if (!ew.apps.lamp.state.def.auto.bt || auto === "0") {
            ew.apps.lamp.state.def.auto.bt = 0;
            NRF.setScan();
            if (this.state.tid.tout) {
                clearTimeout(this.state.tid.tout);
                this.state.tid.tout = 0;
            }
            if (this.state.tid.scan) {
                clearTimeout(this.state.tid.scan);
                this.state.tid.scan = 0;
            }
            //if (ew.apps.ewtag) ew.apps.ewtag.sound.bell();
            //digitalPulse(D22, 1, [1000]);
            return;
        }
        if (ew.apps.ewtag) ew.apps.ewtag.sound.bell();
        //digitalPulse(D22, 1, [10, 300, 10, 300, 10, 300, 10]);
        this.state.loop = this.state.loop || this.state.def.auto.loop;
        this.scanStart();
        this.scanLoop();
    }
    */
};

// --- defaults ---
ew.apps.lamp.state.def = Object.assign(
    ew.apps.lamp.state.def,
    (require("Storage").readJSON("ew.json", true) || {}).lamp || {}
);
// --- pin mode
if (ew.apps.lamp.state.def.isPB) {
    pinMode(ew.apps.lamp.state.pin.pwrb, "opendrain")
    ew.apps.lamp.state.pin.pwrb.set();
}

// --- pir sensor setup ---

if (ew.apps.lamp.state.def.pir.type === "DOCI") {
    ys312 = require("ew_m_ys312");
    ys312.initPIR(ew.apps.lamp.state.pin.pir, ew.apps.lamp.state.pin.pirP);
    ew.apps.lamp.ys312();
}
else {
    ew.sys.btn4 = (x) => {
        ew.apps.lamp.pir();
    };

    pinMode(ew.apps.lamp.state.pin.pir, "input");
    ew.tid.btn4 = setWatch(ew.sys.btn4, ew.apps.lamp.state.pin.pir, { repeat: true, debounce: 50, edge: 1 });
}

//   --- buttons ---

if (ew.apps.lamp.state.def.oneB) {
    // tap toggle light, off long toggle pir, on long dimmer set.
    ew.is.btn1Press = 0;
    ew.sys.btn1 = (x) => {
        if (ew.is.BTN1) x.state = !x.state;
        let bat = ew.sys.batt();
        if (ew.apps.lamp.state.def.slr && !ew.apps.lamp.state.isOn && !ew.apps.lamp.ldr()) {
            if (x.state) ew.sys.sound.warning();
            return;
        }
        if (ew.tid.btn1long) {
            clearTimeout(ew.tid.btn1long);
            ew.tid.btn1long = 0;
        }
        if (x.state) {
            ew.is.lastBTN1time = x.time - x.lastTime;
            ew.is.btn1Press++;

            // pir on/off / dimmer
            ew.tid.btn1long = setTimeout(() => {
                ew.tid.btn1long = 0;
                ew.is.btn1Press = 0;
                if (!ew.apps.lamp.state.isOn) {
                    ew.apps.lamp.auto();
                }
                else {
                    ew.is.btn1dim = 1;
                    ew.apps.lamp.onButtonPress();
                }

            }, 500);
            return;
        }
        else if (ew.is.btn1Press) {
            if (ew.tid.short1) {
                clearTimeout(ew.tid.short1);
                ew.tid.short1 = 0;
            }
            ew.tid.short1 = setTimeout(() => {
                if (1 < ew.is.btn1Press) ew.apps.lamp.ldr("set");
                else ew.apps.lamp.tgl();
                ew.tid.short1 = 0;
                ew.is.btn1Press = 0;
            }, 100);
        }
        else if (ew.is.btn1dim) {
            ew.is.btn1dim = 0;
            ew.apps.lamp.onButtonRelease();
        }

    };

    pinMode(ew.apps.lamp.state.pin.col, ew.is.BTN1 ? "input_pullup" : "input_pulldown");
    ew.tid.btn1 = setWatch(ew.sys.btn1, ew.apps.lamp.state.pin.col, { repeat: true, debounce: 50, edge: 0 });


}
else {

    // color sellector -  auto on/off
    ew.is.btn1Press = 0;
    ew.sys.btn1 = (x) => {
        if (ew.is.BTN1) x.state = !x.state;
        if (ew.sys.batt() < 3.30 && !ew.apps.lamp.state.isOn) { if (x.state) ew.sys.sound.alert(); return; }
        if (ew.tid.btn1long) {
            clearTimeout(ew.tid.btn1long);
            ew.tid.btn1long = 0;
        }
        if (x.state) {
            ew.is.lastBTN1time = x.time - x.lastTime;
            ew.is.btn1Press++;

            // pir on/off
            ew.tid.btn1long = setTimeout(() => {
                ew.tid.btn1long = 0;
                ew.is.btn1Press = 0;
                if (!ew.apps.lamp.state.pin.dim.read()) {
                    ew.apps.lamp.auto();
                }
                else if (!ew.apps.lamp.state.isOn)
                    ew.apps.lamp.ldr("set");

            }, 1000);
        }
        // color change
        else if (ew.is.btn1Press) {
            if (!ew.apps.lamp.state.isOn) return;
            const modes = ["warm", "both"];
            //const modes = ["warm", "cold", "both"];
            let currentMode = ew.apps.lamp.state.def.mode;
            let currentIndex = modes.indexOf(currentMode);
            let nextIndex = (currentIndex + 1) % modes.length; // κυκλική μετάβαση
            let nextMode = modes[nextIndex];
            ew.apps.lamp.mode(nextMode);
        }
    };

    pinMode(ew.apps.lamp.state.pin.col, ew.is.BTN1 ? "input_pullup" : "input_pulldown");
    ew.tid.btn1 = setWatch(ew.sys.btn1, ew.apps.lamp.state.pin.col, { repeat: true, debounce: 50, edge: 0 });

    // dimmer
    ew.sys.btn2 = (x) => {
        if (ew.sys.batt() < 3.30 && !ew.apps.lamp.state.isOn) { if (x.state) ew.sys.sound.alert(); return; }
        if (ew.apps.lamp.state.pin.col.read()) return;
        //if (x.pin === D22) x.state = !x.state;
        if (!x.state) {
            ew.apps.lamp.onButtonRelease();
        }
        else {
            ew.apps.lamp.onButtonPress();
        }
    };
    pinMode(ew.apps.lamp.state.pin.dim, "input_pulldown");
    ew.tid.btn2 = setWatch(ew.sys.btn2, ew.apps.lamp.state.pin.dim, { repeat: true, debounce: 50, edge: 0 });



    // toggle
    ew.is.btn3Press = 0;

    /* if (ew.apps.lamp.state.def.isPB) {
         ew.sys.btn3 = (x) => {
              if (ew.sys.batt() < 3.30 && !ew.apps.lamp.state.isOn) { if (x.state) ew.sys.sound.alert(); return; }
             if (ew.apps.lamp.state.isOn && ew.apps.lamp.state.tid.timer ) ew.apps.lamp.state.count = 0;

             if (ew.tid.btn3long) {
                 clearTimeout(ew.tid.btn3long);
                 ew.tid.btn3long = 0;
             }
             if (x.state) {
                 ew.is.lastBTN3time = x.time - x.lastTime;
                 ew.is.btn3Press++;
                 
                 // toggle
                 //if (ew.apps.lamp.state.isOn && ew.apps.lamp.state.tid.timer ) ew.apps.lamp.state.count = 0;
                 //ew.apps.lamp.tgl();

                 // toggle usb output
                 ew.tid.btn3long = setTimeout(() => {
                     ew.tid.btn3long = 0;
                     ew.is.btn3Press = 0;
                     ew.apps.lamp.pwrT();

                 }, 1000);
             }
             // toggle light
             else if (ew.is.btn3Press) {
                 if (ew.apps.lamp.state.isOn && ew.apps.lamp.state.tid.timer ) ew.apps.lamp.state.count = 0;
                 ew.apps.lamp.tgl();
             }
         };
     }
     else {
     */
    ew.sys.btn3 = (x) => {
        if (ew.sys.batt() < 3.30 && !ew.apps.lamp.state.isOn) { if (x.state) ew.sys.sound.alert(); return; }

        if (x.state) {
            ew.apps.lamp.tgl();
            ew.is.lastBTN3time = x.time - x.lastTime;
            ew.tid.btn3long = setTimeout(() => {
                ew.tid.btn3long = 0;
                if (ew.apps.lamp.state.def.isPB) ew.apps.lamp.pwrT();
                //ew.sys.updt(); //save settings
            }, 1000);
        }
        else {

            if (ew.tid.btn3long) {
                clearTimeout(ew.tid.btn3long);
                ew.tid.btn3long = 0;
            }
        }


    };
    //  }
    pinMode(ew.apps.lamp.state.pin.tgl, "input_pulldown");
    ew.tid.btn3 = setWatch(ew.sys.btn3, ew.apps.lamp.state.pin.tgl, { repeat: true, debounce: 50, edge: 0 });

}


// --- infrared ---

if (ew.apps.lamp.state.def.IR.en) {
    if (require('Storage').read("ew_m_IR")) {
        eval(require('Storage').read("ew_m_IR"));
        let last = null;
        require("IRReceiver").connect(ew.apps.lamp.state.pin.IR, function(code) {
            //toggle
            if (code.startsWith(ew.apps.lamp.state.def.IR.pwr)) {
                ew.apps.lamp.onButtonPress();
                ew.apps.lamp.onButtonRelease();
                last = null;
                return;
            }
            //mem
            if (code.startsWith(ew.apps.lamp.state.def.IR.mem)) {
                ew.apps.lamp.tgl();
                last = null;
                return;
            }
            //up
            if (code.startsWith(ew.apps.lamp.state.def.IR.up)) {
                ew.apps.lamp.dim(0.01);
                last = "up";
                return;
            }
            //dn
            if (code.startsWith(ew.apps.lamp.state.def.IR.dn)) {
                ew.apps.lamp.dim(-0.01);
                last = "dn";
                return;
            }
            //pir on/off
            if (code.startsWith(ew.apps.lamp.state.def.IR.pir)) {
                ew.apps.lamp.auto();
                last = null;
                return;
            }
            //mode
            if (code.startsWith(ew.apps.lamp.state.def.IR.mode)) {
                if (!ew.apps.lamp.state.isOn) return;
                const modes = ["warm", "both", "cold"];
                //const modes = ["warm", "cold", "both"];
                let currentMode = ew.apps.lamp.state.def.mode;
                let currentIndex = modes.indexOf(currentMode);
                let nextIndex = (currentIndex + 1) % modes.length; // κυκλική μετάβαση
                let nextMode = modes[nextIndex];
                ew.apps.lamp.mode(nextMode);
                last = "mode";
                return;
            }
            //repeat
            if (code == "1" && last) {
                if (last == "up") ew.apps.lamp.dim(0.03);
                if (last == "dn") ew.apps.lamp.dim(-0.03);
            }

        }, { usePulseLength: false });
    }
}
