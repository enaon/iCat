// YS312 family example 
const DATA_PIN = D24;   // Mandatory Data pin
const POWER_PIN = D32;  // Optional Power pin (Pass undefined if PIR is permanently powered)

// Inline C Driver 
var c = E.compiledC(`
// void initPIR(int, int)
// int readPIR(int)

volatile unsigned int *DATA_PORT_OUTSET;
volatile unsigned int *DATA_PORT_OUTCLR;
volatile unsigned int *DATA_PORT_IN;
volatile unsigned int *DATA_PIN_CNF;
unsigned char DATA_PIN_SHIFT;

void _mapNRF52Pin(int pinNum, volatile unsigned int **outset, volatile unsigned int **outclr, volatile unsigned int **inReg, volatile unsigned int **cnf, unsigned char *shift) {
    unsigned int baseAddr = 0x50000000UL;
    *shift = (unsigned char)pinNum;
    
    if (pinNum >= 32) {
        baseAddr = 0x50000300UL;
        *shift = (unsigned char)(pinNum - 32);
    }
    
    *outset = (volatile unsigned int *)(baseAddr + 0x508);
    *outclr = (volatile unsigned int *)(baseAddr + 0x50C);
    *inReg  = (volatile unsigned int *)(baseAddr + 0x510);
    *cnf    = (volatile unsigned int *)(baseAddr + 0x700 + (*shift * 4));
}
void delay() {
    for (volatile int i = 0; i < 24; i++) { __asm("nop"); }
}
void delay_h() {
    for (volatile int i = 0; i < 700; i++) { __asm("nop"); }
}
/*
void delay() {  //500 ns
    __asm volatile(
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"
        "nop\n\t" "nop\n\t" "nop\n\t" "nop\n\t"        
    );
}
*/
void initPIR(int dataPinNum, int pwrPinNum) {
    _mapNRF52Pin(dataPinNum, &DATA_PORT_OUTSET, &DATA_PORT_OUTCLR, &DATA_PORT_IN, &DATA_PIN_CNF, &DATA_PIN_SHIFT);
    *DATA_PIN_CNF = 1; 
    *DATA_PORT_OUTSET = (1U << DATA_PIN_SHIFT); 
    
    if (pwrPinNum >= 0) {
        volatile unsigned int *pwr_outset, *pwr_outclr, *pwr_in, *pwr_cnf;
        unsigned char pwr_shift;
        _mapNRF52Pin(pwrPinNum, &pwr_outset, &pwr_outclr, &pwr_in, &pwr_cnf, &pwr_shift);
        *pwr_cnf = 3;                  
        *pwr_outset = (1U << pwr_shift);
    }
}

int readPIR(int threshold) {
    unsigned int value = 0;
    unsigned int valid = 1;
    static short lastSigned = 0;   // remembers the last valid signed reading

    // --- STEPS 1 & 2: MASTER TRIGGER (FORCED READ DEMAND) ---
    *DATA_PIN_CNF = 1;                          // Output Mode
    *DATA_PORT_OUTSET = (1U << DATA_PIN_SHIFT); // Low-to-High Transition (Trigger)
    delay; 

    // --- CLOCKING & SAMPLING BLOCK (19 BITS) ---
    for (unsigned char i = 0; i < 19; i++) {
        *DATA_PIN_CNF = 1;                     
        *DATA_PORT_OUTCLR = (1U << DATA_PIN_SHIFT);  
        delay();
        *DATA_PORT_OUTSET = (1U << DATA_PIN_SHIFT);  
        delay();

        *DATA_PIN_CNF = 0; 
        delay(); 
        value <<= 1;
        if ((*DATA_PORT_IN >> DATA_PIN_SHIFT) & 1) {
            value |= 1;
        }
    }
    
    // --- CYCLE TERMINATION ---
    *DATA_PIN_CNF = 2;
    *DATA_PIN_CNF = 0;
    
    // --- VERIFY START BITS (first two bits must be 1 and 0) ---
    if (((value >> 18) & 1) != 1 || ((value >> 17) & 1) != 0) {
        valid = 0; 
    }

    // --- DATA PARSING ---
    value = (value >> 1);  // Discard Tail Bit
    value &= 0xFFFF;       // Keep 16-bit raw data
    short signedVal = (short)value; // to signed 16-bit integer 

    // --- FILTER & THRESHOLD ---

    if (!valid ) { 
        if (threshold < lastSigned) {
            return 1; // if header is wrong, but right afrer a valid motion, condider as motion.
        }
        return -2; // wrong header – discard
    }
    
    lastSigned = signedVal;   // update the remembered value

    
    if (threshold < signedVal) {
        return (int)signedVal; // Motion detected! Return the actual amplitude
    }

    return 0; // No motion or below threshold
}
`);

// --- Main Execution Script ---
const MOTION_THRESHOLD = 1000; 

function startPIR() {

  console.log("Waiting 4 seconds for sensor stabilization...");
  c.initPIR(DATA_PIN, POWER_PIN); //dataPin, pwrPin or -1 

  setTimeout(function() {
    console.log("C-Level PIR Driver Initialized.");

    setInterval(function() {
      try {
        var res = c.readPIR(MOTION_THRESHOLD);

        if (res > 0) {
          console.log("MOTION! " + res);
        } else if (res === -1) {
          console.log("*****: Jitter Artifact Detected");
        } else if (res === -2) {
          console.log("*****: Start Bits Mismatch (timing issue)");
        }
      } catch(e) {
        console.log("Execution Error: ", e);
      }
    }, 250); // 250ms interval για εξοικονόμηση ενέργειας
  }, 4000);
}

startPIR();