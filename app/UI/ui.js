// === font support ===

const font = E.toString(require('heatshrink').decompress(atob("ABH/5k/+YVRh/AgfwBBoAEhgNBmEP//D//wBBgaEnkwj+Oh1x4cMmH//k//4FB4eOuFx/EMngaE+Ewnkch8OgfHgEDwEB4EA8fAuHwnE8hkPGovwj/+h154eemF/5kPn8Ag4fB8EA/kAmZwJFwNwgH4EoK4TE4N/wE4uEch0OgPDgCCFUpEA4eAuFwnEOjkB/0AKgIAImEwCIXOLoShDgHMgFzHwUMFYIADgZpDIgIMBn/wh5XBBAYREHZUAjkAn0AWYoANFhAIDACQdEGJxLBhzrBC4LtBGoLvBcAM4HI8P4EH/EDw4VB8Hgjk4g8HD4Ph4Ef8ED+A4IJAPA4EwXghuEJ5E8jkfh0O4cHmHDxgCBhgCBzkwv0Mh50FFwLzBhkB4YiBC4cM+HDv1w/P4nk8JgvAgJZB9kAuZ9B4AbBh//4f/BoJUH/kwn41B4PDHYPMhkzgcM4HDnFw4/4mH8UIvwg/+gex4PMmHjKAYCBh1wgP4gBQFHoZ3BQwJlBwExKQK3Ba4IZHAwPwj/+h15QYgCEz1wv/4h4bFAoMfwBEBC4vHNwODxvAv/gMgLbIAAkMhkDZwoAON4Mchk+gcPChopBgPgYILXBwC1BjkOhz7DI5PAgYMB5kAmYIODxEAXINwuE4h0cgPOgE/gEHwDRCMo0AhxWCDoPMmPza4ScBvAqCAAk/a4ZiD5/MmYaB5nD2cwv/AXg0P/kH/8DxgbC8HAnEwg4vB8bnB/kD/4aE//8n//d4gCGz1wv/4h88KBvAC4MDR4z9BGpIRBDRQ1Cc4JQTAQIjDDRQvDHA7UBeIxrNhnDwcwuH8hj3BGo4mCFgJECF4YIBCIgAHJoiPICxAKCh0AgIvFHAlw//4n6hJC4UegEP4EHnEDw4kB8HgjihKMo5uIDRIJC8EAj8Ag/AgeADYSGIBAgPBnAYBD4ccGAQaIa5qhBwFwv/4h6GJCgodFzkAvyRBXYo1J5kwn8Mg+DwPgv/8h/zGp3AmH4hk3GoPgv0ch6hFnkwj+Oh1x4YdBAQ2OuFxEIM8DQjIIHwjaHKAvwn/+gEBeRVw//4n6hFAoM/c4N8SgIEDeoM+AYQpBn41NuEA/AYCBAY1I+E8n0fgPOFAUHwEB8BDCueA/F8njYF+ArFnAaB/kB/8ADgI9DUAp3BXoUMh3Dg62BxkxXgPg4dwboU8a4oADh//4ZyB4D4FVQIIDCwi0BhxQGBYJOBjjABVQJTBEQJQEFhY+EJhAWBFwIpBG4QyBHJIbIBIQZBLAIINABbFGDIIAJBYMegHP4EzmEM5kDmcA5nAncwcAMAcAIAD//8n4IB4HAmAaBhkDI4IIBnFwg7zBDgIADgfwgP+gHhDRIIGDSpHEDRHtNZiLBbZKwEn/8j//hz+DABBQF5kwmZQB4cDmHABAM3h//wf/HAKhIeJM4gC8IAAh9D5/8mYRCeZoADGQMH5//2ZHFABhdB4f/SgIXBvCLBgEc8EOjjXGGYvDI4LOFKBcP/kDQwZ9DgIIB8CGLDQyhTa4qhCa4JiCVQM4uEH/EADgKCIXgYaRGp4IBV4oAHaAM/+AXBgJpBQwJ0GGokMgPjIAPAmY1B5kDmcA5gIB+EMvATBeZKhDIgM/LIPBKATXJJIIRBJQS9INYLODDQgQBMAMfAgccaIINBwEH4ADBgYgBGpdwgCzBnwIEh/4ga8FWYWHgFzwEP4EBG4N4gE/HYPgh0cYoQ1J5kAToMM4EDOAIIBm7XBwbMBGowjB4fAmKzB9kDuZUB4E8fYoAIFoMeJYPwj8+h0B4YLB4EMmAaKAAf8/k/NIIAMEYbRB4eAuF8/DQBRAQLBJZTPBhzWBwC9CAwLEEnAeH/5HB/6TB4f/+AIMLJoARA=")));
Graphics.prototype.setFontTeletext10x18Ascii = function() {
	g.setFontCustom(font, 33, 12, 18);
};

