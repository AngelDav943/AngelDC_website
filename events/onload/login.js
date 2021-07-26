var name = req.query.n;
var pass = req.query.p;

if (!name && !pass) new page.loader({
    "res":res,
    "req":req,
    "template":fs.readFileSync(`${__dirname}/pages/users/login.html`).toString()
}).load()

if(name && pass) {
    console.log("login process started, name " + name);
    accounts.loginUser(req, name, pass).then(login => {
        accounts.getUserByUID(login.split(";")[0].split("=")[1]).then(user => {
            res.send(`<script>document.cookie = "${login}"; window.location = "${page.url}/users/${user.id+1}";</script>`)
        })
    })
}