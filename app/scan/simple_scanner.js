



packets=10;
NRF.setScan(function(d) {
  packets--;
  if (packets<=0)
    NRF.setScan(); // stop scanning
  else
    console.log(d); // print packet info
},{active:false});


packets=10;
NRF.setScan(function(d) {
  packets--;
  if (packets<=0)
    NRF.setScan(); // stop scanning
  else
    console.log(d); // print packet info
},{active:false, filters: [{ id: "f2:55:1e:56:8b:e5 random" }]});

  

// apple itag scanner

packets=10;
NRF.setScan(function(d) {
  packets--;
  if (packets<=0)
    NRF.setScan(); // stop scanning
  else
    console.log(d); // print packet info
},{active:false,   filters: [{ manufacturerData:{0x4c:{}} }]  });





//find me:

/*
BluetoothDevice: {
  "id": "f6:15:b4:d7:45:84 random",
  "rssi": -72,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 0, 3]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 0, 3]).buffer
 }
BluetoothDevice: {
  "id": "ce:e1:68:36:d7:a2 random",
  "rssi": -51,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 36, 0]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 36, 0]).buffer
 }
BluetoothDevice: {
  "id": "f6:15:b4:d7:45:84 random",
  "rssi": -67,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 0, 3]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 0, 3]).buffer
 }
BluetoothDevice: {
  "id": "ce:e1:68:36:d7:a2 random",
  "rssi": -46,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 36, 0]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 36, 0]).buffer
  
  
  
  
packets=10;
=10
>NRF.setScan(function(d) {
:  packets--;
:  if (packets<=0)
:    NRF.setScan(); // stop scanning
:  else
:    console.log(d); // print packet info
:},{active:true,   filters: [{ manufacturerData:{0x4c:{}} }]  });
=undefined
BluetoothDevice: {
  "id": "e3:7e:c6:1e:c4:cd random",
  "rssi": -50,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 32, 2]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 32, 2]).buffer
 }
BluetoothDevice: {
  "id": "f6:15:b4:d7:45:84 random",
  "rssi": -68,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 0, 3]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 0, 3]).buffer
 }
BluetoothDevice: {
  "id": "e3:7e:c6:1e:c4:cd random",
  "rssi": -45,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 32, 2]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 32, 2]).buffer
 }
BluetoothDevice: {
  "id": "f6:15:b4:d7:45:84 random",
  "rssi": -69,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 0, 3]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 0, 3]).buffer
 }
BluetoothDevice: {
  "id": "e3:7e:c6:1e:c4:cd random",
  "rssi": -51,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 32, 2]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 32, 2]).buffer
 }
BluetoothDevice: {
  "id": "f6:15:b4:d7:45:84 random",
  "rssi": -68,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 0, 3]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 0, 3]).buffer
 }
BluetoothDevice: {
  "id": "e3:7e:c6:1e:c4:cd random",
  "rssi": -49,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 32, 2]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 32, 2]).buffer
 }
BluetoothDevice: {
  "id": "f6:15:b4:d7:45:84 random",
  "rssi": -75,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 0, 3]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 0, 3]).buffer
 }
BluetoothDevice: {
  "id": "e3:7e:c6:1e:c4:cd random",
  "rssi": -45,
  "data": new Uint8Array([7, 255, 76, 0, 18, 2, 32, 2]).buffer,
  "manufacturer": 76,
  "manufacturerData": new Uint8Array([18, 2, 32, 2]).buffer
 }
> 
  
  
  
  BluetoothDevice: {
  "id": "f2:55:1e:56:8b:e5 public",
  "rssi": -50,
  "data": new Uint8Array([30, 255, 76, 0, 18, 25, 222, 222, 14, 132, 236, 144, 225, 238, 86, 115, 114, 21, 206, 169, 158, 31, 215, 175, 32, 128, 153, 104, 53, 0, 0]).buffer,
  "manufacturer": 76,
  "ma
  
  
  ωραια, δες λιγο και αυτα για διλο ελεγχο. Ειναι ενα chocolate tag, kineziko allal doyleyei me to findmy τησ αππλε,
  ενα ιφονε, και το ταγ μου το εσπρουιν που λεγαμε. Σιγουα το πακεττο, περα απο την αρχη τησ μακ, εχει προβλημα?
  
  BluetoothDevice: { "id": "ff:96:11:93:28:6b random", "rssi": -67, "data": new Uint8Array([30, 255, 76, 0, 18, 25, 32, 213, 149, 16, 141, 161, 85, 180, 88, 171, 175, 243, 195, 228, 191, 19, 42, 65, 201, 204, 19, 239, 193, 1, 48]).buffer, "manufacturer": 76, "manufacturerData": new Uint8Array([18, 25, 32, 213, 149, 16, 141, 161, 85, 180, 88, 171, 175, 243, 195, 228, 191, 19, 42, 65, 201, 204, 19, 239, 193, 1, 48]).buffer }BluetoothDevice: { "id": "f2:55:1e:56:8b:e5 random", "rssi": -48, "data": new Uint8Array([30, 255, 76, 0, 18, 25, 0, 222, 14, 132, 236, 144, 225, 238, 86, 115, 114, 21, 206, 169, 158, 31, 215, 175, 32, 128, 153, 104, 53, 0, 0]).buffer, "manufacturer": 76, "manufacturerData": new Uint8Array([18, 25, 0, 222, 14, 132, 236, 144, 225, 238, 86, 115, 114, 21, 206, 169, 158, 31, 215, 175, 32, 128, 153, 104, 53, 0, 0]).buffer }BluetoothDevice: { "id": "ed:3b:cb:ff:a6:c2 random", "rssi": -57, "data": new Uint8Array([30, 255, 76, 0, 18, 25, 0, 148, 134, 11, 227, 206, 241, 144, 163, 50, 41, 190, 115, 69, 76, 243, 123, 241, 178, 141, 218, 197, 90, 2, 0]).buffer, "manufacturer": 76, "manufacturerData": new Uint8Array([18, 25, 0, 148, 134, 11, 227, 206, 241, 144, 163, 50, 41, 190, 115, 69, 76, 243, 123, 241, 178, 141, 218, 197, 90, 2, 0]).buffer }
  
  */