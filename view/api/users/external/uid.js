const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
//const cookies = require(`${__dirname}/../../server-modules/cookies.js`)

let external = {
	"username":	req.query.username,
	"pass":		req.query.externalpass
}

accounts.getUser(external.username).then(user => {
	
})