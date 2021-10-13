var name = req.query.n;
var pass = req.query.p;
let background = [
	"https://static.angeldc943.repl.co/assets/images/boxl_spin.gif",
	"https://static.angeldc943.repl.co/assets/images/uraniumgaming.png",
	"https://static.angeldc943.repl.co/assets/images/roblox_image.png",
	"https://static.angeldc943.repl.co/assets/images/cf.gif",
	"https://static.angeldc943.repl.co/assets/images/reallyfunnypoor.png",
	"https://static.angeldc943.repl.co/assets/images/Incidents/gravity01.png",
	"https://static.angeldc943.repl.co/assets/images/Incidents/gravity02.png"
]

if (!name && !pass) new page.loader({
    "res":res,
    "req":req,
    "template":fs.readFileSync(`${__dirname}/pages/users/login.html`).toString(),
	"other":[
		"background:" + background[Math.ceil(Math.random() * background.length)-1]
	]
}).load()

if(name && pass) {
    console.log("login process started, name " + name);
    accounts.loginUser(req, name, pass).then(login => {
        accounts.getUserByUID(login.split(";")[0].split("=")[1]).then(user => {
            res.send(`<script>document.cookie = "${login}"; window.location = "${page.url}/users/${user.id+1}";</script>`)
        })
    })
}