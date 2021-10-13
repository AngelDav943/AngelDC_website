/*accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user) {
        new page.loader({
            "res":res,
            "req":req,
            "template":fs.readFileSync(`${__dirname}/pages/chat.html`).toString()
        }).load()
    } else {
        new page.loader({
            "res":res,
            "req":req,
            "template":"<center><b>You need an account to chat</b></center>"
        }).load()
    }
})*/

res.send(
	`<body style="margin:0; display:flex; justify-content:center; height:100%; align-items:center; background-color:#2f2f2f; color:white; flex-direction: column;">`+		
		`<div>`+
			`<img style="height:100px; width:auto;" src="https://angeldc943.repl.co/assets/images/icons/chat.png">`+
			`<img style="height:100px; width:auto;" src="https://static.angeldc943.repl.co/assets/images/oldmonitor.png">`+
		`</div>`+
		`<p style="margin:0px;">chat disabled</p>`+
		`<p style="margin:0px; zoom:250%;">sorry!</p>`+
	`</body>`
)