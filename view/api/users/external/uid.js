const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
//const cookies = require(`${__dirname}/../../server-modules/cookies.js`)

let external = {
	"username":	req.query.user,
	"pass":		req.query.pass
}

accounts.getUser(external.username).then(user => {
	if (external.pass == user.external.pass)
	{
		console.log("valid")
		res.send(accounts.createexternaluid(user));
	}
})