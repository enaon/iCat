ew.apps.timer = {
  state: {
    def: {
      1: { min: 5, active: 0,  buzz: 1, buzzRep: 5, buzzDelay: 2000, rep: 0, remaining: 0, paused: 0, name: "Timer 1" },
      2: { min: 10, active: 0,  buzz: 1, buzzRep: 5, buzzDelay: 2000, rep: 0, remaining: 0,  paused: 0, name: "Timer 2" },
      3: { min: 15, active: 0,  buzz: 1, buzzRep: 5, buzzDelay: 2000, rep: 0, remaining: 0,  paused: 0, name: "Timer 3" },
      4: { min: 20, active: 0,  buzz: 1, buzzRep: 5, buzzDelay: 2000, rep: 0, remaining: 0,  paused: 0, name: "Timer 4" },
      5: { min: 25, active: 0,  buzz: 1, buzzRep: 5, buzzDelay: 2000, rep: 0, remaining: 0,  paused: 0, name: "Timer 5" }
    },
    tid: {  
      1: { timer: 0, interval: 0, buzz: 0 },
      2: { timer: 0, interval: 0, buzz: 0 },
      3: { timer: 0, interval: 0, buzz: 0 },
      4: { timer: 0, interval: 0, buzz: 0 },
      5: { timer: 0, interval: 0, buzz: 0 }
    }
  },

  // Αρχικοποίηση
  init: function() {
    for (var i = 1; i <= 5; i++) {
      var timer = this.state.def[i];
      
      if (timer.active === 1 && timer.paused === 0) {
        this._startTimer(i, timer.remaining);
      }
    }
  },

  // Ορισμός νέου timer (ΧΩΡΙΣ auto start)
  setTimer: function(timerId, minutes, buzz, buzzRep, buzzDelay, repetitions) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];

    // Clear existing timer if any
    this._stopTimerResources(timerId);

    // Set new values (χωρίς να ξεκινάει)
    timer.min = minutes;
    timer.buzz = buzz ? 1 : 0;
    timer.buzzRep = buzzRep || 1;
    timer.buzzDelay = buzzDelay || 2000;
    timer.rep = repetitions || 0;
    timer.remaining = minutes * 60000;
    timer.active = 0; // Δεν είναι active ακόμα
    timer.paused = 0;
    

    return true;
  },

  // Εκκίνηση timer (ξεκινάει την μέτρηση)
  startTimer: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    // Έλεγχος αν ο timer έχει ρυθμιστεί
    if (timer.min === 0) return false;

    // Έλεγχος αν είναι ήδη active
    if (timer.active === 1 && timer.paused === 0) return false;

    // Clear existing resources
    this._stopTimerResources(timerId);

    // ΑΝ remaining ΕΙΝΑΙ 0, ΞΑΝΑϋΠΟΛΟΓΙΣΕ ΤΟ!
    if (timer.remaining === 0) {
      timer.remaining = timer.min * 60000;
    }

    // Ξεκινάει τον timer
    timer.active = 1;
    timer.paused = 0;
    this._startTimer(timerId, timer.remaining);

    return true;
  },

  // Εσωτερική συνάρτηση εκκίνησης timer
  _startTimer: function(timerId, ms) {
    var self = this;
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId]

    var startTime = Date.now();

    // Set the main timeout
    tid.timer = setTimeout(function() {
      self._timerComplete(timerId);
    }, ms);

    // Update remaining time every second
    tid.interval = setInterval(function() {
      if (!timer.active || timer.paused || !tid.timer) {
        clearInterval(tid.interval);
        tid.interval = 0;
        return;
      }

      var elapsed = Date.now() - startTime;
      timer.remaining = Math.max(0, ms - elapsed);

      if (timer.remaining === 0) {
        clearInterval(tid.interval);
        tid.interval = 0;
      }
    }, 1000);
  },

  // Pause timer
  pauseTimer: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    if (!timer.active || timer.paused) return false;

    // Stop the countdown but keep remaining time
    this._stopTimerResources(timerId);
    timer.paused = 1;

    return true;
  },

  // Resume timer
  resumeTimer: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    if (!timer.active || !timer.paused || timer.remaining <= 0) return false;

    // Continue from remaining time
    timer.paused = 0;
    this._startTimer(timerId, timer.remaining);

    return true;
  },

  // Εσωτερική συνάρτηση ολοκλήρωσης timer
  _timerComplete: function(timerId) {
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId]
    // Clean up intervals
    if (tid.interval) {
      clearInterval(tid.interval);
      tid.interval = 0;
    }

    tid.timer = 0;
    timer.active = 0;
    timer.paused = 0;
    timer.remaining = 0;

    // Trigger buzzer if enabled
    if (timer.buzz) {
      this._triggerBuzzer(timerId, timer.buzzRep, timer.buzzDelay);
    }

    // Handle repetitions
    if (timer.rep > 0) {
      timer.rep--;
      if (timer.rep > 0) {
        // Για repetitions, χρησιμοποιούμε setTimer + startTimer
        this.setTimer(timerId, timer.min, timer.buzz, timer.buzzRep, timer.buzzDelay, timer.rep, timer.name);
        this.startTimer(timerId);
      }
    }
  },

  // Εσωτερική συνάρτηση για buzzer με repetitions
  _triggerBuzzer: function(timerId, repetitions, delay) {
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId]

    var count = 0;

    // Clear any existing buzz
    if (tid.buzz) {
      clearTimeout(tid.buzz);
      tid.buzz = 0;
    }

    function buzz(timer) {
      if (count < repetitions && tid.buzz) {
        ew.sys.buzz.alrm([100, 200, 200]);
        count++;
        tid.buzz = setTimeout(()=>{ buzz(timer) }, delay,timer);
        ew.notify.alert("error", { body: timer.name, title: "TIMER" }, 0, 0);

      }
    }
    if (ew.face.appCurr === "timer") ew.face[0].init();
    // Start the buzz
    tid.buzz = 1; // Mark as active
    buzz(timer);
  },

  // Σταμάτημα buzz για συγκεκριμένο timer
  stopBuzz: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId]

    if (tid.buzz) {
      if (typeof tid.buzz === 'number' && tid.buzz > 1) {
        clearTimeout(tid.buzz);
      }
      tid.buzz = 0;
      return true;
    }
    return false;
  },

  // Σταμάτημα όλων των buzz
  stopAllBuzz: function() {
    var stopped = false;
    for (var i = 1; i <= 5; i++) {
      if (this.stopBuzz(i)) {
        stopped = true;
      }
    }
    return stopped;
  },

  // Εσωτερική συνάρτηση καθαρισμού πόρων timer
  _stopTimerResources: function(timerId) {
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId]

    if (tid.timer) {
      clearTimeout(tid.timer);
      tid.timer = 0;
    }

    if (tid.interval) {
      clearInterval(tid.interval);
      tid.interval = 0;
    }

    // Stop buzz when clearing timer
    this.stopBuzz(timerId);
  },

  // Καθαρισμός timer (stop)
  stopTimer: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    this._stopTimerResources(timerId);

    var timer = this.state.def[timerId];
    timer.active = 0;
    timer.paused = 0;
    timer.remaining = timer.min * 60000; // Επαναφορά στο αρχικό χρόνο

    return true;
  },

  // Πάυση όλων των timers
  stopAll: function() {
    for (var i = 1; i <= 5; i++) {
      this.stopTimer(i);
    }
  },

  // Λήψη κατάστασης timer
  getTimerStatus: function(timerId) {
    if (timerId < 1 || timerId > 5) return null;

    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId]

    var totalSeconds = Math.ceil(timer.remaining / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    return {
      active: timer.active === 1,
      paused: timer.paused === 1,
      minutes: timer.min,
      remainingSeconds: seconds,
      remainingMinutes: minutes,
      buzz: timer.buzz === 1,
      buzzActive: tid.buzz !== 0,
      buzzRep: timer.buzzRep,
      buzzDelay: timer.buzzDelay,
      repetitions: timer.rep,
      repetitionsLeft: timer.rep,
      name: timer.name
    };
  },

  // Λήψη όλων των timers
  getAllStatus: function() {
    return {
      1: this.getTimerStatus(1),
      2: this.getTimerStatus(2),
      3: this.getTimerStatus(3),
      4: this.getTimerStatus(4),
      5: this.getTimerStatus(5)
    };
  },

  // Snooze function
  snoozeTimer: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    if (!timer.active) return false;

    this.stopTimer(timerId);
    this.setTimer(timerId, timer.min + 5, timer.buzz, timer.buzzRep, timer.buzzDelay, timer.rep, timer.name);
    this.startTimer(timerId);
    return true;
  },

  // Vibration function
  vibrate: function(pattern) {
    ew.sys.buzz.alrm(pattern || [100, 100, 100]);
  },

  // Επανεκκίνηση timer
  restartTimer: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    if (timer.min === 0) return false;

    this.setTimer(timerId, timer.min, timer.buzz, timer.buzzRep, timer.buzzDelay, timer.rep, timer.name);
    this.startTimer(timerId);
    return true;
  },

  getRemainingMinutes: function(timerId) {
    if (timerId < 1 || timerId > 5) return 0;
    var timer = this.state.def[timerId];
    return Math.floor(timer.remaining / 60000);
  },

  getRemainingSeconds: function(timerId) {
    if (timerId < 1 || timerId > 5) return 0;
    var timer = this.state.def[timerId];
    return Math.floor((timer.remaining % 60000) / 1000);
  },

  getFormattedTime: function(timerId) {
    var min = this.getRemainingMinutes(timerId);
    var sec = this.getRemainingSeconds(timerId);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
  },

};

