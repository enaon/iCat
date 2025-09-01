NRF.setAdvertising({}, { connectable: true,whenConnected:true,phy:"coded" });

NRF.setTxPower(8)
NRF.setAdvertising({}, { name: "eC-N1",  connectable: true,whenConnected:true});

NRF.setAdvertising({}, { discoverable: true ,connectable: true,whenConnected:true,phy:"coded", scannable:false });

NRF.setAdvertising({},{whenConnected:true,phy:"coded"})


NRF.requestDevice({ filters: [{ namePrefix: 'ew' }]}).then(function(device) {
  print (device);
});



=Promise: { state: 0 }
BluetoothDevice: {
  "id": "d3:31:ea:fc:8f:73 random",
  "rssi": -52,
  "data": new Uint8Array([2, 1, 6, 3, 255, 144, 5, 10, 9, 101, 119, 95, 110, 32, 56, 102, 55, 51]).buffer,
  "manufacturer": 1424,
  "manufacturerData": new ArrayBuffer(0),
  "name": "ew_n 8f73"
 }
>



NRF.setTxPower(8); 
NRF.setAdvertising({}, {
  name: 'eC-n2',
  showName: true,
  discoverable: true , // general discoverable, or limited - default is limited
  connectable: true,  // whether device is connectable - default is true
  scannable : false ,   // whether device can be scanned for scan response packets - default is true
  whenConnected : true ,// keep advertising when connected (nRF52 only)
  interval: 300, //});
  phy: "coded"});
  
  
  
  NRF.setScan(function(d) {
  print(`
id ${d.id}
name : ${d.name}
rssi: ${d.rssi}
`);
},{phy:"coded"});





D13.reset();
NRF.setTxPower(8);
NRF.setAdvertising({}, { name: "eC-24", connectable:true, phy:"coded", scannable:false });