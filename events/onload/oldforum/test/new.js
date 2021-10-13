let topics = ["general","random","off-topic","itteblox","roblox"]

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.banned == false) {
        if (req.query != {} && req.query.t != undefined) {
            var canPost = false
            
            var t = req.query.t.replace(/%20/g," ") || "";
            var c = req.query.c.replace(/%20/g," ") || "";
            var topic = req.query.topic || "random";
            topic = topic.toLowerCase()
            
            topics.forEach(currenttopic => {
                if (topic == currenttopic) canPost = true
            })
			console.log(canPost)
            if (canPost) {
				let message = encodeURIComponent(`${user.displayname} *@${user.name}*  made a post in /forum/${topic} \n **{insert link here}**`)
				fetch("https://angeldavs-testbot.angeldc943.repl.co/sendmessage/866366673849810971/"+message);
				console.log(message)
            }
        } else {
            var npost_html = fs.readFileSync(`${__dirname}/pages/forum/new.html`).toString();
            new page.loader({
                "res":res,
                "req":req,
                "template":npost_html,
                "rename":[
					"forum:" + "forum/test",
					"post:" + "test post"
				]
            }).load()
        }
    }
})