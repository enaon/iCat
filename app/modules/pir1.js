// YS312 family example 
const DATA_PIN = D24;   // Mandatory Data pin
const POWER_PIN = D32;  // Optional Power pin (Pass undefined if PIR is permanently powered)

// Inline C Driver 

var c = (function(){
  var bin=(E.toFlatString||E.toString)(atob("HygwtcOyBdwhSnpEE3BP8KBDBOAfSnpEIDsTcBtLHkoeTHpEA/WhYBBgHUp6RAPyDFAQYBtKekQD9aJgEGAaSnpEfEQQeE/04GIC64AC1RglYAMk1FABIoJAACnD+AwlEtsfKcuyxb8ISiA7T/CgQtuyAvXgYQHrgwEDIAhgASEB+gPzwvgINTC9AL8AAwBQsgEAAKYBAACiAQAAfgEAAJwBAACCAQAAfAEAAIKwACMBkwGbFysD3AC/AZsBM/fnArBwRzNLe0Qt6fdPG2gDIhpgMUt7RBpoMEt7RBl4ASOLQBNgACMBk0DyJSIBm5NCBNwAvwGbATMBk/fnKE0pTilMKk/f+KiAT/ATCk/wAAl9RH5EfER/RPhEK2gyaAMhGWCU+ADgT/ABCwv6DvMTYP/3vP8jeAv6A/E7aBlg//e1/ytoACEZYP/3sP/Y+AAwlPgA4BloIfoO8csHCfoL+Qrx/zJIv0nqCwkS8P8K1NEQS3tEAyIbaBpgD0t7RMnzTwAaaAEjA/oO8xNgA7C96PCPAL/6AAAA8AAAAOIAAACwAAAAtgAAAKgAAACuAAAAoAAAAE4AAABMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="));
  return {
    initPIR:E.nativeCall(1, "void(int, int)", bin),
    readPIRForced19Bit:E.nativeCall(197, "int()", bin),
  };
})();

// --- JavaScript Wrapper Function ---
function setupPIR(dataPin, pwrPin) {
  var dPinNum = Number(dataPin); 
  var pPinNum = pwrPin ? Number(pwrPin) : -1;
  c.initPIR(dPinNum, pPinNum);
}

// --- Main Execution Script ---
const MOTION_THRESHOLD = 1000; 

function startPIRForcedRead() {
  setupPIR(DATA_PIN, POWER_PIN);
  console.log("Waiting 4 seconds for sensor stabilization...");
  
  setTimeout(function() {
    console.log("Dynamic Low-Power PIR Driver Initialized. Monitoring:");
    
    setInterval(function() {
      try {
        var rawVal = c.readPIRForced19Bit();
        var signedVal = (rawVal > 32767) ? rawVal - 65536 : rawVal;

        if (signedVal < -2000) { console.log("*****: " + signedVal);return;} // Reject Jitter Artifacts

        if (signedVal > MOTION_THRESHOLD) {
          console.log("MOTION! " + signedVal);
        } //else console.log("Value: " + signedVal);
      } catch(e) {
        console.log("Execution Error: ", e);
      }
    }, 50); 
  }, 4000);
}

startPIRForcedRead();
// YS312 family example 
const DATA_PIN = D24;   // Mandatory Data pin
const POWER_PIN = D32;  // Optional Power pin (Pass undefined if PIR is permanently powered)

// Inline C Driver 
var c = (function(){
  var bin=(E.toFlatString||E.toString)(atob("HygwtcOyBdwhSnpEE3BP8KBDBOAfSnpEIDsTcBtLHkp6RAP1oWAQYBxKekQD8gxQEGAbSnpEA/WiYBBgGUp6RE/04GAUeBhKAOuEAHpExRgVYAEiwlAAKQL6BPLD+AglEtsfKcuyxb8ISiA7T/CgQtuyAvXgYQHrgwEDIAhgASEB+gPzwvgINTC9AL8AAwBQGgMAAA4DAAAMAwAABgMAAOwCAADmAgAA3AIAAAC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/AL8AvwC/cEcAAC3p908TIwCTK0ssTN/4sLAsTS1Oe0SARk/wAAoBk3xE+0R9RH5EAZsfaCNoT/ABCcf4AJCb+ADgCfoO9x9g//cN/5v4AHAraAn6B/cfYP/3Bf8BmxtoACcfYP/3//43aJv4AOA/aCf6Dvf7BwCbCvoJ+gPx/zNIv0rqCQoT8P8DAJPQ0RFLe0RK808AGmgBIxNgD0p6RAP6DvMSaBD1+m8TYAPbQEXYvwAgAeBP8P8wA7C96PCPAL/EAAAAwgAAALQAAAC6AAAArAAAAFIAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="));
  return {
    initPIR:E.nativeCall(1, "void(int, int)", bin),
    readPIR:E.nativeCall(593, "int(int)", bin),
  };
})();

// --- Main Execution Script ---
const MOTION_THRESHOLD = 1000; 

function startPIR() {

  console.log("Waiting 4 seconds for sensor stabilization...");
  c.initPIR(DATA_PIN, POWER_PIN); //dataPin, pwrPin or -1 

  setTimeout(function() {
    console.log("C-Level PIR Driver Initialized.");

    setInterval(function() {
      try {
        var res = c.readPIR(MOTION_THRESHOLD);

        if (res > 0) {
          console.log("MOTION! " + res);
        } else if (res === -1) {
          console.log("*****: Jitter Artifact Detected");
        } 
      } catch(e) {
        console.log("Execution Error: ", e);
      }
    }, 200); // 250ms interval για εξοικονόμηση ενέργειας
  }, 4000);
}

startPIR();
