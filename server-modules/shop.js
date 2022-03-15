const firebase = require('firebase-admin');
const firestore = firebase.firestore();
let cachedData = []

module.exports = {
    getdata() {
        return new Promise((resolve, reject) => {
			if (cachedData.length == 0) {
				firestore.collection("items").listDocuments().then(documentRefs => {
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

	newitem(newitemdata) {
		if (newitemdata) {
			module.exports.getdata().then(data => {
				
				if (data) firestore.collection("items").add(Object.assign({...newitemdata},{
					"id": data.length
				}))

				data.push(newitemdata)
			})
		}
	}
}


