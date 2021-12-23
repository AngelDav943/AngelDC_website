const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (user) console.log(user.name + " opened shop!")
	
	var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
	var itemshtml = ""
	items.forEach(item => {
		if (item.cost) itemshtml += new page.templater({
			"templatedir": `${__dirname}/../../assets/public/templates/shopitem.html`,
			"other": {
				"item": item,
				"islimited":(typeof(item.limited) == "number" ? "limited" : "")
			}
		}).load() + "<br>";
	});
	
	new page.loader({
		"res":res,
		"req":req,
		"template":fs.readFileSync(`${__dirname}/../../pages/shop/index.html`).toString(),
		"other":{
			"items": itemshtml
		}
	}).load()
})

