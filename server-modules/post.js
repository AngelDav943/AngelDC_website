const Database = require("@replit/database")
let fs = require('fs')
let cookiemanager = require(`${__dirname}/cookies.js`);

module.exports = {
    newComment(topic, id, comment) {
        try {
            var jsondata = JSON.parse(fs.readFileSync(`${__dirname}/../assets/public/posts/${topic}/other.json`));
            jsondata.forEach((currentdata,index) => {
                if (currentdata.index == id) id = index
            })

            jsondata[id].comments.push(comment)

            var datatosave = JSON.stringify(jsondata);
            fs.writeFile(`${__dirname}/../assets/public/posts/${topic}/other.json`, datatosave, err => {
                if (err) console.log(err);
                if (!err) console.log("new comment added")
            });
        } catch(err) {
            console.log(err)
        }
		return id
    },

    getPost(topic, id) {
        let sendpost = {
            "topic":topic,
            "post":{},
            "other":{}
        }
        module.exports.getTopic(topic).then(posttopic => {
            if (posttopic.posts) posttopic.posts.forEach(post => {
                if (post.index == id) {
                    sendpost.post = post
                }
            })
            if (posttopic.other) posttopic.other.forEach(other => {
                if (other.index == id) {
                    sendpost.other = other
                }
            })
        });
        return new Promise(function(resolve, reject) {
            resolve(sendpost);
        })
    },

    getTopic(topic) {
        try {
            var topics = fs.readdirSync(`${__dirname}/../assets/public/posts`);
            let sendtopic = {
                "name":topic,
                "posts":[],
                "other":[]
            }
            topics.forEach((currenttopic,index) => {
                if (topic == currenttopic) {
                    
                    let postsdata = JSON.parse(fs.readFileSync(`${__dirname}/../assets/public/posts/${currenttopic}/posts.json`));
                    let otherdata = JSON.parse(fs.readFileSync(`${__dirname}/../assets/public/posts/${currenttopic}/other.json`));
                    
                    sendtopic.other = otherdata;
                    sendtopic.posts = postsdata;
                }
            })
            return new Promise(function(resolve, reject) {
                resolve(sendtopic);
            })
        } catch(err) {
            return new Promise((resolve, reject) => {
                console.log(err)
                reject(err)
            })
        }
    },

    getAllTopics() {
        var topics = fs.readdirSync(`${__dirname}/../assets/public/posts`);
        let sendtopics = []
        topics.forEach((currenttopic,index) => {
            let topicstat = fs.statSync(`${__dirname}/../assets/public/posts/${currenttopic}`);
            if (!topicstat.isFile()) {
                module.exports.getTopic(currenttopic).then(data => {
                    sendtopics.push(data)
                });
            }
        });
        return new Promise(function(resolve, reject) {
            resolve(sendtopics);
        })
    }

}