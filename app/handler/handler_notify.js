// notifications
ew.notify = {
	new: 0,
	is: { info: 0, error: 0 },
	log: {},
	do: {}
};
ew.apps.notify = {
	state: {
		info:0,
		error:0,
		run:0,
		def: {


		},
		log: {


		}
	},
	alert(type, event, alert, persist) {
		this.state[type]++;
		this.state.run++;
		const now=(Date.now()/1000)|0;
		
		// keep  25 records
		if (!event.time) {
			event.time = now
			this.log[type].unshift(event);
		}
		if (26 <= this.log[type].length) this.log[type].pop();

		// buzz
		if (alert) {
			if (type === "error")
				ew.sys.buzz.sys(ew.sys.buzz.type.error);
			else ew.sys.buzz.nav([80, 50, 80]);
		}
		
		// turn on screen
		if (ew.def.face.scrn && !g.isOn) {
			ew.face.go(ew.face.appCurr, 0);
		}else ew.face.off();
		
		// display message
		ew.UI.btn.ntfy(1, persist ? 20 : 4, 0, "_bar", 6, event.title.toUpperCase() || "", event.body.toUpperCase() || "", (type === "error") ? 15 : 0, (type === "error") ? 13 : 15, 0, 0, (type === "error") ? 1 : 0);

	}
}

ew.notify.log.info = (require('Storage').read('ew_log_info.log')) ? require('Storage').readJSON('ew_log_info.log') : [];
ew.notify.log.error = (require('Storage').read('ew_log_error.log')) ? require('Storage').readJSON('ew_log_error.log') : [];

//notify
ew.notify.alert = function(type, event, alert, persist) {
	this.is[type]++;
	this.new++;
	let d = (Date()).toString().split(' ');
	let ti = ("" + d[4] + " " + d[0] + " " + d[2]);
	// ---- do not log stored notifications ----
	if (!event.time) {
		event.time = ti;
		this.log[type].unshift(event);
	}
	if (26 <= this.log[type].length) this.log[type].pop();
	if (ew.def.face.scrn || g.isOn) {
		//ew.face.off(8000);
		if (ew.face[0].bar) {
			if (!g.isOn && (ew.face.appCurr != ew.def.face.main || ew.face.pageCurr != 0)) ew.face.go(ew.def.face.main, 0);
			ew.UI.btn.ntfy(1, persist ? 20 : 4, 0, "_bar", 6, event.title.toUpperCase() || "", event.body.toUpperCase() || "", (type === "error") ? 15 : 0, (type === "error") ? 13 : 15, 0, 0, (type === "error") ? 1 : 0);
			g.flip();
		}
		if (alert) {
			if (type === "error")
				ew.sys.buzz.sys(ew.sys.buzz.type.error);
			else ew.sys.buzz.nav([80, 50, 80]);

		}
	}
};


/*if (process.env.BOARD === "BANGLEJS2") {
	ew.sys.msg = Bangle.on("message", (type, message) => {
		//if (message.handled) return; // another app already handled this message
		// <type> is one of "text", "call", "alarm", "map", or "music"
		// see `messages/lib.js` for possible <message> formats
		// message.t could be "add", "modify" or "remove"
		if (message && message.title && message.body){ ew.UI.btn.ntfy(1, 15, 0, "_bar", 6, message.title.toUpperCase(),  message.body.toUpperCase(), 0, 15,0,0,1,0);g.flip();
		//E.showMessage(`${message.title}\n${message.body}`, `${message.t} ${type} message`);
		// You can prevent the default `message` app from loading by setting `message.handled = true`:
		message.handled = true;
		}
	});

}
*/
