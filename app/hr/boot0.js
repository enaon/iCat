if (E.CRC32(require('Storage').read('setting.json')) + require('Storage').hash(/\.js$/) + E.CRC32(process.env.GIT_COMMIT) != 959147044) eval(require('Storage').read('bootupdate.js'));
else {
    E.setFlags({ pretokenise: 1 });
    var bleServices = {},
        bleServiceOptions = { uart: true };
    Bluetooth.setConsole(true);
    Bangle.setLCDTimeout(10);
    E.setTimeZone(2);
    Bangle.setOptions({ wakeOnBTN1: true, wakeOnBTN2: true, wakeOnBTN3: true, wakeOnFaceUp: true, wakeOnTouch: false, wakeOnTwist: true, twistThreshold: 819.2, twistMaxY: -800, twistTimeout: 1000, wakeOnDoubleTap: true });
    Bangle.loadWidgets = function() { if (!global.WIDGETS) eval(require("Storage").read(".widcache")) }; { let settings = Object.assign({ rp: true, as: true, vibrate: ".." }, require("Storage").readJSON("android.settings.json", 1) || {}); let _GB = global.GB;
        global.GB = e => { if (_GB) setTimeout(_GB, 0, Object.assign({}, e));
            Bangle.emit("GB", e);
            require("android").gbHandler(e); };
        Bangle.http = (url, options) => require("android").httpHandler(url, options); let sendBattery = function() { require("android").gbSend({ t: "status", bat: E.getBattery(), chg: Bangle.isCharging() ? 1 : 0 }); } Bangle.on("charging", sendBattery);
        NRF.on("connect", () => setTimeout(function() { sendBattery();
            require("android").gbSend({ t: "ver", fw: process.env.VERSION, hw: process.env.HWVERSION });
            GB({ t: "force_calendar_sync_start" }); }, 2000));
        NRF.on("disconnect", () => { GB({ t: "act", stp: 0, hrm: 0, int: 0 }); var settings = require("Storage").readJSON("android.settings.json", 1) || {}; if (!settings.keep) require("messages").clearAll(); });
        setInterval(sendBattery, 10 * 60 * 1000);
        Bangle.on("health", h => { require("android").gbSend({ t: "act", stp: h.steps, hrm: h.bpm, mov: h.movement, act: h.activity }); });
        Bangle.musicControl = cmd => { require("android").gbSend({ t: "music", n: cmd }); };
        Bangle.messageResponse = (msg, response) => { if (msg.id == "call") return require("android").gbSend({ t: "call", n: response ? "ACCEPT" : "REJECT" }); if (isFinite(msg.id)) return require("android").gbSend({ t: "notify", n: response ? "OPEN" : "DISMISS", id: msg.id }); };
        Bangle.messageIgnore = msg => { if (isFinite(msg.id)) return require("android").gbSend({ t: "notify", n: "MUTE", id: msg.id }); }; if (settings.overwriteGps) require("android").overwriteGPS();
        delete settings; };
    Graphics.prototype.setFontIntl = function() { return this.setFontPBF(require("Storage").read("fontext.pbf")); };; {
        let a = 0 | (require("Storage").readJSON("health.json", 1) || {}).hrm;
        if (1 == a || 2 == a) {
            let d = function(b) {
                function c() { Bangle.isCharging() || 100 > Bangle.getHealthStatus("last").movement && .99 < Math.abs(Bangle.getAccel().z) || ({ Bangle.setOptions({hrmPollInterval:40});Bangle.setHRMPower(1, "health");Bangle.setOptions({hrmPollInterval:40});Bangle.setOptions({hrmStaticSampleTime:true}) }, setTimeout(() => { Bangle.setHRMPower(0, "health") }, 6E4 * a)) } c();
                1 == a && (setTimeout(c, 2E5), setTimeout(c, 4E5)) };
            Bangle.on("health", d);
            Bangle.on("HRM", b => {
                90 < b.confidence && 1 > Math.abs(Bangle.getHealthStatus().bpm - b.bpm) && Bangle.setHRMPower(0,
                    "health")
            });
            90 > Bangle.getHealthStatus().bpmConfidence && d()
        }
        else {  
                Bangle.setOptions({hrmPollInterval:40})
                Bangle.setHRMPower(!!a, "health")
                Bangle.setOptions({hrmPollInterval:40})
                Bangle.setOptions({hrmStaticSampleTime:true})
        }
    }
    Bangle.on("health", a => {
        (Bangle.getPressure ? Bangle.getPressure() : Promise.resolve({})).then(d => {
            Object.assign(a, d);
            d = new Date(Date.now() - 59E4);
            if (a && 0 < a.steps) {
                var b = require("Storage").readJSON("health.json", 1) || {},
                    c = Bangle.getHealthStatus("day").steps;
                b.stepGoalNotification && 0 < b.stepGoal && c >= b.stepGoal && (c = (new Date(Date.now())).toISOString().split("T")[0], !b.stepGoalNotificationDate || b.stepGoalNotificationDate <
                    c) && (Bangle.buzz(200, .5), require("notify").show({ title: b.stepGoal + " steps", body: "You reached your step goal!", icon: atob("DAyBABmD6BaBMAsA8BCBCBCBCA8AAA==") }), b.stepGoalNotificationDate = c, require("Storage").writeJSON("health.json", b))
            }
            var g = function(f) { return 145 * (f.getDate() - 1) + 6 * f.getHours() + (0 | 6 * f.getMinutes() / 60) }(d);
            d = function(f) { return "health-" + f.getFullYear() + "-" + (f.getMonth() + 1) + ".raw" }(d);
            c = require("Storage").read(d);
            if (void 0 !== c) {
                b = require("health").getDecoder(c);
                var e = c.substr(8 + g * b.r,
                    b.r);
                if (e != b.clr) { print("HEALTH ERR: Already written!"); return }
            }
            else b = require("health").getDecoder("HEALTH2"), require("Storage").write(d, "HEALTH2\x00", 0, 8 + 4495 * b.r);
            var h = 8 + g * b.r;
            require("Storage").write(d, b.encode(a), h);
            if (143 == g % 145)
                if (g = h + b.r, c.substr(g, b.r) != b.clr) print("HEALTH ERR: Daily summary already written!");
                else {
                    a = { steps: 0, bpm: 0, movement: 0, movCnt: 0, bpmCnt: 0 };
                    for (var k = 0; 144 > k; k++) e = c.substr(h, b.r), e != b.clr && (e = b.decode(e), a.steps += e.steps, a.bpm += e.bpm, a.movement += e.movement, a.movCnt++,
                        e.bpm && a.bpmCnt++), h -= b.r;
                    a.bpmCnt && (a.bpm /= a.bpmCnt);
                    a.movCnt && (a.movement /= a.movCnt);
                    require("Storage").write(d, b.encode(a), g)
                }
        })
    });
    Bangle.on("message", (type, msg) => require("messagegui").listener(type, msg));;
    (function() { if (Bangle.SCHED) { clearTimeout(Bangle.SCHED);
            delete Bangle.SCHED; } delete E.setTimeZone; var alarms = require("Storage").readJSON("sched.json", 1) || []; var time = new Date(); var currentTime = (time.getHours() * 3600000) + (time.getMinutes() * 60000) + (time.getSeconds() * 1000); var d = time.getDate(); var active = alarms.filter(a => a.on && (a.last != d) && (a.t + 60000 > currentTime) && (a.dow >> time.getDay() & 1) && (!a.date || a.date == time.toLocalISOString().substr(0, 10))); if (active.length) { active = active.sort((a, b) => a.t - b.t); var t = active[0].t - currentTime; if (t < 1000) t = 1000;
            Bangle.SCHED = setTimeout(active[0].js || "load(\"sched.js\")", t); var tz = E.setTimeZone;
            E.setTimeZone = function(z) { tz(z);
                eval(require("Storage").read("sched.boot.js")); }; } else { Bangle.SCHED = setTimeout("eval(require(\"Storage\").read(\"sched.boot.js\"))", 86400000 - currentTime); } })();;
    NRF.setServices(bleServices, bleServiceOptions);
    delete bleServices, bleServiceOptions;
}
