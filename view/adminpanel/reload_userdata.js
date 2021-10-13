const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const cookies = require(`${__dirname}/../../server-modules/cookies.js`);

accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.perms.admin == true) {
        res.redirect(`${page.url}/adminpanel`)
        accounts.reloaduserdata();
    } else {
        res.redirect(`${page.url}`)
    }
})