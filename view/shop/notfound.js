const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

args = url
args.shift()

var uid = cookies.getCookie(req.headers.cookie, "uid")
accounts.getUserByUID(uid).then(user => {
	if (user) console.log(user.name + " opened shop item!")
	var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
	let item = items.find(obj => obj.id == args[0]) || {"limited":false}

	var isavailable = (Date.now() < (item.limited || Date.now()+1) ? true : false) && (typeof(item.cost) == "number")
	
	let lefttime = (Math.floor((item.limited - Date.now()) / 36000))/100
	let timeleft = lefttime ? ` (${Math.abs(lefttime)} hours ${lefttime < 0 ? "ago" : "left"})` : ""
	
	if (timeleft != "" && Math.abs(lefttime) < 1) 
	{
		lefttime =  (Math.floor((item.limited - Date.now()) / 60000))
		timeleft = ` (${Math.abs(lefttime)} minute${(lefttime > 1 || lefttime < -1)? "s" : ""} ${lefttime < 0 ? "ago" : "left"})`
	}
	
	if (args[0] && !args[1]) new page.loader({
		"res":res,
		"req":req,
		"template":(item["name"] ? fs.readFileSync(`${__dirname}/../../pages/shop/notfound.html`).toString() : ""),
		"other":{
			"item.cost":(item.cost != 0 ? `${item.cost} Coins` : "Free"),
			"item":item,
			"timeleft":timeleft,
			"availableuntil":(typeof(item.limited || false) == "number" ? `Available until ${new Date(item.limited || 0)}` : ""),
			"purchasebutton": isavailable ? `<a class="button" href="__rooturl/shop/${item.id}/buy">Buy</a>` : `<a class="button disabled">Not available</a>`
		}
	}).load()
	
	if (args[1] == "buy") {
		accounts.getItem(uid, item.id)
		
		console.log(`${user.name} ${"purchased"} ${item.name}`)
		res.redirect(`${page.url}/users/${user.id+1}/backpack`)
	}
})