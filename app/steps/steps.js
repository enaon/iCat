ew.apps.steps={
    state:{def:{page:0, topL:6000, btmL:500, tare:0, strd: 145, dist: 0}}};

if (require('Storage').readJSON('ew.json', 1).steps) {
    ew.apps.steps.state.def = require('Storage').readJSON('ew.json', 1).steps;
    ew.apps.steps.state.myprofile = require("Storage").readJSON("myprofile.json",1)||{};
    if (ew.apps.steps.state.myprofile.strideLength) ew.apps.steps.state.def.strd=ew.apps.steps.state.myprofile.strideLength;
    if (!ew.apps.steps.state.myprofile.strideLength) ew.apps.steps.state.def.strd = 145;
    delete ew.apps.steps.state.myprofile;
    if (ew.apps.steps.state.def.dist = "NaN") ew.apps.steps.state.def.dist=0;
    
}

//ew.UI.icon.steps="nE4wkEogA/AH4A/AE1BiIb1gIbZoEADbMADbI2BgEBOokUGyYABA4cRHqI2CAAMEA4QbXHARYBiJUQDQgYCAAQbWVQIbSmcQHBQaNoczmI4KDZsjmczkA4JkgaLoIbCmQ4JOBlBkQbBKo4bPoEiHASOFiUhDYMiN5kCDYZVCiIHBmSMPgJUDKoUjkURRoUSRhlAiQ4DKogJBfp8AHAhVBKgo3MHAMBHAkggRUCVQT9NKoI4Ff4obNKoI4FcYpwNVYTHGHCdAgQ4DmAbFHB9AibHHRqAABoJVDmI4VOQI4aojIDHC9AKobHEHCRVIHAIcRZAbkEDYJVRZAZyDHCZyEDgY4ScoshDaqPBDgcyiBUBkgbRDgszkUjDaYcE///mQaTSAUBiUikQaVAH4A/AH4ANA";
//ew.UI.icon.steps="mEwwkEogA/AH4AtiMUC9lAgIXVfYIXUoAXBggGCoIuRC4hkQC4UAGoURiJGQAAMBDoIXUCoQXOoUgC4kBC4RgMmcyC4gwDC5dCmczGBESC5USC4MyiAwHC5UCkYYBmJ4HkgXJoMiC4MzkJFBiUikJgMoESGARJBgQWDF5dEgIwDJIcSDIKQLGAiTBgIFBC4KQLGAsygIVBVQTxMFQR6DSYbxMJIIwDYgYwODAj1EGBrEBJIYXDGBz1BVYwwPJIhhSJIgwTVgirDiIwOohJGJAIYOoETYgoXBJJxiDDAQwQDAsRMKJ7EmUhC6L3FmckC6AYBiMiAAIWRAH4A/ADA=";


// install icon
if (!require('Storage').read("ew_i_steps.img")) {
    let icon="mEwwkEogA/AH4AtiMUC9lAgIXVfYIXUoAXBggGCoIuRC4hkQC4UAGoURiJGQAAMBDoIXUCoQXOoUgC4kBC4RgMmcyC4gwDC5dCmczGBESC5USC4MyiAwHC5UCkYYBmJ4HkgXJoMiC4MzkJFBiUikJgMoESGARJBgQWDF5dEgIwDJIcSDIKQLGAiTBgIFBC4KQLGAsygIVBVQTxMFQR6DSYbxMJIIwDYgYwODAj1EGBrEBJIYXDGBz1BVYwwPJIhhSJIgwTVgirDiIwOohJGJAIYOoETYgoXBJJxiDDAQwQDAsRMKJ7EmUhC6L3FmckC6AYBiMiAAIWRAH4A/ADA=";
    require('Storage').write("ew_i_steps.img", require("heatshrink").decompress(atob(icon)));
}