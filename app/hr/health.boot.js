{ // Handle turning HRM on/off at the right times
  let settings = require("Storage").readJSON("health.json", 1) || {};
  let hrm = 0|settings.hrm;
  
  // HRM history array and statistics
  global.HRM_HISTORY = [];
  global.HRM_CORRECTION_STATS = {
    count: 0,
    lastCorrectionTime: 0,
    corrections: [],
    originalValue: null,
    originalTime: null
  };
  
  // Store the final stabilized BPM value
  global.HRM_STABILIZED_BPM = null;
  global.HRM_STABILIZED_CONFIDENCE = null;
  
  const HISTORY_SIZE = 25;
  const MIN_CONFIDENCE = 60;
  const MAX_BPM = 220;
  const MIN_BPM = 30;
  const STABILIZATION_THRESHOLD = 5;
  const STABILIZATION_TIME = 30000; // 30 seconds
  
  // Helper functions
  global.calculateMovingAverage = function(values) {
    if (values.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
    }
    return Math.round(sum / values.length);
  };
  
  global.calculateStability = function(values) {
    if (values.length < 3) return Infinity;
    let lastThree = values.slice(-3);
    let avg = global.calculateMovingAverage(lastThree);
    
    let maxDeviation = 0;
    for (let i = 0; i < lastThree.length; i++) {
      let deviation = Math.abs(lastThree[i] - avg);
      if (deviation > maxDeviation) {
        maxDeviation = deviation;
      }
    }
    return maxDeviation;
  };
  
  global.isValidBPM = function(bpm) {
    return bpm >= MIN_BPM && bpm <= MAX_BPM;
  };
  
  if (hrm == 1 || hrm == 2) {
    let onHealth = function(h) {
      function startMeasurement() {
        if (Bangle.isCharging() ||
            (Bangle.getHealthStatus("last").movement<100 && Math.abs(Bangle.getAccel().z)>0.99)) return;
        
        Bangle.setOptions({hrmPollInterval:40});
        Bangle.setHRMPower(1, "health");
        Bangle.setOptions({hrmPollInterval:40})
        Bangle.setOptions({hrmStaticSampleTime:true});
        
        // Clear any previous values at start of measurement
        HRM_STABILIZED_BPM = null;
        HRM_STABILIZED_CONFIDENCE = null;
        HRM_HISTORY = [];
        HRM_CORRECTION_STATS.originalValue = null;
        HRM_CORRECTION_STATS.originalTime = null;
        
        // Set timeout to ensure sensor turns off after max time
        setTimeout(function() {
          if (HRM_STABILIZED_BPM === null) {
            // If we haven't stabilized, use the last good value or original
            if (HRM_HISTORY.length > 0) {
              let lastValues = [];
              for (let i = Math.max(0, HRM_HISTORY.length - 3); i < HRM_HISTORY.length; i++) {
                lastValues.push(HRM_HISTORY[i].bpm);
              }
              HRM_STABILIZED_BPM = global.calculateMovingAverage(lastValues);
            } else if (HRM_CORRECTION_STATS.originalValue) {
              HRM_STABILIZED_BPM = HRM_CORRECTION_STATS.originalValue;
            }
          }
          Bangle.setHRMPower(0, "health");
        }, hrm * 60000);
      }
      startMeasurement();
      if (hrm == 1) {
        setTimeout(startMeasurement, 200000);
        setTimeout(startMeasurement, 400000);
      }
    };
    Bangle.on("health", onHealth);
    
    // MODIFIED HRM event handler
    Bangle.on("HRM", (h) => {
      //print ("got hrm:", h);
      // EXACT ORIGINAL CONDITION - but instead of turning off, we record the value
      if (h.bpm > 0 && global.isValidBPM(h.bpm) && h.confidence > 90) {
        let healthStatus = Bangle.getHealthStatus();
        if (healthStatus.bpm > 0 && Math.abs(healthStatus.bpm - h.bpm) < 1) {
          // This is EXACTLY where original script would turn off the sensor
          // Instead, we RECORD this as the original value and CONTINUE measuring
          if (!HRM_CORRECTION_STATS.originalValue) {
            HRM_CORRECTION_STATS.originalValue = h.bpm;
            HRM_CORRECTION_STATS.originalTime = Date.now();
            HRM_START_TIME = Date.now();
            console.log("Original method would stop here: " + h.bpm + " BPM (continuing for stabilization...)");
          }
          // DO NOT turn off the sensor - we continue measuring for stabilization
        }
      }
      
      // Always collect measurements for stabilization
      if (h.bpm > 0 && global.isValidBPM(h.bpm) && h.confidence >= MIN_CONFIDENCE) {
        
        HRM_HISTORY.push({
          bpm: h.bpm,
          confidence: h.confidence,
          timestamp: Date.now()
        });
        
        if (HRM_HISTORY.length > HISTORY_SIZE) {
          HRM_HISTORY.shift();
        }
        
        // Once we have enough measurements AND enough time has passed, check for stabilization
        if (HRM_HISTORY.length >= 15) {
         // console.log("Got > 15 measurments");

          // Check if we've been measuring for at least 30 seconds
          let measuringTime = Date.now() - HRM_START_TIME;

          if (measuringTime >= STABILIZATION_TIME) {
            //console.log("Got over ",STABILIZATION_TIME," secs of measurments");

            let recentBPMS = [];
            for (let i = HRM_HISTORY.length - 5; i < HRM_HISTORY.length; i++) {
              if (i >= 0) {
                recentBPMS.push(HRM_HISTORY[i].bpm);
              }
            }
            
            let stabilizedBPM = global.calculateMovingAverage(recentBPMS);
            let stability = global.calculateStability(recentBPMS);
            
            let recentConfidence = [];
            for (let i = HRM_HISTORY.length - 5; i < HRM_HISTORY.length; i++) {
              if (i >= 0) {
                recentConfidence.push(HRM_HISTORY[i].confidence);
              }
            }
            let avgConfidence = global.calculateMovingAverage(recentConfidence);
            
            // Check if we have stabilization
            if (stability <= STABILIZATION_THRESHOLD && avgConfidence >= 85) {
              console.log("stabilization ok");

              // Compare with original value if we have one
              if (HRM_CORRECTION_STATS.originalValue) {
                let difference = Math.abs(stabilizedBPM - HRM_CORRECTION_STATS.originalValue);
                
                if (difference > 15) {
                  let timeSinceOriginal = Date.now() - HRM_CORRECTION_STATS.originalTime;
                  let timeSinceLastCorrection = Date.now() - HRM_CORRECTION_STATS.lastCorrectionTime;
                  
                  HRM_CORRECTION_STATS.count++;
                  HRM_CORRECTION_STATS.lastCorrectionTime = Date.now();
                  
                  HRM_CORRECTION_STATS.corrections.push({
                    timestamp: new Date().toISOString(),
                    originalValue: HRM_CORRECTION_STATS.originalValue,
                    stabilizedValue: stabilizedBPM,
                    difference: difference,
                    timeToStabilize: Math.round(timeSinceOriginal/1000),
                    confidence: avgConfidence,
                    stability: stability,
                    timeSinceLastCorrection: Math.round(timeSinceLastCorrection/1000)
                  });
                  
                  if (HRM_CORRECTION_STATS.corrections.length > 10) {
                    HRM_CORRECTION_STATS.corrections.shift();
                  }
                  
                  console.log("CORRECTION: Original " + HRM_CORRECTION_STATS.originalValue + 
                              " -> Stabilized " + stabilizedBPM + " BPM (diff " + difference + ")");
                } else {
                  console.log("STABLE: " + stabilizedBPM + " BPM (matches original " + 
                              HRM_CORRECTION_STATS.originalValue + ")");
                }
              }
              
              // Store the stabilized value and turn off sensor
              HRM_STABILIZED_BPM = stabilizedBPM;
              HRM_STABILIZED_CONFIDENCE = avgConfidence;
              
              console.log("HRM Stabilized at " + stabilizedBPM + " BPM - turning off");
              Bangle.setHRMPower(0, "health");
            }
          }
        }
      }
    });
    
    if (Bangle.getHealthStatus().bpmConfidence < 90) onHealth();
  } else {
      Bangle.setOptions({hrmPollInterval:40});
      Bangle.setHRMPower(!!hrm, "health");
      Bangle.setOptions({hrmPollInterval:40})
      Bangle.setOptions({hrmStaticSampleTime:true});
  }
}