const font1 = atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/nA/+cD/5wP/nAAAAAAAAPwAA/gAD+AAPwAAAAAD+AAP4AA/gAAAAAAAAAAAAAcOAP//A//8D//wP//AHDgAcOAP//A//8D//wP//AHDgAAAAAAAAH/jgf+OB/44H/jj8OP/w4//Dj/8OPxw/4HD/gcP+Bw/4AAAAAAAP+AA/8AD/wQOHHA4c8D//wP/8A//gAD4AAfAAH/8A//wP//A84cDjhwIP/AA/8AB/wAAAAAAAD//wP//A//8D//wOHHA4ccDhxwOHHA4f8Dh/wOH/A4f8ABwAAAAAAAAD8AAP4AA/gAD8AAAAAAAAAAAEAAD+AB//A///v/D//gB/wABwAAAAAADgAA/wAf/4P8///wf/4AP8AAOAAAAAAAAAyAAHcAAPwAD/gAP/AA/8AA/AAH8AAMwAAAAAAAAAAAAADgAAOAAA4AAf8AD/wAP/AA/8AAOAAA4AADgAAAAAAAAAAD8AAfwAB/AAD8AAAAAAAADgAAOAAA4AADgAAOAAA4AADgAAAAAAAAAADgAAOAAA4AADgAAAAAAAAABwAB/AA/8A//gP/gA/wADwAAIAAAAAAD//wP//A//8D//wOAHA4AcDgBwOAHA//8D//wP//A//8AAAAAAAA4AcDgBwOAHA//8D//wP//A//8AABwAAHAAAcAAAAAAAA+f8D5/wPn/A+f8DhxwOHHA4ccDhxwP/HA/8cD/xwP/HAAAAAAAAOAHA4AcDhxwOHHA4ccDhxwOHHA4ccD//wP//A//8D//wAAAAAAAD/wAP/AA/8AD/wAAHAAAcAABwAAHAA//8D//wP//A//8AAAAAAAA/98D/3wP/fA/98DhxwOHHA4ccDhxwOH/A4f8Dh/wOH/AAAAAAAAP//A//8D//wP//A4ccDhxwOHHA4ccDh/wOH/A4f8Dh/wAAAAAAAD4AAPgAA+AADgAAOAAA4AADgAAP//A//8D//wP//AAAAAAAAP//A//8D//wP//A4ccDhxwOHHA4ccD//wP//A//8D//wAAAAAAAD/xwP/HA/8cD/xwOHHA4ccDhxwOHHA//8D//wP//A//8AAAAAAAAOA4A4DgDgOAOA4AAAAAAAAOA/A4H8DgfwOA/AAAAAAAAB4AAPwAA/AAD8AAf4ABzgAPPAA8cAHh4AAAAAAAAAAAAHHAAccABxwAHHAAccABxwAHHAAccABxwAHHAAAAAAAAAOHAA4cADzwAPPAAf4AB/gAD8AAPwAAeAAB4AAAAAAAAA+AAD4AAPgAA+ecDh9wOH3A4fcDhwAP/AA/8AD/wAP/AAAAAAAAAP//4///j//+P//44ADjn/OOf845/zjnHOP8c4//zj//OP/84AAAAAAAP//A//8D//wP//A4cADhwAOHAA4cAD//wP//A//8D//wAAAAAAAD//wP//A//8D//wOHHA4ccDhxwOHHA//8D//wP9/A/j8AAAAAAAA//8D//wP//A//8DgBwOAHA4AcDgBwOAHA4AcDgBwOAHAAAAAAAAP//A//8D//wP//A4AcDgBwOAHA8A8D//wH/+AP/wAf+AAAAAAAAD//wP//A//8D//wOHHA4ccDhxwOHHA4ccDhxwOAHA4AcAAAAAAAA//8D//wP//A//8DhwAOHAA4cADhwAOHAA4cADgAAOAAAAAAD//wP//A//8D//wOAHA4ccDhxwOHHA4f8Dh/wOH/A4f8AAAAAAAA//8D//wP//A//8ABwAAHAAAcAABwAP//A//8D//wP//AAAAAAAAP//A//8D//wP//AAAAAAAAOAHA4AcDgBwOAHA4AcDgBwOAHA//8D//wP//A//8AAAAAAAA//8D//wP//A//8AHwAA/AAP8AB/wAPn/A8f8DB/wIH/AAAAAAAAP//A//8D//wP//AAAcAABwAAHAAAcAABwAAHAAAAAAAAP//A//8D//wP//Af8AAP+AAH/AAD8AAHwAD/AB/wAf8AP+AA//8D//wP//AAAAAAAAP//A//8D//wP//AfwAAfwAAfwAAfwAAfwP//A//8D//wAAAAAAAAAAAP//A//8D//wP//A4AcDgBwOAHA4AcD//wP//A//8D//wAAAAAAAD//wP//A//8D//wOHAA4cADhwAOHAA/8AD/wAP/AA/8AAAAAP//A//8D//wP//A4AcDgBwOAHA4AcD//+P//4///j//+AAA4AADgAAAP//A//8D//wP//A4eADh+AOH8A4f4D/3wP/HA/8MD/wQAAAAAAAD/xwP/HA/8cD/xwOHHA4ccDhxwOHHA4f8Dh/wOH/A4f8AAAAAAAA4AADgAAOAAA//8D//wP//A//8DgAAOAAA4AADgAAAAAA//8D//wP//A//8AABwAAHAAAcAABwP//A//8D//wP//AAAADAAAPgAA/wAD/4AB/8AA/8AAfwAB/AA/8Af+AP/AA/wAD4AAMAAA4AAD+AAP/gA//8AH/wAB/AAf8Af/wP/4A/4AD/gAP/4AH/8AB/wAB/AB/8D//wP/gA/gADgAAIABA4AcDwDwPw/Afn4Af+AA/wAD/AA//AH5+A/D8DwDwOAHAgAEAAAAP/AA/8AD/wAP/AAAf8AB/wAH/AAf8D/wAP/AA/8AD/wAAAAAAAADh/wOH/A4f8Dh/wOHHA4ccDhxwOHHA/8cD/xwP/HA/8cAAAAAAAAf//9///3///f//9wAA3AADcAAMAAAOAAA/gAD/wAH/8AB/8AA/wAAPAAAEAAAAHAADcAANwAB3///f//9///wAA");
const width1 = atob("BwYLDg4UDwYJCQwMBgkGCQ4MDg4ODg4NDg4GBgwMDA4PDg4ODg4NDg4GDQ4MEg8ODQ8ODgwODhQODg4ICQg=");
Graphics.prototype.setFontLECO1976Regular22 = function(scale) {
	// Actual height 22 (21 - 0)
	//g.setFontCustom(font1, 28, width1, 16+(scale<<8)+(1<<16));
	g.setFontCustom(font1, 32, width1, 22 + (scale << 8) + (1 << 16));
};

const font2 = atob("AAAAAAAAAAfkAAwAAAwAAACQf8CQf8CQAAGIJEf+JEE4AAMMMQBgCMMMAAAYMkTEMkAYBkAAwAgAAAHwIIQEAAQEIIHwAABAFQDgBADgFQBABABAHwBABAAAACAMAABABABABABAAAAEAAAEAYAgDAEAYAAAP4QkRESEP4AAEEIEf8AEAAMMQUQUQkPEAAIIQEREREO4AABwCQEQIQf8AAeISESESER4AAH4KESESEB4AAYAQAQcTgcAAAO4REREREO4AAPAQkQkQoPwAACIAAACCMAABACgEQIIAACQCQCQCQCQAAIIEQCgBAAAMAQAQ0RAOAAAP4QETkUUUUP0AAP8RARARAP8AAf8REREREO4AAP4QEQEQEIIAAf8QEQEIIHwAAf8REREREQEAAf8RARARAQAAAP4QEQEREJ4AAf8BABABAf8AAQEf8QEAAAYAEQEf4QAAAf8BACgEQYMAAf8AEAEAEAEAAf8IAEACAEAIAf8AAf8EACABAf8AAP4QEQEQEP4AAf8RARARAOAAAP4QEQEQGP6AAf8RgRQRIOEAAOIREREREI4AAQAQAf8QAQAAAf4AEAEAEf4AAeABwAMBweAAAf8AIAQAgAQAIf8AAYMGwBAGwYMAAYAGAB8GAYAAAQMQ0REWEYEAAf8QEAAMACABgAQAMAAQEf8AAIAQAgAQAIAAAACACACACACAAgAwAAAAYCkCkCkB8AAf8CECECEB4AAB4CECECEBIAAB4CECECEf8AAB4CUCUCUBwAACAP8SAQAAAB4CFCFCFD+AAf8CACACAB8AACET8AEAAACABT+AAf8AgBQCIAEAAQEf8AEAAD8CACAD8CACAB8AAD8CACACAB8AAB4CECECEB4AAD/CECECEB4AAB4CECECED/AAD8BACACACAAABICkCkCkAYAACAP4CECEAAD4AEAEAED8AADAAwAMAwDAAAD4AEAEA4AEAED4AACMBQAgBQCMAAD4AFAFAFD+AACMCUCkDECEAABAO4QEQEAAf8AAQEQEO4BAAAYAgAQAQAIAwAAAAAAAAAAAAA");
const widths2 = atob("BQIEBgYGBwMEBAcGAwYCBwYFBgYGBgYGBgYCAwUGBQYHBgYGBgYGBgYEBgYGCAYGBgYGBgYGBggGBgYDBgMGBgMGBgYGBgUGBgQEBgQIBgYGBgYGBQYGCAYGBgUCBQcF");
Graphics.prototype.setFont8x12 = function() {
	g.setFontCustom(font2, 32, widths2, 12);
};

