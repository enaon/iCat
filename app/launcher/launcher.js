// launcher.js - WITH QUICK LINKS

ew.apps.launcher = {
    state: {
        def: {
            page: 0, // 0: custom apps, 1: bangle apps
            sort: "name",
            show: false,
            pos: 0, // selected position (index)
            link: { // 3 quick links
                l: null,
                c: null,
                r: null
            }
        },
        ewA: [], // custom apps
        bgA: [], // bangle apps
        perP: 6, // apps per page
        curL: "ewA", // current list name
        curP: 0, // current page
        totP: 1,
        linkMode: false // quick link mode
    },

    init() {
        this.gEW();
        this.gBG();
        this.prep(true);
    },

    // Scan custom apps from ew.apps
    gEW() {
        this.state.ewA = [];
        for (let appName in ew.apps) {
            if (appName === "state" || appName === "launcher" || appName === ew.def.face.main) continue;
            if (typeof ew.apps[appName] === 'object' && ew.apps[appName] !== null) {
                this.state.ewA.push({
                    id: appName,
                    name: appName.toUpperCase(),
                    type: 1,
                    icon: "ew_i_" + appName + ".img",
                    sort: 999
                });
            }
        }
        this.state.ewA.sort((a, b) => {
            if (a.sort !== b.sort) return a.sort - b.sort;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    },

    // Scan Bangle apps from storage
    gBG() {
        const s = require("Storage");
        this.state.bgA = [];
        let files = s.list(/\.info$/);

        for (let file of files) {
            try {
                let info = s.readJSON(file, true);
                if (info.type === "app" || info.type === "clock" || !info.type) {
                    if (!info.id || info.name === "eucWatch") continue;
                    this.state.bgA.push({
                        id: info.src,
                        name: info.name.toUpperCase() || "UNKNOWN",
                        type: 2,
                        icon: info.icon,
                        sort: info.sort || 999
                    });
                }
            }
            catch (e) {
                console.log("Error reading app info:", file);
            }
        }
    },

    // Prepare list for display
    prep(reset) {
        this.state.curL = this.state.def.page === 0 ? "ewA" : "bgA";
        let list = this.state[this.state.curL];
        this.state.totP = Math.ceil(list.length / this.state.perP) || 1;

        if (reset) {
            let pos = this.state.def.pos || 0;
            this.state.curP = Math.floor(pos / this.state.perP);
            if (this.state.curP >= this.state.totP) {
                this.state.curP = 0;
                this.state.def.pos = 0;
            }
        }
        if (this.state.def.pos >= list.length) {
            this.state.def.pos = this.state.curP * this.state.perP;
        }
    },

    // Get app by ID
    getA(id, type) {
        let list = type === 1 ? this.state.ewA : this.state.bgA;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) return list[i];
        }
        return null;
    },

    // Set quick link
    link(position, app) {
        if (!app) {
            this.state.def.link[position] = null;
        }
        else {
            this.state.def.link[position] = {
                type: app.type,
                id: app.id,
                name: app.name,
                icon: app.icon
            };
        }
    },

    // Launch app
    goA(app) {
        if (!app) return false;

        if (app.type === 1) {
            ew.face.go(app.id, 0);
        }
        else {
            if (app.id) {
                setTimeout(() => {
                    ew.sys.updt();
                    load(app.id);
                }, 10);
            }
            else {
                ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", "NO SOURCE", 15, 13);
            }
        }
        return true;
    },

    // Launch by index
    goID(index) {
        let app = this.state[this.state.curL][index];
        if (!app) return false;
        this.state.def.pos = index;
        return this.goA(app);
    },

    // Launch quick link
    goL(position) {
        let link = this.state.def.link[position];
        if (!link) {
            ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "HOLD", "TO SET", 0, 15);
            return false;
        }
        let app = this.getA(link.id, link.type);
        if (!app) {
            ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "ERROR", "NOT FOUND", 15, 13);
            return false;
        }
        return this.goA(app);
    },

    // Navigation
    next() {
        let customPages = Math.ceil(this.state.ewA.length / this.state.perP) || 1;
        let banglePages = Math.ceil(this.state.bgA.length / this.state.perP) || 0;

        if (this.state.def.page === 0) { // custom
            if (this.state.curP < customPages - 1) {
                // Επόμενη custom σελίδα
                this.state.curP++;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
            else if (banglePages > 0) {
                // Πήγαινε στα bangle (αν υπάρχουν)
                this.state.def.page = 1;
                this.state.curP = 0;
                this.state.def.pos = 0;
                return true;
            }
            else {
                // Δεν υπάρχουν bangle apps, γύρνα στην πρώτη custom σελίδα
                this.state.curP = 0;
                this.state.def.pos = 0;
                return true;
            }
        }
        else { // bangle
            if (this.state.curP < banglePages - 1) {
                // Επόμενη bangle σελίδα
                this.state.curP++;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
            else {
                // Γύρνα στα custom - ΠΡΩΤΗ σελίδα
                this.state.def.page = 0;
                this.state.curP = 0;
                this.state.def.pos = 0;
                return true;
            }
        }
    },

    prev() {
        let customPages = Math.ceil(this.state.ewA.length / this.state.perP) || 1;
        let banglePages = Math.ceil(this.state.bgA.length / this.state.perP) || 0;

        if (this.state.def.page === 0) { // custom
            if (this.state.curP > 0) {
                // Προηγούμενη custom σελίδα
                this.state.curP--;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
            else if (banglePages > 0) {
                // Πήγαινε στα bangle - ΤΕΛΕΥΤΑΙΑ σελίδα (αν υπάρχουν)
                this.state.def.page = 1;
                this.state.curP = banglePages - 1;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
            else {
                // Δεν υπάρχουν bangle apps, πήγαινε στην τελευταία custom σελίδα
                this.state.curP = customPages - 1;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
        }
        else { // bangle
            if (this.state.curP > 0) {
                // Προηγούμενη bangle σελίδα
                this.state.curP--;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
            else {
                // Γύρνα στα custom - ΤΕΛΕΥΤΑΙΑ σελίδα
                this.state.def.page = 0;
                this.state.curP = customPages - 1;
                this.state.def.pos = this.state.curP * 6;
                return true;
            }
        }
    },
};

// Load saved settings
if ((require('Storage').readJSON('ew.json', 1) || {}).launcher) {
    ew.apps.launcher.state.def = require('Storage').readJSON('ew.json', 1).launcher;
}

// start
setTimeout(() => { ew.apps.launcher.init(); }, 500);

// Icon
//ew.UI.icon.launcher = "mUywIxuh/AAon8Aocf//gAon+Aon/+AFBn4FB/4FFBgIRCDIUHAoX/wEAAoY5Bh4FEgF/AogZCC4IMDAocDGwQEB4E/gFwAoJbCBoMBEQReCv/+BAP4G4Xz/4VDAAIFCG4R9DG4IXBBgYFDOIJ7CgE8gfwg4KCMwR8CEQMPPgfgQoJ8DSIJ8gHIT/jABQA==";

// install icon
if (!require('Storage').read("ew_i_launcher.img"))   {
    let icon="mUywIxuh/AAon8Aocf//gAon+Aon/+AFBn4FB/4FFBgIRCDIUHAoX/wEAAoY5Bh4FEgF/AogZCC4IMDAocDGwQEB4E/gFwAoJbCBoMBEQReCv/+BAP4G4Xz/4VDAAIFCG4R9DG4IXBBgYFDOIJ7CgE8gfwg4KCMwR8CEQMPPgfgQoJ8DSIJ8gHIT/jABQA==";
    require('Storage').write("ew_i_launcher.img", require("heatshrink").decompress(atob(icon)));
}