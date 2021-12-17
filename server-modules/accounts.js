let fs = require('fs');
let firebase = require('firebase-admin');

let page = require(`${__dirname}/pageloader.js`);
let cookiemanager = require(`${__dirname}/cookies.js`);
let hash = require("sha256");
let saved_userdata = [];
let change_data_cooldown;
let data_changes = 0;
let perm_data_changes = 0;

firebase.initializeApp({
    credential: firebase.credential.cert({
        "type": process.env['type'],
        "project_id": process.env['project_id'],
        "private_key_id": process.env['private_key_id'],
        "private_key": process.env['private_key'],
        "client_email": process.env['client_email'],
        "client_id": process.env['client_id'],
        "auth_uri": process.env['auth_uri'],
        "token_uri": process.env['token_uri'],
        "auth_provider_x509_cert_url": process.env['auth_provider_x509_cert_url'],
        "client_x509_cert_url": process.env['client_x509_cert_url']
    })
});

const firestore = firebase.firestore();

String.prototype.hashCode = function(seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i=0, ch; i<this.length; i++) {
        ch=this.charCodeAt(i);
        h1=Math.imul(h1^ch,2654435761);
        h2=Math.imul(h2^ch,1597334677);
    }
    h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
    h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
    return 4294967296*(2097151 & h2)+(h1>>>0);
};

function data_cooldown() {
	var returnval = change_data_cooldown
	
	data_changes += 1;
	
	if (perm_data_changes > 100) {
		return false
	} else {
		if (data_changes > 4) {
			change_data_cooldown = true
			if (data_changes > 15) {
				setTimeout(() => {
					change_data_cooldown = false
				},300*100)
				data_changes = 0
			} else {
				setTimeout(() => {
					change_data_cooldown = false
				},60*100)
			}
		} else {
			change_data_cooldown = true
			setTimeout(() => {
				change_data_cooldown = false
			},5*100)
		}
	}

	return !returnval
}

