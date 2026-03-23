Modules.addCached("VL_53L0X", function() {
  function c(a, b) { this.options = b || {};
    this.i2c = a;
    this.ad = 41;
    this.options.address && (this.ad = this.options.address >> 1, this.i2c.writeTo(41, 138, this.ad));
    this.init() } c.prototype.init = function() { this.w(128, 1);
    this.w(255, 1);
    this.w(0, 0);
    this.StopVariable = this.r(145, 1)[0];
    this.w(0, 1);
    this.w(255, 0);
    this.w(128, 0) };
  c.prototype.r = function(a, b) { this.i2c.writeTo(this.ad, a); return this.i2c.readFrom(this.ad, b) };
  c.prototype.w = function(a, b) { this.i2c.writeTo(this.ad, a, b) };
  c.prototype.performSingleMeasurement =
    function() { this.w(128, 1);
      this.w(255, 1);
      this.w(0, 0);
      this.w(145, this.StopVariable);
      this.w(0, 1);
      this.w(255, 0);
      this.w(128, 0); for (this.w(0, 1); !this.r(20, 1)[0] & 1;); var a = new DataView(this.r(20, 12).buffer); return { distance: a.getUint16(10), signalRate: a.getUint16(6) / 128, ambientRate: a.getUint16(8) / 128, effectiveSpadRtnCount: a.getUint16(2) / 256 } };
  exports.connect = function(a, b) { return new c(a, b) }
});

//
ew.apps.ToF = {
  i2c: new I2C,
  init: () => {
    ew.apps.ToF.i2c.setup({ sda: ew.pin.i2c.SDA, scl: ew.pin.i2c.SCL });
    ew.apps.ToF.laser = require("VL_53L0X").connect(ew.apps.ToF.i2c);
    //ew.apps.ToF.laser.setDistanceMode("short");
    //ew.apps.ToF.laser.stopContinuous(1000);
  },
  start: () => {
    ew.apps.ToF.init();
    ew.apps.ToF.tid = setInterval(function() {
      console.log(ew.apps.ToF.laser.performSingleMeasurement().distance / 10 + " cm");
    }, 500);
  },
  read: () => {
    ew.apps.ToF.init();
    return ew.apps.ToF.laser.performSingleMeasurement().distance / 10;
  },
  stop: () => {
    if (ew.apps.ToF.tid) clearInterval(ew.apps.ToF.tid);
    ew.apps.ToF.tid = 0;
    poke32(0x50000700 + 14 * 4, 2);
    poke32(0x50000700 + 15 * 4, 2);
  }
};

//ew.apps.ToF.laser.readDistance()

//ew.UI.icon.ToF="mEwwhC/AH4AZhQXX0AX/AAuq1QXyhGIxGALxwXBMAIVBAAYXQFoQADGJgXC1AWFGBoXFmYACGBoWB1WixGDC4c4GBgXC1QuEGBwXDFwgwDC5mK1UjCYMikQwDC5J2B0GC1WjmcyDwIcCMApBDC4eIBAZ9CC8jtCxEqC6OgDQWIPAIXMOggXDXwR3LC4ZKDhDWDU5oXGa6BhDC4QwDFwYXNMAQwEFwJeGMAgXCGAwuJC4wwCAAoWHJAYFDGAQADFxAXHGAwWJC44xDFpRgCLwYASC68AC94A/AH4A4A==";
//ew.UI.icon.ToF="mk0whC/AH4A/gEKDOWq0AZ/DJmqQC4ZEhGIAAIZUDAYABkAZQ0AYFGp4YBDIIYGDRwZC1ATCmYABDKWixGDDAQaDwAZO1QxDAAU4GhiACAAIyFGgYZM0Uq1UjDIw0BJxQZCxQZDkUiAgQZMTIWCDgMzmSHCDJBgD0AFC0AZCkRRBAAI0CNAoZHiGIBIYZTgGIGAYZP1S0CDIJ9BJprLEDIjoCQJg2HDIi1PNQsoxGDdKBLCDIUIDJBmHDI8CJwgyEDJBODAoQQBGgoHBJg4ZHJwI1EAoQYIDIw0CAAwZJZwY0GDBoZCQAIaJkAZSDQgXKNAYZGACJmEACkKDOQA/AH4A/AEQ";
//ew.UI.icon.ToF="oFAwhC/AH4A/AH4AN0Af9hWqD/4ffQDuqD/4ABAwcIxAABwB+UD4gdCECofFDwogTD4egLgYgWD4geIAAKeS1WoC4WDmYABICYfGDwYgED6eqCwIeEEAgfUHwoABnBAPTwYfCDwxADD6GiAQOjD5RgND4UID4sq1UjMAp+PD4WiDAM6BIQgCD5B2D0AfFHIOikUiB4ZGCD46XFD4eghGKBYgACIwSgHD5eCD7IGCD4OID7GgD7CfED4kAD4KdBT6AiGD4uIG4TfPIQ4fEwYgCcoIeCD5jDHD4oAFBYIfO0AfDMAYfHTwofLMAwADLwQfJQAgfFIA5eLD5BgDIAoICHxRgEA4ZADEAYGCD6hADAA4eKD5JADAAo+LQAZ+DIBQeND5IgGDxxgCD45iEDx4fLACgfBDziACD/0KD7wA/AH4A/AH4A/ACwA=";

// install icon
if (!require('Storage').read("ew_i_ToF.img"))   {
  let icon="oFAwhC/AH4A/AH4AN0Af9hWqD/4ffQDuqD/4ABAwcIxAABwB+UD4gdCECofFDwogTD4egLgYgWD4geIAAKeS1WoC4WDmYABICYfGDwYgED6eqCwIeEEAgfUHwoABnBAPTwYfCDwxADD6GiAQOjD5RgND4UID4sq1UjMAp+PD4WiDAM6BIQgCD5B2D0AfFHIOikUiB4ZGCD46XFD4eghGKBYgACIwSgHD5eCD7IGCD4OID7GgD7CfED4kAD4KdBT6AiGD4uIG4TfPIQ4fEwYgCcoIeCD5jDHD4oAFBYIfO0AfDMAYfHTwofLMAwADLwQfJQAgfFIA5eLD5BgDIAoICHxRgEA4ZADEAYGCD6hADAA4eKD5JADAAo+LQAZ+DIBQeND5IgGDxxgCD45iEDx4fLACgfBDziACD/0KD7wA/AH4A/AH4A/ACwA=";
  require('Storage').write("ew_i_ToF.img", require("heatshrink").decompress(atob(icon)));
}