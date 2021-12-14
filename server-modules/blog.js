let fs = require('fs');
let firebase = require('firebase-admin');

let page = require(`${__dirname}/pageloader.js`);
let accounts = require(`${__dirname}/accounts.js`);
let saved_postdata = [];

const firestore = firebase.firestore();

module.exports = { // password needs to be already hashed

	async newPost(uid, title, content) {
		accounts.getUserByUID(uid).then(user => {
			if (user) {

				var newpost = {
					"user":user.id,
					"title":title,
					"content":content,
					"timestamp":Date.now()
				}

				firestore.collection("blog").add(newpost).then(() => {
					console.log(`New post ny: @${user.name}`);
					return(true)
				});
			
			}
		})
	},

	async deletePost(uid, timestamp) {
		var post_todelete = await module.exports.getPost_withTimestamp(timestamp)
		var user = await accounts.getUserByUID(uid)
			
		if (user && (user.perms.admin == true || user.id == post_todelete.user)) {

			firestore.collection("blog").doc(post_todelete.documentid).delete().then(() => {
				console.log(`New post ny: @${user.name}`);
				return(true)
			});
		
		}
	},

    async getAllPosts() {
        return new Promise((resolve, reject) => {
            if (saved_postdata.length == 0) {
                firestore.collection("blog").listDocuments().then(documentRefs => {
                    return firestore.getAll(...documentRefs);
                }).then(documentSnapshots => {
                    let blogposts = [];
                    for (let documentSnapshot of documentSnapshots) {
                        if (documentSnapshot.exists) {
                            let post = documentSnapshot.data();
                            post.documentid = documentSnapshot.id
                            blogposts[post.timestamp] = (post);
                        }
                    }
                    saved_postdata = blogposts
                    resolve(blogposts)
                });
            }
            if (saved_postdata.length > 0) resolve(saved_postdata)
        })
    },

	async getPost_withTimestamp(timestamp) {
		return new Promise( async (resolve, reject) => {
			var posts = await module.exports.getAllPosts();
			
			for (let index in posts) {
				if (posts[index].timestamp == timestamp) resolve(posts[index])
			}
		})
	}
}