const font3 = atob("AAAAAAAAA/QAAcAAAHAAAAJAf4CQH+AkAAAMQJIP+CSBGAAAQAUIEYAwBiBCgAgAAG4EiCRA0gBgDIAAOAAAAfAwYgCAAIAjBgfAAACgAgB8AIAKAAABAAgB8AIAEAAAACAOAAAIAEACABAAgAAADAAAAYAwBgDAGAAAAfgQIJkECB+AAAIQIIP8ACABAAAQwQoIkEiBhAAAQgQIJEEiBuAAADACgCQCID/ACAAAeQJEEiCRBHAAAHwFEEiCRAHAAAQAIMEYCwBgAAANwJEEiCRA3AAAOAIkESCKA+AAAGYAAAAgzgAACACgCICCAAAKAFACgBQAoAAAggIgCgAgAABABAAjQSAGAAAA8AhAmQUoL0CKA4AAABwHAMgGQA4ADgAAf4JEEiCRA4gDgAADwCECBBAggQIQAAH+CBBAggQIQDwAAD/BIgkQSIJEECAAB/gkASAJAEAAAAeAQgQIIkESBOAAA/wCABAAgAQB/gAAQIP8ECAAABAAQQIIEH8AAB/gEADACQCECBAAA/wAIAEACABAAA/wMABgAwBgB/gAAf4MABgAMABg/wAADwCECBBAgQgHgAAH+CIBEAiAOAAAB4BCBAggQIQD2AAD/BEAiARgHIACAAAxAkQSIIkESBGAAAgAQAIAH+CABAAgAAAP4ACABAAgAQfwAAHAAcABgAwDgOAAAD4ADgGAMABgAOD4AAAwwEgBgAwAkBhgAAYACAAgAPAIAIAYAAAEGCFBEgkQUIMEAAH/yAJAEAAYADAAYADAAYAAQBIAn/wAAGAMAYADAAYAAAAIAEACABAAgAQAIAAQAEAAAADAKQFICkA+AAD/gIQEICEA8AAAPAIQEICEAkAAAPAIQEICEP+AAAPAKQFICkA0AAAQA/wkASAIAAAAPAISEJCEh/gAD/gIAEACAA+AAAQBPwAAABAAggSfwAA/4AQAYASAQgAAgAf8AAA/AQAIAD4CABAAfAAAPwEACABAAfAAAHgEICEBCAeAAAP+EICEBCAeAAAHgEICEBCA/4AAPwCACABAAQAAAEQFICkBKAiAAAIAfwCEBCABAAAPgAIAEACA/AAAMABgAMAYAwAAAPAAYAYAwAGABgPAAACEAkAMAJAIQAAD5ACQBIAkP8AACEBGAlAUgMQAAAgAQD3iAJAEAAf/AAEASAI94BAAgAAAIAIAEADAAgAQAQAAAFAHwFUCqBBARAAAACAOAAAAQQI/4kASAAAADgAAA4AAAEAAABAAAAQAAEACAH/AgAQAAAFACgH/AoAUAAAEAEAEABAAQAAAGMAYAwBjAAAAwAADEKRDIiiQRIEYAAAIAKAIgAAH4ECCBA/AkQSIIEAACDFChiRSIKEGCAADAAQAAAEAMAAADAAQAwAEAAABADAAQAwAAAAQAcAfAHABAAAAQAIAEACABAAAAQAIAEACABAAgAQAAAgAgAIAIAAACAB4AgAAAPAGADwAAAEQlIKkJKAiAAAIgCgAgAAAeAQgIQDwCkBSAaAAAIQkYKUJSAxAAAYACAQgAOEIAIAYAAAL8AAAeAQgf4EIBIAAATA+gkQSIAEAABBAfAIgEQCIB8BBAAAwAEgBQAeAUASAwAAAffAADCCYhKQjIIYAAEAAABAAAAH4ECCZBSgpQQIH4AAAQBUAqAPAAAAQAUAVAFAEQAAAQAIAEADwAAH4ECC9BUglQQIH4AAIAEACABAAgAQAIAAAAwAkASAGAAAAIgEQPoBEAiAACIBMAqAJAAAEQCoBUAUAAAEAEAAAAAEH8AIACABAfAAQAAGAHgD/hAA/4QAAAA4AcAOAAAAFADAACQD4AEAAAOAIgEQBwAAAEQBQBUAUAEAAA8YAwBkDGGHgAgAAeMAYAwBpjFQBIAAIgFTB2AMgYww8AEAAADACQWIAEAEAAADgOBJAUgBwAHAAABwHAUgSQA4ADgAAA4TgSQJICcABwAAAcJwJICkCOAA4AAAOE4AkASAnAAcAAAHDcCSBJAbgAOAAADgGANAIgH+CRBAgAAHgEIECSBxAgQgAAH8SSFJAkgQQAAH8CSFJEkgQQAAH8KSJJCkgQQAAH8KSBJCkgQQAAEET+FBAAAQQv4kEAAFBE/hQQAAUED+FBAAACAP4EkCSBBARAHAAAH8KAIwCGCAwP4AAA4AiEghQQEQBwAAAcARBQRIICIA4AAAOBIhIIkEJEAcAAAHAkQkEKCIiAOAAADgSICCBBCRAHAAACIAoAIAKAIgAAD0CECNBYgQgXgAAD8ABEAhAQAIH4AAB+AAhARAIAED8AAA/BARAIgEICB+AAAfggIAEACEBA/AAAMABAAQEHEEAEAMAAAH+AkASAJADAAAABD/CQhIQkINEAcAAADAKQlIKkA+AAADAKQVISkA+AAADAqQlIKkA+AAADAqQlIKkI+AAADAqQFIKkA+AAADBKRVISkA+AAADAKQFIB8BSApANAAADwCEhDghAJAAADwSkFSApANAAADwKkJSApANAAADwKkJSCpANAAADwKkBSCpANAAAkAL8AACgCfgAAUAT8EAAACQAPwgAAAAcERCogkQvwAAF+EgBQBIAD4AAA8EhBQgIQDwAAA8AhBQhIQDwAAA8ChCQgoQDwAAA8ChCQgoQjwAAA8ChAQgoQDwAAAQAIAVACABAAAA9AjAWgMQLwAAB8EBBAgAQH4AAB8CBCAgAQH4AAB8CBCAggQH4AAB8CBAAggQH4AAB8ABJAlASH+AAH/ghAQgIQDwAAB8CBIAkgSH+AAA");
const widths3 = atob("AwIEBgYIBwIEBAYGAwYCBgYGBgYHBgYGBgYCAwUGBQYIBwcHBwcGBwcEBgcGBwcHBgcHBwgHBwgHCAcEBgQGCAMGBgYGBgYGBgMFBgMIBgYGBgYGBgYGCAYGBgYCBggABwADBgQGBgYGBwcECAAHAAADAwUFBgYIBQgGBAgABggAAgYGCAgCBgQIBQYFAAgIBQYFBQMIBwQDBAUGBwcIBgcHBwcHBwgHBgYGBgQEBAQIBwcHBwcHBgcHBwcHCAYIBgYGBgYGCAYGBgYGAwMEBAYGBgYGBgYGBgYGBgYGBgY=");
Graphics.prototype.setFontDylex7x13 = function() {
	g.setFontCustom(font3, 32, widths3, 13);
};


