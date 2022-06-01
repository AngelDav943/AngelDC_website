const accounts = require(`${__dirname}/../../server-modules/accounts.js`)
const cookies = require(`${__dirname}/../../server-modules/cookies.js`)
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);
const fetch = require('node-fetch');

args = url
args.shift()

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
	
	if (!user || (user && user.banned == false)) {
		blogmanager.getPost_withTimestamp(args[0]).then(post => {
			if (post) accounts.getUserByID(post.user).then(postaccount => {
				if (!post) return res.redirect(`${page.url}/blog`);
				
				let date_timestamp = new Date(post.timestamp)
				let date = blogmanager.timeFromTimestamp(post.timestamp);//date_timestamp.getDate() + '/' + (date_timestamp.getMonth()+1) + '/' + date_timestamp.getFullYear() + " " + date_timestamp.getHours() + ':' + date_timestamp.getMinutes();
	
				var embedRegex = /(https?:\/\/[^]+\/[^]+(.png|.jpg|.gif|.ico|.PNG))/g
	
				let content = post.content
				content = content.replace(/</g, "")
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
					//console.log(string)
					return returnstr
				})
	
				let admin_options = ""
				if (user) if (user.perms.admin == true || post.user == user.id) admin_options = `<a href="__rooturl/blog/delete?id=${post.user}&timestamp=${post.timestamp}">delete</a>`
	
				let posts_html = new page.templater({
					"templatedir": `${__dirname}/../../assets/server/templates/blogpost.html`,
					"other": {
						"profilepicture": `${page.url}/api/users/getpfp?id=${post.user+1}`,
						"userdisplay": postaccount.displayname,
						"username": postaccount.name,
						"title": post.title,
						"content": content,
						"date": date,
						"adminoptions": admin_options
					}
				}).load();

                let comments_html = ""
				let commenters = []
				
	            if (post.comments != null && post.comments.length > 0) for (let index in post.comments) {
					commenters.push(new Promise((resolve, reject) => {
						accounts.getUserByID(post.comments[index].user).then(userdata => {
							//console.log(index)
							resolve({
								"user": {
									"name":userdata.name,
									"displayname": userdata.displayname,
									"id": userdata.id
								},
								"comment": post.comments[index]
							})
						})
					}))
				}
				
				Promise.all(commenters).then(allcommenters => {
					//console.log(post.comments)
					if (post.comments) for (var i = 0; i < allcommenters.length; i++) {
						var comment = allcommenters[i]
						let commentdate = blogmanager.timeFromTimestamp(comment.comment.timestamp);
				    	comments_html += new page.templater({
					    	"templatedir": `${__dirname}/../../assets/public/templates/comment.html`,
					    	"other": {
							    "user":{
								    "image": `${page.url}/api/users/getpfp?id=${comment.user.id + 1}`,
			    					"name": `@${comment.user.name}`,
	        	                    "displayname": comment.user.displayname,
									"id": ( comment.user.id + 1 )
		    					},
		    	    			"content": comment.comment.content.replace(/</g,""),
	    	    				"date": commentdate
		    	    		}
		    		    }).load();
					}

				
		    		let admin_panel = ""
		    		if (user && user.perms.comment == true) admin_panel = `<a href="__rooturl/blog/new">New post</a>`
				
		    		new page.loader({
		    			"res": res,
		    			"req": req,
		    			"basetemplate": `${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
		    			"template": fs.readFileSync(`${__dirname}/../../pages/blog/post.html`).toString(),
		    			"other": {
	    					"admin_panel": admin_panel,
		    				"post": posts_html,
		    				"postdata": post,
		    				"comments": comments_html
		    			}
		    		}).load()
                })
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