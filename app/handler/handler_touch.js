var i2c = new I2C();
i2c.setup({ scl: ew.pin.i2c.SCL, sda: ew.pin.i2c.SDA, bitrate: 100000 });

if (process.env.BOARD === "BANGLEJS2") 
	eval(require('Storage').read('ew_handler_touch_b2'));
else {
	if (ew.def.dev.touchtype != "816" && ew.def.dev.touchtype != "716") {
		digitalPulse(ew.pin.touch.RST, 1, [5, 500]);
		i2c.writeTo(0x15, 0x80);
		ew.def.dev.touchtype = (i2c.readFrom(0x15, 1)[0] == 96) ? "816" : "716";
	}
	if (ew.def.dev.touchtype == "816") //816
		eval(require('Storage').read('ew_handler_touch_816'));
	else
		eval(require('Storage').read('ew_handler_touch_716'));
}

