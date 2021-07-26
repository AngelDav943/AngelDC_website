let children = Object.keys(accounts);
let functions = ''


children.forEach(functionname => {
    functions += `<p style="color:#808080">${functionname}();</p>`
})

new page.loader({
    "res":res,
    "req":req,
    "basetemplate":`blank_darkmode.html`,
    "template":"<p>account-manager module functions: </p> <br> <children>",
    "other":[
        "children:" + functions
    ]
}).load()