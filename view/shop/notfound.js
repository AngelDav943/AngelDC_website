const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

args = url
args.shift()

var uid = cookies.getCookie(req.headers.cookie, "uid")
accounts.getUserByUID(uid).then(user => {
	var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
	let item = items.find(obj => obj.id == args[0]) || { "limited": false }
	if (user && item) console.log(user.name + ` opened shop item: ${item.name}!`)

	var isavailable = (item.disabled != true) && (Date.now() < (item.limited || Date.now() + 1) ? true : false) && (typeof (item.cost) == "number")

	let diff = (item.limited - Date.now())
	let times = {
		"weeks": (Math.round(diff / 604800000)),
		"days": (Math.round(diff / 86400000)),
		"hours": (Math.round(diff / 36000)) / 100,
		"minutes": Math.round(diff / 600) / 100
	}

	// default amount are weeks
	let timedisplay = Math.abs(times.weeks) + " week"
	
	// if the amount of weeks is less than 1
	if (Math.abs(times.weeks) < 1) timedisplay = Math.abs(times.days) + " day"

	// if the amount of days is less than 1
	if (Math.abs(times.days) < 1) timedisplay = Math.abs(times.hours) + " hour"

	// if the amount of hours is less than 1
	if (Math.abs(times.hours) < 1) timedisplay = Math.abs(times.minutes) + " minute"

	console.log(Math.abs(parseInt(timedisplay)))

	let timeleft = ""
	if (diff)
		timeleft = ` (
			${timedisplay}${(Math.abs(parseInt(timedisplay)) > 1) ? "s" : ""} 
			${diff < 0 ? "ago" : "left"}
		)`


	if (args[0] && !args[1]) new page.loader({
		"res": res,
		"req": req,
		"template": (item["name"] ? fs.readFileSync(`${__dirname}/../../pages/shop/notfound.html`).toString() : ""),
		"other": {
			"item.cost": (item.cost != 0 ? `${item.cost} Coins` : "Free"),
			"item": item,
			"timeleft": timeleft,
			"availableuntil": (typeof (item.limited || false) == "number" ? `Available until ${new Date(item.limited || 0)}` : ""),
			"purchasebutton": isavailable ? `<a class="button" href="__rooturl/shop/${item.id}/buy">Buy</a>` : `<a class="button disabled">Not available</a>`
		}
	}).load()

	if (args[1] == "buy" && (!item.disabled)) {
		accounts.getItem(uid, item.id)

		console.log(`${user.name} ${"purchased"} ${item.name}`)
		res.redirect(`${page.url}/users/${user.id + 1}/backpack`)
	}
})