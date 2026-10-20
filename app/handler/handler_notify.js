// notifications
ew.notify = {

};

ew.apps.notify = {
	state:{
		info:0,
		error:0,
		run:0,
        page:1,
        btmL:20,
        topL:50,		
		def:{
		    page:1,
            btmL:20,
            topL:50,
			alrt:1,
			log:[],
		}
	}
};

// --- defaults ---
ew.apps.notify.state.def = Object.assign(
	ew.apps.notify.state.def,
	(require("Storage").readJSON("ew.json", true) || {}).notify || {}
);


//notify
ew.notify.alert = function(type, event, alert, persist) {
	
	ew.apps.notify.state[type]++;
	ew.apps.notify.state.run++;

	
	const now = (Date.now() / 1000) | 0;
	//const log=this.log[type];
	let log=ew.apps.notify.state.def.log;
	
	// log event
	// update entry if exists, do not duplicate.
	if (event.id && log.some(item => item.id === event.id)) {
		const index=log.findIndex(item => item.id === event.id);
		event = log.splice(index, 1)[0];
		event.rpt = (event.rpt || 0) + 1;
	} 
	event.time = now;
	event.type= type;
	log.unshift(event);
		
	// keep  50 records
	if (50 <= log.length) log.pop();

	if(!ew.face) return;

	// buzz
	if (alert && ew.apps.notify.state.def.alrt) 
		ew.sys.buzz.sys(ew.sys.buzz.type[type]);

	// turn on screen
	if (ew.apps.notify.state.def.scrn && !g.isOn) {
		ew.face.go(ew.face.appCurr, 0);
	}

	// display message
	ew.UI.btn.ntfy(1, persist ? 30 : 4, 0, "_bar", 6, event.title.toUpperCase() || "", event.body.toUpperCase() || "", (type === "error") ? 15 : 0, (type === "error") ? 13 : 15, true, 0, 0);
	//ew.UI.btn.ntfy(1, persist ? 20 : 4, 0, "_bar", 6, event.title.toUpperCase() || "", event.body.toUpperCase() || "", (type === "error") ? 15 : 0, (type === "error") ? 13 : 15, 0, 0, (type === "error") ? 1 : 0);
	ew.UI.c.bar._ntfy = () => {
		ew.is.bar = 0;
		ew.sys.buzz.nav(ew.sys.buzz.type.na);
		if (ew.UI.ntid) {clearTimeout(ew.UI.ntid); ew.UI.ntid=0;}
		if (ew.apps.notify) ew.face.go(event.src, 0, "jump");
	};
};


//global.msg=[];
//global.typ=[];
if (process.env.BOARD === "BANGLEJS2") {
	ew.sys.msg = Bangle.on("message", (type, message) => {
		//global.msg.unshift(message);
		//global.typ.unshift(type);
		//ew.UI.btn.ntfy(1, 15, 0, "_bar", 6,"MESSAGE",  "GB", 0, 15,0,0);
	message.handled = true;
		//if (message.handled) return; // another app already handled this message
		// <type> is one of "text", "call", "alarm", "map", or "music"
		// see `messages/lib.js` for possible <message> formats
		// message.t could be "add", "modify" or "remove"
		if (type==="text" && message){ 
			ew.notify.alert("info", { "src": "notify", "title": message.title, "body":  message.body }, 1);
			//ew.UI.btn.ntfy(1, 15, 0, "_bar", 6, message.title.toUpperCase(),  message.body.toUpperCase(), 0, 15,0,0,1,0);
			//E.showMessage(`${message.title}\n${message.body}`, `${message.t} ${type} message`);
			// You can prevent the default `message` app from loading by setting `message.handled = true`:
			message.handled = true;
		}
	});

}


// install icon
if (!require('Storage').read("ew_i_notify.img")) {
    let icon="l0uwhC/AG0P/4AN+AWFBAMzABYOBFgvzkMRABcSn4uE//xkQANj/zCwkxIZgABiYWFkIWOiRcEC34WHn7MK+Zb/OX5b/LZBWBW/4W3iYWW+YWIkQAJkMvCxEyiQWJkf/+AWHkLQGAAoVDCwcyMoIAKmAWHFgJOEABgWBFgQhFCxsRn/yCqAWCFgMgCyf/FiQWBAAIsSgEPFigABgQVUAH4AZ";
    //let icon="mEwwhC/AFWIAAQVVDKUIC44YOC4UzAAM4C4WAC5kzwYWCAAQYOgYVFDAoWJh//C5AYCGBP///zC5BjCC5QwMRY+DC4QwLJAwgBC4QwSxAvDGBQXGaQOPCgLuIEgJIHC4M///4C6hECC5ZIBC4peEMJYXFOwqSLPAp2CGBxgBC5AqJC5iPMC8RHGCAJHOABB3LU5CSHC4rXIGBDvGxAmCOQk/GAwXHB4KPFNAgXKB4IvJGAReBC4iQNGAR2FC6A7CC6hrBIwoXPIw6PDIya/DABQWBIwwXNIoIuGLwODHYZLGCwQuGC4QMCC4rpBCxIXBAAkAUAYIEC5YgJCxB3CQBAVKAH4AfA==";
    require('Storage').write("ew_i_notify.img", require("heatshrink").decompress(atob(icon)));
}
