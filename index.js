const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const fetch = require('node-fetch');

const page = require(`${__dirname}/server-modules/pageloader.js`);
const accounts = require(`${__dirname}/server-modules/accounts.js`);
const cookies = require(`${__dirname}/server-modules/cookies.js`);
const post = require(`${__dirname}/server-modules/post.js`);
const inbox = require(`${__dirname}/server-modules/inbox.js`);

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
var awake = fs.readdirSync(`${__dirname}/events/awake`);

for (var i = 0; i < awake.length; i++) {
    try {
	    eval( fs.readFileSync(`${__dirname}/events/awake/${awake[i]}`).toString() );
    } catch(err) {
        console.log("ERROR AT: " + awake[i])
        console.error(err)
    }
}

var closed = false
app.get('*', (req, res) => {
	var cooki = cookies.getCookie(req.headers.cookie, "access_perm") == process.env['access_perm']
	if ( closed == true && cooki === false && req.path.includes("/api") == false) {
		new page.loader({
			"res":res,
			"req":req,
			"custombasetemplate":fs.readFileSync(`${__dirname}/pages/ohuh.html`).toString(),
			"template":"oh uh!"
		}).load()
	} else if (cooki === true || req.path.includes("/api") == true || closed == false) {
    	eval(fs.readFileSync(`${__dirname}/events/loadpage.js`).toString() )
	}

});

app.get('/api', (req, res) => {
	eval(fs.readFileSync(`${__dirname}/events/loadpage.js`).toString() )
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
