// this gets the user with the given external uid

const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
var extuid = req.query.uid

accounts.getUserByExternalUID(extuid).then(user => {
	res.json({
        "name":user.name,
        "displayname":user.displayname,
        "perms":user.perms,
        "badges":user.badges,
        "backpack":user.backpack || [],
        "description":user.description || "",
        "banned":user.banned,
        "currency":user.currency || 0,
        "first-login":user["first-login"],
        "last-login":user["last-login"],
        "hidden":user.hidden,
        "id":user.id,
        "documentid":user.documentid
    })
})