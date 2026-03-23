//itag scan viewer

ew.UI.nav.next.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.face[0] = {
    data: { source: 0, name: 0, key: 0, key_1: 0, key_2: 0, key_3: 0, lowLimit: 0, hiLimit: 0, fields: 0, totLowField: 0, ref: 0, style: 0, posL: 0 },
    gatt: {},
    run: false,
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function() {
        if (!ew.def.face.off[ew.face.appCurr])  ew.def.face.off[ew.face.appCurr] = this.offms;
        if (ew.apps.scan.state.ble.gatt.connected|| (ew.comm.mstr.connection  && ew.comm.mstr.connection.connected)) {
            ew.face.go("itag-connect", 0);
            return;
        }
        ew.is.bar = 0;
        if (ew.face.appPrev === "itag-dev") this.started = 1
        ew.UI.ele.ind(0, 0, 0, 0);

        this.data.key = "rssi";
        // UI control Start
        ew.UI.c.start(1, 1);
        ew.UI.ele.coord("main", "_main", 9);
        ew.UI.c.end();

        // button hander
        ew.UI.c.main._main = (i, l) => {
            if (ew.face[0].dbg) console.log("button: ", i);
            if (l) {
                ew.sys.buzz.nav(ew.sys.buzz.type.ok);
                if (ew.apps.scan.state.def.set.scanAll) {
                    ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "SCAN ALL", "IS ACTIVE", 15, 13);
                    return;
                }
                ew.apps.scan.state.ble.id = ew.apps.scan.state.devA[this.data.posL];
                ew.face.go("itag-connect", 0, ew.apps.scan.state.ble.id);
            } else if (ew.def.face.info) ew.UI.btn.ntfy(1, 0.4, 0, "_bar", 6,"HOLD TO", "CONNECT", 0, 15);

        };
        if (!ew.apps.scan.state.def.set.scanAll) {
            //this.data.array =  ew.apps.scan.state.def.storeOrder;
            this.data.source = ew.apps.scan.state.def.store;;
        }
        else {
            //this.data.array = ew.apps.scan.state.scanAllA;
            this.data.source = ew.apps.scan.state.scanAll;;
        }

        if (ew.apps.scan.state.focus)
            ew.apps.scan.state.lastId = ew.apps.scan.state.focus;

        if (!ew.apps.scan.state.ble.scan) {
            if (!ew.apps.scan.state.def.set.persist) {
                let timePassed = ((getTime() | 0) - ew.apps.scan.state.time);
                if (ew.apps.scan.state.def.set.keepFor * 60 <= timePassed) {
                    ew.apps.scan.state.dev = {};
                    ew.apps.scan.state.devA = [];
                }
            }
            ew.apps.scan.stopScan();
            ew.apps.scan.startScan();
        }
        this.bar();

 
        //if (ew.apps.scan.state.lastId && (ew.apps.scan.state.dev[ew.apps.scan.state.lastId]))
        //        this.data.posL = ew.apps.scan.state.devA.indexOf(ew.apps.scan.state.lastId);
        //else this.data.posL = 0;

        //this.info(this.data.source[ew.apps.scan.state.devA[this.data.posL] ].rssi   , ew.apps.scan.state.devA[this.data.posL] , this.data.source[ew.apps.scan.state.devA[this.data.posL] ].name , this.data.source[ew.apps.scan.state.devA[this.data.posL] ].oflc);
        //this.bar();


        this.run=1

    },
    show: function() {
        if (!this.run) return;

        this.update();
        if (this.tid) clearTimeout(this.tid);
        this.tid = setTimeout(function(t) {
            t.tid = 0;
            t.show();
        }, 500, this);
    },

    info: function(rssi, id, name,oflc) {

        name = this.data.source[id] ? this.data.source[id].name : name;
        let brd =(this.data.source[id] &&this.data.source[id].board )?this.data.source[id].board:0;
        let boCo=[0,0,0,6,1]
        ew.UI.btn.img("main", "_main", 3, "ks", "KINGSONG", oflc ? 13 : 15, 1, 1);
        //ew.UI.btn.i2l("main", "_main", 2, oflc ? oflc : rssi + " ", oflc ? "OFFLINE" : (ew.apps.scan.state.def.set.scanAll) ? id.split(" ")[0].toUpperCase() : "dBm", oflc ? 13 : 15, 1, process.env.BOARD === "BANGLEJS2" ? 2 : 3);
        ew.UI.btn.c2l("main", "_main", 6, name, "", 15, 1, 1);

        //name
        ew.UI.btn.c2l("main", "_header", 6, id.split(" ")[0], "", 15, boCo[brd], 1);

    },
    bar: function() {
        if (ew.is.UIpri) { ew.notify.alert("error", ew.notify.log.error[0], 1, 1); return; }

        if (ew.is.bar) return;
        
        // set the bar control
        ew.UI.c.tcBar = (a, b) => {
            let v = this.graph(ew.apps.scan.state.devA, b, 1, this.data.key);
            if (!v) { return; }
            this.info(v[0], v[1], v[2], v[3]);
        };
        ew.is.slide = 1;

        // reset UI control, bar only
        ew.UI.c.start(0, 1);
        ew.UI.c.end();

        if (!ew.apps.scan.state.devA.length) {
            ew.UI.ele.fill("_bar", 6, 0);
            ew.UI.btn.img("main", "_main", 9, "scan", "WAIT", 15, 1, 3);
            ew.UI.btn.c2l("main", "_header", 6, "SCANNING", "", 15, 0, 1.2);

           /* if (!this.started && ew.def.face.info) {
                ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "EUC", "SCANNER", 15, 1);
                setTimeout(() => { ew.face[0].started = 1; }, 1000);
            }
            */
            return;
        }
        g.flip();
        this.update();
    },

    update: function(listReniew) {
        if (ew.is.bar) return;
      
        ew.UI.ele.fill("_bar", 6, 0);

        ew.sys.TC.val = { cur: this.data.posL, dn: 0, up: ew.apps.scan.state.devA.length - 1, tmp: 0, reverce: 0, loop: 1 };
        // graph the bar

        if (ew.apps.scan.state.devA.length) {
            if (ew.apps.scan.state.lastId && (ew.apps.scan.state.dev[ew.apps.scan.state.lastId]))
                this.data.posL = ew.apps.scan.state.devA.indexOf(ew.apps.scan.state.lastId);
            else this.data.posL = 0;

            let v = this.graph(ew.apps.scan.state.devA, this.data.posL, 0, this.data.key);
            if (!ew.apps.scan.state.def.set.persist&&!g.isOn)
            ew.UI.btn.img("main", "_main", 9, "pause", "Paused", 4, 15, 2);
            else this.info(v[0], v[1], v[2], v[3]);

        }
        else {
            //ew.UI.btn.img("main", "_bar", 6, "scan", "WAIT", 14, 0, 4);
            ew.UI.ele.fill("_bar", 6, 0);
            g.flip();
        }
    },
   graph: function(data, pos, update, focus) {
    // vars
    const width = g.getWidth() - (process.env.BOARD == "BANGLEJS2" ? 0 : 30);
    const bottom = g.getHeight() - (process.env.BOARD == "BANGLEJS2" ? 0 : 15);
    const height = bottom / (process.env.BOARD == "BANGLEJS2" ? 3.65 : 3.65) | 0;
    const value = this.data.key;
    const source = ew.apps.scan.state.dev;
    const fields = data.length;
    const margin = process.env.BOARD == "BANGLEJS2" ? 0 : 15;
    
    // Μέγιστο πλάτος μπάρας
    const MAX_BAR_WIDTH = 40;
    
    // Υπολογισμός πλάτους μπάρας
    let bw, startX;
    
    if (fields * (MAX_BAR_WIDTH + 2) <= width) {
        // Χωράνε όλες με το μέγιστο πλάτος - κεντράρουμε
        bw = MAX_BAR_WIDTH;
        let totalWidth = fields * (bw + 2);
        startX = margin + (width - totalWidth) / 2;
    } else {
        // Δεν χωράνε - δυναμικό πλάτος όπως πριν
        bw = (width - (fields * 2)) / fields;
        startX = margin;
    }
    
    if (!data[pos]) return;

    // get scale
    let scale = (process.env.BOARD == "BANGLEJS2" ? 0.9 : 1.1);
    let rssi = ew.apps.scan.state.def.set.rssi;
    let limits = source[data[pos]].live;
    let abs_pos = (source[data[pos]][value] ^ (source[data[pos]][value] >> 31)) - (source[data[pos]][value] >> 31);
    let abs_posL = (source[data[this.data.posL]][value] ^ (source[data[this.data.posL]][value] >> 31)) - (source[data[this.data.posL]][value] >> 31);
    
    if (update) {
        // top dot - erase last
        g.setCol(1, 0);
        g.fillRect(startX + 2 + (this.data.posL * (bw + 2)) + bw - 2, bottom - height + 0, 
                   startX + 2 + (this.data.posL * (bw + 2)), bottom - height + 5);
        
        // top dot - create current
        g.setCol(1, 14);
        if (fields) {
            g.fillRect(startX + 2 + (pos * (bw + 2)) + bw - 2, bottom - height + 0, 
                       startX + 2 + (pos * (bw + 2)), bottom - height + 5);
        }
        
        limits = source[data[this.data.posL]].live;

        // style 1
        if (!rssi) {
            // bar - clear previous 
            g.setCol(1, limits ? 4 : 13);
            g.fillRect(startX + 2 + (this.data.posL * (bw + 2)) + bw - 2, 
                       bottom - (limits ? 50 : 50 - source[data[this.data.posL]].oflc), 
                       startX + 2 + (this.data.posL * (bw + 2)), bottom);
            
            // bar - highlight current
            g.setCol(1, 14);
            limits = source[data[pos]].live;
            g.drawRect(startX + 2 + (pos * (bw + 2)) + bw - 2, 
                       bottom - (limits ? 50 : 50 - source[data[pos]].oflc), 
                       startX + 2 + (pos * (bw + 2)), bottom);
        }
        // style 0
        else {
            // limits color coding
            g.setCol(1, limits ? 4 : 13);
            // bar - clear previous
            g.drawRect(startX + 2 + (this.data.posL * (bw + 2)) + bw - 2, 
                       bottom - (limits ? ((100 - abs_posL) * scale) : 50 - source[data[this.data.posL]].oflc), 
                       startX + 2 + (this.data.posL * (bw + 2)), bottom);
            
            // bar - highlight current 
            g.setCol(1, 14);
            limits = source[data[pos]].live;
            g.drawRect(startX + 2 + (pos * (bw + 2)) + bw - 2, 
                       bottom - (limits ? ((100 - abs_pos) * scale) : 50 - source[data[pos]].oflc), 
                       startX + 2 + (pos * (bw + 2)), bottom);
        }
        this.data.posL = pos;
        ew.apps.scan.state.lastId = data[pos];
    }
    else {
        // first draw
        // dot highlight current
        g.setCol(1, 14);
        if (1 < fields) {
            g.fillRect(startX + 2 + (pos * (bw + 2)) + bw - 2, bottom - height + 0, 
                       startX + 2 + (pos * (bw + 2)), bottom - height + 5);
        }

        // bar - draw bars
        for (let i in data) {
            if (fields < i) break;
            limits = source[data[i]].live;
            g.setCol(1, limits ? 4 : 13);
            
            if (rssi) {
                let abs_i = (source[data[i]][value] ^ (source[data[i]][value] >> 31)) - (source[data[i]][value] >> 31);
                g.fillRect(startX + 2 + (i * (bw + 2)) + bw - 2, 
                           bottom - (limits ? ((100 - abs_i) * scale) : 50 - source[data[i]].oflc), 
                           startX + 2 + (i * (bw + 2)), bottom);
            } else {
                g.fillRect(startX + 2 + (i * (bw + 2)) + bw - 2, 
                           bottom - (limits ? 50 : 50 - source[data[i]].oflc), 
                           startX + 2 + (i * (bw + 2)), bottom);
            }
        }
        
        // bar - highlight current
        g.setCol(1, 14);
        limits = source[data[pos]].live;
        if (rssi) {
            g.drawRect(startX + 2 + (pos * (bw + 2)) + bw - 2, 
                       bottom - (limits ? ((100 - abs_pos) * scale) : 50 - source[data[pos]].oflc), 
                       startX + 2 + (pos * (bw + 2)), bottom);
        } else {
            g.drawRect(startX + 2 + (pos * (bw + 2)) + bw - 2, 
                       bottom - (limits ? 50 : 50 - source[data[pos]].oflc), 
                       startX + 2 + (pos * (bw + 2)), bottom);
        }
    }

    return [source[data[pos]].rssi, data[pos], source[data[pos]].name, source[data[pos]].oflc];
},
    clear: function(o) {
        ew.is.slide = 0; /*TC.removeAllListeners();*/
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        if (ew.apps.scan.state.focus || (ew.apps.scan.state.def.set.persist && ew.face.appCurr === "itag") /*|| (ew.face.appCurr.startsWith("itag") && !ew.face.pageCurr)*/ )
            return;

        else {
            if (ew.face.appCurr === "itag") ew.UI.btn.img("main", "_main", 9, "pause", "Paused", 4, 15, 2);
            ew.apps.scan.state.time = (getTime() | 0);
            ew.apps.scan.stopScan();
        }
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
