// launcher face

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.launcher.next();
    ew.face[0].draw();
});

ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    ew.apps.launcher.prev();
    ew.face[0].draw();
});

ew.face[0] = {
    run: false,
    quicklink: 0,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 15000,

    init: function() {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        ew.apps.launcher.state.selP = 0;
        ew.apps.launcher.prep(false);
        this.bar();
        this.draw();
        this.run = true;
    },

    show: function() {
        if (!this.run) return;
    },

    draw: function() {
        let launcher = ew.apps.launcher;
        let state = launcher.state;
        
        // Σημαντικό: ενημέρωσε το curL
        state.curL = state.def.page === 0 ? "ewA" : "bgA";
        
        let totalCustomPages = Math.ceil(state.ewA.length / 6);
        let totalBanglePages = Math.ceil(state.bgA.length / 6);
        let totalPagesAll = totalCustomPages + totalBanglePages;
        
        let currentPageAll = (state.def.page === 0) ? 
            state.curP + 1 : 
            totalCustomPages + state.curP + 1;

        // indicator
        if (totalPagesAll === 1)
            ew.UI.ele.ind(0, 0, 0, 15);
        else
        ew.UI.ele.ind(currentPageAll, totalPagesAll, 0, 15);

        let apps = state[state.curL];
        let startIdx = state.curP * 6;
        
        ew.UI.ele.fill("_main", 12, 0);
        ew.UI.c.start(1, 0);

        for (let i = 0; i < 6; i++) {
            let idx = startIdx + i;
            let pos = i + 1;

            if (idx < apps.length) {
                let app = apps[idx];
                if (app.icon && app.icon !== "app") {
                    ew.UI.btn.img("main", "_2x3", pos, app.icon, "", 15, app.type === 2 ? 0 : 1, 1.3, 0, 0);
                } else {
                    ew.UI.btn.c2l("main", "_2x3", pos, app.name, "", 15, 0, 0.7);
                }
            }
        }
        ew.UI.c.end();

        // Button callbacks
        ew.UI.c.main._2x3 = (i, l) => {
            let idx = startIdx + (i - 1);
            if (idx >= apps.length) return;

            if (!l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (launcher.state.selP) {
                    ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "LINK", "ADDED", 0, 15, false, false, false);
                    state.selP = 0;
                    launcher.link(this.quicklink, apps[idx]);
                } else {
                    launcher.goID(idx);
                }
            }
            else {
                ew.sys.buzz.nav(ew.sys.buzz.type.na);
                state.def.pos = idx;
                this.draw();
                ew.UI.btn.img("main", "_2x3", (state.def.pos % 6) + 1, apps[state.def.pos].icon, "", 15, 9, 1.3);
                if (ew.def.face.info) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, apps[state.def.pos].name, "SELECTED", 0, 15);
                }
                state.selP = 1;
            }
        };
    },

    bar: function() {
        ew.is.bar = 0;
        ew.UI.c.start(0, 1);
        ew.UI.ele.fill("_bar", 6, 0);

        let links = ew.apps.launcher.state.def.link;
        let positions = ["l", "c", "r"];

        for (let i = 0; i < 3; i++) {
            let pos = i + 1;
            let link = links[positions[i]];
            
            if (link) {
                let app = ew.apps.launcher.getA(link.id, link.type);
                if (app && app.icon) {
                    ew.UI.btn.img("bar", "_bar", pos, app.icon, "", 15, 4, 1.1, 0, 1);
                } else {
                    ew.UI.btn.c2l("bar", "_bar", pos, link.name, "", 15, 4, 0.8);
                }
            } else {
                ew.UI.ele.coord("bar", "_bar", pos);
            }
        }

        ew.UI.c.end();

        // Quick link callbacks
        ew.UI.c.bar._bar = (i, l) => {
            let position = i === 1 ? "l" : (i === 2 ? "c" : "r");
            let link = links[position];

            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                let action = link ? "REMOVE" : "ADD";
                ew.UI.btn.ntfy(1, 2, 0, "_bar", 6, action + " LINK ?", "", 15, link ? 13 : 4, true, false, false);
                
                ew.UI.c.bar._ntfy = () => {
                    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                    if (link) {
                        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "LINK", "REMOVED", 0, 15, false, false, false);
                        ew.apps.launcher.link(position);
                    } else {
                        ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "SELECT", "APP", 0, 15, false, false, false);
                        ew.apps.launcher.state.selP = 1;
                        ew.face[0].quicklink = position;
                    }
                };
            }
            else {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                ew.apps.launcher.goL(position);
            }
        };
    },

    clear: function() {
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },

    off: function() {
        g.off();
    }
};