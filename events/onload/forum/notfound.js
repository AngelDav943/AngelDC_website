let args = url
args.shift()

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a style="color:#cac4ff;" href="' + url + '">' + url + '</a>';
    })
}

function createpost(req, post, topic, index, other) {

    let publicstatus = "This post is public"
    if (post.hided == true) publicstatus = "This post is private"

    commentcount = "undefined"
    if (other && other.comments) commentcount = other.comments.length;
    
    return new Promise((resolve, reject) => {
        accounts.getUserByID(post.user).then(postuser => {
            if (!postuser) postuser = { "name": "USER" }

            let profile = `__rooturl/assets/images/userprofiles/${post.user + 1}.png`
            let profile_exists = fs.existsSync(`${__dirname}/assets/public/images/userprofiles/${post.user + 1}.png`)
            if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`
            
            let postcontent = ""
            if (post.content) post.content.toString().split(" ").forEach(text => {
                postcontent = `${postcontent} ${urlify(text)}`
            })

            if (post) resolve(new page.templater({
                "template":fs.readFileSync(`${__dirname}/assets/public/templates/forumpost.html`).toString(),
                "other": [
                    "userdisplay:" + postuser.displayname,
                    "userid:" + (post.user+1),
                    "user:" + postuser.name,
                    "accprofile:" + profile,
                    "title:" + post.title.toString().replace(/%20/g," "),
                    "content:" + postcontent.toString().replace(/%20/g," "),
                    "likescount:" + `${other.likes || 0} Likes`,
                    "topic:" + (topic || "off-topic"),
                    "commentcount:" + commentcount,
                    "date:" + post.date,
                    "publicstatus:" + publicstatus
                ]
            }).load());
        })
    })
}

let topic = args[0].toString()
let index = parseFloat(args[1]) - 1

post.getPost(topic.toLowerCase(),index).then((data) => {
    if (data.post && data.other) {
        let postcomments = ""
        new Promise((resolve, reject) => {
            if (data.other.comments) data.other.comments.forEach(comment => {
                accounts.getUserByID(comment.user).then( commentaccount => { 
                    if (!commentaccount) commentaccount = { "name": "{USER}" }

                    let profile = `__rooturl/assets/images/userprofiles/${comment.user + 1}.png`
                    let profile_exists = fs.existsSync(`${__dirname}/assets/public/images/userprofiles/${comment.user + 1}.png`)
                    if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`

                    try {
                        commentcontent = ""
                        comment.content.split(" ").forEach(text => {
                            commentcontent = `${commentcontent} ${urlify(text)}`
                        })

                        postcomments += new page.templater({
                            "templatedir":"forumcomment",
                            "other":[
                                "accprofile:" + profile,
                                "userdisplay:" + commentaccount.displayname,
                                "user:" + commentaccount.name,
                                "userid:" + (comment.user+1),
                                "content:" + commentcontent.replace(/%20/g," "),
                                "date:" + comment.date
                            ]
                        }).load()
                    } catch (err) {
                        console.log(err)
                        postcomments += new page.templater({
                            "templatedir":"forumcomment",
                            "other":[
                                "user:" + "{USER}",
                                "content:" + "{COMMENT}",
                                "date:" + "{DATE}"
                            ]
                        }).load()
                    }
                })
            });
            resolve()
        }).then(() => {
            createpost(req, data.post, topic, index, data.other).then(finalpost => {
                new page.loader({
                    "res":res,
                    "req":req,
                    "template":(finalpost + postcomments),
                    "other":[
                        "imageembed:" + "",
                        "index:" + (index + 1)
                    ]
                }).load()
            })
        })
    }
});