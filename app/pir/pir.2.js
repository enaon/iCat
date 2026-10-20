// YS312 family example 
const DATA_PIN = D24;   // Mandatory Data pin
const POWER_PIN = D32;  // Optional Power pin (Pass undefined if PIR is permanently powered)

// Inline C Driver 

var c = (function(){
  var bin=(E.toFlatString||E.toString)(atob("HygwtcOyBdwhSnpEE3BP8KBDBOAfSnpEIDsTcBtLHkoeTHpEA/WhYBBgHUp6RAPyDFAQYBtKekQD9aJgEGAaSnpEfEQQeE/04GIC64AC1RglYAMk1FABIoJAACnD+AwlEtsfKcuyxb8ISiA7T/CgQtuyAvXgYQHrgwEDIAhgASEB+gPzwvgINTC9AL8AAwBQ5gEAANoBAADWAQAAsgEAANABAAC2AQAAsAEAAIKwACMBkwGbLysD3AC/AZsBM/fnArBwR0BLe0QDIhtoLenwTxpgPkt7RIewGmg9S3tEGXgBI4tAE2AAvwC/Okp6RBJoE2AAIwSTQPJLQgSbk0IE3AC/BJsBMwST9+czSzNMNE00TjVPe0RP8BMLT/AACnxEfUQBk35Ef0SYRiJoAyMTYAGbKmiT+ADgT/ABCQn6DvMTYP/3s/8BmzJoG3gJ+gPzE2D/96v/1PgAwAAjzPgAMAWTBZsLKwPcAL8FmwEz9+c7aJj4AJAbaCP6Cf4e8AEPT+pKCgvx/zIYv0rwAQoS8P8LytEDI8z4ADAUS3tEGWgBIwP6CfMLYM34DLADmpUqBNwAvwOaATIDkvfnyvNPAAtgB7C96PCPLgEAACgBAAAUAQAADAEAANwAAADWAAAA3AAAANQAAADGAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));
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
    }, 200); 
  }, 4000);
}

startPIRForcedRead();
