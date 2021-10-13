const accounts = require(`${__dirname}/../../server-modules/accounts.js`)
const cookies = require(`${__dirname}/../../server-modules/cookies.js`)

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && (user.badges.find(e => { return e == 1 }) != undefined)) {
		var id = user.id;
		var timestamp = req.query.timestamp;
		if (user.perms.admin) id = req.query.id

		var posts = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/posts.json`));

		let modified_posts = posts.filter(obj => {
			return (obj.timestamp+"|"+obj.user) != (timestamp+"|"+id)
		});

		fs.writeFile(`${__dirname}/../../assets/public/posts.json`, JSON.stringify(modified_posts), err => {
			if (err) console.log(err)
		})
		
		res.redirect(`${page.url}/blog`)
    } else {
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString()
        }).load()
    }
})