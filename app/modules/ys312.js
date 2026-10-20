// YS312 family module 

// Inline C Driver 
var c = (function(){
  var bin=(E.toFlatString||E.toString)(atob("HygwtcOyBdwhSnpEE3BP8KBDBOAfSnpEIDsTcBtLHkp6RAP1oWAQYBxKekQD8gxQEGAbSnpEA/WiYBBgGUp6RE/04GAUeBhKAOuEAHpExRgVYAEiwlAAKQL6BPLD+AglEtsfKcuyxb8ISiA7T/CgQtuyAvXgYQHrgwEDIAhgASEB+gPzwvgINTC9AL8AAwBQugEAAK4BAACsAQAAqgEAAIwBAACGAQAAfAEAAIKwACMBkwGbCysD3AC/AZsBM/fnArBwRy3p9082STdMN004T3lEASMKaHxEE2B9RAZGIHgqaINAE2AzS3tET/ATCE/wAAqLRgGTf0Tb+AAwAZpP8AEJw/gAkJT4AOASaAn6DvMTYP/3y///98n/lPgA4CpoCfoO8xNg//fB/9v4ACACIxNg//e7/9v4ACAAIxNg//e1///3s/87aJT4AOAbaCP6DvPbBwr6CfoI8f84SL9K6gkKGPD/CMfRE0t7RAIhG2gZYAr0wCOz9YAvCNAPS3tEs/kAALBC2L9v8AEAB+AMS3tESvNPABiAhkKovwAgA7C96PCP+AAAAO4AAADyAAAAygAAAOwAAABeAAAAUgAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="));
  return {
    initPIR:E.nativeCall(1, "void(int, int)", bin), //data pin/power pin optional, else -1
    readPIR:E.nativeCall(197, "int(int)", bin), // threshold( returns > 0 value |-1 jitter|-2 bad header)
  };
})();
exports = c;