// === UI ===

ew.UI = {
	//size: { _2x2: 20, _2x1: 25, _txt: 26, _sideSmall: 20, sideBig: 45, underSmall: 20, txt: 0.85, len: 1, sca: 1 },
	size: { _2x2: 20, _2x1: 25, _txt: 26, t1: 10, t2: 35, t3: 42, txt: 0.85, len: 1, sca: 1 },
	font: { def: "LECO1976Regular22" },
	pos: { //raw X colomn
		_fold: [20, [79, 161], //middle pos x
			[65], //middle pos y
			[158, 158], //size x
			[74] //size y
		],
		_2x1: [28, [120],
			[80, 200],
			[240],
			[120, 120]
		],
		_2x2: [27, [60, 180],
			[80, 200],
			[120, 120],
			[120, 120]
		],
		_2x3: [
			28, [38, 120, 202],
			[65, 144],
			[77, 77, 77],
			[74, 74]
		],
		_3x1: [25, [120],
			[63, 145, 225],
			[220],
			[72, 72, 75]
		],
		_4x1: [27, [120],
			[50, 110, 170, 230],
			[240],
			[60, 60, 60, 60]
		],
		_ind: [27, [120],
			[260],
			[240],
			[40]
		],
		_kp4x4: [28, [30, 90, 150, 210],
			[50, 110, 170, 230]
		],
		_kp4x3: [35, [40, 120, 200],
			[50, 110, 170, 230],
			[80, 80, 80],
			[60, 60, 60, 60]
		],
		_ele: { "0": 25, title: [0, 260, 239, 279, 19], titleTop: [0, 0, 239, 19, 18], ind: [70, 0, 170, 5], indF: [0, 0, 239, 19] },
		_bar: [23, [40, 120, 200, 60, 180, 120],
			[235],
			[80, 80, 80, 114, 114, 240],
			[90]
		],
		_1x2: [25, [120],
			[80, 200],
			[240],
			[120, 120]
		],
		_header: [23, [40, 120, 200, 60, 180, 120],
			[25],
			[80, 80, 80, 120, 120, 240],
			[54]
		],
		_headerL: [23, [40, 120, 200, 70, 190, 120],
			[30],
			[80, 80, 80, 140, 100, 240],
			[60]
		],
		_headerS: [23, [40, 120, 200, 70, 190, 120],
			[30],
			[80, 80, 80, 140, 100, 240],
			[48]
		],
		_main: [25, [60, 180, 120], //5x3
			[45, 120, 105, 140, 140],
			[120, 120, 240],
			[50, 130, 170, 240, 280]
		],
		_lcd: [110, [120],
			[135, 110, 140],
			[240],
			[130, 180, 240]
		],
		_log: [50, [80, 120, 200],
			[36, 105, 170],
			[160, 240, 80],
			[50, 90, 40]
		],
		_top: 20,
		_head: 2,
		_foot: [225,210,240]
	},
	loc: function(no, po) {
		let m = {};
		const p = (ew.UI.pos[no]);
		let ln = p[1].length;
		m.x = p[1][(po - 1) % ln];
		m.y = p[2][((po - 1) / ln) | 0];
		m.szX = p[3][(po - 1) % ln] / 2;
		m.szY = p[4][((po - 1) / ln) | 0] / 2;
		return m;
	},
	btn: {
		size: { _xs: 28, _s: 22, _m: 28, _l: 35, _xl: 45, txt: 1, len: 1 },
		
		cInd: function(loc, no, po, val, txt, fclr, bclr, size) {
			const p = (ew.UI.pos[no]);
			const ln = p[1].length;
			const x = p[1][(po - 1) % ln];
			const y = p[2][((po - 1) / ln) | 0];
			const szX = p[3][(po - 1) % ln] / 2;
			const szY = p[4][((po - 1) / ln) | 0] / 2;
			g.setCol(0, bclr);
			g.fillRect({ x: x-szX, y: y-szY, x2: x+szX, y2: y+szY, r: 10 });
			g.setCol(1, fclr);
			if (txt && ew.def.face.txt){
				if (process.env.BOARD == "BANGLEJS2") g.setFont("Teletext10x18Ascii");
				else g.setFont("LECO1976Regular22");
				g.drawString(txt, x - (g.stringWidth(txt) / 2), y + 2 + ((szY * 2) * (2 - ew.UI.size.txt) / 6));
				let szXn= (val / 10) * (szX-10) ;
				g.fillRect({ x: x-szXn, y: y-szY+8, x2: x+szXn , y2: y-4, r: 10 });
			}else{
				g.drawCircle(x,y,p[0]*ew.UI.size.txt * (size ? size : 1)); 
				g.fillCircle(x,y,(p[0]*ew.UI.size.txt * (size ? size : 1) -3) * (val/10));
			}
			//if (!ew.def.face.bpp) 
			g.flip();
			//coordinates
			if (ew.UI.c.get[loc])
				//ew.UI.c.raw[loc]=ew.UI.c.raw[loc]+`${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}_${po}();`;	
				ew.UI.c.raw[loc] = ew.UI.c.raw[loc] + `${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}(${po},l);`;
		
			//g.flip();
		},
		
		
		i2l: function(loc, no, po, txt1, txt2, fclr, bclr, size) {

			const p = (ew.UI.pos[no]);
			const ln = p[1].length;
			const x = p[1][(po - 1) % ln];
			const y = p[2][((po - 1) / ln) | 0];
			const szX = p[3][(po - 1) % ln] / 2;
			const szY = p[4][((po - 1) / ln) | 0] / 2;
			g.setCol(0, bclr);
			g.fillRect({ x: x-szX, y: y-szY, x2: x+szX, y2: y+szY, r: 10 });
			g.setCol(1, fclr);

			if (txt1){ 
				g.setFont("LECO1976Regular22", size?size:2);
				if (txt1!="fill") g.drawString(txt1, x - (g.stringWidth(txt1) / 2), y  - (g.stringMetrics(txt1).height / 2)  );
			}
			if (txt2) {
				if (process.env.BOARD == "BANGLEJS2") g.setFont("Vector", p[0] * ew.UI.size.txt); //g.setFont("Dylex7x13",2);
				else g.setFont("Teletext10x18Ascii");
				if (txt2 != "fill") g.drawString(txt2, x  -( g.stringWidth(txt2)/2), y + szY -10 - (g.stringMetrics(txt2).height / 2));
			}
			if (!ew.def.face.bpp) g.flip();
			//coordinates
			if (ew.UI.c.get[loc])
				//ew.UI.c.raw[loc]=ew.UI.c.raw[loc]+`${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}_${po}();`;	
				ew.UI.c.raw[loc] = ew.UI.c.raw[loc] + `${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}(${po},l);`;
		},
		
		c3l: function(loc, no, po, txt1, txt2, fclr, bclr) {

			const p = (ew.UI.pos[no]);
			const ln = p[1].length;
			const x = p[1][(po - 1) % ln];
			const y = p[2][((po - 1) / ln) | 0];
			const szX = p[3][(po - 1) % ln] / 2;
			const szY = p[4][((po - 1) / ln) | 0] / 2;
			g.setCol(0, bclr);
			g.fillRect(x - szX, y - szY, x + szX, y + szY);
			g.setCol(1, fclr);
			g.setFont("LECO1976Regular22", 3);
			//g.setFont("Vector", p[0] * ew.UI.size.txt);
			g.drawString(txt1, x - (g.stringWidth(txt1) / 2), y + 5 - (g.stringMetrics(txt1).height / 2));
			g.setFont("LECO1976Regular22", 1);
			//g.setFont("Vector", p[0] * ew.UI.size.txt * 0.2);
			g.drawString(txt2, x + szX - g.stringWidth(txt2), y + (g.stringMetrics(txt2).height / 2));
			if (!ew.def.face.bpp) g.flip();
			//coordinates
			if (ew.UI.c.get[loc])
				//ew.UI.c.raw[loc]=ew.UI.c.raw[loc]+`${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}_${po}();`;	
				ew.UI.c.raw[loc] = ew.UI.c.raw[loc] + `${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}(${po},l);`;

			else g.flip();
		},
		c0l: function(btn) { //type:main|bar,
			//"ram";
			let p = (ew.UI.pos[btn.type]);
			let len = p[1].length;
			let x = p[1][(btn.pos - 1) % len];
			let y = p[2][((btn.pos - 1) / len) | 0];
			let szX = p[3][(btn.pos - 1) % len] / 2;
			let szY = p[4][((btn.pos - 1) / len) | 0] / 2;
			//g.setFont(ew.UI.font.def, btn.size?btn.size:4);
			g.setCol(0, btn.bClr);
			g.setFont("Vector", ew.UI.size.txt * (btn.size ? btn.size * ew.UI.size.t3 : ew.UI.size.t3));
			//g.setFont("Vector", p[0] * ew.UI.size.txt);
			let t1 = Number(btn.txt1).toFixed(2).split(".");
			let t1H = g.stringMetrics(btn.txt1).height;
			let x0 = x - (g.stringWidth(btn.txt1) / 2);
			let x1 = x + (g.stringWidth(btn.txt1) / 2);
			let y0 = y - (t1H / 2);
			let y1 = y + (t1H / 2);
			//g.fillRect(x0, y0, x1, y1);
			g.fillRect(x - szX, y - szY, x + szX, y + szY);
			g.setCol(1, btn.fClr);
			g.drawString(t1[0], x0, y0);
			let nxt = g.stringWidth(t1[0]);
			g.setCol(1, 11);
			g.setFont("Vector", ew.UI.size.txt * (btn.size ? btn.size * ew.UI.size.t2 : ew.UI.size.t2));
			g.setCol(1, btn.fClr);
			g.drawString("." + t1[1], x0 + nxt, y1 - 3 - g.stringMetrics(t1[1]).height);
			nxt += g.stringWidth("." + t1[1]);
			g.setFont("Vector", (btn.size ? btn.size * ew.UI.size.t1 : ew.UI.size.t1));
			g.drawString(btn.txt2, x0 + nxt, y1 - 12 - g.stringMetrics(btn.txt2).height);
			g.flip();
		},
		c1l: function(loc, no, po, txt1, txt2, fclr, bclr, size) { //type:main|bar,
			//"ram";
			//draw
			const p = (ew.UI.pos[no]);
			let len = p[1].length;
			let x = p[1][(po - 1) % len];
			let y = p[2][((po - 1) / len) | 0];
			let szX = p[3][(po - 1) % len] / 2;
			let szY = p[4][((po - 1) / len) | 0] / 2;
			//g.setFont("LECO1976Regular22", size?size:1);
			g.setFont("Vector", p[0] * ew.UI.size.txt * (size ? size : 1));
			if (this.x0) {
				g.setCol(0, bclr);
				g.fillRect(this.x0, this.y0, this.x1, this.y1);
			}
			this.x0 = x - (g.stringWidth(txt1) / 2);
			this.x1 = x + (g.stringWidth(txt1) / 2);
			this.y0 = y + 4 - (g.stringMetrics(txt1).height / 2);
			this.y1 = y + (g.stringMetrics(txt1).height / 2);
			g.setCol(1, fclr);
			g.drawString(txt1, x - (g.stringWidth(txt1) / 2), y + 5 - (g.stringMetrics(txt1).height / 2));
			g.flip();
		},
		c2l: function(loc, no, po, txt1, txt2, fclr, bclr, size) { //type:main|bar,
			//"ram";
			//draw
			const p = (ew.UI.pos[no]);
			let len = p[1].length;
			let x = p[1][(po - 1) % len];
			let y = p[2][((po - 1) / len) | 0];
			let szX = p[3][(po - 1) % len] / 2;
			let szY = p[4][((po - 1) / len) | 0] / 2;

			g.setCol(0, bclr);

			g.fillRect({ x: x - szX, y: y - szY, x2: x + szX, y2: y + szY, r: 10 });

			g.setCol(1, fclr);
			if (txt2 && txt2 != "") {
				g.setFont("Vector", p[0] * 0.70 * ew.UI.size.txt * (size ? size : 1));

				g.drawString(txt1, x - (g.stringWidth(txt1) / 2), y - 6 - g.stringMetrics(txt1).height);
				g.setFont("Vector", p[0] * 1 * ew.UI.size.txt * (size ? size : 1));
				g.drawString(txt2, x - (g.stringWidth(txt2) / 2), y + (1.00 - ew.UI.size.txt));
			}
			else {
				g.setFont("Vector", p[0] * ew.UI.size.txt * (size ? size : 1));

				g.drawString(txt1, x - (g.stringWidth(txt1) / 2), y + 4 - (g.stringMetrics(txt1).height / 2));
			}
			if (!ew.def.face.bpp) g.flip();
			//coordinates
			if (ew.UI.c.get[loc])
				//ew.UI.c.raw[loc]=ew.UI.c.raw[loc]+`${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}_${po}();`;	
				ew.UI.c.raw[loc] = ew.UI.c.raw[loc] + `${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}(${po},l);`;

			else g.flip();
		},
		img: function(loc, no, po, img, txt, fclr, bclr, size, side, tran) {
			if (process.env.BOARD == "P8" || process.env.BOARD == "P22" || process.env.BOARD == "PINETIME") img = 0;
			else img = require("heatshrink").decompress(atob(ew_icon[img]));
			//img = require("heatshrink").decompress(atob(eval(img)));

			//img= require("Storage").readJSON("ew_icon.js")[img]
			//img = require("heatshrink").decompress(atob(       img     ));

			//require("Storage").readJSON("ew_icon.js",ew_icon).bt

			const p = (ew.UI.pos[no]);
			let len = p[1].length;
			let x = p[1][(po - 1) % len];
			let y = p[2][((po - 1) / len) | 0];
			let szX = p[3][(po - 1) % len] / 2;
			let szY = p[4][((po - 1) / len) | 0] / 2;
			if (!tran) {
				g.setCol(0, bclr);
				g.fillRect({ x: x - szX, y: y - szY, x2: x + szX, y2: y + szY, r:10 });
			}
			g.setCol(1, fclr);
			let imgW = g.imageMetrics(img).width;
			let imgH = g.imageMetrics(img).height;
			if (txt && side) {
				g.setFont("Vector", p[0] * 1.5 * ew.UI.size.txt* size);
				let xa = x - ((imgW + g.stringWidth(txt)) / 2);
				g.setCol(1, 11);
				g.drawImage(img, xa, y - (imgH / 2), { scale: ew.UI.size.sca });
				g.setCol(1, fclr);
				g.drawString(txt, xa + 8 + imgW, y - (p[0] * 1.7 * ew.UI.size.txt) / 2 + 2);
			}
			else if (ew.def.face.txt && txt) {
				g.drawImage(img, x - (imgW * ew.UI.size.sca * 0.65 / 2), (y - szY) + ((szY * 2) * (2 - ew.UI.size.txt) / 15), { scale: 0.75 * ew.UI.size.sca });
				g.setCol(1, fclr);
				if (process.env.BOARD == "BANGLEJS2") g.setFont("Teletext10x18Ascii");
				else g.setFont("LECO1976Regular22");
				g.drawString(txt, x - (g.stringWidth(txt) / 2), y + 2 + ((szY * 2) * (2 - ew.UI.size.txt) / 6));
			}
			else g.drawImage(img, x - (imgW * ew.UI.size.sca / 2), y - (imgH * ew.UI.size.sca / 2), { scale: ew.UI.size.sca });
			img = 0;
			if (!ew.def.face.bpp) g.flip();
			//coordinates
			if (ew.UI.c.get[loc])
				ew.UI.c.raw[loc] = ew.UI.c.raw[loc] + `${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}(${po},l);`;
			//ew.UI.c.raw[loc]=ew.UI.c.raw[loc]+`${ew.UI.c.raw[loc]==" "?'':'else '}if (${x}-${szX}<x&&x<${x}+${szX}&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.${loc}.${no}_${po}();`;	
			else g.flip();
		},
		ntfy: function(rst, tmot, ignr, no, po, txt1, txt2, fclr, bclr, sel, img, pri) {
			//"ram";

			if (ew.is.UIpri && !pri) return;
			if (pri) ew.is.UIpri = 1;
			if (ew.UI.ntid) {
				clearTimeout(ew.UI.ntid);
				ew.UI.ntid = 0;
			}
			if (rst && !sel) {
				//ew.UI.c.xy.replaceWith(new Function("x", "y", "l", 'setTimeout(()=>{' + ew.UI.c.raw.main + '},0);'));
				ew.UI.c.xy.replaceWith(new Function("x", "y", "l", '' + ew.UI.c.raw.main +''));

				ew.is.slide = 0;
			}
			if (!ignr) {
				ew.face.off();
				const p = (ew.UI.pos[no]);
				let len = p[1].length;
				let x = p[1][(po - 1) % len];
				let y = p[2][((po - 1) / len) | 0];
				let szX = p[3][(po - 1) % len] / 2;
				let szY = p[4][((po - 1) / len) | 0] / 2;
				g.setCol(0, bclr);
				g.fillRect({ x: x - szX, y: y - szY, x2: x + szX, y2: y + szY, r: 10 });
				g.setCol(1, fclr);
				g.setFont("LECO1976Regular22");
				if (txt1) 
					g.drawString(txt1, x - (g.stringWidth(txt1) / 2), (txt2) ? ew.UI.pos._foot[1]:ew.UI.pos._foot[0]);
				
				if (txt2) 
					g.drawString(txt2, x - (g.stringWidth(txt2) / 2), 	ew.UI.pos._foot[2]);
				
				if (sel && rst) {
					//g.flip
					ew.is.bar = 1;
					ew.is.slide = 0;
					ew.UI.c.raw.bar = `if (x<120&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.bar._ntfy(1); else if (120<x&&${y}-${szY}<y&&y<${y}+${szY}) ew.UI.c.bar._ntfy(2);`;
					ew.UI.c.xy.replaceWith(new Function("x", "y", "l", '' + ew.UI.c.raw.main + ew.UI.c.raw.bar +''));
					//ew.UI.c.xy.replaceWith(new Function("x", "y", "l", 'setTimeout(()=>{' + ew.UI.c.raw.main + ew.UI.c.raw.bar + '},0);'));
				}else  ew.UI.c.bar._ntfy =  function(){};
				g.flip();
			}
			if (txt1) ew.face[0].ntfy=txt1;
			//if (!sel) g.flip();
			ew.UI.ntid = setTimeout(function(t) {
				ew.face[0].ntfy=false;
				ew.UI.rtb();
			}, tmot ? tmot * 1000 : 1000);

		}
	},
	ele: {
		title: function(txt, fclr, bclr, top) {
			//"ram";
			let p = (top ? ew.UI.pos._ele.titleTop : ew.UI.pos._ele.title);
			let x = 4 + p[2] - ((p[2] - p[0]) / 2);
			let y = p[3] - ((p[3] - p[1]) / 1.5);
			g.setCol(0, bclr);
			g.fillRect(p[0], p[1], p[2], p[3]);
			g.setCol(1, fclr);
			g.setFont("Vector", p[4] * ew.UI.size.txt);
			g.drawString(txt, x - (g.stringWidth(txt) / 2), top ? y - 2 : y);
			if (!ew.def.face.bpp) g.flip();
		},
		ind: function(c, t, clr, clrF) {
			//"ram";
			if (ew.UI.pos._ele.indF) {
				let pf = (ew.UI.pos._ele.indF);
				g.setCol(0, clr ? clr : 0);
				g.fillRect(pf[0], pf[1], pf[2], pf[3]);
			}
			if (!c) return;
			let p = (ew.UI.pos._ele.ind);
			g.setCol(0, clr ? 0 : 6);
			g.fillRect(p[0], p[1], p[2], p[3]);
			let pa = (p[2] - p[0]) / t;
			g.setCol(1, clrF ? clrF : 3);
			g.fillRect(p[0] + (pa * (c - 1)), p[1], p[0] + (pa * c), p[3]);
			if (!ew.def.face.bpp) g.flip();
		},
		fill: function(no, po, clr) {
			//"ram";
			let m = ew.UI.loc(no, po);
			g.setCol(0, clr);
			g.fillRect(m.x - m.szX, m.y - m.szY, m.x + m.szX, m.y + m.szY);
			if (!ew.def.face.bpp) g.flip();
		},
		keypad: function(no, po, clr) {
			let m = ew.UI.loc(no, po);
			g.setCol(0, clr);
			g.fillRect(m.x - m.szX, m.y - m.szY, m.x + m.szX, m.y + m.szY);
			if (!ew.def.face.bpp) g.flip();
		},
		coord: function(loc, no, po) {
			//"ram";
			let m = ew.UI.loc(no, po);
			ew.UI.c.raw[loc] = ew.UI.c.raw[loc] + `${ew.UI.c.raw[loc]==" "?'':'else '}if (${m.x}-${m.szX}<x&&x<${m.x}+${m.szX}&&${m.y}-${m.szY}<y&&y<${m.y}+${m.szY}) ew.UI.c.${loc}.${no}(${po},l);`;
		},
		txt: function(loc, no, po, txt, bclr, fclr, size) {
			let m = ew.UI.loc(no, po);
			print("m", m);
			g.setCol(0, bclr);
			g.fillRect(m.x - m.szX, m.y - m.szY, m.x + m.szX, m.y + m.szY);
			g.setCol(1, fclr);
			if (process.env.BOARD == "BANGLEJS2") g.setFont("Dylex7x13");
			else
				//g.setFont("Teletext10x18Ascii",1);
				g.setFont("Vector", ew.UI.size._txt * ew.UI.size.txt * (size ? size : 1));

			//txt=g.wrapString(txt||"",220);
			//g.drawString(txt.join("\n"), m.x - (g.stringWidth(txt) / 2), m.y - m.szY + (m.szY / 10));
			g.drawString(txt, m.x - (g.stringWidth(txt) / 2), m.y - m.szY + (m.szY / 10));
			//if (!ew.def.face.bpp) 
			g.flip();
		}
	},
	txt: {
		wrap: function(str, len) {
			//"ram";
			str = str.split(' ');
			var line = "";
			let i = 0;
			var prev = 0;
			for (i == 0; i < str.length; i++) {
				if (str[i].length < (len + 1)) {
					if (str[i].length + (line.length - line.lastIndexOf('\n')) < (len + 1)) {
						if (line != "") line = line + " " + str[i];
						else line = str[i];
					}
					else line = line + "\n" + str[i];
				}
				else {
					var o = 0;
					var l;
					while (o < str[i].length) {
						l = line.length - (line.lastIndexOf('\n') + 1) > 0 ? len - (line.length - line.lastIndexOf('\n')) : len;
						if (l <= 0) l = len;
						if (l < len) line = line + " " + str[i].substr(o, l);
						else {
							if (line != "") line = line + "\n" + str[i].substr(o, l);
							else line = str[i].substr(o, l);
						}
						o = o + l;
					}
				}
			}
			return line;
		},
		block: function(no, po, txt, len, fclr, bclr, tran) {
			//"ram";
			const p = (ew.UI.pos[no]);
			let ln = p[1].length;
			let x = p[1][(po - 1) % ln];
			let y = p[2][((po - 1) / ln) | 0];
			let szX = p[3][(po - 1) % ln] / 2;
			let szY = p[4][((po - 1) / ln) | 0] / 2;
			g.setCol(0, bclr);
			txt = this.wrap(txt, len * ew.UI.size.len);
			if (!tran) g.fillRect(x - szX, y - szY, x + szX, y + szY);
			g.setCol(1, fclr);
			if (process.env.BOARD == "BANGLEJS2") g.setFont("Dylex7x13");
			else
				g.setFont("Teletext10x18Ascii", 1);
			//g.setFont("Vector", ew.UI.size._txt * ew.UI.size.txt);
			g.drawString(txt, x - (g.stringWidth(txt) / 2), y - szY + (szY / 10));
			//g.drawString(txt,x-(g.stringWidth(txt)/2),y-szY); 

			if (!ew.def.face.bpp) g.flip();
		}
	},
	rtb: function() {
		if (ew.UI.ntid) {clearTimeout(ew.UI.ntid);ew.UI.ntid = 0;}
		ew.is.UIpri = 0;
		if (ew.sys.TC.tid && ew.def.dev.touchtype === "816") {
			clearTimeout(ew.sys.TC.tid);
			ew.sys.TC.tid = 0;
		}
		ew.is.bar = 0;
		ew.is.slide = 0;
		if (ew.face[0].exe) {
			ew.face[0].exe();
			ew.face[0].exe = 0;
		}
		if (ew.face[0].bar) ew.face[0].bar();
	},
	bar: function(i) {
		"ram"
		ew.is.bar = 1;
		ew.is.slide = 0;
		ew.UI.btn.ntfy(0, 1.3, 1);
		ew.UI.ele.fill("_bar", 6, 3);
		ew.UI.c.start(0, 1);
		if (ew.face.appCurr!="settings") ew.UI.btn.img("bar", "_bar", 1, "settings", "",0, 3, 0,1);
		ew.UI.btn.img("bar", "_bar", 2, "apps", "",0, 3, 0,1);
		if (require('Storage').read('ew_f_' + ew.face.appCurr + "-set") ) ew.UI.btn.img("bar", "_bar", 3, "dash", "", 0, 3, 0,1);
		ew.UI.c.end();
		ew.UI.c.bar._bar = (i) => {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			if (i === 3) ew.face.go(ew.face.appCurr + "-set", 0);
			else if (i ===1) ew.face.go("settings", 0, i);
			else setTimeout(()=>{ew.sys.updt();Bangle.showLauncher()},100); //ew.face.go("launcher", 0, i);
		};
	}
};
//g.col=Uint16Array([  0,31,2016,2016,31,2047,2047,63488,63519,63519,   31,63519,63519,65504,65535,65535]);
//icon

