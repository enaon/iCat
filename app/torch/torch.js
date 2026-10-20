// torch app

ew.apps.torch = { 
    state:{
        isOn:false,
        tid:{tout:false,tgOn:false},
        def:{
            twst:false,
            led:true,
            pin:D43,
            lvl:5,
            per:false, //persist
            tmr:30 //timeout in sec
        }
        
    },
    tgl(i){
        this.state.isOn=(i==="OFF")?false:(i==="ON")?true:!this.state.isOn;
        if (this.state.tid.tgOn) {clearTimeout(this.state.tid.tgOn);this.state.tid.tgOn=false;}

        if (this.state.isOn){
            let v=ew.sys.batt();
            let per = 1;
            if (3.8 <= v)  per =  (0.9 / (v - 2.9));
            if (3.75 <= v) {
                digitalWrite(this.state.def.pin, 1);
                
                this.state.tid.tgOn=setTimeout(()=>{
                    analogWrite(this.state.def.pin, (this.state.def.lvl/10) * per, { freq: 4000 });
                    this.state.tid.tgOn=false;
                },2500);
            }else 
                analogWrite(this.state.def.pin, (this.state.def.lvl/10) * per, { freq: 4000 });

        }
        else
            digitalWrite(this.state.def.pin,0); 
            //this.state.def.pin.reset();
        this.tmr();
        return this.state.isOn;
    }
    ,
    tmr(){
        if (this.state.tid.tout){
            clearTimeout(this.state.tid.tout);
            this.state.tid.tout=false;
        }
        //if (this.state.isOn && this.state.def.per ) {
        if (this.state.isOn ) {
            this.state.tid.tout=setTimeout(()=>{
                this.state.isOn=false;
                digitalWrite(this.state.def.pin,0); 
                this.state.tid.tout=false;
                if (ew.face.appCurr==="torch") ew.face[0].info();
            },this.state.def.tmr*1000);
        }
    }
    
    
    
};

// --- defaults ---
ew.apps.torch.state.def = Object.assign(
    ew.apps.torch.state.def,
    (require("Storage").readJSON("ew.json", true) || {}).torch || {}
);

//ew.UI.icon.torch="mEwwILIgOAAp0EAoMQAoMMAoMwAoMGAoNgAoMDAQPADgcBAooqEADcP///+AFNABcHCIPgKYQFHKYYFHLIYFHFQd/Aol8nwFDngFdvwFDn/+AvX8ApIADA==";
//ew.UI.icon.torch="mEwwhC/AB0RABQWWDBcRxAAKC5MBjAXLwIXXiAX4R5oXIU7JIKwIXKMBZeJbBouKGBYuMSIQuIC5hIJIxhIJIxowJFxwXZJApGQC+eBAQQXTiJ7BC6eBinhAYIXTjwX/C+ynBC9mIAAQX/C/4X/C6MAdoIADCyAwBCwYuRAH4A==";

// install icon
if (!require('Storage').read("ew_i_torch.img")) {
    let icon="mEwwhC/AB0RABQWWDBcRxAAKC5MBjAXLwIXXiAX4R5oXIU7JIKwIXKMBZeJbBouKGBYuMSIQuIC5hIJIxhIJIxowJFxwXZJApGQC+eBAQQXTiJ7BC6eBinhAYIXTjwX/C+ynBC9mIAAQX/C/4X/C6MAdoIADCyAwBCwYuRAH4A==";
    require('Storage').write("ew_i_torch.img", require("heatshrink").decompress(atob(icon)));
}
