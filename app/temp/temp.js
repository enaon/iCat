ew.apps.temp={
    state:{def:{page:0, topL:30, btmL:20}}};

if (require('Storage').readJSON('ew.json', 1).temp) {
    ew.apps.temp.state.def = require('Storage').readJSON('ew.json', 1).temp;
    
}

// install icon
if (!require('Storage').read("ew_i_temp.img")) {
    let icon="mEwwhC/AE8IxAACC6QWDC7geOC/B3vC67ICR/5HcU/6P3C66P/d76Pm1AXHhOZzIXL5gAD4B2QhgXE5gXQCwoXYJB5GGC/4XwR66/YJAouQGAwWRgEFFyoA/AGI=";
    require('Storage').write("ew_i_temp.img", require("heatshrink").decompress(atob(icon)));

    
}