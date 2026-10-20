const PIN_OUT = D24;   // Data (P0.24)
const PIN_PWR = D32;   // Power (P1.00)

var c = (function(){
  var bin=(E.toFlatString||E.toString)(atob("BkoBIxNgovX8chNgQvioPANLT/CAchpgcEcAvwAKAFAMBQBQgrAAIwGTAZsvKwPcAL8BmwEz9+cCsHBHLenzQSVKJkwBI0/wgHEjYBFgAL8AvyNLGWAAIQGRHkZA8ktBAZuLQgTcAL8BmwEzAZP359/4cIATIQAgASdP8IB1J2AVYP/3z/81YP/3zP8AIyNg//fI/9j4ADBAANsBAfH/MUi/QPABABHw/wHo0QEjI2BP8IBzE2AAkQCblSsE3AC/AJsBMwCT9+dP8IBzwPNPABNgArC96PCBDAUAUGAHAFAIBQBQEAUAUA=="));
  return {
    initPIR:E.nativeCall(1, "void()", bin),
    readPIRForced19Bit:E.nativeCall(61, "int()", bin),
  };
})();

function startPIRForcedStream() {
  c.initPIR();
  console.log("Αναμονή 4 δευτερολέπτων για σταθεροποίηση...");
  
  setTimeout(function() {
    console.log("Έναρξη ασταμάτητου stream με τη μέθοδο του αναγκασμού (Κάθε 200ms):");
    lala=1000;
    setInterval(function() {
      try {
        var rawVal = c.readPIRForced19Bit();
        var signedVal = (rawVal > 32767) ? rawVal - 65536 : rawVal;
        if (lala <=signedVal ) print("move:",signedVal);
        else print("---",    signedVal);
        //else if (-3000 <= signedVal  && signedVal <= -1000 ) print("---",    signedVal);    
        /*
        // Μετατροπή των 16-bit δεδομένων σε signed short (High-Pass Filter Output)
        var signedVal = (rawVal > 32767) ? rawVal - 65536 : rawVal;
        
        // Σχεδίαση μπάρας με βάση την απόλυτη τιμή (ένταση κίνησης)
        var absVal = Math.abs(signedVal);
        var barLength = Math.floor((absVal / 2500) * 40); 
        if(barLength > 40) barLength = 40;
        var bar = "=".repeat(barLength) + " ".repeat(40 - barLength);
        
        console.log("Filter Value: " + signedVal + " [" + bar + "]");
        */
      } catch(e) {
        console.log("Error: ", e);
      }
    }, 100); // Δειγματοληψία κάθε 200ms με απόλυτη ασφάλεια
  }, 4000);
}

startPIRForcedStream();
