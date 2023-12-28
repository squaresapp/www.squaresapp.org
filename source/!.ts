
require("strawjs");
const straw = new Straw.Site();
const css: (string | Raw.Style)[] = [];
straw.emit();


console.log("!!!!!!!!!!!!!!!!!");
console.log(JSON.stringify(process.env, null, "\t"));
