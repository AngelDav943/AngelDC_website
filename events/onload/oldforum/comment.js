accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    let topic = req.query.topic.toString()
    let index = parseInt(req.query.index)-1
    if (user && user.perms.comment == true && req.query.topic != undefined && req.query.index != undefined) {
        post.getPost(topic.toLowerCase(),index).then(data => {
        
            var c = req.query.c || "";
            c = c.replace(/</g,"").replace(/>/g,"")
            c = c.replace(/<\/?[a-z]*>/g, "")
            c = c.replace(/<\/?[^]>/g, "")
            
            if (c.replace(/ /g, "") != "") {
                let date = Date().split(" ")
                
                let comment = {
                    "user": user.id,
                    "content": c,
                    "date": `${date[1]}-${date[2]}-${date[3]}`
                };
                let cancomment = true
                let id

				console.log(data)

                data.other.comments.forEach(commentdata => {
                    if (commentdata.date == comment.date && commentdata.content == comment.content) {
                        cancomment = false
                    }
                })

                if (data.post.hided != true && cancomment == true) {
                    let i = post.newComment(topic, data.other.index, comment)
					console.log(`/forum/${topic}/${data.other.index+1}`)
    				res.redirect(`${page.url}/forum/${topic}/${data.other.index+1}`)
                }
            }
        });
    }
});