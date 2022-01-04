// this enables a custom password for third party websites

const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

var name = req.query.i
var pass = req.query.ts
var enable = req.query.y
const uid = cookies.getCookie(req.headers.cookie, "uid")


accounts.loginUser(req, name, pass).then(login => {
	if (typeof(login) == "string") accounts.getUserByUID(uid).then( user => {
		console.log(`enabled == ${enable}`)
		if (enable == "false") {
			console.log("valid password and username, disabling external password")
			user.external = {}
			return
		}

		console.log("valid password and username, setting external password")
		user.external = {}
		var randomnum = Math.floor(Math.random()*1000000000000)
		if (enable == "true") user.external["pass"] = `external${Date.now()}${randomnum}`
	})
}).then(() => {
	res.redirect('/settings')
});