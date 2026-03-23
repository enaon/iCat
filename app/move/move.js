ew.apps.move={
    state:{def:{page:0, topL:8000, btmL:1000}}};

if (require('Storage').readJSON('ew.json', 1).move) {
    ew.apps.move.state.def = require('Storage').readJSON('ew.json', 1).move;
    
}

// install icon
if (!require('Storage').read("ew_i_move.img")) {
    let icon="mEwwhC/AH4A/AAmIxEAhGIwAWSAAmAAQQWLFQIAJDBYWKAAIkCC5JBCBoIzPEIZdFDY4XHwBhHC4wwFA4QXLWJAOEIoZ0EC4ZIFC4gpDGoqfEGIYXHJoy3FDAJODC5hqGRwgaDC4ZmCQYwXNFg4XXCgoXaLYYeFC6KSGDwYXSGwgXmB4SjEQoYDCC4r1GC4wDDC4oaFEIgXIARJaDJwgjDCgxNGOwgXBAgQXEAAoqEC4wAKLxIFDC5RGDC6QACCIUIDYRIOFwYAHFx4YTFxQAIKAYWSN44A/AH4AVA==";
    require('Storage').write("ew_i_move.img", require("heatshrink").decompress(atob(icon)));
}