//itag viewer

ew.apps.launcher = {
    tid: {},
    state: {
        def: {},
    },
    scanApps: function() {
        let s = require("Storage");
        let launchCache = s.readJSON("ew_launcher.cache.json", true) || {};
        let launchHash = require("Storage").hash(/\.info/);
        if (launchCache.hash != launchHash) {
            launchCache = {
                hash: launchHash,
                apps: s.list(/\.info$/)
                    .map(app => { var a = s.readJSON(app, 1); return a && { name: a.name, type: a.type, icon: a.icon, sortorder: a.sortorder, src: a.src }; })
                    .filter(app => app && (app.type == "app" || (app.type == "clock" && settings.showClocks) || !app.type))
                    .sort((a, b) => {
                        var n = (0 | a.sortorder) - (0 | b.sortorder);
                        if (n) return n; // do sortorder first
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    })
            };
            s.writeJSON("launch.cache.json", launchCache);
        }
        let apps = launchCache.apps;
    },


};
if (require('Storage').readJSON('ew.json', 1).launcher) {
    ew.apps.launcher.state.def = require('Storage').readJSON('ew.json', 1).launcher;
    if (!ew.apps.launcher.state.def) ew.apps.launcher.state.def = { store: {}, storeOrder: [], hiddenOrder: [], pos: 0, set: { phy: 0, autoPhy: 1, minInterval: 50, maxInterval: 100, slaveLatency: 4, persist: 0, rssi: 1, pos: 0, keepFor: 5, storeLock: 0, scanAll: 0, checker: 1, showHidden: 0 } };

}
