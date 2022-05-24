const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);
const fetch = require('node-fetch');

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (user) {
		let notifdata = (user.notifications || {})
		
		/*notifdata.sort(function(a, b) {
			return parseInt(a.timestamp * (a.read ? 1 : 10)) - parseInt(b.timestamp * (a.read ? 1 : 10));
		});*/

		let posts_html = "";
		for (index in notifdata) {
			var notif = notifdata[index]
			let date_timestamp = new Date(notif.timestamp)
			let date = blogmanager.timeFromTimestamp(notif.timestamp);//date_timestamp.getDate() + '/' + (date_timestamp.getMonth()+1) + '/' + date_timestamp.getFullYear() + " " + date_timestamp.getHours() + ':' + date_timestamp.getMinutes();

			/* let content = notif.content
			content = content.replace(/</g, "")
			content = content.replace(/\n/g, " <br> ") */

			let htmlpost = new page.templater({
				"templatedir": `${__dirname}/../../assets/server/templates/notification.html`,
				"other": Object.assign({...notif}, {
					"date": date,
					"isread": (notif.read ? "" : "UNREAD"),
					"markstatus":(notif.read ? "Unm" : "M")
				})
			}).load();

			posts_html = htmlpost + posts_html;
		}

		var notifamount = ""
		var notiflength = 0/*Object.keys(user.notifications || {}).length*/
		for (i in notifdata) {
			if (!notifdata[i].read) notiflength++;
		}
		notifamount = `<notifamount>${notiflength}</notifamount>`
		
		new page.loader({
			"res": res,
			"req": req,
			"basetemplate": `${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
			"template": fs.readFileSync(`${__dirname}/../../pages/notifications.html`).toString(),
			"other": {
				"posts": posts_html,
				"amount_notif":notifamount,
				"alltimestamps":Object.keys(user.notifications).join(",")
			}
		}).load()
	} else {
		new page.loader({
			"res": res,
			"req": req,
			"template": fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString()
		}).load()
	}
})