// === icons ===

eval(require('Storage').read('ew_icons'));

// === UI control ==

ew.UI.c = {
	get: { bar: 0, main: 0 },
	raw: { main: " ", bar: " ", up: " ", down: " ", back: " ", next: " " },
	xy: function() {},
	main: {},
	bar: {},
	start: function(m, b) {
		//"ram";
		if (m) {
			ew.UI.c.raw.main = " ";
			ew.UI.c.get.main = 1;
		}
		if (b) {
			ew.UI.c.raw.bar = " ";
			ew.UI.c.get.bar = 1;
		}
	},
	end: function() {
		//"ram";
		g.flip();
		ew.UI.c.get.main = 0;
		ew.UI.c.get.bar = 0;
		ew.UI.c.xy.replaceWith(new Function("x", "y", "l", '' + ew.UI.c.raw.main + ew.UI.c.raw.bar +''));
		//ew.UI.c.xy.replaceWith(new Function("x", "y", "l", 'setTimeout(()=>{' + ew.UI.c.raw.main + ew.UI.c.raw.bar + '},0);'));
	},
	clear: function() {
		this.raw = { main: " ", bar: " ", up: " ", down: " ", back: " ", next: " " };
	}
};

//  === themes ===
ew.UI.theme = {};
ew.UI.theme.dark = {
	btn: { onT: 15, onB: 4, offT: 11, offB: 2 },
	menu: { onT: 15, onB: 4, offT: 15, offB: 2 },
	slide: { onT: 15, onB: 4, offT: 15, offB: 2 },
	ntfy: { text: 0, back: 15 },
	clock: { minF: 15, minB: 1, hrF: 11, hrB: 1, secF: 15, secB: 1, dateF: 11, dateB: 0, batF: 11, batB: 0, back: 0, top: 0 }
};
ew.UI.theme.white = {
	btn: { onT: 15, onB: 4, offT: 11, offB: 2 },
	menu: { onT: 15, onB: 4, offT: 15, offB: 2 },
	slide: { onT: 15, onB: 4, offT: 15, offB: 2 },
	ntfy: { text: 0, back: 15 },
	clock: { minF: 0, minB: 15, hrF: 10, hrB: 15, secF: 10, secB: 15, dateF: 11, dateB: 0, batF: 11, batB: 0, back: 0, top: 0 }
};
ew.UI.theme.current = ew.UI.theme.dark;


