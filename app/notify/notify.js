ew.apps.notify = {
	log: {

	},
	state: {
		info:0,
		error:0,
		run:0,
		def: {
            page:1,
            btmL:20,
            topL:50,
            log:ew.notify.log
		},

	},
}
/*
ew.apps.notify.log.info = (require('Storage').read('ew_log_info.log')) | [];
ew.apps.notify.log.error = (require('Storage').read('ew_log_error.log')) | [];


// Load saved settings
if ((require('Storage').readJSON('ew.json', 1) || {}).notify) {
    ew.apps.notify.state.def = require('Storage').readJSON('ew.json', 1).notify;
}
*/
// install icon
if (!require('Storage').read("ew_i_notify.img")) {
    let icon="l0uwhC/AG0P/4AN+AWFBAMzABYOBFgvzkMRABcSn4uE//xkQANj/zCwkxIZgABiYWFkIWOiRcEC34WHn7MK+Zb/OX5b/LZBWBW/4W3iYWW+YWIkQAJkMvCxEyiQWJkf/+AWHkLQGAAoVDCwcyMoIAKmAWHFgJOEABgWBFgQhFCxsRn/yCqAWCFgMgCyf/FiQWBAAIsSgEPFigABgQVUAH4AZ";
    //let icon="mEwwhC/AFWIAAQVVDKUIC44YOC4UzAAM4C4WAC5kzwYWCAAQYOgYVFDAoWJh//C5AYCGBP///zC5BjCC5QwMRY+DC4QwLJAwgBC4QwSxAvDGBQXGaQOPCgLuIEgJIHC4M///4C6hECC5ZIBC4peEMJYXFOwqSLPAp2CGBxgBC5AqJC5iPMC8RHGCAJHOABB3LU5CSHC4rXIGBDvGxAmCOQk/GAwXHB4KPFNAgXKB4IvJGAReBC4iQNGAR2FC6A7CC6hrBIwoXPIw6PDIya/DABQWBIwwXNIoIuGLwODHYZLGCwQuGC4QMCC4rpBCxIXBAAkAUAYIEC5YgJCxB3CQBAVKAH4AfA==";
    require('Storage').write("ew_i_notify.img", require("heatshrink").decompress(atob(icon)));
}


