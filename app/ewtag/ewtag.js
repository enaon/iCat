ew.apps.ewtag = {
	tid: { siren: 0 },
	state: {
		beep: false,
		cnt: 0,
		iPay: null,
		gPay: null,
		addr: null,
		def: {
			ver: 0,
			alrm: 1,
			eTag: 1,
			iTag: 0,
			iKey: null,
			gTag: 0,
			gKey: null,
		}
	},
	init: function() {
		this.iTag();
		this.gTag();
	},
	iTag: function() {

		function base64ToBytes(base64) {
			let binaryString = atob(base64);
			let len = binaryString.length;
			let bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			return bytes;
		}

		function startAppleFindMy() {
			if (!ew.apps.ewtag.state.def.iKey) { 				
				ew.apps.ewtag.state.def.iTag=0;
				return;
			}
			let public_key = base64ToBytes(ew.apps.ewtag.state.def.iKey);

			if (public_key.length !== 28) {
				ew.apps.ewtag.state.def.iTag=0;
				return;
			}
			let ble_mac = [];
			ble_mac.push(public_key[0] | 0xC0); // Make sure addr is Private Random(add '11')
			for (let i = 1; i < 6; i++) {
				ble_mac.push(public_key[i]);
			}

			//  ble_mac to Hex String 
			let hexParts = [];
			for (let i = 0; i < ble_mac.length; i++) {
				let hex = ble_mac[i].toString(16);
				if (hex.length < 2) hex = '0' + hex;
				hexParts.push(hex);
			}
			ew.apps.ewtag.state.addr = hexParts.join(':') + " random";

			// 2. Calculate Hint Bite from KEY's 1st byte
			let hintByte = public_key[0] >> 6;

			// 3. Use last 22 bytes from KEY 
			let advKeyBytes = public_key.slice(public_key.length - 22);

			// 4. construct RAW packet (31 bytes)
			let payload = [
				0x1E, // length
				0xFF, // Manufacturer Data
				0x4C, 0x00, // Apple ID
				0x12, // Find My Type
				0x19, // Μήκος δεδομένων
				0x00 // State placeholder — updt() writes here (ver<<6)|battery
			];

			// add last 22 bytes from key 
			for (let i = 0; i < advKeyBytes.length; i++) {
				payload.push(advKeyBytes[i]);
			}

			payload.push(hintByte); // Hint Byte 
			payload.push(0x00); // Battery  Status local status

			ew.apps.ewtag.state.iPay = payload;

		}
		startAppleFindMy();

	},
	gTag: function() {
		if (!ew.apps.ewtag.state.def.gKey) { 				
			ew.apps.ewtag.state.def.gTag=0;
			return;
		}
		//  Hex to Byte Array
		function hexToBytes(hex) {
			let bytes = new Uint8Array(hex.length / 2);
			for (let i = 0; i < hex.length; i += 2) {
				bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
			}
			return bytes;
		}

		function startGoogleFindMy() {
			let eidBytes = hexToBytes(ew.apps.ewtag.state.def.gKey);

			if (eidBytes.length !== 20) {
				ew.apps.ewtag.state.def.gTag=0;
				return;
			}
			// Google FMDN NO FLAGS (save 3 bytes for manufactured data)
			let payload = [
				0x18, // length of Google part (24 bytes: 1 byte type + 2 bytes UUID + 1 byte Frame Type + 20 bytes EID)
				0x16, // type: Service Data
				0xAA, 0xFE, // Google's 16-bit Service UUID (0xFEAA)
				0x40 // 0x40 = This is the Anti-Tracking Privacy Mode, 0x41 makes the tag not cause an alert.
			];

			// add 20 bytes EID
			for (let i = 0; i < eidBytes.length; i++) {
				payload.push(eidBytes[i]);
			}

			// --- ΜANUFACTURER DATA (4 BYTES) --- This part is not trully needed, it is here only for the scanner to tell this is a custom google tag.
			//  25 bytes + 4 bytes = 29 bytes 
			payload.push(0x03); // length (3 bytes)
			payload.push(0xFF); // Manufacturer Specific Data
			payload.push(0xCC); // 1ο byte of Company ID
			payload.push(0xAA); // 2ο byte of Company ID

			ew.apps.ewtag.state.gPay = payload;

		}
		startGoogleFindMy();

	},
	updt: function() {
		var v = ew.sys.batt(); // volts (float)
		var raw = Math.round((v - 3.0) / 1.2 * 63); // 3.0-4.2V -> 0..63 (6 bits)
		var batt = raw < 0 ? 0 : (raw > 63 ? 63 : raw);
		var ver = ew.apps.ewtag.state.def.ver || 0; // collar version (0-1)
		// bit7 = version · bit6 = batteryValid(=1) · bit5-0 = battery
		if (ew.apps.ewtag.state.iPay) {
			ew.apps.ewtag.state.iPay[6] = ((ver & 1) << 7) | (1 << 6) | batt;
		}
		
	},
	sound: {
		bell: function() {
			ew.sys.sound.bell();
			return "Bell";
		},
		siren: function() {
			ew.sys.sound.siren();
			return "Siren";

		},
	}

};

