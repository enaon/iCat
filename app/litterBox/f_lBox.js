//litterBox

ew.UI.nav.next.replaceWith(() => {
    if (ew.UI.ntid) { clearTimeout(ew.UI.ntid); ew.UI.ntid = 0; }
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});
ew.UI.nav.back.replaceWith(() => {
    if (ew.UI.ntid) { clearTimeout(ew.UI.ntid); ew.UI.ntid = 0; }
    ew.sys.buzz.nav(ew.sys.buzz.type.na);
});

ew.face[0] = {
    data: {
        img: {
            scan: "mEwwIcZg/+Aocfx+AAoV4gPgAoQDBuAEBgPAgE4AoQVBjgFBgYCBhgoCAQMGAQUgAolACggFL6AFGGQQFJEZsGsAFEIIhNFLIplFgBxBnwFCPYP/AoU8gf/BwKVB/+/SAUD/kf+CjDh/4V4n8AoYeBAoq1DgIqDAAP/XYcAv4qEn4qEGwsfC4kPEYkHF4Z1DACA="
        },
        source: ew.apps.itag.state.def.devices["lBox"],
        key: "batt",
        posL: 0
    },
    gatt: {},
    run: false,
    coord: (process.env.BOARD == "BANGLEJS2") ? { "main": [0, 29, 176, 115], "id": [88, 97], "batt": [88, 65], "unit": [45, 70], "last": [88, 35] } : { "main": [0, 55, 240, 185], "id": [120, 160], "batt": [120, 120], "unit": [70, 122], "last": [120, 70] },
    offms: (ew.def.face.off[ew.face.appCurr]) ? ew.def.face.off[ew.face.appCurr] : 60000,
    init: function(o) {
        if (!ew.def.face.off[ew.face.appCurr]) ew.def.face.off[ew.face.appCurr] = this.offms;
        ew.UI.ele.ind(0, 0, 0, 15);
        this.data.array = Object.keys(this.data.source);
        this.data.key = "batt";
        this.data.posL = 0;
        if (this.data.array.length) {
            let dev = this.data.array[0];
            this.info(this.data.source[dev].batt, dev, this.data.source[dev].name, this.data.source[dev].last);
        }
        ew.UI.btn.img("main", "_bar", 6, "scan.face", "WAIT", 14, 0, 1);
        this.bar();
        ew.UI.c.start(1, 1);
        //ew.UI.ele.coord("main", "_main", 9);
        ew.UI.c.end();
    },
    show: function(s) {},
    info: function(batt, id, name, last) {
        g.setCol(0, 1);
        g.fillRect({ x: this.coord.main[0], y: this.coord.main[1], x2: this.coord.main[2], y2: this.coord.main[3], r: 10 });

        // battery + voltage
        g.setCol(1, 15);
        g.setFont("LECO1976Regular22", 1);
        let volt = this.data.source[id].volt;
        let devInfo = (volt) ? batt + "% " + volt / 100 * 2 + "V" : batt + "%";
        let l = g.stringWidth(devInfo) / 2;
        g.drawString(devInfo, this.coord.batt[0] - l, this.coord.batt[1]);

        // last seen
        const now = (Date.now() / 1000 | 0);
        const diffMins = (now - last) / 60 | 0;
        g.setCol(1, 14);
        g.setFont("Teletext10x18Ascii");
        g.drawString(this.formatTimeDiff(diffMins), this.coord.last[0] - g.stringWidth(this.formatTimeDiff(diffMins)) / 2, this.coord.last[1]);

        // id (MAC)
        g.setCol(1, 14);
        if (process.env.BOARD == "BANGLEJS2") g.setFont("Vector", 20 * ew.UI.size.txt);
        else g.setFont("Teletext10x18Ascii");
        g.drawString(id.split(" ")[0].toUpperCase(), this.coord.id[0] - g.stringWidth(id.split(" ")[0].toUpperCase()) / 2, this.coord.id[1]);

        // name
        ew.UI.btn.c2l("main", "_header", 6, name, "", 15, 0, 1.5);
    },
    formatTimeDiff: function(mins) {
        if (mins < 1) return 'Now';
        if (mins < 60) return mins + ' Minutes ago';
        const hours = Math.floor(mins / 60);
        if (hours < 24) return hours + ' Hours ago';
        const days = Math.floor(hours / 24);
        return days + ' Days ago';
    },
    bar: function() {
        if (ew.UI.ntid) return;

        if (this.data.array.length === 0) {
            ew.UI.btn.c2l("main", "_main", 15, "EMPTY", "", 15, 0, 2);
        }
        ew.UI.ele.fill("_bar", 6, 0);

        if (this.data.array.length) {
            this.graph(this.data.array, this.data.posL, 0, this.data.key);
        }
        else {
            ew.UI.btn.c2l("main", "_main", 15, "EMPTY", "", 15, 0, 2);
        }

        ew.sys.TC.val = { cur: this.data.posL, dn: 0, up: this.data.array.length - 1, reverce: 0, loop: 1 };
        ew.UI.c.tcBar = (a, b, r, m) => {
            let v = this.graph(this.data.array, b, 1, this.data.key);
            if (!v) { return; }
            g.flip();
            if (ew.tid.barDo) clearTimeout(ew.tid.barDo);
            ew.tid.barDo = setTimeout(() => {
                ew.tid.barDo = 0;
                this.info(v[0], v[1], v[2], v[3]);
            }, 20);
        };
        ew.is.slide = 1;

        ew.UI.c.start(0, 1);
        ew.UI.c.end();

        ew.UI.c.bar._bar = (i) => {
            if (i == 1) {}
        };
    },
    graph: function(data, pos, update, focus) {
        const width = g.getWidth() - (process.env.BOARD == "BANGLEJS2" ? 0 : 30);
        const bottom = g.getHeight() - (process.env.BOARD == "BANGLEJS2" ? 0 : 15);
        const height = process.env.BOARD == "BANGLEJS2" ? 42 : 70;
        const value = this.data.key;
        const fields = this.data.array.length;
        const source = this.data.source;
        const margin = process.env.BOARD == "BANGLEJS2" ? 0 : 15;
        const bw = width / fields;
        const devP = data[pos];
        if (!devP) return;

        let scale = height / 100;

        if (update) {
            // top dot - erase last
            g.setCol(1, 0);
            g.fillRect(margin + 3 + (this.data.posL * bw) + bw - 3, bottom - height - 8, margin + 3 + (this.data.posL * bw), bottom - height - 5);
            // top dot - create current
            g.setCol(1, 15);
            if (fields) g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - height - 8, margin + 3 + (pos * bw), bottom - height - 5);
            // bar - clear previous
            g.setCol(1, 4);
            g.fillRect(margin + 3 + (this.data.posL * bw) + bw - 3, bottom - (source[data[this.data.posL]][value] * scale), margin + 3 + (this.data.posL * bw), bottom);
            // bar - highlight current
            g.setCol(1, 15);
            g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - (source[devP][value] * scale), margin + 3 + (pos * bw), bottom);

            this.data.posL = pos;

            return [source[devP][value], devP, source[devP].name, source[devP].last];
        }

        // first draw
        g.setCol(1, 14);
        if (1 < fields) g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - height - 8, margin + 3 + (pos * bw), bottom - height - 5);

        // bar - draw bars
        for (let i in data) {
            if (fields < i) break;
            const dev = data[i];
            g.setCol(1, 4);
            g.fillRect(margin + 3 + (i * bw) + bw - 3, bottom - (source[dev][value] * scale), margin + 3 + (i * bw), bottom);
        }
        // bar - highlight current
        g.setCol(1, 15);
        g.fillRect(margin + 3 + (pos * bw) + bw - 3, bottom - (source[devP][value] * scale), margin + 3 + (pos * bw), bottom);

        return [source[devP][value], devP, source[devP].name, source[devP].last];
    },
    clear: function(o) {
        ew.is.slide = 0;
        if (this.tid) clearTimeout(this.tid);
        this.tid = 0;
        return true;
    },
    off: function(o) {
        g.off();
        this.clear(o);
    }
};
