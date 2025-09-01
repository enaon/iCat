ew.is.dddm = 16;
//g=global.g;
//g.col=Uint16Array([0,2047,2016,2016,2047,2047,31,   63488,63519,63519,63519,63519,63519,65504,2016,65535]);
//g.col=Uint16Array([  0,   0,2016,2016,2047,2047,31,63488,63519,63519,   31,63519,63519,65504,  31,65535]);  g.col=Uint16Array([  0,0x00ff,0x00ffff,-1,0x00ff,0x00ff,0,0x00ff,-1,0x00ff,0x00ff,0xfff,0xf00,0xff000,0xffff,0xffff]);
//g.col=Uint16Array([  0,0x00ff,0x00ffff,-1,0x00ff,0x00ff,0,0x00ff,-1,0x00ff,0x00ff,0xfff,0xf00,0xff000,0xffff,0xffff]);
//g.col=Uint16Array([  0,31,2016,2016,31,2047,0,63488,63519,63519,   31,63519,63519,65504,  65535,65535]);
global.color=Uint16Array([0x000, 0x1084, 0x5B2F, 0xce9b, 0x001D, 0x3299, 0x0842, 0x0F6A, 0x3ADC, 0xF81F, 2220, 0x07FF, 115, 0xd800, 0xFFE0, 0xFFFF]);
global.theme=[0,1,2,3,4,5,4,7,8,9,10,11,12,13,14,15];


g.col=Uint16Array([  g.theme.bg,g.theme.bg2,g.theme.bgH,-1,0x00ff,0x00ff,0,0x00ff,-1,0x00ff,0x00ff,0xfff,0xf00,0xff000,0xffff,g.theme.fg]);
//g.col= new Uint8Array(toFlatBuffer([0,0x2,0x8,0xa,0x20,0x22,0x24,0x2a,0x15,0x17,0x1d,0x1f,0x3d,0x37,0x3d,0x3f]));

g.setCol=(c,v)=>{g.setColor(g.col[v]);}; 

g.isOn = false;

g.setFontAlign(-1,-1);


g.on= function(){this.isOn = true;g.bri.set(ew.def.bri);};
g.off= function(){this.isOn = false;Bangle.setLCDBrightness(0);};

g.bri = {
    lv: (require("Storage").readJSON("ew.json", 1) && require("Storage").readJSON("ew.json", 1).sys) ? require("Storage").readJSON("ew.json", 1).sys.bri : 3,
    set: function(o) {
      if (o) this.lv = o;
      else { this.lv++; if (this.lv > 7) this.lv = 1;
        o = this.lv; }
      if (this.lv == 0 || this.lv == 7)
        digitalWrite(BL, (this.lv == 0) ? 0 : 1);
      else
        analogWrite(BL, (this.lv * 42.666) / 256, { freq: 60 });
      ew.def.bri = o;
      return o;
    }
  };



