const users_online = []
const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.perms.admin == true) {
		console.log("adminpanel to @"+user.name)
        new page.loader({
            "res":res,
            "req":req,
            "basetemplate":`${__dirname}/../../assets/server/basetemplates/blogstyle.html`,
            "template":fs.readFileSync(`${__dirname}/../../pages/admin/index.html`).toString(),
            "other":{
                "peopleonline": (JSON.stringify(users_online).replace('},',"<br>"))
			}
        }).load()
    } else {
        res.redirect(`${page.url}`)
    }
})