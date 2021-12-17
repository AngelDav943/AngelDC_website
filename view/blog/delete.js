const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);

var uid = cookies.getCookie(req.headers.cookie, "uid")
accounts.getUserByUID(uid).then(user => {
    if (user && user.banned == false /*&& (user.badges.find(e => { return e == 1 }) != undefined)*/ ) {
		var id = user.id;
		var timestamp = req.query.timestamp;
		if (user.perms.admin) id = req.query.id

		blogmanager.deletePost(uid, timestamp)
		
		res.redirect(`${page.url}/blog`)
    } else {
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString()
        }).load()
    }
})