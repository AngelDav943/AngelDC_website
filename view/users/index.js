const users_online = []
const accounts = require(`${__dirname}/../../server-modules/accounts.js`)
const cookies = require(`${__dirname}/../../server-modules/cookies.js`)
const fetch = require('node-fetch');

accounts.getAllUsers().then(accounts => {
	function doload(users_online) {
		let accnames = "<article class='grid-container'> "
		var htmlpage = fs.readFileSync(`${__dirname}/../../pages/users/index.html`).toString(); 
		var acctemplate = fs.readFileSync(`${__dirname}/../../assets/server/templates/user-boxtemplate.html`).toString(); 
		accounts.forEach(user => {
			if (user.hidden != true) {
				let isonline = ""

				for (let online_user in users_online) {
					if (users_online[online_user].id == user.id) {
						isonline = "online"; 
						onlinecolor = "#39f06e";
					}
				}
				let profile = `__rooturl/assets/images/userprofiles/${user.id+1}.png`
				let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${user.id+1}.png`)
				if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`

				let isbot = ""
				if (user.perms.bot == true) isbot = `<b style="font-size:50%;color: #ffffff;background-color: #ff7c00;padding: 4px; border-radius: 1000px;">BOT</b>`

				let usertemplate = new page.templater({
					"template": acctemplate,
					"other":{
						"display":  user.displayname,
						"user":  user.name,
						"userid":  (user.id+1),
						"accprofile":  profile,
						"isonline":  isonline,
						"isbot":  isbot
					}
				}).load()
				accnames = `${accnames} ${usertemplate}`
			}
		})
		accnames = `${accnames} </article>`
		
		new page.loader({
			"res":res,
			"req":req,
			"title":"Users",
			"template": (htmlpage + accnames),
			"other":{
				"accountcount": + accounts.length
			}
		}).load()
	}
	
	fetch(`${page.url}/api/users/online`).then(response => response.json()).then(users_online => {
		doload(users_online);
	}).catch(() => {
		doload([])
	})
})