// YS312 family example 
const DATA_PIN = D24;   // Mandatory Data pin
const POWER_PIN = D32;  // Optional Power pin (Pass undefined if PIR is permanently powered)

// Inline C Driver 

/* 
var c = E.compiledC(`
// void initPIR(int, int)
// int readPIRForced19Bit()

// Global variables to store computed register addresses based on user selection
volatile unsigned int *DATA_PORT_OUTSET;
volatile unsigned int *DATA_PORT_OUTCLR;
volatile unsigned int *DATA_PORT_IN;
volatile unsigned int *DATA_PIN_CNF;
unsigned char DATA_PIN_SHIFT;

// Internal configuration function to dynamically map nRF52840 registers
void _mapNRF52Pin(int pinNum, volatile unsigned int **outset, volatile unsigned int **outclr, volatile unsigned int **inReg, volatile unsigned int **cnf, unsigned char *shift) {
    unsigned int baseAddr = 0x50000000UL; // Base address for Port 0
    *shift = (unsigned char)pinNum;
    
    // Check if the pin belongs to Port 1 (Pins D32 to D47)
    if (pinNum >= 32) {
        baseAddr = 0x50000300UL; // Base address for Port 1
        *shift = (unsigned char)(pinNum - 32);
    }
    
    *outset = (volatile unsigned int *)(baseAddr + 0x508);
    *outclr = (volatile unsigned int *)(baseAddr + 0x50C);
    *inReg  = (volatile unsigned int *)(baseAddr + 0x510);
    *cnf    = (volatile unsigned int *)(baseAddr + 0x700 + (*shift * 4));
}

// Global delay helpers
void delay_5us() {
    for (volatile int i = 0; i < 48; i++) { __asm("nop"); }
}

void delay_111us() {
    for (volatile int i = 0; i < 1100; i++) { __asm("nop"); }
}

// Dynamic Initialization
void initPIR(int dataPinNum, int pwrPinNum) {
    // 1. Dynamic Map and setup the Data Pin
    _mapNRF52Pin(dataPinNum, &DATA_PORT_OUTSET, &DATA_PORT_OUTCLR, &DATA_PORT_IN, &DATA_PIN_CNF, &DATA_PIN_SHIFT);
    
    // Put Data pin to deep sleep idle state immediately: Input + Disconnect (Value: 2)
    *DATA_PIN_CNF = 2; 

    // 2. Optional: If a valid power pin is provided, map and enable it PERMANENTLY
    if (pwrPinNum >= 0) {
        volatile unsigned int *pwr_outset, *pwr_outclr, *pwr_in, *pwr_cnf;
        unsigned char pwr_shift;
        
        _mapNRF52Pin(pwrPinNum, &pwr_outset, &pwr_outclr, &pwr_in, &pwr_cnf, &pwr_shift);
        
        *pwr_cnf = 1;                    // Set Power Pin as Output
        *pwr_outset = (1U << pwr_shift); // Drive Power Pin HIGH permanently to keep PIR warm
    }
}

int readPIRForced19Bit() {
    unsigned int value = 0;

    // --- PREPARE TRIGGER & DISCHARGE LINE ---
    // Switch Data Pin to Output LOW for ~15μs to fully clear any floating voltage
    *DATA_PIN_CNF = 1;                         // Output Mode
    *DATA_PORT_OUTCLR = (1U << DATA_PIN_SHIFT);  // Clear line to LOW
    for (volatile int d = 0; d < 200; d++) { __asm("nop"); }

    // --- STEPS 1 & 2: MASTER TRIGGER (FORCED READ DEMAND) ---
    *DATA_PORT_OUTSET = (1U << DATA_PIN_SHIFT);  // Low-to-High Transition (Trigger)
    delay_111us();                               // Maintain HIGH for 111 us

    // --- STEPS 3 to 8: CLOCKING & SAMPLING BLOCK (19 BITS) ---
    for (unsigned char i = 0; i < 19; i++) {
        
        // Step 3: MCU drives DOCI line LOW for 5 us
        *DATA_PIN_CNF = 1;       
        *DATA_PORT_OUTCLR = (1U << DATA_PIN_SHIFT);  
        delay_5us();

        // Step 4: MCU generates a rising edge and holds HIGH for 5 us
        *DATA_PORT_OUTSET = (1U << DATA_PIN_SHIFT);  
        delay_5us();

        // Steps 5 & 6: Switch to INPUT Mode for sampling (DOCI Window)
        *DATA_PIN_CNF = 0; // Input Mode, Connected Buffer
        delay_5us();                         

        // Sample bit (MSB first)
        value <<= 1;
        if ((*DATA_PORT_IN >> DATA_PIN_SHIFT) & 1) {
            value |= 1;
        }
    }

    // --- STEP 9: CYCLE TERMINATION & LATCH UPDATE ---
    *DATA_PIN_CNF = 1;       
    *DATA_PORT_OUTCLR = (1U << DATA_PIN_SHIFT);  
    for (volatile int d = 0; d < 150; d++) { __asm("nop"); }

    // --- IDLE DEEP SLEEP ---
    // Disconnect Data Pin entirely to eliminate the 70uA leakage (Value: 2)
    *DATA_PIN_CNF = 2; 

    // --- DATA PARSING ---
    value = (value >> 1);  // Discard Tail Bit
    value &= 0xFFFF;       // Extract 16-bit High-Pass Filter data

    return (int)value;
}
`);
*/

var c = (function(){
  var bin=(E.toFlatString||E.toString)(atob("BkoBIxNgovX8chNgQvioPANLT/CAchpgcEcAvwAKAFAMBQBQgrAAIwGTAZsvKwPcAL8BmwEz9+cCsHBHLenzQSVKJkwBI0/wgHEjYBFgAL8AvyNLGWAAIQGRHkZA8ktBAZuLQgTcAL8BmwEzAZP359/4cIATIQAgASdP8IB1J2AVYP/3z/81YP/3zP8AIyNg//fI/9j4ADBAANsBAfH/MUi/QPABABHw/wHo0QEjI2BP8IBzE2AAkQCblSsE3AC/AJsBMwCT9+dP8IBzwPNPABNgArC96PCBDAUAUGAHAFAIBQBQEAUAUA=="));
  return {
    initPIR:E.nativeCall(1, "void()", bin),
    readPIRForced19Bit:E.nativeCall(61, "int()", bin),
  };
})();


// --- JavaScript Wrapper Function ---
function setupPIR(dataPin, pwrPin) {
  var dPinNum = Number(dataPin); 
  var pPinNum = pwrPin ? Number(pwrPin) : -1;
  c.initPIR(dPinNum, pPinNum);
}

// --- Main Execution Script ---
let MOTION_THRESHOLD = 1000; 

function startPIRForcedRead() {
  setupPIR(DATA_PIN, POWER_PIN);
  console.log("Waiting 4 seconds for sensor stabilization...");
  
  setTimeout(function() {
    console.log("Dynamic Low-Power PIR Driver Initialized. Monitoring:");
    
    setInterval(function() {
      try {
        var rawVal = c.readPIRForced19Bit();
        var signedVal = (rawVal > 32767) ? rawVal - 65536 : rawVal;

        if (signedVal < -2000) return; // Reject Jitter Artifacts

        if (signedVal > MOTION_THRESHOLD) {
          console.log("MOTION! " + signedVal);
        }
      } catch(e) {
        console.log("Execution Error: ", e);
      }
    }, 200); 
  }, 4000);
}

startPIRForcedRead();