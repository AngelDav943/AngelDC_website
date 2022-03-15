
const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const shopdb = require(`${__dirname}/../../server-modules/shop.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.perms.admin == true) {
		console.log(req.query)

		if (req.query.title != null && req.query.cost != null && parseInt(req.query.cost).toString() != "NaN") {
			var optionaldata = {
				"tradeable": false
			}
			
			if (req.query.date != '' && req.query.time != '' && req.query.date != null) {
				var timestamp = new Date(req.query.date + " " + req.query.time).getTime()
				optionaldata["limited"] = parseInt(timestamp)
			}

			if (req.query.tradeable == 'on') optionaldata["tradeable"] = true
			if (req.query.isenabled == null) optionaldata["disabled"] = true
			
			var newitem = Object.assign({
				"name": req.query.title,
				"cost": parseInt(req.query.cost),
				"icon_url": req.query.iconurl,
				"description": req.query.description,
				"publisher": user.id
			}, optionaldata)

			console.log(newitem)
			shopdb.newitem(newitem)
			
		} else {
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
		}
		
    } else {
        res.redirect(`${page.url}`)
    }
})