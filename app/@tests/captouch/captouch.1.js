// --- Αρχή Module CapacitiveTouch ---
function CapacitiveTouch(pinA, pinB) {
    this.pinA = pinA;
    this.pinB = pinB;
}

CapacitiveTouch.prototype.read = function(samples) {
    var s = 0;
    if (!samples) samples = 1;
    for (var i = 0; i < samples; i++) {
        digitalWrite(this.pinA, 0);
        pinMode(this.pinB, "input");
        digitalWrite(this.pinA, 1);
        while (!digitalRead(this.pinB)) s++;
    }
    return s / samples;
};

exports.connect = function(pinA, pinB) {
    return new CapacitiveTouch(pinA, pinB);
};
// --- Τέλος Module ---

// Τώρα το χρησιμοποιείς κανονικά:
var cap = new CapacitiveTouch(D0, D1); // D0 -> Αντίσταση -> D1 (Touch)

setInterval(function() {
    var val = cap.read(10);
    if (val > 50) {
        print("Touch: " + val);
    }
}, 50);



// --- Ρυθμίσεις Hardware ---
var pinTX = D9; // Συνδέεται στην αντίσταση (1-10ΜΩ)
var pinRX = D10; // Συνδέεται στην άλλη άκρη της αντίστασης ΚΑΙ στο καλώδιο αφής
var pinLED = D6; // Το pin που ελέγχει το LED (PWM)

var brightness = 0.5; // Αρχική φωτεινότητα (50%)
var isOn = false;
var touchStartTime = 0;
var isDimming = false;

// --- Η λογική του Touch (RC Timing) ---
function readTouch() {
    var s = 0;
    digitalWrite(pinTX, 0);
    pinMode(pinRX, "input");
    digitalWrite(pinTX, 1);
    while (!digitalRead(pinRX)) s++;
    return s;
}

// Βρες το "μηδέν" σου (Baseline)
var threshold = readTouch() + 20; // Πρόσθεσε ένα περιθώριο θορύβου

setInterval(function() {
    var val = readTouch();
    var isTouched = val > threshold;

    if (isTouched) {
        if (touchStartTime === 0) {
            touchStartTime = Date.now(); // Μόλις ακούμπησε
        }
        else if (Date.now() - touchStartTime > 500) {
            // Αν το κρατάει πάνω από 500ms -> Dimming Mode
            isDimming = true;
            doDimming();
        }
    }
    else {
        // Μόλις σήκωσε το δάχτυλο
        if (touchStartTime !== 0) {
            var touchDuration = Date.now() - touchStartTime;
            if (!isDimming && touchDuration < 500) {
                toggleLight(); // Ήταν απλό κλικ
            }
            // Reset
            touchStartTime = 0;
            isDimming = false;
        }
    }
}, 50); // Έλεγχος κάθε 50ms

/*

var pinLED = D6; // Το pin που ελέγχει το LED (PWM)

var brightness = 0.5; // Αρχική φωτεινότητα (50%)
var isOn = false;
var touchStartTime = 0;
var isDimming = false;
*/


function toggleLight() {
    isOn = !isOn;
    applyLight();
}

function doDimming() {
    if (!isOn) isOn = true; // Άναψε το αν ήταν σβηστό
    brightness += 0.05;
    if (brightness > 1) brightness = 0.1; // Κάνει κύκλο (από χαμηλά πάλι)
    applyLight();
}

function applyLight() {
    var val = isOn ? brightness : 0;
    analogWrite(pinLED, val, { freq: 100 });
}


// ---- start scan ----
ew.apps.light = {
    state: {
        tid:{loop:0,scan:0},
        def: {}
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
    scanLoop:function(){
        this.scanStart();
        this.state.tid.scan=setTimeout(()=>{
            this.state.tid.scan=0;
            NRF.setScan();
            this.state.tid.loop=setTimeout(()=>{
                this.state.tid.loop=0
                this.scanLoop()
            },10000);
        
            
        },1000)
        
    }

}
