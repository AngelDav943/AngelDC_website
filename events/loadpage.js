let url = req.path.substring(1).split('/');
let urlpath = req.url;
urlpath = urlpath.split('?')[0]

let baseurl = url[0];

let filepath = `${urlpath.toLowerCase()}/index`;

if ( url[url.length-1] != "index" && fs.existsSync(`${__dirname}/view${urlpath.toLowerCase()}.html`)) 
    filepath = urlpath.toLowerCase()

let paths = filepath.split('/');
let title = [url.length - 1];
let scriptpath = `${__dirname}/events/onload${urlpath.toLowerCase()}.js`;
let scriptloaded = false

if (fs.existsSync(scriptpath)) {
    eval(fs.readFileSync(scriptpath).toString())
    scriptloaded = true
} else {
    scriptpath = `${__dirname}/events/onload${urlpath.toLowerCase()}/index.js`
    if (urlpath.toLowerCase() == "/") scriptpath = `${__dirname}/events/onload/index.js`
    try {
        eval(fs.readFileSync(scriptpath).toString())
        scriptloaded = true
    } catch(err) {
        try {
            if (urlpath.toLowerCase() != "/" && url[0].toLowerCase() != "assets") {
                eval(fs.readFileSync(`${__dirname}/events/onload/${url[0].toLowerCase()}/notfound.js`).toString())
                scriptloaded = true
            }
        } catch(err) {

        }
    }
}

setTimeout(() => {
    if (!scriptloaded) new page.loader({
        "res":res,
        "req":req,
        "title":title,
        "templatedir":filepath
    }).load()
},)