const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

let fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 800000
    },
}));

app.use(cors())
app.use('/assets', express.static('assets/public'));
app.use('/favicon.ico', express.static('assets/favicon.ico'));

let users_online = {};
let sockets_online = {};

eval( fs.readFileSync(`${__dirname}/account_post.js`).toString() );

const page = require('angeldav-testpackage');
page.url = "https://angeldc943.repl.co"
page.default.template = `${__dirname}/assets/server/basetemplates/default.html`
page.default.notfound = `${__dirname}/pages/404.html`
page.default.other = {
    "defaultheader": fs.readFileSync(`${__dirname}/assets/server/templates/navigationbar.html`)
}

page.default.codeDir = `${__dirname}/default_onload.js`

app.get('/api/users/online', (req, res) => {
	if (req.query.page) var requestedpage = req.query.page.split('/')[0];
	let repeat = req.query.repeat || "false";
	let value = req.query.value;
	let id = req.query.id;
	let onlinepeople = []

	function pusharrayusers(online_user) {
		if (users_online[online_user].visiting == `/${requestedpage}` || !requestedpage) {
			onlinepeople.push(users_online[online_user])
		}
	}

	if (!id) for (let online_user in users_online) {
		pusharrayusers(online_user)
	}
	if (id) for (let index in users_online) {
		if (users_online[index].id == id) pusharrayusers(index)
	}

	if (value) for (let index in onlinepeople) {
		onlinepeople[index] = onlinepeople[index][value]
	}

	if (req.query.repeat == "false") onlinepeople = onlinepeople.filter((thing, index, self) =>
		index === self.findIndex((t) => (
			t.place === thing.place && t === thing
		))
	)

	res.json(onlinepeople)
})

const pageloader = require(`angeldav-test-pageloader`)(page,{
    "app":app,
    "path":`${__dirname}/view`
})

//Whenever someone connects this gets executed
io.on('connection', socket => {
    eval(fs.readFileSync(`${__dirname}/events/ioconnection.js`).toString())
});

http.listen(3000, () => {
	console.log('server started');
});

app.use(function(error, req, res, next) {
	console.log(error); // log error

	new page.loader({
        "res":res,
        "req":req,
        "title":"ERROR 500",
        "templatedir":`${__dirname}/pages/error.html`,
        "other":[
            "500templateerrorcode:" + `500`,
            "500templateerrortitle:" + `Internal Server Error`,
            "500templateerrormessage:" + error
        ]
    }).load()
});
