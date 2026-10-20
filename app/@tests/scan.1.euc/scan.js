//BLE scanner

ew.apps.scan = {state:{def:{}}};

//ew.UI.icon.scan="mEwwhC/AH4ABmczmAVSgczkUikcjCyMyCwIACmQWRIwIABAoIYOIgIWDDAcgFxoWFAAJKBFxkjC44wNFxAvCMJUDLowXEJBUDIxQABJBJGJC970EXqIXvLwYXrCwjYJC75GFX5UjFxYXJgYXFFwoXLkQWKLxJgFCw4XLmZIBCxBGJYIYVHF5owBC5QwUmUSGBsjDAsykERGBsAVQQCBCwMAgIYCC5cAgRyGiJJBGBgAHGAIxBC6YwBGIIwwC6gwCC6gwBiAXVAH4A8A="

// install icon
if (!require('Storage').read("ew_i_scan.img") )  {
    let icon="mEwwhC/AH4ABmczmAVSgczkUikcjCyMyCwIACmQWRIwIABAoIYOIgIWDDAcgFxoWFAAJKBFxkjC44wNFxAvCMJUDLowXEJBUDIxQABJBJGJC970EXqIXvLwYXrCwjYJC75GFX5UjFxYXJgYXFFwoXLkQWKLxJgFCw4XLmZIBCxBGJYIYVHF5owBC5QwUmUSGBsjDAsykERGBsAVQQCBCwMAgIYCC5cAgRyGiJJBGBgAHGAIxBC6YwBGIIwwC6gwCC6gwBiAXVAH4A8A="
    require('Storage').write("ew_i_scan.img", require("heatshrink").decompress(atob(icon)));
}