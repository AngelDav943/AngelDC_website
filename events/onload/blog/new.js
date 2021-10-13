var post_title = req.query.t;
var post_content = req.query.c;

console.log(post_title +" || "+ post_content )

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && (user.badges.find(e => { return e == 1 }) != undefined || user.perms.bot == true) ) {

		if (post_title && post_content) {
			var posts = JSON.parse(fs.readFileSync(`${__dirname}/assets/public/posts.json`));
			posts.push({
				"user": user.id,
				"title": post_title.replace(/>/,"").replace(/</,""),
				"content": post_content.replace(/<slash-n>/g,"\n").replace(/>/,""),
				"timestamp": Date.now()
			})

			fs.writeFile(`${__dirname}/assets/public/posts.json`, JSON.stringify(posts), err => {
				if (err) console.log(err)
			})
			res.redirect(`${page.url}/blog`)
		} else {
			new page.loader({
				"res":res,
				"req":req,
				"template":fs.readFileSync(`${__dirname}/pages/blog/new.html`).toString()
			}).load()
		}

    } else {
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/pages/noaccess.html`).toString()
        }).load()
    }
})
			