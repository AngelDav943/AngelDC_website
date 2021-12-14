new page.loader({
    "res":res,
    "req":req,
    "template":fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString()
}).load()