// Stats function
function getHRMStats() {
  console.log("=== HRM CORRECTION STATISTICS ===");
  console.log("Total corrections (diff >15 BPM): " + HRM_CORRECTION_STATS.count);
  console.log("Last correction: " + (HRM_CORRECTION_STATS.lastCorrectionTime ? new Date(HRM_CORRECTION_STATS.lastCorrectionTime).toISOString() : 'Never'));
  
  if (HRM_CORRECTION_STATS.corrections.length > 0) {
    console.log("\nLast 10 corrections:");
    for (let i = 0; i < HRM_CORRECTION_STATS.corrections.length; i++) {
      let c = HRM_CORRECTION_STATS.corrections[i];
      console.log((i+1) + ". " + c.timestamp);
      console.log("   Original: " + c.originalValue + " -> Stabilized: " + c.stabilizedValue + " BPM (diff " + c.difference + ")");
      console.log("   Stabilized in: " + c.timeToStabilize + " sec, Confidence: " + c.confidence + "%");
      if (c.timeSinceLastCorrection) {
        console.log("   Time from previous: " + c.timeSinceLastCorrection + " sec");
      }
    }
    
    let sumDifference = 0;
    for (let i = 0; i < HRM_CORRECTION_STATS.corrections.length; i++) {
      sumDifference += HRM_CORRECTION_STATS.corrections[i].difference;
    }
    let avgDifference = sumDifference / HRM_CORRECTION_STATS.corrections.length;
    console.log("\nAverage difference: " + Math.round(avgDifference) + " BPM");
    
  } else {
    console.log("No corrections recorded yet");
  }
  console.log("====================================");
}

