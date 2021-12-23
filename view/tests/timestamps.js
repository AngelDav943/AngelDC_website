var date1, date2;  

date1 = new Date( Date.now() );
date2 = new Date( Date.now() + (3600000) );

var hours = Math.floor(Math.abs(date1 - date2) / 3600000);

new page.loader({
    "res":res,
    "req":req,
    "template":`<p>date1: ${date1} <br> date2: ${date2}</p> <br>`+`<p>Difference hours: ${hours}</p> ${Date.now() + (86400000*1)}`
}).load()