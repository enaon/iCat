NRF.connect("64:69:4e:75:89:4d public", { minInterval:7.5, maxInterval: 100, phy:"2mbps"}).then(function(g) {
		gatt = g;
		print("g:",g);
		return g.getPrimaryService(0xffe0);
	}).then(function(s) {
		print("s:",s);
		return s.getCharacteristic(0xffe1);
	}).then(function(c) {
		print("c:",c);
		gatt.device.on('gattserverdisconnected', function(){print("disconnect")});
	}).then(function() {
		console.log("connected");

	});


"ca:6b:b3:41:cd:81"

NRF.connect("74:bd:54:d7:86:c1 private-resolvable", { minInterval:7.5, maxInterval: 100}).then(function(g) {
		gatt = g;
		console.log("connected");
});
	


NRF.on('mtu', function(arr) { print("**********mtu :",arr) });
NRF.connect("4a:73:17:2d:a7:10 private-resolvable").then(function(g) {
	gatt = g;
	gatt.device.on('gattserverdisconnected', function(){print("disconnect")});	
	global.lala="connected";
});



NRF.on('bond', function(status) { print ("bond status:", status) });

var gatt;
var mac="50:21:b4:33:bd:3c private-resolvable";
NRF.connect(mac,{minInterval:15, maxInterval:100 }).then(function(device) {
  gatt = device;
  console.log("connected");
  return gatt.startBonding();
}).then(function() {
  console.log("bonded", gatt.getSecurityStatus());
  gatt.disconnect();
}).catch(function(e) {
  console.log("ERROR",e);
});


NRF


googletag
  "id": "54:da:56:bb:54:fb private-resolvable",
  "id": "76:3e:b8:95:54:0f private-resolvable",
	"id": "47:fd:c9:bd:b9:a9 private-resolvable",
	"68:a3:f3:78:21:c4 private-resolvable";
	"75:20:76:50:51:a3 private-resolvable",
	"75:20:76:50:51:a3 private-resolvable"
	"47:fd:c9:bd:b9:a9 private-resolvable"
	"6b:fb:36:0f:ad:b8 private-resolvable"
	
NRF.resolveAddress( "6b:fb:36:0f:ad:b8 private-resolvable")




NRF.setScan(function(device) { if (device.id.includes("private-resolvable")) print(device);}, { active: false});
        
NRF.setScan( )