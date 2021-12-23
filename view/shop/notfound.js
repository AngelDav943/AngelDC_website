const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (user) console.log(user.name + " opened shop item!")
	new page.loader({
		"res":res,
		"req":req,
		"template":fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString()
	}).load()
})

