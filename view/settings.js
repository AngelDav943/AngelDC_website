const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user) {
		if (user.external == undefined) user.external = {}
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/../../pages/settings.html`).toString(),
			"other":{
				"description":user.description.replace(/<br>/g,"\n").replace("",""),
				"external":{
					"status": (Object.keys(user.external).length === 0 ? "enable" : "disable"),
					"statusbool": Object.keys(user.external).length === 0,
				}
			}//String.fromCharCode(09)
        }).load()
    } else {
        res.redirect(`${page.url}/login`)
    }
})