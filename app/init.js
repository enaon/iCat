E.setFlags({ pretokenise: 1 });
E.setFlags({ onErrorSave: true });
//0x20000000+0x10000-process.memory().stackEndAddress

global.save = function() { throw new Error("save() is not used on eucWatch"); };

// ---- ew setup ----

global.ew = { "sys": {}, "apps": {}, "dbg": 0, "logger": {}, "notify": {}, "log": [], "def": {}, "is": {}, "comm": {}, "tid": {}, "pin": {} };

if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "ROCK") {
  ew.pin = { BAT: D30, BTN2: D46, CHRG: D8, BUZZ: D6, BUZ0: 0, BL: D12, i2c: { SCL: D14, SDA: D15 }, touch: { SCL: D14, SDA: D15, RST: D39, INT: D32, SLP: 0xA5 }, disp: { CS: D3, DC: D47, RST: D2, BL: D12 }, acc: { SCL: D14, SDA: D15, INT: D16 } };
  E.showMessage = console.log; //apploader suport
  D7.write(1); // turns off sp02 red led
  ew.is.maxTx = 8;
}

else if (process.env.BOARD == "DSD6") {
  ew.pin = { BAT: D3, CHRG: D2, BUZZ: D25, BUZ0: 1, BL: D12, i2c: { SCL: D13, SDA: D14 }, touch: { RST: D13, INT: D28 }, disp: { SPI: D5, MOSI: D6, CS: D29, DC: D28, RST: D04, BL: D14 }, acc: { INT: D8 }, serial: { rx: D22, tx: D23 } };
  E.showMessage = print; //apploader suport
  D26.reset();
  ew.is.maxTx = 4;
}

else if (process.env.BOARD == "BANGLEJS2") {
  ew.pin = { BAT: D3, CHRG: D23, BUZZ: D19, BUZ0: 1, BL: D8, i2c: { SCL: D34, SDA: D33 }, touch: { SCL: D34, SDA: D33, RST: D35, INT: D36, SLP: 0xE5 }, disp: { CS: D5, DC: D6, RST: D7, BL: D8 }, acc: { SDA: D37, SLC: D38, INT: D39 } };
  Bangle.setOptions({ wakeOnTouch: 0, lockTimeout: 0, backlightTimeout: 0, wakeOnBTN1: 0, wakeOnTwist: 0, wakeOnFaceUp: 0, powerSave: 1, btnLoadTimeout: 5000 });
  Bangle.setLocked(0);
  ew.is.maxTx = 8; //disable VCC output
}

else if (process.env.BOARD == "NANO") {
  ew.pin = { BUZZ: D13, BUZ0: 1, BL: D15, i2c: { SCL: D9, SDA: D10 }, serial: { rx: D22, tx: D23 } };
  //ew.pin = { BAT: D3, CHRG: D23, BUZZ: D19, BUZ0: 1, BL: D8, i2c: { SCL: D34, SDA: D33 }, touch: { SCL: D34, SDA: D33, RST: D35, INT: D36 ,SLP: 0xE5}, disp: { CS: D5, DC: D6, RST: D7, BL: D8 }, acc: { SDA: D37, SLC: D38, INT: D39 } };
  E.showMessage = print; //apploader suport
  D13.reset(); //turn off VCC output
  BTN1 = { read: function() { return false } } //fake Btn
  //pinMode(D39, "input_pullup");
  ew.is.maxTx = 8;
  g = Graphics.createArrayBuffer(8, 8, 8);
  g.flip = function() { return; }
}

else {
  ew.pin = { BAT: D31, CHRG: D19, BUZZ: D16, BUZ0: 1, BL: D12, i2c: { SCL: D7, SDA: D6 }, touch: { RST: D13, INT: D28 }, disp: { CS: D25, DC: D18, RST: D26, BL: D14 }, acc: { INT: D8 } };
  E.showMessage = print; //apploader suport
  ew.is.maxTx = 4;
}

// ---- watchDog ----
let noWd=(require("Storage").readJSON("ew.json", 1) && require("Storage").readJSON("ew.json", 1).sys) && require("Storage").readJSON("ew.json", 1).sys.noWd? require("Storage").readJSON("ew.json", 1).sys.noWd : 0

