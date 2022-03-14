const firebase = require('firebase-admin');
const firestore = firebase.firestore();
let cachedData = []

module.exports = {
    getdata() {
        return new Promise((resolve, reject) => {
			if (cachedData.length == 0) {
				firestore.collection("voting").listDocuments().then(documentRefs => {
					return firestore.getAll(...documentRefs);
				}).then(documentSnapshots => {
					let db_items = [];
					for (let documentSnapshot of documentSnapshots) {
						if (documentSnapshot.exists) {
							let item = documentSnapshot.data();
							item.documentid = documentSnapshot.id
							db_items.push(item);
						}
					}
					cachedData = db_items
					resolve(db_items)
				});
			} else {
				resolve(cachedData)
			}
		})
    },

	newvote(voteruser, targetvote, alltargets) {
		if (voteruser && (voteruser.id+1 != targetvote.account)) {
			var canvote = true
			alltargets.forEach(dataobject => {
				if (dataobject.votes.find(id => {return id == voteruser.id}) != undefined) canvote = false
			})
			
			if (canvote && targetvote.votes.find(id => {return id == voteruser.id}) == undefined) {
				console.log(`${voteruser.name} is voting for: ${targetvote.discord}`)

				targetvote.votes.push(voteruser.id)
				
				firestore.collection("voting").doc(targetvote.documentid).set(targetvote)/*.then(doc => {
                    resolve(user_newdata)
                })*/
			}
		}
	}
}


