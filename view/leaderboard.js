const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const fetch = require(`node-fetch`);

accounts.getAllUsers().then(users => {

	var leaderboard = []

	for (index in users) {
		leaderboard.push({
			"name":users[index].name,
			"displayname":users[index].displayname,
			"currency":users[index].currency,
			"badges":users[index].badges,
			"hidden":users[index].hidden,
			"id":users[index].id,
		})
	}
	
	leaderboard.sort(function(a, b) {
		return parseInt(b.currency || 0) - parseInt(a.currency || 0);
	});

	return leaderboard;

}).then(rawleaderboard => {
	var boardpromises = []
	rawleaderboard.forEach(user => {
		boardpromises.push(new Promise((resolve, reject) => {
			fetch(`${page.url}/api/users/getpfp?id=${user.id+1}`).then(res => res.text()).then(image => {
				user.pfp = image
				resolve(user)
			})
		}))
	});

	Promise.all(boardpromises).then(leaderboard => {
		var htmlleaderboard = ""
		leaderboard.forEach((user,index) => {
			let htmlpost = new page.templater({
				"templatedir": `${__dirname}/../../assets/server/templates/testpost.html`,
				"other": {
					"profilepicture": user.pfp,
					"userdisplay": user.displayname,
					"username": user.name,
					"title": user.name,
					"content": user.currency || 0,
					"number": `#${index+1}`
				}
			}).load();

			if (!user.hidden) htmlleaderboard += htmlpost
		})
		new page.loader({
			"res": res,
			"req": req,
			"basetemplate": `${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
			"template": fs.readFileSync(`${__dirname}/../../pages/leaderboard.html`).toString(),
			"other":{
				"mainleaderboard":htmlleaderboard
			}
		}).load();
	})

	/**/

	
})

