
// logger.js - Minimal, fast generic logger for Espruino
// Supports: 10-min snapshots, optional session tracking, rolling 24h views.
// Use: ew.logger.myDev = ew.logger.cd('name', { ... config ... })
// myDev.log({ ... }) // records data
// myDev.getStats()   // all aggregation
// myDev.getRolling24() // last 24h slots, hourly bars, stats (for UI)

var L = {
  D: {},  // all devices' data
  C: {},  // all devices' configs
  N: function() { return (Date.now()/1000)|0; },

  cd: function(nm, cf) {
    if (!this.D[nm]) {
      this.D[nm] = { at:{}, ys:{}, ms:{}, dh:[], db:0, act:[], ats:{}, lat:{} };
    }
    // Reverse map for short → long field names
    cf.rMap = {};
    for (var s in cf.fmap) cf.rMap[cf.fmap[s]] = s;
    this.C[nm] = cf;
    var self = this;
    return {
      nm: nm,
      log: function(e) { self._l(nm, e); },
      getStats: function() { return self._g(nm); },
      getRolling24: function() { return self._r24(nm); }
    };
  },

  // ---------- LOG ENTRY ----------
  _l: function(nm, e) {
    var d = this.D[nm], c = this.C[nm];
    if (!d || !c) return;

    // Convert entry to short names
    var es = {};
    for (var k in e) {
      var sk = c.rMap[k];
      if (sk !== undefined) es[sk] = e[k];
    }

    var n = this.N();
    var dt = new Date(n*1000);
    var y = dt.getFullYear();
    var mo = dt.getMonth()+1;
    var dm = dt.getDate();
    var h = dt.getHours();
    var mi = dt.getMinutes();
    var m10 = Math.floor(mi/10)*10;  // 0,10,20,30,40,50
    var de = Math.floor(n/86400);
    var pd = c.pd || 31;

    // Circular day buffer
    if (d.db === undefined) { d.db = de; d.dh = new Array(pd); }
    var slotIdx = (de - d.db) % pd;
    if (!d.dh[slotIdx] || d.dh[slotIdx].d !== de) {
      d.dh[slotIdx] = { d: de, h: {} };
    }
    var bufDay = d.dh[slotIdx];

    // Aggregate cnt + acc fields
    var fl = (c.cnt || []).concat(c.acc || []);
    for (var i=0; i<fl.length; i++) {
      var f = fl[i], v = es[f];
      if (v !== undefined) {
        this._a(d, f, v, y, mo, dm, bufDay, h, m10);
        if (c.cnt && c.cnt.indexOf(f)>=0) {
          if (f === c.pCnt) d.ats.tot = (d.ats.tot || 0) + v;
        }
        if (c.acc && c.acc.indexOf(f)>=0) {
          d.ats[f] = (d.ats[f] || 0) + v;
        }
      }
    }

    // Snapshot fields (overwrite, not sum)
    if (c.snap && c.snap.length) {
      if (!bufDay.h[h]) bufDay.h[h] = {};
      if (!bufDay.h[h]._10m) bufDay.h[h]._10m = {};
      var slot10m = bufDay.h[h]._10m;
      if (!slot10m[m10]) slot10m[m10] = {};
      // Check charging flag (to nullify battery)
      var isCharging = false;
      if (c.chgSnapField) {
        var chgVal = es[c.chgSnapField];
        if (chgVal !== undefined) isCharging = !!chgVal;
      }
      var btField = c.btSnapField;
      for (var j=0; j<c.snap.length; j++) {
        var sf = c.snap[j];
        if (sf === c.chgSnapField) {
          slot10m[m10][sf] = isCharging;        // store charging flag
        } else if (isCharging && btField && sf === btField) {
          slot10m[m10][sf] = null;              // battery invalid while charging
        } else {
          var v = es[sf];
          if (v !== undefined) slot10m[m10][sf] = v;
        }
      }
    }

    // Latest values
    if (c.lat) {
      for (var i=0; i<c.lat.length; i++) {
        var lf = c.lat[i];
        if (es[lf] !== undefined) d.lat[lf] = es[lf];
      }
    }

    // Activity record (circular)
    if (c.af && c.af.length) {
      var rec = { ts: n };
      for (var i=0; i<c.af.length; i++) { rec[c.af[i]] = es[c.af[i]]; }
      d.act.push(rec);
      var ma = c.ma || 20;
      if (d.act.length > ma) d.act.splice(0, d.act.length - ma);
    }

    // Session tracking (optional)
    if (c.ses && c.ses.f) {
      this._s(d, c, es, dt, n);
    }

    this._uA(d, c);
    this._pM(d, dt, c.pm || 12);
  },

  // ---------- AGGREGATION HELPERS ----------
  _a: function(d, f, v, y, mo, dm, bufDay, h, m10) {
    // Years
    if (!d.ys[y]) d.ys[y] = {};
    if (!d.ys[y][mo]) d.ys[y][mo] = {};
    d.ys[y][mo][f] = (d.ys[y][mo][f]||0) + v;
    // Months
    if (!d.ms[mo]) d.ms[mo] = {};
    if (!d.ms[mo][dm]) d.ms[mo][dm] = {};
    d.ms[mo][dm][f] = (d.ms[mo][dm][f]||0) + v;
    // Day hour (cumulative)
    if (!bufDay.h[h]) bufDay.h[h] = {};
    bufDay.h[h][f] = (bufDay.h[h][f]||0) + v;
    // 10-min bin (cumulative – snap overwrites later)
    if (!bufDay.h[h]._10m) bufDay.h[h]._10m = {};
    if (!bufDay.h[h]._10m[m10]) bufDay.h[h]._10m[m10] = {};
    bufDay.h[h]._10m[m10][f] = (bufDay.h[h]._10m[m10][f]||0) + v;
  },

  _uA: function(d, c) {
    var tot = d.ats.tot || 0;
    if (c.acc && tot > 0) {
      for (var i=0; i<c.acc.length; i++) {
        var f = c.acc[i], sum = d.ats[f] || 0;
        d.ats['av'+f] = sum / tot;
      }
    }
  },

  _pM: function(d, dt, maxM) {
    var cy = dt.getFullYear(), cm = dt.getMonth()+1;
    for (var k in d.ms) {
      var m = parseInt(k,10);
      var diff = cm - m;
      if (diff < 0) diff += 12;
      if (diff >= maxM) delete d.ms[k];
    }
  },

  // ---------- SESSION TRACKING (optional) ----------
  _s: function(d, c, es, dt, nowTs) {
    var se = c.ses;
    var mode = se.mode || 'discharge';
    var sf = se.f;  // primary field (e.g. battery)
    var s = d._s;
    if (!s) { s = { mode: mode, cur: null, hist: [], dly: [] }; d._s = s; }
    var cur = s.cur;
    var today = dt.toLocalISOString().split('T')[0];

    if (mode === 'discharge') {
      var v = es[sf];
      if (v === undefined) return;
      var th = se.th || 15;
      if (!cur) {
        cur = { sd: today, sl: v, ll: v, lu: dt.toLocalISOString(), dr: null, acc: {} };
        s.cur = cur; s.dly = [v];
        if (se.acc) this._initAcc(cur, se.acc);
        return;
      }
      if (v > cur.ll + th) {
        this._finalizeSession(d, se);
        cur = { sd: today, sl: v, ll: v, lu: dt.toLocalISOString(), dr: null, acc: {} };
        s.cur = cur; s.dly = [v];
        if (se.acc) this._initAcc(cur, se.acc);
        return;
      }
      var lastUpdDate = new Date(cur.lu).toLocalISOString().split('T')[0];
      if (today !== lastUpdDate) {
        s.dly.push(v); cur.ll = v; cur.lu = dt.toLocalISOString();
      } else {
        cur.ll = v; cur.lu = dt.toLocalISOString();
      }
      if (se.acc) this._accumulate(cur, se.acc, es);
      if (se.calc) cur.dr = se.calc(s.dly, cur);
      else if (s.dly.length >= 2) {
        var days = ((new Date(dt) - new Date(cur.sd)) / 86400000);
        if (days < 0.1) days = 0.1;
        var drop = s.dly[0] - cur.ll;
        var rate = drop / days;
        if (rate < 0) rate = 0.1;
        cur.dr = rate;
      }
    } else if (mode === 'charge') {
      var onField = se.onField;
      var isActive = es[onField];
      if (isActive === undefined) return;
      if (!cur) {
        if (isActive) {
          cur = { sd: dt.toLocalISOString(), startTs: nowTs, sv: es[sf], acc: {} };
          s.cur = cur;
          if (se.acc) this._initAcc(cur, se.acc);
          if (se.acc) this._accumulate(cur, se.acc, es);
        }
      } else {
        if (isActive) {
          if (se.acc) this._accumulate(cur, se.acc, es);
        } else {
          cur.ed = dt.toLocalISOString(); cur.endTs = nowTs; cur.ev = es[sf];
          this._finalizeSession(d, se);
          s.cur = null;
        }
      }
    }
  },

  _initAcc: function(cur, accFields) {
    var a = cur.acc;
    for (var i=0; i<accFields.length; i++) a[accFields[i]] = 0;
  },

  _accumulate: function(cur, accFields, es) {
    if (!accFields || !cur) return;
    for (var i=0; i<accFields.length; i++) {
      var f = accFields[i];
      if (es[f] !== undefined) cur.acc[f] = (cur.acc[f]||0) + (es[f]||0);
    }
  },

  _finalizeSession: function(d, se) {
    var s = d._s;
    if (!s || !s.cur) return;
    var cur = s.cur;
    var hm = se.hm || 5;
    var hist = s.hist;

    if (s.mode === 'discharge') {
      if (!cur.sd || cur.ll === null) return;
      var days = ((new Date(cur.lu) - new Date(cur.sd)) / 86400000).toFixed(0);
      var lost = cur.sl - cur.ll;
      if (days >= 1 && lost >= 5) {
        var entry = {
          sd: cur.sd,
          ed: new Date(cur.lu).toLocalISOString().split('T')[0],
          dl: days,
          pl: lost.toFixed(0),
          ad: (lost / days).toFixed(1)
        };
        if (se.acc && cur.acc) {
          entry.acc = {};
          for (var k in cur.acc) entry.acc[k] = cur.acc[k];
        }
        hist.unshift(entry);
        if (hist.length > hm) hist.length = hm;
      }
    } else if (s.mode === 'charge') {
      if (!cur.sd || !cur.ed) return;
      var dur = ((cur.endTs - cur.startTs) / 3600000).toFixed(2);
      var gain = (cur.ev - cur.sv) || 0;
      var entry = { sd: cur.sd, ed: cur.ed, dur: dur, sv: cur.sv, ev: cur.ev, gain: gain };
      if (se.acc && cur.acc) {
        entry.acc = {};
        for (var k in cur.acc) entry.acc[k] = cur.acc[k];
      }
      hist.unshift(entry);
      if (hist.length > hm) hist.length = hm;
    }
    s.cur = null;
  },

  // ---------- GET FULL STATS ----------
  _g: function(nm) {
    var d = this.D[nm], c = this.C[nm];
    if (!d) return {};
    var fm = c.fmap;
    var out = { allTime: d.at, years: {}, months: {}, dayHours: {},
                activity: [], allTimeStats: {}, latest: {} };

    // years -> month -> fields
    for (var y in d.ys) {
      var yr = {};
      for (var m in d.ys[y]) {
        var dmObj = {};
        for (var sf in d.ys[y][m]) dmObj[fm[sf]||sf] = d.ys[y][m][sf];
        yr[m] = dmObj;
      }
      out.years[y] = yr;
    }

    // months -> day -> fields
    for (var m in d.ms) {
      var md = {};
      for (var day in d.ms[m]) {
        var dayObj = {};
        for (var sf in d.ms[m][day]) dayObj[fm[sf]||sf] = d.ms[m][day][sf];
        md[day] = dayObj;
      }
      out.months[m] = md;
    }

    // dayHours from circular buffer
    var nowDe = Math.floor(this.N()/86400);
    var pd = c.pd || 31;
    if (d.dh) {
      for (var i=0; i<pd; i++) {
        var slot = d.dh[i];
        if (slot && nowDe - slot.d <= pd) {
          var dt2 = new Date(slot.d * 86400000);
          var dayKey = dt2.getDate();
          if (!out.dayHours[dayKey]) out.dayHours[dayKey] = {};
          for (var hr in slot.h) {
            if (!out.dayHours[dayKey][hr]) out.dayHours[dayKey][hr] = {};
            var hObj = slot.h[hr];
            for (var sf in hObj) {
              if (sf === '_10m') continue;
              out.dayHours[dayKey][hr][fm[sf]||sf] =
                (out.dayHours[dayKey][hr][fm[sf]||sf]||0) + hObj[sf];
            }
            if (hObj._10m) {
              if (!out.dayHours[dayKey][hr]._10m) out.dayHours[dayKey][hr]._10m = {};
              for (var m10 in hObj._10m) {
                if (!out.dayHours[dayKey][hr]._10m[m10]) out.dayHours[dayKey][hr]._10m[m10] = {};
                for (var sf in hObj._10m[m10]) {
                  out.dayHours[dayKey][hr]._10m[m10][fm[sf]||sf] =
                    (out.dayHours[dayKey][hr]._10m[m10][fm[sf]||sf]||0) + hObj._10m[m10][sf];
                }
              }
            }
          }
        }
      }
    }

    // activity
    for (var i=0; i<d.act.length; i++) {
      var rec = d.act[i], longRec = { ts: rec.ts };
      for (var sf in rec) { if (sf !== 'ts') longRec[fm[sf]||sf] = rec[sf]; }
      out.activity.push(longRec);
    }

    // allTimeStats
    var ats = d.ats;
    out.allTimeStats.total = ats.tot || 0;
    for (var k in ats) {
      if (k === 'tot') continue;
      if (k.indexOf('av') === 0) {
        var sf = k.slice(2);
        var long = fm[sf];
        if (long) out.allTimeStats['avg'+long.charAt(0).toUpperCase()+long.slice(1)] = ats[k];
      } else out.allTimeStats[fm[k]||k] = ats[k];
    }

    // latest
    for (var sf in d.lat) out.latest[fm[sf]||sf] = d.lat[sf];

    // session stats (if any)
    if (d._s) {
      out.session = this._gSession(d._s, c);
    }
    return out;
  },

  _gSession: function(s, c) {
    var se = c.ses;
    if (!se) return undefined;
    var res = { mode: s.mode };
    if (s.mode === 'discharge') {
      var cur = s.cur;
      if (cur) {
        var daysElapsed = cur.sd ? ((new Date() - new Date(cur.sd)) / 86400000).toFixed(0) : 0;
        var dr = cur.dr, pred = null;
        if (dr && dr > 0 && cur.ll !== null) pred = (cur.ll / dr).toFixed(0);
        res.currentSession = {
          startDate: cur.sd, startLevel: cur.sl, daysElapsed: daysElapsed,
          lastLevel: cur.ll, dischargeRate: dr, predictedDaysLeft: pred,
          accumulated: cur.acc || {}
        };
        res.dailyLevels = s.dly;
      } else { res.currentSession = null; res.dailyLevels = []; }
      res.history = s.hist.map(function(e) {
        var he = { startDate: e.sd, endDate: e.ed, daysLasted: e.dl, percentLost: e.pl, avgDailyLoss: e.ad };
        if (e.acc) he.accumulated = e.acc;
        return he;
      });
    } else if (s.mode === 'charge') {
      var cur = s.cur;
      res.currentSession = cur ? { startDate: cur.sd, active: true, accumulated: cur.acc || {} } : null;
      res.history = s.hist.map(function(e) {
        var he = { startDate: e.sd, endDate: e.ed, durationHours: e.dur, startValue: e.sv, endValue: e.ev, gain: e.gain };
        if (e.acc) he.accumulated = e.acc;
        return he;
      });
    }
    return res;
  },

  // ---------- ROLLING 24‑HOUR VIEW (for UI) ----------
  _r24: function(nm) {
    var d = this.D[nm], c = this.C[nm];
    if (!d || !c) return null;
    var now = this.N();
    var slotSize = 600; // 10 minutes
    var slots24 = 144;
    var startSlot = Math.floor(now / slotSize) - slots24 + 1;
    var pd = c.pd || 31;

    var snapFields = c.snap || [];
    var btField = c.btSnapField;
    var chgField = c.chgSnapField;
    // Look for 'lgt' in snap fields, else null
    var lgtField = null;
    for (var i=0; i<snapFields.length; i++) {
      if (snapFields[i] === 'lgt' || c.fmap[snapFields[i]] === 'lightOn') {
        lgtField = snapFields[i];
        break;
      }
    }

    // Read all 144 slots from buffer
    var slots = new Array(slots24);
    for (var i=0; i<slots24; i++) {
      var slotTs = (startSlot + i) * slotSize;
      var dt = new Date(slotTs * 1000);
      var de = Math.floor(slotTs / 86400);
      var h = dt.getHours();
      var m10 = dt.getMinutes() - (dt.getMinutes() % 10);
      var daySlotIdx = (de - d.db) % pd;
      if (daySlotIdx < 0) daySlotIdx += pd;
      var dayObj = d.dh[daySlotIdx];
      var obj = { hour: h, min10: m10 };
      var found = false;
      if (dayObj && dayObj.h && dayObj.h[h] && dayObj.h[h]._10m && dayObj.h[h]._10m[m10]) {
        var src = dayObj.h[h]._10m[m10];
        for (var j=0; j<snapFields.length; j++) {
          var sf = snapFields[j];
          if (src[sf] !== undefined) {
            obj[sf] = src[sf];  // keep short names internally
            found = true;
          }
        }
      }
      if (!found) {
        // fill with nulls
        for (var j=0; j<snapFields.length; j++) obj[snapFields[j]] = null;
      }
      slots[i] = obj;
    }

    // Convert to long names for output
    var outSlots = slots.map(function(o) {
      var no = { hour: o.hour, min10: o.min10 };
      for (var k in o) {
        if (k === 'hour' || k === 'min10') continue;
        no[c.fmap[k]||k] = o[k];
      }
      return no;
    });

    // --- Statistics and hourly aggregation ---
    var totalLoss = 0, totalGain = 0, lightMinutes = 0;
    var prevBt = null, prevChg = null;
    var chargeStartBt = null; // battery before charge began

    var hourly = new Array(24);
    for (var i=0; i<24; i++) hourly[i] = { sumBt:0, cntBt:0, chgMin:0, lgtMin:0 };

    for (var i=0; i<slots24; i++) {
      var s = slots[i];
      var bt = (btField && s[btField] !== undefined) ? s[btField] : null;
      var chg = (chgField && s[chgField] !== undefined) ? !!s[chgField] : false;
      var lgt = (lgtField && s[lgtField]) ? true : false;

      // Hourly sums
      if (bt !== null && bt !== undefined) { hourly[s.hour].sumBt += bt; hourly[s.hour].cntBt++; }
      if (chg) hourly[s.hour].chgMin += 10;
      if (lgt) hourly[s.hour].lgtMin += 10;
      if (lgt) lightMinutes += 10;

      // Loss: when both slots discharging and have valid battery
      if (prevBt !== null && bt !== null && !prevChg && !chg) {
        if (bt < prevBt) totalLoss += (prevBt - bt);
      }

      // Gain: detect charge sessions (start/end)
      if (!prevChg && chg) {
        // Charge started – remember battery before (from current slot if valid, else previous)
        chargeStartBt = (bt !== null ? bt : prevBt);
      } else if (prevChg && !chg) {
        // Charge ended
        if (chargeStartBt !== null && bt !== null) {
          var gain = bt - chargeStartBt;
          if (gain > 0) totalGain += gain;
        }
        chargeStartBt = null;
      }

      prevBt = bt;
      prevChg = chg;
    }

    // Hourly output
    var hourlyOut = [];
    for (var h=0; h<24; h++) {
      var hObj = hourly[h];
      hourlyOut.push({
        hour: h,
        avgBattery: hObj.cntBt ? (hObj.sumBt / hObj.cntBt).toFixed(1) : null,
        chargingMinutes: hObj.chgMin,
        lightMinutes: hObj.lgtMin
      });
    }

    return {
      slots: outSlots,
      hourly: hourlyOut,
      stats24h: {
        batteryLoss: Math.round(totalLoss * 10) / 10,
        solarGain: Math.round(totalGain * 10) / 10,
        lightTime: lightMinutes   // minutes
      }
    };
  },

  // ---------- STORAGE ----------
  save: function() {
    try { require("Storage").writeJSON("lgr", this.D); } catch(e) {}
  },
  load: function() {
    try { var s = require("Storage").readJSON("lgr"); if (s) this.D = s; } catch(e) {}
  }
};

// Attach to ew
if (typeof ew === "undefined") global.ew = {};
ew.logger = L;