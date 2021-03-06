const accounts = require(`${__dirname}/../../server-modules/accounts.js`)
const cookies = require(`${__dirname}/../../server-modules/cookies.js`)
const blog = require(`${__dirname}/../../server-modules/blog.js`)
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`)
const fetch = require('node-fetch');
const shopdb = require(`${__dirname}/../../server-modules/shop.js`);

var embedRegex = /(https?:\/\/[^]+\/[^]+(.png|.jpg|.gif|.ico|.PNG))/g

args = url
args.shift()

accounts.getUserByID(parseInt(args[0]) - 1).then(user => {
	accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(currentuser => {
		if (currentuser) console.log(`@${currentuser.name} looking at @${user.name}'s ${args[1] == '' ? "profile" : args[1]}.`)

		if (user) {
			if (args[1] == "backpack") {
				shopdb.getdata().then(items => {
					//var items = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/items.json`));
					/*if (parseInt(args[2]) != NaN) {
						let item = items.find(obj => obj.id == args[2])
						
						return;
					}*/
					var itemshtml = ""
					if (user.backpack) user.backpack.forEach(backpackitem => {
						let item = items.find(obj => obj.id == backpackitem.id)
						itemshtml += new page.templater({
							"templatedir": `${__dirname}/../../assets/public/templates/shopitem.html`,
							"other": {
								"item.cost":"",
								"item": item,
								"islimited":backpackitem.quantity
							}
						}).load() + "<br>";
					});
					
					new page.loader({
						"res":res,
						"req":req,
						"title":`@${user.name}'s backpack`,
						"template":fs.readFileSync(`${__dirname}/../../pages/users/backpack.html`).toString(),
						"other":{
							"user":{
								"name": user.name,
								"displyname":""
							},
							"items": itemshtml
						}
					}).load()
				})
			}


			if (args[0]) blogmanager.getAllPosts().then(jsonposts => {
				let badges = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/badges.json`));

				let userposts = []

				for (index in jsonposts) {
					if (jsonposts[index].user == user.id) userposts.push(jsonposts[index])
				}

				let acc_config = ""
				let isonline = "offline"
				let onlinecolor = "#f04f39"
				let banstatus = ""

				function finishload(users_online) {
					let profile = `__rooturl/assets/images/userprofiles/${user.id + 1}.png`
					let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${user.id + 1}.png`)
					if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`

					let background = `background:url(__rooturl/assets/images/userbackgrounds/${user.id + 1}.png) !important;`
					let background_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userbackgrounds/${user.id + 1}.png`)
					if (!background_exists) background = `background`

					for (let online_user in users_online) {
						if (users_online[online_user].id == user.id) {
							isonline = "online";
							onlinecolor = "#39f06e";
						}
					}

					if (user.banned == true) banstatus = "<article class='alert'><p style='right'>This person is currently banned</p></article>"
					if (currentuser) {
						if (user.id == currentuser.id) {
							acc_config = fs.readFileSync(`${__dirname}/../../pages/users/accountconfig.html`);
						}
					}

					let htmlbadge = ''
					let htmluserposts = ''

					console.log(user.badges)
					if (user.badges.length > 0) badges.forEach(currentbadge => {
						var badgeid = user.badges.findIndex(element => element == currentbadge.id)
						if (badgeid >= 0 && currentbadge.id == badgeid) htmlbadge = `${htmlbadge} <img src="${currentbadge.image}">`
					})

					if (userposts.length > 0) userposts.forEach(post => {
						let date_timestamp = new Date(post.timestamp)
						let date = date_timestamp.getDate() + '/' + (date_timestamp.getMonth()) + '/' + date_timestamp.getFullYear() + " " + date_timestamp.getHours() + ':' + date_timestamp.getMinutes();

						let content = post.content
						content = content.replace(/\n/g, " <br> ")

						content = content.replace(embedRegex, string => { // embed link that has .img .jpg .gif in the end
							let str = string.split(" ")
							let returnstr = ""
							for (let i = 0; i < str.length; i++) {
								if (embedRegex.test(str[i])) {
									returnstr += `<embed style="width:300px; max-width:90%; height:auto;" src="${str[i]}">`
								} else {
									returnstr += str[i] + " "
								}
							}
							
							return returnstr
						})

						htmluserposts = new page.templater({
							"templatedir": `${__dirname}/../../assets/server/templates/blogpost.html`,
							"other": {
								"profilepicture": profile,
								"userdisplay": user.displayname,
								"username": user.name,
								"title": post.title,
								"content": content,
								"date": date,
								"adminoptions": ""
							}
						}).load() + htmluserposts;
					})


					let isbot = ""
					if (user.perms.bot == true) isbot = `<b style="font-size:75%;color: #ffffff;background-color: #ff7c00;padding: 2px 4px; margin: 0px 5px;border-radius: 1000px;">bot</b>`

					new page.loader({
						"res": res,
						"req": req,
						"title": `@${user.name}'s profile`,
						"basetemplate": `${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
						"template": fs.readFileSync(`${__dirname}/../../pages/users/users.html`).toString(),
						"other": {
							"accprofile": profile,
							"displayname": `${user.displayname}`,
							"username": `${user.name}`,
							"userindex": `${user.id + 1}`,
							"usercurrency": user.currency || 0,

							"userdesc": `${user.description || "nothingness..."}`,
							"userdescinput": `${user.description.replace(/<br>/g, String.fromCharCode(10)) || "nothingness..."}`,

							"onlinestatus": isonline,
							"onlinecolor": onlinecolor,

							"userfirstlogin": blog.timeFromTimestamp(user["first-login"], true),
							"userlastlogin": blog.timeFromTimestamp(user["last-login"], true),

							"postcount": userposts.length,
							"userposts": htmluserposts,
							"badges": htmlbadge,
							"newuserbackground": background,
							"banstatus": banstatus,
							"isbot": isbot
						}
					}).load()
				}
				
				fetch(`${page.url}/api/users/online`).then(response => response.json()).then(users_online => {
					finishload(users_online)
				}).catch(() => {
					finishload([])
				})
			})
		}
	})
})