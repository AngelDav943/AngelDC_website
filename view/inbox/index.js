const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const inbox = require(`${__dirname}/../../server-modules/inbox.js`);
const fetch = require('node-fetch');

function getData(notifs,timestamp) {
	return new Promise(function(resolve, reject) {
		notifs.forEach(notf => {
			if (notf.timestamp == timestamp) {
				fetch(`${page.url}/api/users/get?id=${notf.user}`).then(response => response.json().then(data => {
					let returndata = data
					returndata[1] = notf
					resolve(returndata)
				})).catch(err => {
					console.log("FART: " + err)
				})
			}
		})
	})
}

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (user) {
		var notifs = inbox.getInbox(user.id + 1)

		new Promise(function(resolve, reject) {
			let notifpromises = []
			notifs.forEach(notif => {
				notifpromises.push(getData(notifs,notif["timestamp"]))
			})

			Promise.all(notifpromises).then(inbox_users => {

				let inbox_html = "";
				inbox_users.forEach(inbox_user => {
					
					let profile = `__rooturl/assets/images/userprofiles/${inbox_user[0].id + 1}.png`
					let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${inbox_user[0].id + 1}.png`)
					if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`
					
					let notif_html = new page.templater({
						"templatedir":`${__dirname}/../../assets/server/templates/inboxmessage.html`,
						"other":{
							"userdisplay":  inbox_user[0].displayname,
							"username":  inbox_user[0].name,
							"userid":  (inbox_user[0].id+1),
							"profilepicture":  (profile),
							"title":  inbox_user[1].title,
							"timestamp":  inbox_user[1].timestamp
						}
					}).load()

					inbox_html = notif_html + inbox_html;
				})
				resolve(inbox_html)
			})
		}).then(inbox_html => {

			new page.loader({
				"title":"Inbox",
				"res":res,
				"req":req,
				"template":fs.readFileSync(`${__dirname}/../../pages/inbox/index.html`).toString(),
				"other":{
					"inbox_size": `(${notifs.length})`,
					"inbox_notification": `${inbox_html}`
				}
			}).load()

			//console.log(notifs)
		})
	} else {
		res.redirect(`${page.url}/login`)
	}
})