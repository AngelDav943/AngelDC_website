const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

args = url
args.shift()

var uid = cookies.getCookie(req.headers.cookie, "uid")
accounts.getUserByUID(uid).then(user => {
	if (user) console.log(user.name + " opened shop item!")
	var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
	let item = items.find(obj => obj.id == args[0]) || {"limited":false}
	if (args[0] && !args[1]) new page.loader({
		"res":res,
		"req":req,
		"template":(item["name"] ? fs.readFileSync(`${__dirname}/../../pages/shop/notfound.html`).toString() : ""),
		"other":{
			"item":item,
			"availableuntil":(typeof(item.limited || false) == "number" ? `Available until ${new Date(item.limited || 0)}` : "")
		}
	}).load()
	
	if (args[1] == "buy") accounts.getItem(uid, item.id)
})