// Function to reset statistics
function resetHRMStats() {
  HRM_HISTORY = [];
  HRM_CORRECTION_STATS = {
    count: 0,
    lastCorrectionTime: 0,
    corrections: [],
    originalValue: null,
    originalTime: null
  };
  HRM_STABILIZED_BPM = null;
  HRM_STABILIZED_CONFIDENCE = null;
  console.log("HRM statistics reset");
}

// Original health event handler - with modification to use stabilized value
Bangle.on("health", health => {
  (Bangle.getPressure?Bangle.getPressure():Promise.resolve({})).then(pressure => {
  Object.assign(health, pressure);
  
  // Use stabilized value if available
  if (HRM_STABILIZED_BPM !== null && HRM_STABILIZED_BPM > 0) {
    console.log("Saving stabilized BPM: " + HRM_STABILIZED_BPM + " (was: " + health.bpm + ")");
    health.bpm = HRM_STABILIZED_BPM;
    if (HRM_STABILIZED_CONFIDENCE !== null) {
      health.bpmConfidence = HRM_STABILIZED_CONFIDENCE;
    }
    HRM_STABILIZED_BPM = null;
    HRM_STABILIZED_CONFIDENCE = null;
  }
  
  // Original health code continues unchanged
  var d = new Date(Date.now() - 590000);

  const DB_RECORDS_PER_HR = 6;
  const DB_RECORDS_PER_DAY = DB_RECORDS_PER_HR*24 + 1/*summary*/;
  const DB_RECORDS_PER_MONTH = DB_RECORDS_PER_DAY*31;
  const DB_HEADER_LEN = 8;

  if (health && health.steps > 0) {
    var settings = require("Storage").readJSON("health.json",1)||{};
    const steps = Bangle.getHealthStatus("day").steps;
    if (settings.stepGoalNotification && settings.stepGoal > 0 && steps >= settings.stepGoal) {
      const now = new Date(Date.now()).toISOString().split('T')[0];
      if (!settings.stepGoalNotificationDate || settings.stepGoalNotificationDate < now) {
        Bangle.buzz(200, 0.5);
        require("notify").show({
            title : settings.stepGoal + " steps",
            body : "You reached your step goal!",
            icon : atob("DAyBABmD6BaBMAsA8BCBCBCBCA8AAA==")
        });
        settings.stepGoalNotificationDate = now;
        require("Storage").writeJSON("health.json", settings);
      }
    }
  }

  function getRecordFN(d) {
    return "health-"+d.getFullYear()+"-"+(d.getMonth()+1)+".raw";
  }
  function getRecordIdx(d) {
    return (DB_RECORDS_PER_DAY*(d.getDate()-1)) +
           (DB_RECORDS_PER_HR*d.getHours()) +
           (0|(d.getMinutes()*DB_RECORDS_PER_HR/60));
  }

  var rec = getRecordIdx(d);
  var fn = getRecordFN(d);
  var inf, f = require("Storage").read(fn);

  if (f!==undefined) {
    inf = require("health").getDecoder(f);
    var dt = f.substr(DB_HEADER_LEN+(rec*inf.r), inf.r);
    if (dt!=inf.clr) {
      print("HEALTH ERR: Already written!");
      return;
    }
  } else {
    inf = require("health").getDecoder("HEALTH2");
    require("Storage").write(fn, "HEALTH2\0", 0, DB_HEADER_LEN + DB_RECORDS_PER_MONTH*inf.r);
  }
  var recordPos = DB_HEADER_LEN+(rec*inf.r);
  require("Storage").write(fn, inf.encode(health), recordPos);
  if (rec%DB_RECORDS_PER_DAY != DB_RECORDS_PER_DAY-2) return;
  
  var sumPos = recordPos + inf.r;
  if (f.substr(sumPos, inf.r)!=inf.clr) {
    print("HEALTH ERR: Daily summary already written!");
    return;
  }
  health = { steps:0, bpm:0, movement:0, movCnt:0, bpmCnt:0};
  var records = DB_RECORDS_PER_HR*24;
  for (var i=0;i<records;i++) {
    var dt = f.substr(recordPos, inf.r);
    if (dt!=inf.clr) {
      var h = inf.decode(dt);
      health.steps += h.steps;
      health.bpm += h.bpm;
      health.movement += h.movement;
      health.movCnt++;
      if (h.bpm) health.bpmCnt++;
    }
    recordPos -= inf.r;
  }
  if (health.bpmCnt)
    health.bpm /= health.bpmCnt;
  if (health.movCnt)
    health.movement /= health.movCnt;
  require("Storage").write(fn, inf.encode(health), sumPos);
})});