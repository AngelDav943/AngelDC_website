let children = fs.readdirSync(`${__dirname}/events/onload/api`)
let objects = ''

children.forEach(file => {
    let name = file.replace('.js','')
    if (name != 'index') objects += `<a href='__rooturl/api/${name}'>${name}</a><br>`
})

new page.loader({
    "res":res,
    "req":req,
    "basetemplate":`blank_darkmode.html`,
    "template":"<p>/api index</p> <br> <children>",
    "other":[
        "children:" + objects
    ]
}).load()