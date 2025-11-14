//timer face

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);

    if (ew.UI.ntid ) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    if (ew.face[0].page === 5)
        ew.face[0].page = 1;
    else
        ew.face[0].page++;
    ew.face[0].init();

});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);
    if (ew.UI.ntid ) {
        clearTimeout(ew.UI.ntid);
        ew.UI.ntid = 0;
    }
    if (ew.face[0].page === 1)
        ew.face[0].page = 5;
    else
        ew.face[0].page--;
    ew.face[0].init();

});

ew.face[0] = {
    run: false,
    page: 1,
    val:0,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    coord: (process.env.BOARD == "BANGLEJS2") ? { "txt":[40],"main": [0, 35, 176, 125], "clear": [5, 35, 170, 100], "rep": [88, 105], "time": [55, 55, 87, 92, 45, 51, 55] } : 
    { "txt":[55],"main": [0, 55, 240, 185], "clear": [5, 55, 235, 160], "rep": [120, 167], "time": [77, 87, 140, 124, 82, 87, 85] },
    init: function(o) {
        ew.def.face.off[ew.face.appCurr] = this.offms;
        this.rep = 0;
        this.page = o || this.page;
        ew.apps.timer.state.pos = this.page;

        ew.UI.c.start(1, 1);
        ew.UI.ele.ind(this.page, 5, 0, 3);
        ew.UI.ele.coord("main", "_main", 6);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            if (ew.apps.timer.getTimerStatus(this.page).active) return;
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            if (ew.UI.ntid && this.ntfy==="<  SET TIME  >") {
                clearTimeout(ew.UI.ntid);
                ew.UI.ntid = 0;
                this.bar();
                return;
            }
            ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, "<  SET TIME  >", "", 15, 6, 1);
            ew.sys.TC.val = { cur: ew.apps.timer.state.def[ew.face[0].page].min, dn: 1, up: 1440, tmp: 0, fire: 1, reverce: 0, loop: 1 };
            ew.UI.c.tcBar = (a, b, r) => {
                if (11 < r && 29 < b && b < 1440) b = b + (a * (20 < r ? 10 : 5));
                ew.sys.TC.val.cur = b;
                ew.apps.timer.state.def[ew.face[0].page].min = b;
                this.info(b);
                ew.UI.btn.ntfy(0, 3, 1);

            };
            ew.is.slide = 1;
        };
        g.setCol(0, 0);
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 0 });

        //draw repeat 
        if (!ew.apps.timer.getTimerStatus(ew.face[0].page).active) {
            let rep = ew.apps.timer.getTimerStatus(this.page).repetitions;
            if (rep) {
                g.setCol(1, 15);
                g.setFont("Teletext10x18Ascii");
                g.drawString("Repeat: " + rep, this.coord.rep[0] - g.stringWidth("Repeat: " + rep) / 2, this.coord.rep[1]);
            }

        }
        // info
        this.info(ew.apps.timer.getTimerStatus(this.page).minutes);
        // header
        ew.UI.btn.c2l("main", "_headerS", 6, ew.apps.timer.getTimerStatus(this.page).name, "", 15, 0, 1.5);

        this.bar();
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

    info: function(min) {

        // values
        if (ew.apps.timer.getTimerStatus(ew.face[0].page).active) {
            let totalMinutes = ew.apps.timer.getTimerStatus(this.page).remainingMinutes;
            let sec = ew.apps.timer.getTimerStatus(this.page).remainingSeconds;

            let hours = ((totalMinutes / 60) | 0); // Bitwise OR για γρήγορο floor
            let mins = (totalMinutes % 60 );
            let timeStr;
            if (hours) timeStr = ("0" + hours).substr(-2) + ":" + ("0" + mins).substr(-2) + ":" + ("0" + sec).substr(-2);
            //else timeStr = ("0" + mins).substr(-2) + ":" + ("0" + sec).substr(-2);
            else timeStr = ("0" + mins).substr(-2);

            g.setCol(0, 4);
            g.fillRect({ x: this.coord.clear[0], y: this.coord.clear[1], x2: this.coord.clear[2], y2: this.coord.clear[3], r: 10 });
            //g.fillRect(0, 60, 235, 170);
            g.setCol(1, 15);

            if (hours) {
                g.setFont("Vector", this.coord.txt[0] * ew.def.face.size);
                //g.setFont("LECO1976Regular22", 2);
                let l = g.stringWidth(timeStr) / 2;
                g.drawString(timeStr, this.coord.time[3] - l, this.coord.time[6]);

            }
            else if (mins) {
                //g.setFont("LECO1976Regular22", 3);
                g.setFont("Vector", 60 * ew.def.face.size);
                let l = g.stringWidth(timeStr) / 2;
                g.drawString(timeStr, this.coord.time[1] - l, this.coord.time[4]);
                g.setFont("Vector", 50 * ew.def.face.size);
                //g.setFont("LECO1976Regular22", 2);
                g.drawString(":" + ("0" + sec).substr(-2), this.coord.time[3] + l - g.stringWidth(":" + ("0" + sec).substr(-2)) / 2, this.coord.time[5]);

            }
            else {
                g.setFont("Vector", 60 * ew.def.face.size);
                //g.setFont("LECO1976Regular22", 3);
                g.drawString(("0" + sec).substr(-2), this.coord.time[3] - g.stringWidth(("0" + sec).substr(-2)) / 2, this.coord.time[4]);

            }


            //repeat
            let repL = ew.apps.timer.getTimerStatus(this.page).repetitionsLeft;
            let rep = ew.apps.timer.getTimerStatus(this.page).repetitions;

            if (rep) {
                g.setFont("Teletext10x18Ascii");
                g.drawString("Rep.Left: " + repL + "/" + rep, this.coord.rep[0] - g.stringWidth("Rep.Left: " + repL + "/" + rep) / 2, this.coord.rep[1]);
            }

        }
        else {
            let totalMinutes = ew.apps.timer.getTimerStatus(this.page).minutes;

            let hours = (totalMinutes / 60) | 0;
            let mins = totalMinutes % 60;
            let timeStr;


            if (hours) timeStr = ("0" + hours).substr(-2) + ":" + ("0" + mins).substr(-2);
            else timeStr = ("0" + mins).substr(-2);
            g.setCol(0, 1);
            g.fillRect({ x: this.coord.clear[0], y: this.coord.clear[1], x2: this.coord.clear[2], y2: this.coord.clear[3], r: 10 });
            g.setCol(1, 15);
            g.setFont("Vector", 60 * ew.def.face.size);
            //g.setFont("LECO1976Regular22", hours?2:3);
            let l = g.stringWidth(timeStr) / 2;
            g.drawString(timeStr, this.coord.time[3] - l, this.coord.time[4]);

        }
        g.flip();

    },
    bar: function(timer) {
        if (ew.UI.ntid) return; 
        if (ew.is.UIpri) { if (ew.notify.log.error[0]) ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";
        ew.UI.ele.fill("_bar", 6, 0);

        // timer active
        if (ew.apps.timer.getTimerStatus(this.page).active) {
            ew.is.slide = 0;
            ew.UI.c.start(0, 1);
            ew.UI.btn.img("bar", "_bar", 4, "pause", "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 4 : 1);
            ew.UI.btn.img("bar", "_bar", 5, "stop", "STOP", 13, 15);
            ew.UI.c.end();

            // bar buttons
            ew.UI.c.bar._bar = (i, l) => {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);

                if (i == 4) {
                    //if (l) {
                    if (ew.apps.timer.getTimerStatus(this.page).paused)
                        ew.apps.timer.resumeTimer(this.page);
                    else
                        ew.apps.timer.pauseTimer(this.page);


                    ew.UI.btn.img("bar", "_bar", 4, "pause", ew.apps.timer.getTimerStatus(this.page).paused ? "RESUME" : "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 13 : 0);
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", ew.apps.timer.getTimerStatus(this.page).paused ? "PAUSED" : "RESUMED", 0, 15);
                    //}
                    //else
                    //if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "PAUSE/RESUME", 0, 15);

                }
                else if (i == 5) {
                    if (l) {
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "RESTARTED", 0, 15, 0, 0, 0);
                        ew.apps.timer.restartTimer(this.page);
                    }
                    else {
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "STOPPED", 0, 15, 0, 0, 0);
                        ew.apps.timer.stopTimer(ew.face[0].page);
                    }

                }
                g.flip();
            };
        }
        // timer inactive
        else {
            ew.is.slide = 0;
            ew.UI.c.start(0, 1);
            //ew.UI.btn.img("bar", "_bar", 4, "time", "TIME", 15, 4);
            ew.UI.btn.img("bar", "_bar", 6, "play", "START",0,14);
            ew.UI.c.end();

            // bar buttons
            ew.UI.c.bar._bar = (i, l) => {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                // set time
                if (i == 4) {
                    ew.UI.btn.ntfy(1, 3, 0, "_bar", 6, " <  SET TIME  >", "", 15, 6, 1);
                    ew.sys.TC.val = { cur: ew.apps.timer.state.def[ew.face[0].page].min, dn: 1, up: 1440, tmp: 0, fire: 1, reverce: 0, loop: 1 };
                    ew.UI.c.tcBar = (a, b, r) => {
                        if (11 < r && 29 < b && b < 1440) b = b + (a * (20 < r ? 10 : 5));
                        ew.sys.TC.val.cur = b;
                        ew.apps.timer.state.def[ew.face[0].page].min = b;
                        this.info(b);
                        ew.UI.btn.ntfy(0, 2, 1);

                    };
                    ew.is.slide = 1;
                }
                //start timer
                else if (i == 6) {
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "STARTED", 0, 15,0,0,0);
                    ew.apps.timer.startTimer(ew.face[0].page);
                    ew.face[0].init();
                }
            };
        }
    },
    clear: function(o) {
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
    }
};
