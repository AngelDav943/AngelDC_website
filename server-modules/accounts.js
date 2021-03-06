let firebase = require('firebase-admin');
let fs = require('fs');

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
		return hash(user.name.toString() + user.pass.toString() + (user["first-login"] || 0).toString() + user.invkey.toString()) + hash("num" + user.id) + hash(user.invkey + user.documentid + "1angeldavwebsite")
	},

	createexternaluid(user) {
		var ext = user.external || {"pass":"notvalid"}
		return "ext" + hash(user.name.toString() + (ext).toString() + (user["first-login"] || 0).toString()) + hash("num" + user.id) + hash(user.invkey  + (user["first-login"] || 0).toString() + user.documentid + "2externalsource") + "id"
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
                        datavalue = datavalue.replace(/<LINEBREAK>/g,"??&br??&")
                        datavalue = datavalue.replace(/[^\u0000-\u00ff]/g,"").replace(/</g,"").replace(/>/g,"").replace(/\//g,"")
                        if (index == "description") datavalue = datavalue.replace(/??&br??&/g,"<br>")
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
				if ( user["currency"] == undefined || user["currency"] == NaN || user["currency"] < 0) user["currency"] = 25
				if ( user["last-cashout"] == undefined) user["last-cashout"] = Date.now() - 3600000
				
				// This gets you one coin every hour
				var hcoin = Math.floor(Math.abs(user["last-cashout"] - Date.now()) / 3600000)
				if ( hcoin >= 1 ) {
					hcoin = Math.min(hcoin,100) // Limit amount of coins
					console.log(user.name +" " + (hcoin*2))
					user["currency"] += hcoin*2;
					user["last-cashout"] = Date.now();
				}
				
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

	

	"notification":{
		new(id, title, content, redirect) {
			module.exports.getUserByID(id).then(user => {
				var newtimestamp = Date.now()
				user["notifications"] = (user["notifications"] || {})
				user["notifications"][newtimestamp] = {
					"title":title,
					"content":content,
					"redirect":redirect,
					"read":false,
					"timestamp":newtimestamp
				}
				firestore.collection("users").doc(user.documentid).set(user)
			})
		},

		read(uid, timestamp, status) {
			module.exports.verifyuser(uid).then(user => {
				if (user.notifications == undefined) return;

				if (user.notifications[timestamp] != undefined) {
					var readstatus = !user.notifications[timestamp].read
					if (status != undefined) readstatus = status
					
					user.notifications[timestamp].read = readstatus
					firestore.collection("users").doc(user.documentid).set(user)
				}
			})
		},

		remove(uid, timestamp) {
			module.exports.verifyuser(uid).then(user => {
				if (user.notifications == undefined) return;

				if (user.notifications[timestamp] != undefined) {
					delete user.notifications[timestamp]
					firestore.collection("users").doc(user.documentid).set(user)
				}
			})
		}
	},

	getItem(uid, shopid) {
		let shopdb = require(`${__dirname}/shop.js`);
		module.exports.verifyuser(uid).then(user => {
			shopdb.getdata().then(items => {
				//var items = JSON.parse(fs.readFileSync(`${__dirname}/../assets/public/items.json`));
				let item = items.find(obj => obj.id == shopid);
				var isavailable = (item.disabled != true) && (Date.now() < (item.limited || Date.now()+1) ? true : false)
				console.log(`${item.name} is ${isavailable ? "available" : "no longer available"}`)
				
				if (user && user.currency >= item.cost && isavailable) {
					if (user.backpack == undefined) user.backpack = []
					var useritem = user.backpack.find(obj => obj.id == shopid) 
					var quantity = useritem == undefined ? 1 : useritem.quantity+1
	
					var newitem = {
						"id":shopid,
						"quantity":quantity
					}
					
					console.log(useritem)
					if (useritem) {
						let objectindex = -1
						user.backpack.forEach((item,index) => {
							if (item.id == newitem.id) objectindex = index
						})
						if (objectindex != -1) user.backpack[objectindex] = newitem
					} else {
						user["backpack"].push(newitem)
					}
	
					useritem = user.backpack.find(obj => obj.id == shopid)
					if (useritem && useritem.quantity == quantity) user["currency"] -= item.cost
					firestore.collection("users").doc(user.documentid).set(user)
				}
			})
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
		if (name == undefined || pass == undefined) return new Promise(function(resolve, reject) {
			resolve({
				"error":"invalid"
			})
		})
		
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

	async getUserByExternalUID(uid) {
        return new Promise(function(resolve, reject) {
            let returnuser
            module.exports.getAllUsers().then(usercontent => {
                if (uid && uid != "") usercontent.forEach( (user, index) => {
                    if (user.pass) var idusr = module.exports.createexternaluid(user)
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
				let user = null;
                users.forEach(currentuser => {
                    if (currentuser.name.toString().toLowerCase() == name.toString().toLowerCase()) {
                        user = currentuser;
                    }
                })
				return user
            }).then(user => {
				resolve(user)
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