//button 

ew.is.btn1Press=0;
ew.sys.btn1=(x)=>{
	//print(x);
	if (ew.tid.btn1long) {clearTimeout(ew.tid.btn1long);ew.tid.btn1long=0;}
	if (ew.face.offid) { clearTimeout(ew.face.offid); ew.face.offid = 0; }
	if (x.state) { 
		ew.is.lastBTN1time=x.time-x.lastTime;
		ew.is.btn1Press++;
		ew.tid.btn1long=setTimeout(() => {
			ew.tid.btn1long=0;
			ew.sys.emit("button","long");
			ew.is.btn1Press=0;
		}, 1000);
		return;
	}else if (ew.is.btn1Press) {
		if (ew.tid.btn1short) {clearTimeout(ew.tid.btn1short);ew.tid.btn1short=0;} 
			ew.tid.btn1short=setTimeout(() => {
				ew.tid.btn1short=0;
				if (2<ew.is.btn1Press)	ew.sys.emit("button","triple");
				else if (1<ew.is.btn1Press)	ew.sys.emit("button","double");
				else ew.sys.emit("button","short");
				ew.is.btn1Press=0;
			}, 10);
	//	}
	}
	
};
ew.tid.btn1 = setWatch(ew.sys.btn1, BTN1, { repeat: true, debounce: 50, edge: 0 });


ew.sys.on("button", (x) => { 
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);

	if (x === "short") {
		if (ew.face.pageCurr == -1)
			ew.face.go(ew.face.appCurr, 0);
		else {
			if (ew.face.appCurr == "main")
				ew.face.go("main", -1);
			else ew.face.go("main", 0);
		}

	}
	else 	if (x=== "long"){
	    if (ew.tid.time) {clearTimeout(ew.tid.time);ew.tid.time=0;}
		if (ew.face.appCurr==="torch")
			ew.face.go("main", 0);
		else 
			ew.face.go("torch",0);
	
	}
	
});

if (process.env.BOARD == "ROCK") {
D46.mode("input_pulldown")
ew.sys.btn2=(x)=>{
	//print(x);
	if (ew.tid.btn1long) {clearTimeout(ew.tid.btn1long);ew.tid.btn1long=0;}
	if (ew.face.offid) { clearTimeout(ew.face.offid); ew.face.offid = 0; }
	if (x.state) { 
		ew.is.lastBTN1time=x.time-x.lastTime;
		ew.is.btn1Press++;
		ew.tid.btn1long=setTimeout(() => {
			ew.tid.btn1long=0;
			ew.sys.emit("button2","long");
			ew.is.btn1Press=0;
		}, 1000);
		return;
	}else if (ew.is.btn1Press) {
		if (ew.tid.btn1short) {clearTimeout(ew.tid.btn1short);ew.tid.btn1short=0;} 
			ew.tid.btn1short=setTimeout(() => {
				ew.tid.btn1short=0;
				if (2<ew.is.btn1Press)	ew.sys.emit("button2","triple");
				else if (1<ew.is.btn1Press)	ew.sys.emit("button2","double");
				else ew.sys.emit("button2","short");
				ew.is.btn1Press=0;
			}, 10);
	//	}
	}
	
};
ew.tid.btn2 = setWatch(ew.sys.btn2, ew.pin.BTN2, { repeat: true, debounce: 50, edge: 0 });

ew.sys.on("button2", (x) => { 
	ew.sys.buzz.nav(ew.sys.buzz.type.ok);
	print(1)
	if (x=== "short"){
		if (ew.face.appCurr==="torch")
			ew.face.go("main",-1);
		else 
			ew.face.go("torch",0);
	
	}
	
});

}

