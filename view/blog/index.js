const accounts = require(`${__dirname}/../../server-modules/accounts.js`)
const cookies = require(`${__dirname}/../../server-modules/cookies.js`)
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);
const fetch = require('node-fetch');


accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	if (!user || (user && user.banned == false)) {
		//let jsonposts = JSON.parse(fs.readFileSync(`${__dirname}/../../assets/public/posts.json`))
		blogmanager.getAllPosts().then(jsonposts => {
			let accpromises = []

			for (let index in jsonposts) {
				accpromises.push(new Promise((resolve, reject) => {
					accounts.getUserByID(jsonposts[index].user).then(userdata => {
						return userdata
					}).then(postuser => {
						fetch(`${page.url}/api/users/getpfp?id=${jsonposts[index].user + 1}`).then(res => res.text()).then(image => {
							resolve({
								"timestamp": index,
								"account": postuser,
								"pfp": image,
								"post": jsonposts[index]
							})
						})
					})
				}))
			}

			Promise.all(accpromises).then(post_users => {
				post_users.sort(function(a, b) {
					return parseInt(a.timestamp) - parseInt(b.timestamp);
				});

				let posts_html = "";
				post_users.forEach(post => {
					let date_timestamp = new Date(post.post.timestamp)
					let date = date_timestamp.getDate() + '/' + (date_timestamp.getMonth()) + '/' + date_timestamp.getFullYear() + " " + date_timestamp.getHours() + ':' + date_timestamp.getMinutes();

					var embedRegex = /(https?:\/\/[^]+\/[^]+(.png|.jpg|.gif|.ico|.PNG))/g

					let content = post.post.content
					content = content.replace(/\n/g, " <br> ")
					content = content.replace(/</g, "")

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
						//console.log(string)
						return returnstr
					})

					let admin_options = ""
					if (user) if (user.perms.admin == true || post.account.id == user.id) admin_options = `<a href="__rooturl/blog/delete?id=${post.account.id}&timestamp=${post.post.timestamp}">delete</a>`

					let htmlpost = new page.templater({
						"templatedir": `${__dirname}/../../assets/server/templates/blogpost.html`,
						"other": {
							"profilepicture": post.pfp,
							"userdisplay": post.account.displayname,
							"username": post.account.name,
							"title": post.post.title,
							"content": content,
							"date": date,
							"adminoptions": admin_options
						}
					}).load();

					posts_html = htmlpost + posts_html;
				})

				let admin_panel = ""

				if (user && user.perms.comment == true) admin_panel = `<a href="__rooturl/blog/new">New post</a>`

				new page.loader({
					"res": res,
					"req": req,
					"basetemplate": `${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
					"template": fs.readFileSync(`${__dirname}/../../pages/blog/index.html`).toString(),
					"other": {
						"admin_panel": admin_panel,
						"posts": posts_html
					}
				}).load()
			})
		})
	} else {
		new page.loader({
			"res": res,
			"req": req,
			"template": fs.readFileSync(`${__dirname}/../../pages/noaccess.html`).toString()
		}).load()
	}
})
