const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

args = url
args.shift()

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (user) console.log(user.name + " opened shop item!")
	var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
	let item = items.find(obj => obj.id == args[0])
	new page.loader({
		"res":res,
		"req":req,
		"template":(item ? fs.readFileSync(`${__dirname}/../../pages/shop/notfound.html`).toString() : ""),
		"other":{
			"item":item,
			"availableuntil":(typeof(item.limited) == "number" ? `Available until ${new Date(item.limited)}` : "")
		}
	}).load()
})