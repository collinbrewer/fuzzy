// dependencies
var Fuzzy=require("./src/fuzzy.js");

// export
(typeof(module)!=="undefined" ? (module.exports=Fuzzy) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return Fuzzy; }) : (window.Fuzzy=Fuzzy)));
