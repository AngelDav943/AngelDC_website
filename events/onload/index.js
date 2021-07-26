new page.loader({
    "title":"Home",
    "res":res,
    "req":req,
    "template":fs.readFileSync(`${__dirname}/view/index.html`).toString()
}).load()