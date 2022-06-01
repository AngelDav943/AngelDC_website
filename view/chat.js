const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user) {
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/../../pages/chat.html`).toString(),
			"other":{}
        }).load()
    } else {
        res.redirect(`${page.url}/login`)
    }
})