if (!noWd && process.env.BOARD != "NANO") {
  E.kickWatchdog();
  ew.sys.kickWD = function() {
    "ram";
    if ((typeof(BTN1) == 'undefined') || (!BTN1.read())) E.kickWatchdog();
  };
  ew.tid.WD = setInterval(ew.sys.kickWD, 2000);
  E.enableWatchdog(process.env.BOARD == "DSD6" ? 5 : 10, false);
}

// === devmode ===


if ((BTN1.read() || require("Storage").read("devmode")) && process.env.BOARD != "BANGLEJS2") {

  var exitDev = function() {
    require("Storage").erase("devmode");
    require("Storage").erase("devmode.info");
    NRF.setServices({}, { uart: false });
    NRF.setServices({}, { uart: true });
    NRF.disconnect();
    NRF.wake();
    setTimeout(() => {
      reset();
    }, 500);
  };

  //if ((BTN1.read() || require("Storage").read("devmode")) && process.env.BOARD != "BANGLEJS2") {
  let mode = (require("Storage").read("devmode"));
  if (mode == "loader") {
    digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0, 80);
  }
  else if (mode == "shutdown") {
    digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0, 300);
    NRF.sleep();
  }
  else {
    require("Storage").write("devmode", "done");
    NRF.setAdvertising({}, { name: "eW-" + process.env.SERIAL.substring(14) + "-dev", connectable: true });
    digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0, [80, 50, 80, 50, 80]);
    print("Welcome!\n*** DevMode ***\nShort press the side button\nto restart in WorkingMode");

    var timeout = setTimeout(exitDev, 30000);
    NRF.on('connect', function() { clearTimeout(timeout) });

  }

  setWatch(exitDev, BTN1, { repeat: false, edge: "rising" });



  if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "ROCK") {
    // ---- put touch/acc to sleep ----
    setTimeout(() => {
      var i2c = new I2C();
      i2c.setup({ scl: ew.pin.i2c.SCL, sda: ew.pin.i2c.SDA, bitrate: 100000 });

      // ---- acc sleep ----
      i2c.writeTo(0x18, 0x20, 0x07); //Clear LPen-Enable all axes-Power down
      i2c.writeTo(0x18, 0x26);
      i2c.readFrom(0x18, 1); // Read REFERENCE-Reset filter block 
      // ---- touch sleep ----
      digitalPulse(ew.pin.touch.RST, 1, [5, 50]);
      setTimeout(() => { i2c.writeTo(0x15, ew.pin.touch.SLP, 3); }, 100);
    }, 1000);
  }

}

// === working mode ===

else {

  // ---- screen driver  ----
  if (process.env.BOARD === "BANGLEJS2" && require('Storage').read('ew_display_b2')) global.g = require('ew_display_b2').g;
  else if ((process.env.BOARD == "MAGIC3" || process.env.BOARD == "ROCK") && require('Storage').read('ew_display')) global.g = require('ew_display').g;
  else if (process.env.BOARD == "DSD6" && require('Storage').read('ew_display_dsd6')) global.g = require('ew_display_dsd6').g;
  // ---- handler ----
  if (require('Storage').read('ew_handler')) eval(require('Storage').read('ew_handler'));

  // ---- clock ----
  if (process.env.BOARD != "NANO" && require('Storage').read('ew_clock')) eval(require('Storage').read('ew_clock'));

  // ---- apps ----
  require("Storage").list(/^ew_a/).forEach(appKey => {
    eval(require('Storage').read(appKey));
  });

  if (require('Storage').read('ew_logger_kitty')) ew.logger.kitty = require("ew_logger_kitty");


  // ---- start ----

  if (process.env.BOARD == "MAGIC3" || process.env.BOARD == "ROCK" || process.env.BOARD == "BANGLEJS2") {
    digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0, [100, 30, 100]);
    setTimeout(function() {
      ew.face.go('main', 0);
      setTimeout(function() {
        if (ew.def.dev.tilt===undefined)ew.def.dev.tilt=0;
        if (ew.def.dev.tap===undefined)ew.def.dev.tap=0;
        ew.sys.acc.updt(ew.def.dev.tilt+ew.def.dev.tap);
      }, 1000);
      digitalPulse(ew.pin.BUZZ, ew.pin.BUZ0, 100);
    }, 400);
  }
}
