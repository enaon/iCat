ew.apps.light={state:{on:0,auto:0}};


// install icon
if (!require('Storage').read("ew_i_light.img")) {
    let icon="mEwwhC/AFUO93u8AWSCoIADFqYADGKAWFGCAuGGCAWHGBwuIGBwXvCxJgNC/4X3a/5gSCxgXYJBBGNC7BIICxwXYJAxGPC7BIGCyAX/ABERAAgX/C/4AJgIWDiAXpJAgWSDAYWUAH4AV";
    require('Storage').write("ew_i_light.img", require("heatshrink").decompress(atob(icon)));
}

