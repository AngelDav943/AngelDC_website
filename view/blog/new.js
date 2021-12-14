const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
var post_title = req.query.t;
var post_content = req.query.c;


console.log(post_title +" || "+ post_content )

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.banned == false && (user.badges.find(e => { return e == 1 }) != undefined) ) {

		if (post_title && post_content) {
			var posts = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/posts.json`));
			var posttitle = post_title.replace(/>/,"").replace(/</,"")
			var postcontent = post_content.replace(/<slash-n>/g,"\n").replace(/>/,"")

			if (postcontent != "" && posttitle != "") if (posts[posts.length-1].title != posttitle && posts[posts.length-1].content != postcontent && posts[posts.length-1].timestamp - Date.now() < -10000) {

				blogmanager.newPost(
					cookies.getCookie(req.headers.cookie, "uid"),
					posttitle,
					postcontent
				);
				
			}
			res.redirect(`${page.url}/blog`)
		} else {
			new page.loader({
				"res":res,
				"req":req,
				"template":fs.readFileSync(`${__dirname}/../../pages/blog/new.html`).toString()
			}).load()
		}

    } else {
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString(),
			"other":{
				"message":"cooldown"
			}
        }).load()
    }
})
			