const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const shopdb = require(`${__dirname}/../../server-modules/shop.js`);


function getItemdata() {
	return new Promise((resolve, reject) => {
		firestore.collection("items").listDocuments().then(documentRefs => {
			return firestore.getAll(...documentRefs);
		}).then(documentSnapshots => {
			let db_items = [];
			for (let documentSnapshot of documentSnapshots) {
				if (documentSnapshot.exists) {
					let item = documentSnapshot.data();
					item.documentid = documentSnapshot.id
					db_items[item.id] = (item);
				}
			}
			resolve(db_items)
		});
	})
}

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {

	shopdb.getdata().then(items => {
		console.log(items.length);
	
		if (user) console.log(user.name + " opened dbshop!")
		
		//var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
		var itemshtml = ""
		items.forEach(item => {
			if (item.cost != undefined && (!item.disabled)) itemshtml += new page.templater({
				"templatedir": `${__dirname}/../../assets/public/templates/shopitem.html`,
				"other": {
					"item.cost":(item.cost == 0 ? "Free" : `${item.cost} Coins`),
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

	//res.send("success")
})

