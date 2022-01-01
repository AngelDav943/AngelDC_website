const fetch = require('node-fetch')
let fs = require('fs');
let firebase = require('firebase-admin');

let accounts = require(`${__dirname}/accounts.js`);
let saved_postdata = [];
let posted = 0;
let deleted = 0;
let emoji_rejex = /(:)(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])(:)/g
const firestore = firebase.firestore();

module.exports = {
	timeFromTimestamp(timestamp, hidetime) {
		var d = new Date(timestamp);
		time = {
			"day": d.getDate(),
			"month": d.getMonth() + 1,
			"year": d.getFullYear(),
			"hours": d.getHours(),
			"minutes": d.getMinutes()
		}

		for (var t in time) {
			if (time[t] < 10) time[t] = `0${time[t]}`
		}
		
		timeStampCon = time.day + '/' + time.month + '/' + time.year;
		if (hidetime != true) timeStampCon += " " + time.hours + ':' + time.minutes

		return timeStampCon;
	},

	async newPost(uid, title, content) {

		if (posted > 100) return;

		accounts.getUserByUID(uid).then(user => {
			if (user) {
				if (!emoji_rejex.test(title)) title = title.replace(/[^\u0000-\u00ff]/g, "")
				if (!emoji_rejex.test(content)) content = content.replace(/[^\u0000-\u00ff]/g, "")

				if (title == "" || content == "") return;

				let message = encodeURIComponent(`${user.displayname} *@${user.name}*  made a post in the blog \n **Title: ** ${title}  \n`)

				var newpost = {
					"user": user.id,
					"title": title,
					"content": content,
					"timestamp": Date.now()
				}

				firestore.collection("blog").add(newpost).then(() => {
					console.log(`New post ny: @${user.name}`);
					fetch("https://angeldavs-testbot.angeldc943.repl.co/sendmessage/921427188417450044/" + message);
					posted++;
					return (true)
				});

			}
		})
	},

	async deletePost(uid, timestamp) {
		if (deleted > 100) return;

		var post_todelete = await module.exports.getPost_withTimestamp(timestamp)
		var user = await accounts.getUserByUID(uid)

		if (user && (user.perms.admin == true || user.id == post_todelete.user)) {

			firestore.collection("blog").doc(post_todelete.documentid).delete().then(() => {
				console.log(`New post ny: @${user.name}`);
				deleted++;
				return (true)
			});

		}
	},

	async getAllPosts() {
		return new Promise((resolve, reject) => {
			if (saved_postdata.length <= 0) {
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
		return new Promise(async (resolve, reject) => {
			var posts = await module.exports.getAllPosts();

			for (let index in posts) {
				if (posts[index].timestamp == timestamp) resolve(posts[index])
			}
		})
	}
}