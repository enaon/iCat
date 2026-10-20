ew.sys.buzz = {};

ew.sys.buzz.type = { 
    na: [15, 15, 15], 
    ok: [15], 
    ln: [80], 
    info: [75, 50, 75, 50, 75], 
    error: [100, 50, 75, 50, 100, 200, 100, 200, 100], 
    on: [40], 
    off: [20, 25, 20] 
};


ew.sys.buzz._queue = [];
ew.sys.buzz._busy = false;


ew.sys.buzz.play = function(pattern) {
    if (!Array.isArray(pattern)) pattern = [pattern];

    ew.sys.buzz._queue.push(pattern);

    if (!ew.sys.buzz._busy) {
        ew.sys.buzz._next();
    }
};

ew.sys.buzz._next = function() {
  if (ew.sys.buzz._queue.length === 0) {
    ew.sys.buzz._busy = false;
    // Εξασφαλίζουμε ότι το pin έκλεισε
    digitalWrite(ew.pin.BUZZ, !ew.pin.BUZ0); 
    return;
  }

  ew.sys.buzz._busy = true;
  var currentPattern = ew.sys.buzz._queue.shift();
  
  var totalDuration = 0;
  currentPattern.forEach(function(time) {
    totalDuration += time;
  });

  digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0, currentPattern);

  setTimeout(function() {
    ew.sys.buzz._next();
  }, totalDuration + 100); 
  //}, totalDuration ); 

};
ew.sys.buzz.sys = function(pattern) { ew.sys.buzz.play(pattern); };
ew.sys.buzz.alrm = function(pattern) { ew.sys.buzz.play(pattern); };
ew.sys.buzz.euc = function(pattern) { ew.sys.buzz.play(pattern); };

/*if (ew.def.face.buzz) ew.sys.buzz.nav = digitalPulse.bind(null, ew.pin.BUZZ, ew.pin.BUZ0);
else ew.sys.buzz.nav = function() { return true; };
*/
ew.sys.buzz.nav = function(pattern) {
    if (ew.def.face.buzz) digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0,pattern);
    else return true;
};

/*ew.sys.buzz.nav = function(pattern) {
    if (ew.def.face.buzz) ew.sys.buzz.play(pattern);
    else return true;
};
*/