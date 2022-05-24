autoresolve = false
let accounts = require(`${__dirname}/../../server-modules/accounts.js`)
let cookies = require(`${__dirname}/../../server-modules/cookies.js`)
let fetch = require('node-fetch');
let mode = "main dark-mode"

function setTheme() {
	let value = cookies.getCookie(req.headers.cookie, "theme")
	switch (value)
	{
		case "legacy":
			mode = "main legacy"
			htmltemplate = fs.readFileSync(`${__dirname}/../../assets/server/basetemplates/legacy.html`).toString()
			break;
	}
}

function create(account,profile) {
	var notifdata = (account.notifications || {})
	var notifhtml = ""
	var notiflength = 0
	for (i in notifdata) {
		if (!notifdata[i].read) notiflength++;
	}
	if (notiflength > 0) notifhtml = `<p class="notification">${notiflength >= 9 ? "9+" : notiflength}</p>`
	
	return new templater({
		"templatedir":`${__dirname}/../../assets/server/templates/usertopbar.html`,
		"other":{
			"userdisplay": account.displayname,
			"userid": (account.id+1),
			"username": account.name,
			"profile": profile || 'https://angeldc943.repl.co/assets/images/userprofiles/UserDefault.png',
			"notification": notifhtml
		}
	}).load();
}
module.exports.default.other = {
    "defaultheader": fs.readFileSync(`${__dirname}/../../assets/server/templates/navigationbar.html`),
    "templatesectionclass": "main"
}


setTheme()

classmain = mode 

var uid = cookies.getCookie(req.headers.cookie, "uid")
accounts.verifyuser( uid ).then(account => {
	let accounthtml = "<a class='btn' href='__rooturl/login'>Login</a>"
	if (account) {		
		accounts.setlastlogin(uid)
		let profile = `__rooturl/assets/images/userprofiles/UserDefault.png`
		let background = ``

		let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${account.id+1}.png`)
        if (profile_exists) profile = `__rooturl/assets/images/userprofiles/${account.id+1}.png`

		let background_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userbackgrounds/${account.id+1}.png`)
        if (background_exists) background = `background: url(__rooturl/assets/images/userbackgrounds/${account.id+1}.png);`

		accounthtml = create(account,profile)
		
		resolve()
		other["user_profile"] = profile
		other["user_username"] = account.name
		other["user_displayname"] = account.displayname
		other["user_id"] = account.id+1

		other["usertopbar"] = accounthtml
		other["userbackground"] = background

		other["user_lastlogin"] = new Date( account["last-login"] )
		other["user_currency"] = account.currency || 0

		return account;
	} else {
		other["userbackground"] = ""
		other["user_username"] = ""
		other["user_displayname"] = ""
		other["usertopbar"] = accounthtml
		return undefined;
	}
}).then(acc => {
	if (acc && acc.banned == true) {
		htmltemplate = "fart smella"//fs.readFileSync(`${__dirname}/../../view/banned.html`).toString()
	}
	resolve("");
})