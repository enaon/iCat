ew.apps.timer = {

  state: {
    def: {
      1: { min: 5, active: 0, buzz: 1, buzzRep: 5, buzzDelay: 2000, snooze: 5, wake: 0, rep: 0, repLeft: 0, remaining: 0, paused: 0, name: "Timer 1" },
      2: { min: 10, active: 0, buzz: 1, buzzRep: 5, buzzDelay: 2000, snooze: 5, wake: 0, rep: 0, repLeft: 0, remaining: 0, paused: 0, name: "Timer 2" },
      3: { min: 15, active: 0, buzz: 1, buzzRep: 5, buzzDelay: 2000, snooze: 5, wake: 0, rep: 0, repLeft: 0, remaining: 0, paused: 0, name: "Timer 3" },
      4: { min: 20, active: 0, buzz: 1, buzzRep: 5, buzzDelay: 2000, snooze: 5, wake: 0, rep: 0, repLeft: 0, remaining: 0, paused: 0, name: "Timer 4" },
      5: { min: 25, active: 0, buzz: 1, buzzRep: 5, buzzDelay: 2000, snooze: 5, wake: 0, rep: 0, repLeft: 0, remaining: 0, paused: 0, name: "Timer 5" }
    },
    tid: {
      1: { timer: 0, interval: 0, buzz: 0 },
      2: { timer: 0, interval: 0, buzz: 0 },
      3: { timer: 0, interval: 0, buzz: 0 },
      4: { timer: 0, interval: 0, buzz: 0 },
      5: { timer: 0, interval: 0, buzz: 0 }
    },
    page: 1
  },


  // Αρχικοποίηση
  init: function() {
    for (var i = 1; i <= 5; i++) {
      var timer = this.state.def[i];

      // Αν δεν υπάρχει repLeft, το δημιουργούμε από το rep
      if (timer.repLeft === undefined) {
        timer.repLeft = timer.rep > 0 ? timer.rep : 0;
      }

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
    timer.rep = repetitions || 0; // Αυτό παραμένει η ρύθμιση
    timer.repLeft = repetitions > 0 ? repetitions - 1 : 0; // Επαναλήψεις που απομένουν
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

    timer.remaining = timer.min * 60000;

    // Αρχικοποίηση repLeft - repLeft = rep - 1 (επαναλήψεις που απομένουν)
    timer.repLeft = timer.rep > 0 ? timer.rep : 0;

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
    var tid = this.state.tid[timerId];

    this.state.run=1;


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
  /*
    // Εσωτερική συνάρτηση ολοκλήρωσης timer
    _timerComplete: function(timerId) {
      var timer = this.state.def[timerId];
      var tid = this.state.tid[timerId];
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
      if (timer.repLeft > 0) {
        timer.repLeft--; // Μείωση των επαναλήψεων που απομένουν
        if (timer.repLeft >= 0) {
          // Επαναφορά και εκκίνηση timer
          timer.remaining = timer.min * 60000;
          timer.active = 1;
          this._startTimer(timerId, timer.remaining);
        }
      }
    },
  */
  // Also modify the _timerComplete function to restore original time after snooze
  _timerComplete: function(timerId) {
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId];

    // Clean up intervals
    if (tid.interval) {
      clearInterval(tid.interval);
      tid.interval = 0;
    }

    tid.timer = 0;
    timer.active = 0;
    timer.paused = 0;

    // RESTORE ORIGINAL TIME - This is important!
    timer.remaining = timer.min * 60000;

    // Trigger buzzer if enabled
    if (timer.buzz) {
      this._triggerBuzzer(timerId, timer.buzzRep, timer.buzzDelay);
    }

    // Handle repetitions
    if (timer.repLeft > 0) {
      timer.repLeft--; // Μείωση των επαναλήψεων που απομένουν
      if (timer.repLeft >= 0) {
        // Επαναφορά και εκκίνηση timer με τον αρχικό χρόνο
        timer.remaining = timer.min * 60000;
        timer.active = 1;
        this._startTimer(timerId, timer.remaining);
      }
    }
    this._isActive();
  },



  // Εσωτερική συνάρτηση για buzzer με repetitions
  _triggerBuzzer: function(timerId, repetitions, delay) {
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId];

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
        tid.buzz = setTimeout(() => { buzz(timer); }, delay, timer);
        ew.apps.timer._alert(timerId, timer.name);
      }
    }
    //if (ew.face.appCurr === "timer") ew.face[0].init();
    // Start the buzz
    tid.buzz = 1; // Mark as active
    buzz(timer);
  },
  _alert: function(timerId, name) {
    if (ew.apps.timer.state.def[timerId].wake && !g.isOn)
      ew.face.go(ew.face.appCurr, 0)

    ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, name.toUpperCase(), "", 15, 13, true, false, false);
    ew.UI.c.bar._ntfy = function() {
        ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "", "", 15, 0, false, false, true);
        ew.UI.c.start(0, 1);
        if (!ew.apps.timer.state.def[timerId].rep) {
          ew.UI.btn.img("bar", "_bar", 4, "snooze", "SNOOZE", 15, 4);
          ew.UI.btn.img("bar", "_bar", 5, "confirm", "MUTE", 0, 14);
        }
        else
          ew.UI.btn.img("bar", "_bar", 6, "confirm", "MUTE", 0, 14);
        ew.UI.c.end();
        ew.UI.c.bar._bar = function(i, l) {
          ew.is.UIpri = 0;
          ew.sys.buzz.nav(ew.sys.buzz.type.ok);
          if (i == 4) {
            ew.apps.timer.snoozeTimer(timerId);
            if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, name.toUpperCase(), "SNOOZE", 0, 15);
    
          }
          else {
            ew.apps.timer.stopBuzz(timerId);
            if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "MUTED", "", 0, 15);
    
          }
        };
    };

  },

  // Σταμάτημα buzz για συγκεκριμένο timer
  stopBuzz: function(timerId) {
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId];

    if (tid.buzz) {
      if (typeof tid.buzz === 'number' && tid.buzz > 1) {
        clearTimeout(tid.buzz);
      }
      tid.buzz = 0;
      this._isActive();
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
    this._isActive();
    return stopped;
  },

  // Εσωτερική συνάρτηση καθαρισμού πόρων timer
  _stopTimerResources: function(timerId) {
    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId];

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
    timer.repLeft = timer.rep > 0 ? timer.rep : 0; // Επαναφορά και των επαναλήψεων
    if (ew.face.appCurr === "timer") ew.face[0].init();
    this._isActive();


    return true;
  },

  // Πάυση όλων των timers
  stopAll: function() {
    for (var i = 1; i <= 5; i++) {
      this.stopTimer(i);
    }
    this.state.run=0;
  },

  // check active
  _isActive: function() {
        let isActive = 0;

        for (let i = 1; i <= 5; i++) {
            let status = this.getTimerStatus(i);
            if (status.active && !status.paused) 
              isActive=1;
          
        }
        this.state.run=isActive;        
  },

  // Λήψη κατάστασης timer
  getTimerStatus: function(timerId) {
    if (timerId < 1 || timerId > 5) return null;

    var timer = this.state.def[timerId];
    var tid = this.state.tid[timerId];

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
      repetitions: timer.rep, // Η ρύθμιση των επαναλήψεων
      repetitionsLeft: timer.repLeft, // Οι υπόλοιπες επαναλήψεις
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

  /*  // Snooze function
    snoozeTimer: function(timerId) {
      if (timerId < 1 || timerId > 5) return false;

      var timer = this.state.def[timerId];
      if (timer.active) return false;

      this.stopTimer(timerId);
      this.setTimer(timerId, timer.snooze, timer.buzz, timer.buzzRep, timer.buzzDelay, timer.rep, timer.name);
      this.startTimer(timerId);
      return true;
    },

    // Vibration function
    vibrate: function(pattern) {
      ew.sys.buzz.alrm(pattern || [100, 100, 100]);
    },
    
  */

  snoozeTimer: function(timerId) {
    print(timerId);
    if (timerId < 1 || timerId > 5) return false;

    var timer = this.state.def[timerId];
    if (timer.active) return false;

    // Stop any current buzzing
    this.stopBuzz(timerId);

    // Instead of changing the default settings, just start a new timer
    // with the snooze duration WITHOUT modifying the permanent settings
    timer.remaining = timer.snooze * 60000; // Set remaining time to snooze duration
    timer.active = 1;
    timer.paused = 0;

    // Start the timer with snooze duration
    this._startTimer(timerId, timer.remaining);

    return true;
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

ew.UI.icon.confirm="mEwwIdah/wAof//4ECgYFB4AFBg4FB8AFBj4FB/AFBn4FB/gFBv4FEAgIFGC4MBAoQ2BFwQpB4AFD4PAGgX/wYFEg/gAoX+h4FD/kf8EP/IuBn/wMYIuBv4FCv/gA4MPB4PBAoQbBwYFCE4ImBAoP/gwCBAoWAOYPwBwPAOYI7C8BzBAoQ2BAoZCBAoJlDDQIFFPoYsBRIa0CAoqhC/ytHXIrFFaIrdFdIwAVA==";
ew.UI.icon.snooze="mEwwIWTvgCBnkAgP/AoP/wEDAQIIB4EHBYfgh/+AoN/+EP/kP+E/+Ef/F//0fAoPx///x/4j/nAoPnAoPPAoPzAoOfAoP5/EPn4FB/nwhwFDuEEv4FB/0gHwIACIgRLBj5ZCAo3+n5cB/EHAov8v5oCJYJxDK4IfBgZdBLYIFCn/jAoMBDYPDQwQjBGoIFHJoYFGLJAFDNYYFHPoYFBj4FB/ALHC4v5AoOfAoPwX4MPAoPgY4MHf6IAM";
ew.UI.icon.pause="mEwwIif//Agf/gEB//gg//wAIB8EPAoWAuEOgIUBAv4F/AvLFEaIsAv4IB/z/dgA";
ew.UI.icon.play="mEwwIurhwFEj4FF4AFE8AFDn/4Aon+Aon/AooeDAoIeDAoIeDAoP8AogeDAoWAAogeCAoXwAogkCAoQkCApARFDoopFGopNKLIplFOIqJKSoihFVozFKAFA=";
ew.UI.icon.stop="mEwwI63h////wAoM/AoP8Ao9/AoP+Av4F/ApabLVooA0";


//ew.UI.icon.timer="mUywgNKgMRAAMQEqQXDDKgXEDFhKYGQgXTDIYXVDDMiAAIVSmYAFxGIC6oZQC5AZOC5UznAZKgYPCn//+YCBDI2AGBQUBDAODAYRMMGAQXC//4DAQZEGRALCCQQxEAAJlKGAwABAogyDDAIyEPQYYEAAh+KGAU4GQowDxBLJF4U4LwgADBISXHJIRYCJJDPCMgwYBI5BNGMgyTHDBpLCSRaYHDEvykMRiYYUC4IABl7jHDAszYofzC4URj4WDwYYIHAKXCDAhLDCYIYIbwgYICwQYHMZJ9FPh0xDC5LDDBx6CGQ0SDBcDDA/yDAyLBDAWADBR+CDA4wBDAhkCM4gyBDAIlCVogYCMgfzxAyEDAU4wYYFC4QYDBwR+FDARiEDAhLCnBmF+YxBCwRJHWBHzGwgZDGAoYDPYgYFBgRJGJYgZDDAhJLGQhNCDAYJDGBAZGABAXKJggAHGAJIHDJoXNDJIXPM44XBB5A=";
//ew.UI.icon.timer="mEwwg96hWq1WgDCgXWxGZzOICqQABC4QABCyIXFDBsICIeJyfznAFBwAWPC4Of///mYYMCwgXBl4XB/4xCFxwABn4XCDAQwICw2ICwf/+YwJxGDHoQXHGARGIn/4C5QwBJAwQDC5QLCIw6GEC5BIGIwQLBJAgXGJAwXEJAgXPHgoXIEYIXFLwRIFC484C4h2DJAoIFPA+Ix4MGAAJoDHYgXKf4QXUJAYJGC5p5CF6hIBO44XNABIXGEw4AIU4rXFC5jvFc5AAHxAXGQwwAHQAIXcPCB2FC4RgOB4IXFJBxGHJB5GHJAYwKFwIXIJAIwKFwJGHGAYYICwIuIGAeImYWFmYJBFxIYEwZjC+YtCCxZJDAA4WMDBIWODIwVRAH4AXA==";
//ew.UI.icon.timer="mEwwkEogAgp8zmc0C6czkUhiIXTkUiiIXUCoMRihgUgAuUAAJeUoaNBmRhBmYKECxh1CAAIYBVQXzki7KIgIUBDQUSkYiBmUSXZIWBkZIBJQQYBkVDBYKXHBQUz/4AEDALGLBoItBC4oYBGAIuKifzCwwABmMiOxAuBn8/C5HzGAIuHmMTCpBJDC5Ehl4XL+ZIHNQJFBmIaKSIIXFkRGC+USJCBGE+ZLK+QXFoUhRgZMBMB9CUoIMDGBIXHFIowKC5gwKmQXERwYNEiLeHC4sSBw3ziMRC6n/C68xI5tBBw/zV4YXKUBKnMC6DXBigXFH44XgCwYABiMjC5sykIXU+YXHJBxeGC4YwMmReGJAUiIyYwOmZGHGAhhICwIuIGAYYHmZdBFxIwCDAMzLYYWCiIWKGAIYCkczCoQWNDAZjBAAUhiJFLJQoAECp4ZEFaAAqA=";
//ew.UI.icon.timer="mEwwhC/AFMIxAACwAX/C+MAhOZzOQSCYXXI4YeDDhwWDDAY1BCyQABJoQWTAAJkMUgmImZKGFx8zmc4C5ouFC4QYDbZRaGC4RKDC5eDIIYXDA4RGLmeJzAXFGARIIC4ODE4OZC4wwBC5BGCmcyGAQXGJBApElAwBC4hICC5gwBMBB2KGAZ4PC40yC6wQCC6sikQXVAAwXgU4oXKd5YAId5gXVMBheJC4cjCw7dCC5BICyQXHlJGJC4eJMI04zAXLJAWZJIuJIxYwEDAcyzIuMGAgYBAAQWCFxYwDAA4WMDBIWODA4WQMYhbNAH4AEA==";
//ew.UI.icon.timer="mEwwhC/AB0P///+czAAWIAAOACpIUBCwgUCAAoXIFIUiAAMoC58ykMRAAsa1QABxGKlBIIFgQAEGIpgJgQXGiUikcjmcgC5UwTRQLKC/4XPgbHBC6EPbYUkolDn4XLgYLB+czmVEAANCmYXMgE/IIIrBAAYvNgEzgYVEAAIvB+YWKJAPzC6pIBmgXFoZGMJAXwklCCwf/VAIAMO4PzkSOCmHzFxoYCLAM0RgIWQPQc0bIIWRMQUyC4PwCqEPeAIACn4YQ///JIJFBh//DB0PB4QXCDAQuOPIYIEGBguDC4oJEFxgSBBRIXSGBcDBYgXGbZUCBYgXX+YdFC57uCCQgXO+cz7vdDAgXKdIUPmc+C4PTDAYXNFwMzogABoczBgKnLmUjCwPu9owBDARkFAAuIAAIPBkQAElAKBCxEPnAYCABJLCFxAAMC74ZNwAWJAH4ACA";
//ew.UI.icon.timer="mEwwhC/AHkIxAAMwAX3DBoWJC+EAmYAKVJYX/C+8DCxMwC5k07oAGoYXMJAIXHIxgXCnoWF6YXOMAMtCwfSLxqREpoWB6iNNDA0koQWSYQwWTmUjDCLYDC4h3Od5IXRF4gXNIwYXGJBgXEAAoXMCIgvFJBgQElvSC6kt7vdDAgXOmgWBAANDC6NNC4fUC6AuEGAgWKhGIABWAC/AWMDBQXvAH4Az";

// install icon
if (!require('Storage').read("ew_i_timer.img"))  {
  let icon="mEwwhC/AHkIxAAMwAX3DBoWJC+EAmYAKVJYX/C+8DCxMwC5k07oAGoYXMJAIXHIxgXCnoWF6YXOMAMtCwfSLxqREpoWB6iNNDA0koQWSYQwWTmUjDCLYDC4h3Od5IXRF4gXNIwYXGJBgXEAAoXMCIgvFJBgQElvSC6kt7vdDAgXOmgWBAANDC6NNC4fUC6AuEGAgWKhGIABWAC/AWMDBQXvAH4Az";
  require('Storage').write("ew_i_timer.img", require("heatshrink").decompress(atob(icon)));
}

// start
ew.apps.timer.init();
