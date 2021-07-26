const fs = require('fs')
const page = require(`${__dirname}/pageloader.js`)
let fetch = require('node-fetch');
let notif_dir = `${__dirname}/../assets/public/notifications/`

module.exports = {
    timeFromTimestamp(timestamp) {
		var d = new Date(timestamp);
		timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() + " " + d.getHours() + ':' + d.getMinutes();

		return timeStampCon;
	},

	newMessage(fromID,toID,t,message) {
		return new Promise(function(resolve, reject) {
			var title = t.replace(/%20/g," ") || "";
			var c = message.replace(/%20/g," ") || "";
			console.log(fromID)
			console.log(toID)
			fromID = parseInt(fromID);
			toID = parseInt(toID);
			
			if (module.exports.getInbox(toID+1) != undefined) {
			
				c = c.replace(/"/g, "'");
				c = c.replace(/</g,"").replace(/>/g,"")
				c = c.replace(/<\/?[a-z]*>/g, "").replace(/<\/?[^]>/g, "");
				c = c.replace(/<\/?/g,"").replace(/>/g,"");

				var fromUser_inbox = JSON.parse(fs.readFileSync(`${__dirname}/../assets/public/notifications/${fromID+1}.json`));
				var toUser_inbox = JSON.parse(fs.readFileSync(`${__dirname}/../assets/public/notifications/${toID+1}.json`));
				fetch(`${page.url}/api/users/get?id=${toID}`).then(response => response.json().then(data => {
					let timestam = Date.now();
					console.log(data)
					toUser_inbox.push({
						"user": fromID,
						"title": title,
						"content": `From: @<¡username> \n To:@${data[0].name} \n `+c,
						"timestamp": timestam
					})
					fromUser_inbox.push({
						"user": fromID,
						"title": "Sent: "+title,
						"content": `From: @<¡username> \n To:@${data[0].name} \n `+c,
						"timestamp": timestam
					})

					var toUser_newdata = JSON.stringify(toUser_inbox);
					try {
						fs.writeFile(`${__dirname}/../assets/public/notifications/${toID+1}.json`, toUser_newdata, err => {
							var fromUser_newdata = JSON.stringify(fromUser_inbox);
							if (err) reject(err)
							if (!err) {
								fs.writeFile(`${__dirname}/../assets/public/notifications/${fromID+1}.json`, fromUser_newdata, err => {
									console.log(`message from ${fromID} got sent to ${toID}.. err:${err}`)
									if (err) reject(err)
									if (!err) resolve(`${page.url}/inbox/${timestam}`)
								})
							}
						})
					} catch (err) {
						console.log("error sending message")
						reject(err)
					}
				}))
			}
		})
	},

	hasInbox(id) {
		if (module.exports.getInbox(id)) return true
		return false
	},
	
	getInbox(id) {
		var user_inbox;
		if(fs.existsSync(`${notif_dir}${id}.json`)) {
			user_inbox = JSON.parse(fs.readFileSync(`${notif_dir}${id}.json`));
		} else {
			let welcome_message = fs.readFileSync(`${__dirname}/../assets/public/welcome_message_inbox.txt`).toString()
			user_inbox = [
				{
					"user":16,
					"title":"Welcome to the inbox!",
					"content": `${welcome_message}`,
					"timestamp":(new Date().getTime())
				}
			]
			var datatosave = JSON.stringify(user_inbox, null, 4);
			fs.writeFile(`${notif_dir}${id}.json`, datatosave, err => {
                if (err) console.log("Error making new inbox json: "+err);
                if (!err) console.log("new comment added")
            });
		}
		//console.log(user_inbox)
		return user_inbox
	},

	sendInbox(id, title, content) {

	}
}