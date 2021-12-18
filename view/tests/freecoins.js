const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

let uid = cookies.getCookie(req.headers.cookie, "uid");
accounts.getUserByUID(uid).then(user => {

	if (user && user["currency"] < 200) {
		console.log(`${user.name} got 15 credits!`)
		accounts.getCurrency(uid, 15)
	}
	
	res.redirect(`${page.url}/home`)
})
