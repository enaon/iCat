ew.apps.lBox={state:{on:0,auto:0}};


// install icon
if (!require('Storage').read("ew_i_lBox.img"))  {
  let icon="mEwwkFqoAfqczkcyCyUykUikICBmoWSAAURDB9SFgMRAAkjC5oWHiMSGBguBCwwwOqQuHC5xGIAAMTJBYXibhZ2BO5MzmYXMGA8TmR4BkclIw4ACDAsSe4UyiUiFxAADCwQTBBAgXJFAIbFAAcjkIXIIgYXKL4wXFGREzC5J1GCwoXJZYLAFGIYWBC5NCmaHELYYWCHgIXHoglDDQIUDCwQXKolCDIYADHAbtGC4YZDABAXMAAgXNqoTEoLBIC5QMBkjZJC5JcDaooACkgXKkJ0ISAMhC5buDeQgXBXoxHGDIovDC5MUoMjIw4ICC5NUoKJGCwLvCCxAABK4QxEAgYuJAANRLQgAFooXORoi9CC6Y0CC68UioXTiURigWKC4UBC40BC5ioBqBHGCpjCFAAchC6sSahZ6LCyAYFUZZJKCygwCCygAOA==";
  require('Storage').write("ew_i_lBox.img", require("heatshrink").decompress(atob(icon)));
}

