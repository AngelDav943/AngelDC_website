// Currently disabled

/*

const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const voting = require(`${__dirname}/../../server-modules/voting.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    var userid = -1
    if (user) userid = user.id
	
	voting.getdata().then(data => {

		console.log(data)
		
		var name = req.query.nm;
		var acc = req.query.acc;
		
		if (!name && !acc) {
			var voteshtml = ""
			var boardhtml = ""
			
			let alreadyvoted = false
			if (user) data.find(dataobj => {
				return dataobj.votes.find(vid => {
					if (vid == user.id) alreadyvoted = true
				})
			})

			if (!user) alreadyvoted = true
			
			data.forEach(dataobject => {
				voteshtml += new page.templater({
					"templatedir": `${__dirname}/../../assets/public/templates/votehandle.html`,
					"other": Object.assign({...dataobject}, {
						"linkdata": `?nm=${dataobject.name}&acc=${dataobject.account}`,
						"state": ((dataobject.account == (userid+1) || alreadyvoted) ? "disabled" : ""),
						"image": `https://angeldc943.repl.co/assets/images/userprofiles/${dataobject.account}.png`,
						"votecount": dataobject.votes.length
					})
				}).load() + "<br>";
			});
			
			new page.loader({
				"res":res,
				"req":req,
				"template":fs.readFileSync(`${__dirname}/../../pages/voting.html`).toString(),
				"other":{
					"board": boardhtml,
					"items": voteshtml
				}
			}).load()
		}

		if (name && acc) {
			if (user) voting.newvote(user, data.find(obj => {return obj.name == name && obj.account == acc}), data)
			res.redirect(`${page.url}/voting`)
		}
	})

})

*/