// --- defaults ---
ew.apps.ewtag.state.def = Object.assign(
	ew.apps.ewtag.state.def,
	(require("Storage").readJSON("ew.json", true) || {}).ewtag || {}
);

// --- BT ---
NRF.on('disconnect', function() {
	if (ew.apps.ewtag.state.def.alrm && ew.apps.ewtag.state.beep) {
		ew.apps.ewtag.state.beep=false;
		ew.apps.ewtag.sound.bell();
	}

});

NRF.on('connect', function(addr) {
	/*if (ew.tid.advR) {
		clearInterval(ew.tid.advR);
		ew.tid.advR = false;
	}
	*/
    let allow=["cf:9f:9d:ec:0d:95","d5:ba:32:2a:cb:80","ca:6b:b3:41:cd:81","e5:b5:93:26:49:41","dc:00:d5:c8:32:ef"];
	let mac=addr.split(' ')[0];
	if (allow.includes(mac) && ew.apps.ewtag.state.def.alrm) {
	 	ew.apps.ewtag.state.beep=true;
		ew.apps.ewtag.sound.bell();
		ew.notify.alert("info", { "src": "eWtag", "title": "conn", "body": mac }, 1); 

	}else {
		ew.apps.ewtag.state.cnt++;

	}
});

// --- update aple network battery ---
/*ew.sys.on('hour', function(x) {
	if (x === 23 && ew.apps.ewtag.state.def.iTag)
		ew.apps.ewtag.updt();
		ew.comm.updt();
});
*/
// --- init ---
ew.apps.ewtag.init();

// install icon
/*if (!require('Storage').read("ew_i_ewtag.img")) {
	let icon="m02whC/AH4AShGIAAOADKgYCAAYZZDaQZIDaBnDAA5vODJQ2OGhY2ODJg2MGho2MDTQZOKJYQJDR5PGIwYKKDRQOFBZYajO5YajSpiiNFBhCMDRo1NQ2ry7KIoKFDRAPGDYYJJDRoAJDRJRGABBPJDTZRPDJQ2OGhY2ODJg2MGhoabKJYZOGxQ0PGxQZQGxA0RGxAZSGww0TGwwZUGwg0VDTZRDDKw2CGi42CDLAA/AAgA==";
    //let icon="mEwwhC/AFMIxAACwEAhnM5nACxYVDAAWECwIYMCw2IpgXD5gWIgYuLGBMDnAXGlgXNmZGKn/zJBAuIC4XD///ngXHmYXBDIwRB54XB/gXIxGDF4wXMIwRIHI5hcHO54XKU5cIC5TXGoAXPJAYAB4mAC6AwEpAXRGAfExAXECxgwDpAFBC6IwBFwIXUwguCC6YAEC/4Xja5oAEd6QX5PCQWEC7BIQIwowRCwwXYJBxGHGB4WIGBouJDBgWLJJYWMDBIWOJQxENAH4AbA=";
    require('Storage').write("ew_i_ewtag.img", require("heatshrink").decompress(atob(icon)));
}
*/