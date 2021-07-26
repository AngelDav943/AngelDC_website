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
                c = c.replace(/"/g, "'");
                c = c.replace(/<LINEBREAK>/g, "'°n");
                c = c.replace(/</g,"").replace(/>/g,"")
                c = c.replace(/<\/?[a-z]*>/g, "").replace(/<\/?[^]>/g, "");
                c = c.replace(/<\/?/g,"").replace(/>/g,"");
                c = c.replace(/'°n/g, "<br>");
                var postjson = JSON.parse(fs.readFileSync(`${__dirname}/assets/public/posts/${topic}/posts.json`));
                var otherjson = JSON.parse(fs.readFileSync(`${__dirname}/assets/public/posts/${topic}/other.json`));
                
                let date = Date().split(" ")
                let postindex = postjson[postjson.length-1].index + 1
                let new_post = {
                    "user": user.id,
                    "title": t,
                    "content": c,
                    "date": ` ${date[1]}-${date[2]}-${date[3]}`,
                    "timestamp": Date.now(),
                    "index": (postindex || 0)
                };
                let new_other = {
                    "index": (postindex || 0),
                    "likes": 0,
                    "comments": []
                };

                otherjson.push(new_other)
                postjson.push(new_post)

                var data_newpost = JSON.stringify(postjson);
                var data_newother = JSON.stringify(otherjson);

                try {
					let message = encodeURIComponent(`${user.displayname} *@${user.name}*  made a post in ${topic} \n **Title: ** ${t}  \n **/forum/${topic}/${postindex+1}**`)
                    fs.writeFile(`${__dirname}/assets/public/posts/${topic}/posts.json`, data_newpost, err => {
                        if (err) console.log(err)
                        
                        if (!err) fs.writeFile(`${__dirname}/assets/public/posts/${topic}/other.json`, data_newother, err => {
                            if (err) console.log(err)
                            if (!err) {
								fetch("https://angeldavs-testbot.angeldc943.repl.co/sendmessage/866366673849810971/"+message);
								//console.log("https://angeldavs-testbot.angeldc943.repl.co/sendmessage/866366673849810971/"+message)
								console.log(`post ${topic}/${postindex+1} posted.. ${err}`)
                                res.redirect(`${page.url}/forum/${topic}/${postindex+1}`)
                            }
                        })
                    })
                } catch (err) {
                    console.log("error posting post")
                    return console.log(err)
                }
            }
        } else {
            var npost_html = fs.readFileSync(`${__dirname}/pages/forum/new.html`).toString();
            new page.loader({
                "res":res,
                "req":req,
                "template":npost_html,
                "other":[]
            }).load()
        }
    }
})