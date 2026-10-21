var bw = require("ew_m_btHwr");
bw.setup({
  advertise: [
    { type: "battery", interval: 300000, get: function () { return ew.sys.batt(1); } },
    {
      type: "light",
      get: function () { return ew.apps.lamp.state.isOn; },
      set: function (v) {
        if (v) ew.apps.lamp.on();
        else  ew.apps.lamp.off();
      },
    },
   {
      type: "light",
      get: function () { return ew.apps.lamp.state.def.pir.en; },
      set: function (v) {
        ew.apps.lamp.auto(v?"1":"0");
      },
    },    
    {
      type: "count",
      get: function () { return ew.apps.lamp.getBri() *255 ; },
      set: function (v) {
        ew.apps.lamp.fadeTo(v/255)
      },
    },
  ],
  interval: 1000,
  maxServiceData: 20,
  showName: false,
  counterReport: true,
  bindkey: "d21c19c1d7cc1ab1bbe224cd096db833",
  onError: function (error) {
    console.log("write rejected:", error.code, error.message);
  },
});