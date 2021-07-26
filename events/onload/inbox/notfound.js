accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (user) {
		function getData(notifs, timestamp) {
			return new Promise(function(resolve, reject) {
				notifs.forEach(notf => {
					if (notf.timestamp == timestamp) {
						fetch(`${page.url}/api/users/get?id=${notf.user}`).then(response => response.json().then(data => {
							let returndata = data
							returndata[1] = notf
							resolve(returndata)
						}))
					}
				})
			})
		}

		var notifs = inbox.getInbox(user.id + 1)
		let args = url
		args.shift()

		//res.send(args)
		getData(notifs, args[0]).then(data => {

			let profile = `__rooturl/assets/images/userprofiles/${data[0].id + 1}.png`
			let profile_exists = fs.existsSync(`${__dirname}/assets/public/images/userprofiles/${data[0].id + 1}.png`)
			if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`

			var urlRegex = /(https?:\/\/[^\s]+)/g;
            var embedRegex = /(https?:\/\/[^]+\/[^]+(.png|.jpg|.gif|.ico|.PNG))/g

			let notif_content = data[1].content
			notif_content = notif_content.replace(/\n/g, " <br> ")


			notif_content = notif_content.replace(/(\*\*.*?\*\*)/g, string => { // boldify text that looks like **hello**
				if (string.replace(/\*/g, "") == "") return string
				//console.log("BOLD: "+ string)
				return `<b>${string.replace(/\*\*/g, "")}</b>`
			})

			notif_content = notif_content.replace(/(\*.*?\*)/g, string => { // make text italic that looks like *hello*
				if (string.replace(/\*/g, "") == "") return string
				//console.log("Italic: "+ string)
				return `<i>${string.replace(/\*/g, "")}</i>`
			})

			notif_content = notif_content.replace(embedRegex, string => { // embed link that has .img .jpg .gif in the end
				let str = string.split(" ")
				let returnstr = ""
				for (let i = 0; i < str.length; i++) {
					if (embedRegex.test(str[i])) {
						returnstr += `<embed style="max-width:90%; height:auto;" src="${str[i]}">`
					} else {
						returnstr += str[i] + " "
					}
				}
				//console.log(string)
				return returnstr
			})




			new page.loader({
				"title": "Inbox",
				"res": res,
				"req": req,
				"template": fs.readFileSync(`${__dirname}/pages/inbox/message.html`).toString(),
				"other": [
					"inbox_size:" + `(${notifs.length})`,
					"title:" + data[1].title,
					"content:" + notif_content,
					"displayname:" + data[0].displayname,
					"username:" + data[0].name,
					"profile:" + profile,
					"date:" + inbox.timeFromTimestamp(data[1].timestamp)
				]
			}).load()
		})
	}
})