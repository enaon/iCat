NRF.setAdvertising({}, { interval: 1000 });

NRF.setTxPower(4)
NRF.setAdvertising({}, { name: "eC-N1", connectable: true, whenConnected: true });

NRF.setAdvertising({}, { discoverable: true, connectable: true, whenConnected: true, phy: "coded", scannable: false });

NRF.setAdvertising({}, { whenConnected: true, phy: "coded" })


NRF.requestDevice({ filters: [{ namePrefix: 'ew' }] }).then(function(device) {
  print(device);
});



= Promise: { state: 0 }
BluetoothDevice: {
    "id": "d3:31:ea:fc:8f:73 random",
    "rssi": -52,
    "data": new Uint8Array([2, 1, 6, 3, 255, 144, 5, 10, 9, 101, 119, 95, 110, 32, 56, 102, 55, 51]).buffer,
    "manufacturer": 1424,
    "manufacturerData": new ArrayBuffer(0),
    "name": "ew_n 8f73"
  } >



  NRF.setTxPower(8);
NRF.setAdvertising({}, {
  name: 'eC-n2',
  showName: true,
  discoverable: true, // general discoverable, or limited - default is limited
  connectable: true, // whether device is connectable - default is true
  scannable: false, // whether device can be scanned for scan response packets - default is true
  whenConnected: true, // keep advertising when connected (nRF52 only)
  interval: 300, //});
  phy: "coded"
});



NRF.setScan(function(d) {
  print(`
id ${d.id}
name : ${d.name}
rssi: ${d.rssi}
`);
}, { phy: "coded" });

NRF.setScan(function(d) {
  console.log(d.manufacturerData);
}, { filters: [{ manufacturerData: { 0x0590: {} } }] });


NRF.setScan(function(d) {
  console.log(d);
});





NRF.requestDevice({ phy:"both",filters: [{ namePrefix: "eC" }] }).then(function(device) {
print(device)
});






NRF.setScan(function(d) {
  print(d.id);
  //if (d.serviceData && d.serviceData.fe2c)console.log( print (d.id) );
  //if (d.serviceData && d.serviceData.fe2c)console.log( print (d.id) );
}, { timeout: 300, interval: 600, window: 300, phy: "both" });


NRF.setScan()

D13.reset();
NRF.setTxPower(8);
NRF.setAdvertising({}, { interval:500,name: "eC-test", connectable:true, phy:"1mbps,coded", scannable:false, whenConnected :true });
//NRF.setConnectionInterval(100) ;

switchAdv = {
  type: 0,
  start: function() {
    this.type = 1 - this.type;
    NRF.setAdvertising({}, { interval: 500, name: "eC-test", connectable: true, phy: switchAdv.type ? "coded" : "1mbps", scannable: (switchAdv.type ? false : true), whenConnected: true });
    setTimeout(() => { switchAdv.start(); }, 1000);
  }

};
switchAdv.start();



mag
  "id": "d1:8b:af:b8:cc:3d random"

// Σε κάθε Espruino:
// 1. Το αντικείμενο αυτόματα ενεργοποιεί τον server

// 2. Για να λάβεις αρχείο από άλλο Espruino:
ew.comm.remoteFile.get("d1:8b:af:b8:cc:3d random", "ew_logger_kitty.json", function(err, result) {
  if (err) {
    console.log("Error:", err);
  }
  else {
    console.log("Success:", result);
  }
});

// 3. Για να απενεργοποιήσεις τον server (προαιρετικά):
// ew.comm.remoteFile.disable();

// 4. Για να ελέγξεις την κατάσταση:
// console.log("Server enabled:", ew.comm.remoteFile.isEnabled());



NRF.connect("d1:8b:af:b8:cc:3d random").then(function() {
  Bluetooth.println("REQUEST_FILE:ew_logger_kitty.json");
  Bluetooth.on('data', function(d) { console.log("Got:", d.trim()); });
});