// === UI navigation ===

ew.UI.nav = {
	dn: function(x, y) {
		"ram";
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		/*if (ew.UI.ntid && ew.is.bar) {
			ew.UI.rtb();
			//return;
		}*/
		if (ew.face.appCurr == "main" && ew.face.pageCurr != -1)
			ew.face.go("main", -1);
		else
			ew.face.go("main", 0);

	},
	up: function(x, y) {
		"ram";
		if (x < 50 && g.getHeight() - (process.env.BOARD == "BANGLEJS2"?25:50) < y) {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			if (ew.def.face.bri !== ((process.env.BOARD == "BANGLEJS2")?10:7)) {
				ew.is.bri = ew.def.face.bri;
				g.bri.set((process.env.BOARD == "BANGLEJS2")?10:7);
			}
			else
				g.bri.set(ew.is.bri);
			if (ew.face[0].bar) {
				ew.UI.btn.ntfy(1, 1, 0, "_bar", 6, "BRIGHTNESS", "GESTURE", 0, 15, 0);
				g.flip();
				if (ew.face.appCurr == "settings" && ew.face[0].page == "set") 
					ew.UI.btn.cInd("main", "_2x3", 3, ew.def.face.bri == (process.env.BOARD == "BANGLEJS2"?10:7) ? process.env.BOARD == "BANGLEJS2"?10:7 : ew.is.bri, "BRI", 15, 6, 0.9);

			}
		}
		else {
			ew.sys.buzz.nav(ew.sys.buzz.type.ok);
			ew.UI.bar(2);
		}
	},
	back: function() {
		ew.sys.buzz.nav(ew.sys.buzz.type.ok);
		ew.face.go(ew.face.appRoot[0], ew.face.appRoot[1]);
	},
	next: function() {
		ew.sys.buzz.nav(ew.sys.buzz.type.na);
	},
	bar: function(a, b, r) { ew.UI.c.tcBar(a, b, r); },
};


