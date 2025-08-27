//timer face

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);

    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    if (ew.face[0].page === 5)
        ew.face[0].page =1
    else
        ew.face[0].page++
        ew.face[0].init();

});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    if (ew.UI.ntid) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    if (ew.face[0].page === 1)
        ew.face[0].page = 5
    else
        ew.face[0].page--
        ew.face[0].init();

});

ew.face[0] = {
    run: false,
    page: 1,
    offms: (ew.def.off[ew.face.appCurr]) ? ew.def.off[ew.face.appCurr] : 60000,
    init: function(o) {
        ew.def.off[ew.face.appCurr] = this.offms;
        ew.UI.ele.ind(this.page, 5, 0, 2);
        ew.UI.c.start(1, 1);
        ew.UI.c.end();
        g.setCol(0, ew.apps.timer.getTimerStatus(ew.face[0].page).active ? 4 : 1);
        g.fillRect({ x: 0, y: 55, x2: 235, y2: 180, r: 10 });
        ew.UI.btn.c2l("main", "_headerS", 6, ew.apps.timer.getTimerStatus(ew.face[0].page).name, "", 15, 0, 1.5);

        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 6);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);

            if (l) {

                if (!ew.apps.timer.getTimerStatus(ew.face[0].page).active) {
                    ew.apps.timer.setTimer(ew.face[0].page, ew.apps.timer.state.def[ew.face[0].page].min, 1, 10);
                    ew.apps.timer.startTimer(ew.face[0].page);
                    ew.face[0].init();
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "STARTED", 0, 15);

                }
                else {
                    ew.apps.timer.stopTimer(ew.face[0].page);
                    ew.face[0].init();
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "STOPPED", 0, 15);
                }
            }
            else {
                if (ew.apps.timer.getTimerStatus(ew.face[0].page).active)
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "TO STOP", 0, 15);
                else
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "TO START", 0, 15);

            }
        }
        this.bar();

        this.info();
        this.run = 1;

    },
    show: function(s) {
        if (!this.run) return;

        this.info();
        this.tid = setTimeout(function(t) {
            t.tid = -1;
            t.show();
        }, 1000, this);
    },

    info: function() {
        //"ram";

        // values

        if (ew.apps.timer.getTimerStatus(ew.face[0].page).active) {
            let min = ew.apps.timer.getTimerStatus(this.page).remainingMinutes;
            let sec = ew.apps.timer.getTimerStatus(this.page).remainingSeconds;
            min = min < 10 ? "0" + min : min
            sec = sec < 10 ? "0" + sec : sec

            g.setCol(0, 4);
            g.fillRect(0, 60, 240, 170);

            g.setCol(1, 15);
            g.setFont("LECO1976Regular22", 3);
            g.drawString(min + ":" + sec, 120 - g.stringWidth(min + ":" + sec) / 2, 95);

        }
        else {
            let minutes = ew.apps.timer.getTimerStatus(this.page).minutes;
            g.setCol(0, 1);
            g.fillRect(50, 70, 190, 150);
            g.setCol(1, 15);
            g.setFont("LECO1976Regular22", 3);
            let l = g.stringWidth(minutes) / 2;
            g.drawString(minutes, 120 - l, 95);
        }
        g.flip();

    },

    bar: function(timer) {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";
        g.setCol(0, 0);
        g.fillRect({ x: 0, y: 180, x2: 250, y2: 280, });

        if (ew.apps.timer.getTimerStatus(this.page).active) {
            ew.is.slide = 0;
            ew.UI.c.start(0, 1);
            ew.UI.btn.img("bar", "_bar", 4, "pause", "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 4 : 1);
            ew.UI.btn.img("bar", "_bar", 5, "restart", "RESTART", 15, 2);
            ew.UI.c.end();

            // bar buttons
            ew.UI.c.bar._bar = (i, l) => {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);

                if (i == 4) {
                    if (l) {
                        if (ew.apps.timer.getTimerStatus(this.page).paused)
                            ew.apps.timer.resumeTimer(this.page);
                        else
                            ew.apps.timer.pauseTimer(this.page);


                        ew.UI.btn.img("bar", "_bar", 4, "pause", "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 4 : 1);
                        if (ew.def.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", ew.apps.timer.getTimerStatus(this.page).paused ? "PAUSED" : "RESUME", 0, 15);
                    }
                    else
                    if (ew.def.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "PAUSED/RESUME", 0, 15);

                }
                else if (i == 5) {
                    if (l) {
                        ew.apps.timer.restartTimer(this.page);
                        if (ew.def.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "RESTARTED", 0, 15);
                    }
                    else
                    if (ew.def.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "TO RESTART", 0, 15);

                }
                g.flip();
            };
        }
        else {
            ew.UI.btn.c2l("bar", "_bar", 6, "| | | | | | | | | | | | | |", "", 15, 1);
            // set the bar control
            ew.sys.TC.val = { cur: ew.apps.timer.getTimerStatus(this.page).minutes, dn: 1, up: 999, tmp: 0, reverce: 0, loop: 1 };
            ew.UI.c.tcBar = (a, b) => {

                ew.tid.barDo = 0;
                ew.apps.timer.state.def[ew.face[0].page].min = b;
                this.info();

            };
            ew.is.slide = 1;
        }

    },


    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        ew.apps.itag.stopScan();
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
