
const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

// TODO: Connect firestore database to item creation page

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.perms.admin == true) {
		console.log("adminpanel/new/item @"+user.name)
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/../../pages/admin/new/item.html`).toString(),
            "other":{
				"itempreview": new page.templater({
					"templatedir": `${__dirname}/../../assets/public/templates/shopitem.html`,
					"other": {
						"item": {
							"name":"",
							"cost":0
						},
						"islimited":""
					}
				}).load()
			}
        }).load()
    } else {
        res.redirect(`${page.url}`)
    }
})