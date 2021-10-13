args = url
args.shift()

var string_args = ""
if (args.length > 0) args.forEach(b => {
	string_args = `${string_args}/${b}`
})

let children = fs.readdirSync(`${__dirname}/events/onload/api${string_args}`)
let objects = ''
if (args.length > 0) {
	var bac = string_args.split('/')
	bac.pop()
	objects = `<a href="__rooturl/api${bac.join('/')}">..</a><br>`
}

children.forEach(file => {
    let name = file.replace('.js','')
    if (name != 'index' && name != "notfound") objects += `<a href='__rooturl/api${string_args}/${name}'>${name}</a><br>`
})

new page.loader({
    "res":res,
    "req":req,
    "basetemplate":`blank_darkmode.html`,
    "template":`<p>/api${string_args} index</p> <br> <¡children>`,
    "other":[
        "children:" + objects
    ]
}).load()