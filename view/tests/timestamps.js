var date1, date2;  

date1 = new Date( Date.now() );
date2 = new Date( Date.now() + (86400000*1) );

var ress = Math.abs(date1 - date2) / 1000;

// get total days between two dates
var days = Math.floor(ress / 86400);

new page.loader({
    "res":res,
    "req":req,
    "template":`<p>date1: ${date1} <br> date2: ${date2}</p> <br>`+`<p>Difference days: ${days} <br> ${Math.min(days,2)} </p> ${Date.now() + (86400000*1)}`
}).load()