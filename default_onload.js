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
	return new templater({
		"templatedir":`${__dirname}/../../assets/server/templates/usertopbar.html`,
		"other":{
			"userdisplay": account.displayname,
			"userid": (account.id+1),
			"username": account.name,
			"profile": profile || 'https://angeldc943.repl.co/assets/images/userprofiles/UserDefault.png'
		}
	}).load();
}
module.exports.default.other = {
    "defaultheader": fs.readFileSync(`${__dirname}/../../assets/server/templates/navigationbar.html`),
    "templatesectionclass": "main"
}


setTheme()

classmain = mode 
new Promise(function(resolve, reject) {
	accounts.verifyuser(cookies.getCookie(req.headers.cookie, "uid")).then(account => {
		let accounthtml = "<a class='btn' href='__rooturl/login'>Login</a>"
		if (account) {
			let profile = `__rooturl/assets/images/userprofiles/UserDefault.png`
			let background = ``

			let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${account.id+1}.png`)
            if (profile_exists) profile = `__rooturl/assets/images/userprofiles/${account.id+1}.png`

			let background_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userbackgrounds/${account.id+1}.png`)
            if (background_exists) background = `__rooturl/assets/images/userbackgrounds/${account.id+1}.png`

			accounthtml = create(account,profile)
			
			resolve()
			other["user_profile"] = profile
			other["user_username"] = account.name
			other["user_displayname"] = account.displayname
			other["user_id"] = account.id+1

			other["usertopbar"] = accounthtml
			other["userbackground"] = `background: url(${background});`

		} else {
			other["userbackground"] = ""
			other["user_username"] = ""
			other["user_displayname"] = ""
			other["usertopbar"] = accounthtml
			resolve()
		}
	})
}).then(() => {
	resolve()
})