module.exports = { // password needs to be already hashed
	createuid(user) {
		return hash(user.name.toString() + user.pass.toString() + user.invkey.toString()) + hash("num" + user.id) + hash(user.invkey + user.documentid + "why")
	},

    reloaduserdata() {
        saved_userdata = [];
        Object.keys(require.cache).forEach(key => { 
            delete require.cache[key]
        })
    },

    createUser(cookies, name, pass, invkey) {
        return new Promise((resolve, reject) => {
            module.exports.getAllUsers().then(users => {
                var cancreate = true
                users.forEach(user => {
                    if (user.name == name) return cancreate = false
                })
				
                if (cancreate) {
                    var id = 0
                    id = users[users.length-1].id+1
                    users.forEach(user => {
                        if (user.id > id) id = user.id+1
                    })
                    
                    let newuser = { 
                        "displayname":name,
                        "name":name,
                        "description":"",
                        "friends":[],
                        "badges":[],
                        "perms":{
                            "comment": true
                        },
                        "pass":hash(pass.toString().hashCode().toString()),
                        "invkey":invkey,
                        "banned":false,
                        "id":id
                    };

                    firestore.collection("users").add(newuser).then(() => {
                        console.log(`New user with name: @${name}`);
                        module.exports.reloaduserdata();
                        resolve(true)
                    });
                }
            })
        })
    },

    changeuserdata(uid,newdata) {
		
        return new Promise(function(resolve, reject) {
            if (data_cooldown()) {
                module.exports.verifyuser(uid).then(user => {
                    var user_newdata = user;
                    for (let index in newdata) {
                        let datavalue = newdata[index]
                        datavalue = datavalue.replace(/<LINEBREAK>/g,"°&br°&")
                        datavalue = datavalue.replace(/[^\u0000-\u00ff]/g,"").replace(/</g,"").replace(/>/g,"").replace(/\//g,"")
                        if (index == "description") datavalue = datavalue.replace(/°&br°&/g,"<br>")
                        if ((index == "displayname" || index == "description") && datavalue.substring(3) != "") {
                            if (index == "displayname") datavalue = datavalue.substring(0,20)
                            if (index != "displayname" || (datavalue.replace(/ /g,"") != "")) user_newdata[index] = datavalue
                        }
                    }
                    firestore.collection("users").doc(user.documentid).set(user_newdata).then(doc => {
						perm_data_changes += 1;
                        resolve(user_newdata)
                    })
                })
            }
        });
    },

	setlastlogin(uid) {
		module.exports.verifyuser(uid).then(user => {
			if (user && data_cooldown()) {
				if ( user["first-login"] == undefined) user["first-login"] = Date.now();
				if ( user["currency"] == undefined) user["currency"] = 0
				//console.log(Math.abs(user["first-login"] - user["last-login"]) / 1000 / 86400);
				user["last-login"] = Date.now();
				firestore.collection("users").doc(user.documentid).set(user)
			}
		})
	},

	getCurrency(uid, currency) {
		module.exports.verifyuser(uid).then(user => {
			if (user && data_cooldown()) {
				user["currency"] += currency
				firestore.collection("users").doc(user.documentid).set(user)
			}
		})
	},
	
    verifyuser(uid, name, pass, id) {
        return new Promise(function(resolve, reject) {
            module.exports.getAllUsers().then(users => {
                let u;
                users.forEach(user => {
                    var idusr = module.exports.createuid(user)
					
                    if ( (name == user.name && pass == user.pass) || uid === idusr ) {
                        let userreturn = user
                        u = userreturn
                    }
                })
				//console.log(u)
                resolve(u)
            })
        });
    },
    
    loginUser(req, name, pass) { // this login
        return new Promise(function(resolve, reject) {
            let uid
            pass = hash(pass.hashCode().toString());

            module.exports.getUser(name).then(user => {
                if (user) {
                    console.log("user found. trying to log in");
                    uid = module.exports.createuid(user)
                    
                    module.exports.verifyuser(null, name, pass, user.id).then(verifieduser => {
                        if (verifieduser) {
                            console.log(user.name + " user logged in!");
                            resolve("uid=" + uid + ";");
                        } else {
                            console.log("user didnt log in")
                        }
                    })
                }
            });
        })
    },

    async getUserByUID(uid) {
        return new Promise(function(resolve, reject) {
            let returnuser
            module.exports.getAllUsers().then(usercontent => {
                if (uid && uid != "") usercontent.forEach( (user, index) => {
                    if (user.pass) var idusr = module.exports.createuid(user)
                    if (uid == idusr) {
                        returnuser = user;
                        return user;
                    }
                });
            }).then( user => {
                resolve(returnuser)
            });
        })
    },

    async getUserByID(userid) {
        return new Promise(function(resolve, reject) {
			module.exports.getAllUsers().then(users => {
				users.forEach(currentuser => {
					if (currentuser.id == userid) {
						resolve(currentuser)
					}
				})
			});
        });
    },

    async getUser(name) {
        return new Promise(function(resolve, reject) {
            module.exports.getAllUsers().then(users => {
                users.forEach(currentuser => {
                    if (currentuser.name == name) {
                        let user = currentuser;
                        resolve(user)
                    }
                })
            });
        });
    },

    async getAllUsers() {
        return new Promise((resolve, reject) => {
            if (saved_userdata.length == 0) {
                firestore.collection("users").listDocuments().then(documentRefs => {
                    return firestore.getAll(...documentRefs);
                }).then(documentSnapshots => {
                    let users = [];
                    for (let documentSnapshot of documentSnapshots) {
                        if (documentSnapshot.exists) {
                            let user = documentSnapshot.data();
                            user.documentid = documentSnapshot.id
                            users[user.id] = (user);
                        }
                    }
                    saved_userdata = users
                    resolve(users)
                });
            }
            if (saved_userdata.length > 0) resolve(saved_userdata)
        })
    }
}