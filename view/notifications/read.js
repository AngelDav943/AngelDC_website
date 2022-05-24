const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const fetch = require('node-fetch');
const uid = cookies.getCookie(req.headers.cookie, "uid")

//console.log(req.query.timestamp.split(","))

accounts.getUserByUID(uid).then(user => {
	if (user) {
		var timestamps = req.query.timestamp.split(",")
		var value = undefined
		if (req.query.value != undefined) value = (req.query.value == "true")
		
		if (req.query.timestamp) if (timestamps.length > 1) {
			for (var i = 0; i < timestamps.length; i++) {
				accounts.notification.read(uid,timestamps[i],value)
			}
		} else {
			accounts.notification.read(uid,req.query.timestamp,value)
		}
		res.redirect(`${page.url}/notifications`)
	} else {
		res.redirect(page.url)
	}
})