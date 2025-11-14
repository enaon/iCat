// BLE Configuration
var SERVICE_UUID = "0x180A";
var CONTROL_CHARACTERISTIC = "0x9C40";
var CMD_ON_OFF_1 = 0x7032;
var CMD_ON_OFF_2 = 0x7033;  
var CMD_UNKNOWN = 0x7034;
var packetId = 1000;
var characteristic = null;

function connectToBulb() {
  console.log(" Scanning for QUEC bulbs...");
  NRF.requestDevice({ 
    active:true,
    filters: [{  id:"7c:e7:12:52:f6:78 public" }],
    timeout: 10000 
  }).then(function(device) {
    console.log("found: " + device.shortName);
    return device.gatt.connect();
  }).then(function(gatt) {
    console.log(" Connected to device");
    return gatt.getPrimaryService(SERVICE_UUID);
  }).then(function(service) {
    console.log(" Found service");
    return service.getCharacteristic(CONTROL_CHARACTERISTIC);
  }).then(function(char) {
    characteristic = char;
    console.log(" Got control characteristic!");
    characteristic.on('characteristicvaluechanged', function(event) {
      var value = new Uint8Array(event.target.value.buffer);
      console.log(" Response:", value);
    });
    return characteristic.startNotifications();
  }).then(function() {
    console.log(" READY! Try these commands:");
    console.log("turnOn() - turnOff() - sendTest()");
  }).catch(function(error) {
    console.log("Error:", error);
  });
}

function sendCommand(command, payload) {
  if (!characteristic) {
    console.log("Not connected!");
    return;
  }
  // FIXED: Σωστός υπολογισμός μήκους
  var payloadLength = payload.length;
  var dataFieldLength = payloadLength + 5; // CRC(1) + PacketID(2) + Command(2) = 5 bytes
  var totalPacketLength = 4 + 2 + dataFieldLength; // Header(4) + LengthField(2) + DataField(dataFieldLength)
  var packet = new Uint8Array(totalPacketLength);
  // Header: AAAA AAAA (4 bytes)
  packet[0] = 0xAA; 
  packet[1] = 0xAA; 
  packet[2] = 0xAA; 
  packet[3] = 0xAA;
  // Data length (2 bytes) - payload + 5
  packet[4] = (dataFieldLength >> 8) & 0xFF;
  packet[5] = dataFieldLength & 0xFF;
  // CRC (1 byte) - placeholder
  packet[6] = 0x00;
  // Packet ID (2 bytes)
  packet[7] = (packetId >> 8) & 0xFF;
  packet[8] = packetId & 0xFF;
  // Command (2 bytes)
  packet[9] = (command >> 8) & 0xFF;
  packet[10] = command & 0xFF;
  // Payload (if any)
  for(var i = 0; i < payloadLength; i++) {
    packet[11 + i] = payload[i];
  }
  // Calculate CRC (sum of bytes from position 6 to end)
  var crc = 0;
  for(var i = 6; i < totalPacketLength; i++) {
    crc = (crc + packet[i]) & 0xFF;
  }
  packet[6] = crc;
  console.log("Sending packet length:", totalPacketLength, "bytes:", packet);
  characteristic.writeValue(packet);
  console.log("Sent: Command=0x" + command.toString(16) + " PacketId=" + packetId);
  packetId++;
}

function turnOn() {
  console.log("Trying to turn ON...");
  sendCommand(CMD_ON_OFF_1, []);  // Empty payload
}

function turnOff() {
  console.log("Trying to turn OFF...");  
  sendCommand(CMD_ON_OFF_2, []);  // Empty payload
}

function sendTest() {
  console.log("Sending test command...");
  sendCommand(CMD_UNKNOWN, [0x00, 0x0B, 0x00, 0x10]); // Sample payload from Wireshark
}

// Auto-connect
connectToBulb();



////2


function sendPlugCommand(isOn) {
  const SERVICE_UUID = "0x180A";       // Όπως είχες πει
  const CHARACTERISTIC_UUID = "0x9C40"; // Όπως είχες πει
  const DEVICE_MAC = "7c:e7:12:52:f6:78 public";

  // Payload: aa aa 00 05 8d 03 e8 70 32 (ON) ή aa aa 00 05 da 03 e9 70 33 (OFF)
  const payload = isOn ? 
    new Uint8Array([170, 170, 0, 5, 141, 3, 232, 112, 50]) :
    new Uint8Array([170, 170, 0, 5, 218, 3, 233, 112, 51]);

  let gattConnection;
  let characteristic;

  NRF.connect(DEVICE_MAC,{minInterval:7.5,maxInterval:50})
    .then(gatt => {
      gattConnection = gatt;
      print("1. Συνδέθηκε!");
      return gatt.getPrimaryService(SERVICE_UUID);
    })
    .then(service => {
      print("2. Βρέθηκε service!");
      return service.getCharacteristic(CHARACTERISTIC_UUID);
    })
    .then(char => {
      characteristic = char;
      print("3. Ενεργοποίηση notifications...");
      return characteristic.startNotifications();
    })
   .then(() => {
      characteristic.on('characteristicvaluechanged', data => {
        const response = new Uint8Array(data.target.value.buffer);
        print(" Απάντηση Plug:", response);
      });
      print("4. Αποστολή:", isOn ? "ON" : "OFF");
      print("Payload:", payload);
      return characteristic.writeValue(payload);
    })
    .then(() => {
      print("5. Επιτυχία! Περιμένω απάντηση...");
      setTimeout(() => {
        if (gattConnection) gattConnection.disconnect();
        print("6. Η σύνδεση έκλεισε.");
      }, 5000);
    })
    .catch(err => {
      print("Σφάλμα:", err);
      if (gattConnection) gattConnection.disconnect();
    });
}