if (require('Storage').readJSON('ew.json', 1).timer)
  ew.apps.timer.state.def = require('Storage').readJSON('ew.json', 1).timer;

// Αρχικοποίηση κατά την φόρτωση
ew.apps.timer.init();

/*
// Ορισμός πολλαπλών timers
ew.apps.timer.set(1, 5, true, 5);  // Timer 1: 5 λεπτά
ew.apps.timer.set(2, 10, false, 1); // Timer 2: 10 λεπτά
ew.apps.timer.set(3, 2, true, 0);   // Timer 3: 2 λεπτά

// Stop μόνο του timer 2
ew.apps.timer.stopTimer(2);

// Stop μόνο του timer 3 (εναλλακτικά με clear)
ew.apps.timer.clear(3);

// Έλεγχος κατάστασης ενός timer
var status = ew.apps.timer.getStatus(1);
console.log("Timer 1: " + status.remainingSeconds + " δευτερόλεπτα");

// Επανεκκίνηση του timer 2
ew.apps.timer.restart(2);





// Timer για 1 λεπτό, με μπάζερ 3 φορές με 2 δευτερόλεπτα delay
ew.apps.timer.set(1, 1, true, 3, 2000, 0);

// Τώρα το status θα δείχνει:
// { active: true, minutes: 1, remainingMinutes: 0, remainingSeconds: 59,
//   buzz: true, buzzRep: 3, buzzDelay: 2000, repetitions: 0, repetitionsLeft: 0 }

// Timer για 119 δευτερόλεπτα (1 λεπτό 59 δευτερόλεπτα)
ew.apps.timer.set(2, 2, false, 1, 2000, 0); // 2 λεπτά = 120 δευτερόλεπτα

// Μετά από 1 δευτερόλεπτο θα δείχνει:
// { active: true, minutes: 2, remainingMinutes: 1, remainingSeconds: 59, ... }

// Ορισμός timer με buzz 10 επαναλήψεις
ew.apps.timer.set(1, 1, true, 10, 2000, 0);

// Σταμάτημα μόνο του buzz (ο timer συνεχίζει)
ew.apps.timer.stopBuzz(1);

// Σταμάτημα όλων των buzz
ew.apps.timer.stopAllBuzz();

// Έλεγχος αν το buzz είναι active
var status = ew.apps.timer.getStatus(1);
console.log("Buzz active: " + status.buzzActive);


// Ορισμός timer
ew.apps.timer.setTimer(1, 5, true, 3, 2000, 0);

// Pause
ew.apps.timer.pauseTimer(1);

// Resume
ew.apps.timer.resumeTimer(1);

// Snooze
ew.apps.timer.snoozeTimer(1);

// Stop
ew.apps.timer.stopTimer(1);
*/
