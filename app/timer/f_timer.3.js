//timer face

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.ok);

    if (ew.UI.ntid) {
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
    if (ew.UI.ntid) {
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
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,    
    coord: (process.env.BOARD == "BANGLEJS2") ? 
    { "main":[0,35,176,125] ,"clear":[10,35,160,100],"rep": [88, 110], "time": [77, 110,130,87,50,90,100]  } : 
    { "main":[0,55,240,185],"rep": [120, 156], "time": [77, 110,130,120,87,90,100] },
    init: function(o) {
        ew.def.face.off[ew.face.appCurr] = this.offms;
        this.rep = 0;
        ew.UI.ele.ind(this.page, 5, 0, 2);
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 6);
        ew.UI.ele.coord("main", "_header", 6);

        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);

            if (l) {

                if (!ew.apps.timer.getTimerStatus(ew.face[0].page).active) {
                    ew.apps.timer.startTimer(ew.face[0].page);
                    ew.face[0].init();
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "STARTED", 0, 15);

                }
                else {
                    ew.apps.timer.stopTimer(ew.face[0].page);
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "STOPPED", 0, 15);
                }
            }
            else {
                this.rep = 0;
                this.bar();
                if (ew.apps.timer.getTimerStatus(ew.face[0].page).active)
                    ew.UI.btn.ntfy(0, 1.5, 0, "_bar", 6, "LONG HOLD", "TO STOP", 0, 15);
                else
                    ew.UI.btn.ntfy(0, 1.5, 0, "_bar", 6, "LONG HOLD", "TO START", 0, 15);

            }
        };
        ew.UI.c.main._header = (i) => {
            if (ew.apps.timer.getTimerStatus(ew.face[0].page).active) return;
            this.rep = 1;
            ew.sys.buzz.nav(ew.sys.buzz.type.ok);
            this.bar();
            ew.UI.btn.ntfy(0, 1.5, 0, "_bar", 6, "SET", "REPEAT", 0, 15);
        };

        g.setCol(0, ew.apps.timer.getTimerStatus(ew.face[0].page).active ? 4 : 1);
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });
        //draw repeat 
        if (!ew.apps.timer.getTimerStatus(ew.face[0].page).active) {
            let rep = ew.apps.timer.getTimerStatus(this.page).repetitions;
            if (rep) {
                g.setCol(1, 15);
                g.setFont("Teletext10x18Ascii");
                g.drawString("Repeat: " + rep, this.coord.rep[0] - g.stringWidth("Repeat: " + rep) / 2,this.coord.rep[1]);
            }

        }

        this.info(ew.apps.timer.getTimerStatus(this.page).minutes);
        ew.UI.btn.c2l("main", "_headerS", 6, ew.apps.timer.getTimerStatus(ew.face[0].page).name, "", 15, 0, 1.5);

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

            let hours = (totalMinutes / 60) | 0; // Bitwise OR για γρήγορο floor
            let mins = totalMinutes % 60;
            let timeStr;
            if (hours) timeStr = ("0" + hours).substr(-2) + ":" + ("0" + mins).substr(-2) + ":" + ("0" + sec).substr(-2);
            //else timeStr = ("0" + mins).substr(-2) + ":" + ("0" + sec).substr(-2);
            else timeStr = ("0" + mins).substr(-2);

            g.setCol(0, 4);
            g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });
            //g.fillRect(0, 60, 235, 170);
            g.setCol(1, 15);
            
            if (hours && mins) {
                g.setFont("LECO1976Regular22", 2);
                let l = g.stringWidth(timeStr) / 2;
                g.drawString(timeStr, this.coord.time[0] - l, this.coord.time[4]);

            }
            else if (!hours && mins) {
                g.setFont("LECO1976Regular22", 3);
                let l = g.stringWidth(timeStr) / 2;
                g.drawString(timeStr, this.coord.time[0] - l, this.coord.time[3]);
                g.setFont("LECO1976Regular22",2);
                g.drawString(": " + ("0" + sec).substr(-2), this.coord.time[1] + l - g.stringWidth(": " + ("0" + sec).substr(-2)) / 2, this.coord.time[5]);

            }else{
                g.setFont("LECO1976Regular22", 3);
                g.drawString( ("0" + sec).substr(-2), this.coord.time[2] - g.stringWidth( ("0" + sec).substr(-2)) / 2,this.coord.time[3]);

            }
            
            
            //repeat
            let repL = ew.apps.timer.getTimerStatus(this.page).repetitionsLeft;
            let rep = ew.apps.timer.getTimerStatus(this.page).repetitions;

            if (rep) {
                g.setFont("Teletext10x18Ascii");
                g.drawString("Repeat Left: " + repL +"/"+rep , this.coord.rep[0] - g.stringWidth("Repeat Left: " + repL +"/"+rep) / 2, this.coord.rep[1]);
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
            g.fillRect(this.coord.clear[0], this.coord.clear[1], this.coord.clear[2], this.coord.clear[3]);
            g.setCol(1, 15);
            g.setFont("LECO1976Regular22", 3);
            let l = g.stringWidth(timeStr) / 2;
            g.drawString(timeStr, this.coord.time[3] - l, this.coord.time[4]);

        }
        g.flip();

    },
    bar: function(timer) {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }
        //"ram";

        if (ew.apps.timer.getTimerStatus(this.page).active) {
            ew.is.slide = 0;
            ew.UI.c.start(0, 1);
            ew.UI.btn.img("bar", "_bar", 4, "pause", "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 4 : 0);
            ew.UI.btn.img("bar", "_bar", 5, "restart", "RESTART", 15, 13);
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


                        ew.UI.btn.img("bar", "_bar", 4, "pause", "PAUSE", 15, ew.apps.timer.getTimerStatus(this.page).paused ? 4 : 0);
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", ew.apps.timer.getTimerStatus(this.page).paused ? "PAUSED" : "RESUME", 0, 15);
                    }
                    else
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "PAUSED/RESUME", 0, 15);

                }
                else if (i == 5) {
                    if (l) {
                        ew.apps.timer.restartTimer(this.page);
                        if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "TIMER", "RESTARTED", 0, 15);
                    }
                    else
                    if (ew.def.face.info) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "LONG HOLD", "TO RESTART", 0, 15);

                }
                g.flip();
            };
        }
        else {
            ew.UI.btn.c2l("bar", "_bar", 6, "| | | | | | | | | | | |", "", 1, 0);
            // set the bar control

            if (this.rep) {
                ew.sys.TC.val = { cur: ew.apps.timer.state.def[ew.face[0].page].rep, dn: 0, up: 10, tmp: 0, reverce: 0, loop: 0 };
                ew.UI.c.tcBar = (a, b) => {
                    ew.apps.timer.state.def[ew.face[0].page].rep = b;
                    ew.UI.btn.i2l("main", "_main", 6, "", b ? "Repeat: " + b : "fill", 15, 1, 1);
                    g.flip();
                };
            }
            else {
                ew.sys.TC.val = { cur: ew.apps.timer.state.def[ew.face[0].page].min, dn: 1, up: 1440, tmp: 0, fire: 1, reverce: 0, loop: 1 };
                ew.UI.c.tcBar = (a, b, r) => {
                    if (11 < r && 29 < b && b < 1440) b = b + (a * (20 < r ? 10 : 5));
                    ew.sys.TC.val.cur = b;
                    ew.apps.timer.state.def[ew.face[0].page].min = b;
                    this.info(b);
                };
            }
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
