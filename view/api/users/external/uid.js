const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
//const cookies = require(`${__dirname}/../../server-modules/cookies.js`)

let external = {
	"username":	req.query.user,
	"pass":		req.query.pass
}

accounts.getUser(external.username).then(user => {
	if (user && external.pass == user.external.pass)
	{
		console.log("api/external/uid _ valid")
		res.send(accounts.createexternaluid(user));
	}
	else
	{
		console.log("api/external/uid _ invalid") //res.status(500)
		res.send("null")
	}
}).then(() => {
	if(!this.res.headersSent) res.send("null")
})

