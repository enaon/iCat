
ew.apps.timer = {
  state: {
    def: {
      timers: {
        1: { min: 0, on: 0, tid: 0, buzz: 0, rep: 0, remaining: 0, intervalId: 0 },
        2: { min: 0, on: 0, tid: 0, buzz: 0, rep: 0, remaining: 0, intervalId: 0 },
        3: { min: 0, on: 0, tid: 0, buzz: 0, rep: 0, remaining: 0, intervalId: 0 }
      }
    }
  },

  // Αρχικοποίηση
  init: function() {
    // Επαναφορά κατάστασης μετά από reboot
    for (var i = 1; i <= 3; i++) {
      var timer = this.state.def.timers[i];
      if (timer.on && timer.tid === 0 && timer.remaining > 0) {
        // Επαναλειτουργία μετά από reboot
        this._startTimer(i, timer.remaining);
      }
    }
  },

  // Ορισμός νέου timer
  set: function(timerId, minutes, buzz, repetitions) {
    if (timerId < 1 || timerId > 3) return false;
    
    var timer = this.state.def.timers[timerId];
    
    // Clear existing timer if any
    this._clearTimerResources(timerId);
    
    var ms = minutes * 60000;
    
    // Set new values
    timer.min = minutes;
    timer.buzz = buzz ? 1 : 0;
    timer.rep = repetitions || 0;
    timer.remaining = ms;
    timer.on = 1;
    
    // Start the timer
    this._startTimer(timerId, ms);
    return true;
  },

  // Εσωτερική συνάρτηση εκκίνησης timer
  _startTimer: function(timerId, ms) {
    var self = this;
    var timer = this.state.def.timers[timerId];
    var startTime = Date.now();
    
    // Set the main timeout
    timer.tid = setTimeout(function() {
      self._timerComplete(timerId);
    }, ms);
    
    // Update remaining time every second
    timer.intervalId = setInterval(function() {
      if (!timer.on || !timer.tid) {
        clearInterval(timer.intervalId);
        timer.intervalId = 0;
        return;
      }
      
      var elapsed = Date.now() - startTime;
      timer.remaining = Math.max(0, ms - elapsed);
      
      // Clean up when timer completes
      if (timer.remaining === 0) {
        clearInterval(timer.intervalId);
        timer.intervalId = 0;
      }
    }, 1000);
  },

  // Εσωτερική συνάρτηση ολοκλήρωσης timer
  _timerComplete: function(timerId) {
    var timer = this.state.def.timers[timerId];
    
    // Clean up intervals
    if (timer.intervalId) {
      clearInterval(timer.intervalId);
      timer.intervalId = 0;
    }
    
    timer.tid = 0;
    timer.on = 0;
    timer.remaining = 0;
    
    // Trigger buzzer if enabled
    if (timer.buzz) {
      ew.sys.buzz.alrm([100, 200, 200]);
    }
    
    // Handle repetitions
    if (timer.rep > 0) {
      timer.rep--;
      if (timer.rep > 0) {
        this.set(timerId, timer.min, timer.buzz, timer.rep);
      }
    }
  },

  // Εσωτερική συνάρτηση καθαρισμού πόρων timer
  _clearTimerResources: function(timerId) {
    var timer = this.state.def.timers[timerId];
    
    if (timer.tid) {
      clearTimeout(timer.tid);
      timer.tid = 0;
    }
    
    if (timer.intervalId) {
      clearInterval(timer.intervalId);
      timer.intervalId = 0;
    }
  },

  // Καθαρισμός timer (stop για συγκεκριμένο timer)
  clear: function(timerId) {
    if (timerId < 1 || timerId > 3) return false;
    
    this._clearTimerResources(timerId);
    
    var timer = this.state.def.timers[timerId];
    timer.on = 0;
    timer.remaining = 0;
    
    return true;
  },

  // Πάυση όλων των timers
  stop: function() {
    for (var i = 1; i <= 3; i++) {
      this.clear(i);
    }
  },

  // Πάυση συγκεκριμένου timer
  stopTimer: function(timerId) {
    return this.clear(timerId);
  },

  // Λήψη κατάστασης timer
  getStatus: function(timerId) {
    if (timerId < 1 || timerId > 3) return null;
    
    var timer = this.state.def.timers[timerId];
    return {
      active: timer.on === 1,
      minutes: timer.min,
      remainingSeconds: Math.ceil(timer.remaining / 1000), // σε δευτερόλεπτα
      remainingMinutes: Math.ceil(timer.remaining / 60000), // σε λεπτά
      buzz: timer.buzz === 1,
      repetitions: timer.rep,
      repetitionsLeft: timer.rep
    };
  },

  // Λήψη όλων των timers
  getAllStatus: function() {
    var result = {};
    for (var i = 1; i <= 3; i++) {
      result[i] = this.getStatus(i);
    }
    return result;
  },

  // Snooze function (προσθέτει 5 λεπτά στον συγκεκριμένο timer)
  snz: function(timerId) {
    if (timerId < 1 || timerId > 3) return false;
    
    var timer = this.state.def.timers[timerId];
    if (!timer.on) return false;
    
    this.clear(timerId);
    this.set(timerId, timer.min + 5, timer.buzz, timer.rep);
    return true;
  },

  // Vibration function
  vibr: function(pattern) {
    // Απλή υλοποίηση vibration
    ew.sys.buzz.alrm(pattern || [100, 100, 100]);
  },

  // Επανεκκίνηση timer (αν έχει διακοπεί)
  restart: function(timerId) {
    if (timerId < 1 || timerId > 3) return false;
    
    var timer = this.state.def.timers[timerId];
    if (timer.on || timer.min === 0) return false;
    
    this.set(timerId, timer.min, timer.buzz, timer.rep);
    return true;
  }
};

