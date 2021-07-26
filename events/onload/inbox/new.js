accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.banned == false) {
		console.log(req.query)
        if (req.query != {} && req.query.t != undefined) {

            var t = req.query.t.replace(/%20/g," ") || "";
            var c = req.query.c.replace(/%20/g," ") || "";
            var targetuser = req.query.u
			
            accounts.getUser(targetuser).then(targetu => {
				//console.log(targetu)
				inbox.newMessage(user.id,targetu.id,t,c).then((response,err) => {
					console.log("AAAA")
					console.log(response)
					if (!err && response) {
						res.redirect(response)
					} else {
						console.log(err)
						res.redirect(`${page.url}/inbox`)
					}
				})
			})
        } else {
            var npost_html = fs.readFileSync(`${__dirname}/pages/inbox/new.html`).toString();
			new page.loader({
				"res":res,
				"req":req,
				"template":npost_html,
				"other":[
					"inbox_size:"
				]
			}).load()
        }
    }
})