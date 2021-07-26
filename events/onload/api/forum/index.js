let children = fs.readdirSync(`${__dirname}/events/onload/api/forum`)
let objects = '<a href="__rooturl/api">..</a><br>'

children.forEach(file => {
    let name = file.replace('.js','')
    if (name != 'index') objects += `<a href='__rooturl/api/forum/${name}'>${name}</a><br>`
})

new page.loader({
    "res":res,
    "req":req,
    "basetemplate":`blank_darkmode.html`,
    "template":"<p>/api/forum index</p> <br> <children>",
    "other":[
        "children:" + objects
    ]
}).load()