if (process.env.BOARD == "BANGLEJS2") {
	ew.UI.size = { _2x2: 20, _2x1: 25, _txt: 19, t1: 8, t2: 28, t3: 34, txt: 0.8, len: 1, sca: 0.75 };

	ew.UI.pos = {

		_fold: [12, [58, 120],//middle pos x
			[36],//middle pos y
			[120, 120],//size x
			[57]//size y
		],
		_2x1: [25, [89],
			[45, 122],
			[176],
			[78, 78]
		],
		_2x2: [22, [45, 135],
			[40, 120],
			[88, 88],
			[78, 78]
		],
		_2x3: [23, [28, 87, 146],
			[36, 95],
			[56, 56, 56],
			[57, 57]
		],
		_3x1: [25, [90],
			[40, 120, 200]
		],
		_ind: [12, [88],
			[3],
			[176],
			[6]
		],
		_4x1: [22, [89],
			[25, 65, 105, 145],
			[176],
			[40, 40, 40, 40]
		],
		_kp4x3: [25, [30, 89, 145],
			[20, 58, 100, 140],
			[58, 58, 58],
			[40, 40, 40, 40]
		],
		_ele: { "0": 25, title: [0, 160, 176, 176, 16], titleTop: [0, 0, 176, 5, 14], ind: [10, 0, 166, 5], indF: [0, 0, 176, 5] },
		_bar: [16, [30, 88, 145, 43, 133, 88],
			[150],
			[58, 58, 58, 84, 84, 176],
			[50]
		],
		_1x2: [25, [90],
			[78, 135],
			[176],
			[78, 78]
		],
		_header: [19, [30, 89, 145, 45, 133, 88],
			[17],
			[58, 58, 58, 88, 88, 176],
			[35]
		],
		_headerL: [19, [30, 89, 145, 45, 133, 88],
			[25],
			[58, 58, 58, 100, 77, 176],
			[40]
		],
		_headerS: [19, [30, 89, 145, 45, 133, 88],
			[20],
			[58, 58, 58, 100, 77, 176],
			[30]
		],		
		_main: [20, [45, 133, 88],
			[25, 79, 65, 70, 92],
			[88, 120, 176],
			[40, 88, 120, 130, 174]
		],

		_lcd: [75, [89],
			[83, 65, 90],
			[176],
			[78, 120, 176]
		],
		_log: [40, [58, 88, 146],
			[20, 65, 105],
			[116, 176, 60],
			[30, 70, 30]
		],
		_top: 20,
		_head: 2,
		_foot: [ 142, 132, 155 ]
	};
}
