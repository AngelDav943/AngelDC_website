
const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const shopdb = require(`${__dirname}/../../server-modules/shop.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.perms.admin == true) {
		console.log(req.query)
		var title = req.query.title
		var content = req.query.content
		var redirect = req.query.redirect

		if (title != null && content != null && redirect != null && req.query.username != null) {
			
			accounts.getUser(req.query.username).then(targetuser => {
				if (targetuser) accounts.notification.new(targetuser.id, title, content, redirect)
			})

			res.redirect(`${page.url}/adminpanel/new/notification`)
			
		} else {
			console.log("adminpanel/new/item @"+user.name)
	        new page.loader({
	            "res":res,
	            "req":req,
	            "template":fs.readFileSync(`${__dirname}/../../pages/admin/new/notification.html`).toString(),
	            "other":{
					
				}
	        }).load()
		}
		
    } else {
        res.redirect(`${page.url}`)
    }
})