args = url
args.shift()

var string_args = ""

if (args.length > 0) args.forEach(b => {
	string_args = `${string_args}/${b}`
})

let children = fs.readdirSync(`${__dirname}/../../assets/public${string_args}`)
let objects = ''
if (args.length > 0) {
	var bac = string_args.split('/')
	bac.pop()
	objects = `<a href="__rooturl/files${bac.join('/')}">..</a><br>`
}

children.forEach(file => {
    let name = file.split('.')
	if (!name[1]) objects += `<a href='__rooturl/files${string_args}/${file}'>${file}</a><br>`
    if (file != 'index' && file != "notfound" && name[1]) objects += `<a href='__rooturl/assets${string_args}/${file}'>${file}</a><br>`
})
new page.loader({
    "res":res,
    "req":req,
    "basetemplate":`${__dirname}/../../assets/server/basetemplates/blank_darkmode.html`,
    "template":`<p>/assets${string_args} index</p> <br> <¡children>`,
    "other":{
        "children":objects
	}
}).load()