const accounts = require(`${__dirname}/../../server-modules/accounts.js`)
const cookies = require(`${__dirname}/../../server-modules/cookies.js`)

var name = req.query.n;
var pass = req.query.p;
var invk = req.query.ik;

if (!name && !pass) new page.loader({
    "res":res,
    "req":req,
    "template":fs.readFileSync(`${__dirname}/../../pages/users/signin.html`).toString()
}).load()

if (invk == process.env['inv_key']) {
    accounts.createUser(req.headers.cookie, name, pass, invk).then(() => {
        res.redirect('/login')
    })
}
