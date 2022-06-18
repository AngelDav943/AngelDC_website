const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

var content = req.query.c;
var documentid = req.query.did;
var timestamp = req.query.tim;

var uid = cookies.getCookie(req.headers.cookie, "uid")
accounts.getUserByUID(uid).then(user => {
    if (user && user.banned == false ) {
		blogmanager.getPost_withTimestamp(timestamp).then(post => {
			if (!post) return;
			blogmanager.newComment(uid, documentid, content)
			if (post.user != user.id) accounts.notification.new(
				post.user,
				`New comment on your post "${post.title}"`,
				`@${user.name} commented on your post: <br> "${content.replace(/<LINEBREAK>/g,"\n").replace(/</g, "").replace(/\n/g," <br> ")}"`,
				`blog/${timestamp}`
			)
		}).then(() => {
			res.redirect(`${page.url}/blog/${timestamp}`);
		})
	}
})