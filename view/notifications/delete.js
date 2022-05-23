const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const fetch = require('node-fetch');
const uid = cookies.getCookie(req.headers.cookie, "uid")

accounts.getUserByUID(uid).then(user => {
	if (user) {
		if (req.query.timestamp) accounts.notification.remove(uid,req.query.timestamp)
		res.redirect(`${page.url}/notifications`)
	} else {
		res.redirect(page.url)
	}
})