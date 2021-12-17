const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

let uid = cookies.getCookie(req.headers.cookie, "uid");
accounts.getUserByUID(uid).then(user => {

	if (user && user["currency"] < 100) {
		console.log(`${user.name} got 10 credits!`)
		accounts.getCurrency(uid, 10)
	}
	
	res.redirect(`${page.url}/home`)
})
