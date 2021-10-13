const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);
const post = require(`${__dirname}/../../server-modules/post.js`);

function simplifiedpost(post, other, topic) {
    var commentcount = ""
    var likescount = 0
    if (other) {
        if (other.comments) commentcount = other.comments.length
        if (other.likes) likescount = other.likes
    }

    return new Promise(function(resolve, reject) {
        accounts.getUserByID(post.user).then(postuser => {

            if (!postuser) postuser = {
                "displayname":"USER",
                "name":"usernotfound"
            }

            let profile = `__rooturl/assets/images/userprofiles/${post.user + 1}.png`
            let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${post.user + 1}.png`)
            if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`

            if (post) resolve(new page.templater({
                "template":fs.readFileSync(`${__dirname}/../../assets/public/templates/simplifiedpost.html`).toString(),
                "other":{
                    "userdisplay":  postuser.displayname || "user not found",
                    "user":  postuser.name || "user not found",
                    "accprofile":  profile || "__rooturl/public/assets/images/userprofiles/UserDefault.png",
                    "title":  post.title.replace(/%20/g," ").substring(0,14),
                    "likescount":  `${likescount} Likes`,
                    "topic":  (topic || "off-topic"),
                    "commentcount":  commentcount,
                    "date":  post.date,
                    "postid":  (post.index + 1)
				}
            }).load());
        });
    })
}

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (true == true) {
        post.getAllTopics().then((topics) => {

            new Promise((resolve, reject) => {
                let postspromises = [];
                topics.forEach(topic => {
                    topic.posts.forEach(datapost => {
                        let otherdata
                        if (topic.other) topic.other.forEach(dataother => {
                            if (dataother && dataother.index == datapost.index) otherdata = dataother
                        })
                        postspromises.push(simplifiedpost(datapost,otherdata,topic.name));
                    })
                });
                Promise.all(postspromises).then(postarray => {
                    let result = ""
                    postarray.forEach(posttemplate => {
                        result = posttemplate + result
                    })
                    
                    resolve(result)
                })
            }).then(posts => {
                let postbutton = ""
                var htmlpage = fs.readFileSync(`${__dirname}/../../pages/forum/index.html`).toString();

                new page.loader({
                    "res":res,
                    "req":req,
                    "template":(htmlpage + posts.toString().replace(/undefined/g,"")),
                    "other":{
                        "postbutton":  postbutton,
                        "pstkycookie":  cookies.getCookie(req.headers.cookie, "pstky")
					}
                }).load()
            })
        });
    } else {
        new page.loader({
            "res":res,
            "req":req,
            "template":"<center><b>Cant access forum right now, try again later.</b></center>",
            "other":{}
        }).load()
    }
})