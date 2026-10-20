// --- Ρυθμίσεις Hardware ---
var pinTX = D17  // Το ένα άκρο της αντίστασης 2.2Μ
var pinRX = D20; // Το άλλο άκρο της αντίστασης ΚΑΙ το καλώδιο αφής
var pinLED = D6; // Το MOSFET που ελέγχει τα LED
//pinMode(pinRX, "input_pulldown", false); 
//pinMode(pinTX, "output", false);      // Κλείδωμα TX ως Output

// --- Μεταβλητές Κατάστασης ---
var brightness = 0.5; 
var isOn = false;
var touchStartTime = 0;
var isDimming = false;
var threshold = 0;


function readTouch() {
  // 1. Φορτίζουμε το pin RX (D9) στο 1 (High)
  digitalWrite(D9, 1);
  pinMode(D9, "output");
  
  // 2. Στέλνουμε έναν ΠΟΛΥ μικρό παλμό εκφόρτισης (0)
  // Αυτό γίνεται στο hardware, οπότε είναι ταχύτατο
  digitalPulse(D9, 0, 0.01); // 0.01ms παλμός LOW
  
  // 3. Γυρίζουμε σε input και μετράμε πόσο χρόνο κάνει να ξαναγίνει 1
  // μέσω της αντίστασης 1Μ που είναι συνδεδεμένη στο D10 (που είναι High)
  digitalWrite(D10, 1);
  pinMode(D9, "input");
  
  var s = 0;
  while (!digitalRead(D9)) {
    s++;
    if (s > 1000) break;
  }
  return s;
}

setInterval(function() {
  var v = readTouch();
  if (v > 0) print("Value: " + v);
}, 100);

function readTouch() {
  var s = 0;
  
  // 1. Εκφόρτιση: Το κάνουμε output 0 για να αδειάσει τελείως
  pinMode(pinRX, "output");
  digitalWrite(pinRX, 0);
  
  // Μικρή παύση να σιγουρευτούμε ότι είναι 0
  var wait = 100; while(wait--); 

  // 2. Ενεργοποιούμε το PULLUP (αυτό θα αρχίσει να φορτίζει το pin)
  pinMode(pinRX, "input_pullup");
  
  // 3. Μέτρηση: Πόσο γρήγορα θα πάει στο 1;
  // Το δάχτυλο θα καθυστερήσει αυτή τη φόρτιση
  while (!digitalRead(pinRX)) {
    s++;
    if (s > 5000) break;
  }
  
  return s;
}

/*
function readTouch() {
  var s = 0;
  
  // 1. Εκφόρτιση (Το RX αδειάζει μέσω της 2.2Μ προς το TX που είναι 0)
  digitalWrite(pinTX, 0);
  
  // 2. Αναμονή (Busy wait)
  var wait = 500; while(wait--); 

  // 3. Έναρξη φόρτισης
  digitalWrite(pinTX, 1);
  
  // 4. Μέτρηση
  // Χρησιμοποιούμε την digitalRead. Αν το mode παραμένει "input_pulldown",
  // τότε η 2.2Μ παλεύει με την εσωτερική 13k.
  while (!digitalRead(pinRX)) {
    s++;
    if (s > 2000) break; 
  }
  
  return s;
}
*/
/*
function readTouch() {
  var s = 0;
  digitalWrite(pinTX, 0);
  pinMode(pinRX, "input");
  digitalWrite(pinTX, 1);
  
  // Πιο αργό loop για να προλαβαίνει ο γρήγορος nRF52
  while (!digitalRead(pinRX)) {
    s++;
    // Μικρή καθυστέρηση για να αυξήσουμε την ανάλυση
    var x = 1+1; 
    var y = 2+2;
  }
  return s;
}
*/

// --- Λειτουργίες Φωτισμού ---
function applyLight() {
  var val = isOn ? brightness : 0;
  analogWrite(pinLED, val, {freq: 200}); // 200Hz για σταθερό φως χωρίς τρεμόπαιγμα
}

function toggleLight() {
  isOn = !isOn;
  applyLight();
  print(isOn ? "Light ON" : "Light OFF");
}

function doDimming() {
  if (!isOn) isOn = true; 
  brightness += 0.04; // Ταχύτητα dimming
  if (brightness > 1) brightness = 0.1; // Κύκλος από το 10% στο 100%
  applyLight();
}

// --- Αρχικοποίηση (Calibration) ---
// Παίρνουμε μερικές μετρήσεις για να βρούμε το "μηδέν"
setTimeout(function() {
  var samples = 0;
  for (var i=0; i<10; i++) samples += readTouch();
  threshold = (samples / 10) + 25; // Baseline + περιθώριο θορύβου
  print("Calibration Done. Threshold: " + threshold);
}, 500);

// --- Κύριο Loop Ελέγχου ---
setInterval(function() {
  if (threshold === 0) return; // Περίμενε το calibration
  
  var val = readTouch();
  var isTouched = val > threshold;

  if (isTouched) {
    if (touchStartTime === 0) {
      touchStartTime = Date.now();
    } else if (Date.now() - touchStartTime > 400) {
      isDimming = true;
      doDimming();
    }
  } else {
    if (touchStartTime !== 0) {
      var touchDuration = Date.now() - touchStartTime;
      if (!isDimming && touchDuration < 400) {
        toggleLight();
      }
      touchStartTime = 0;
      isDimming = false;
    }
  }
}, 50);











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
