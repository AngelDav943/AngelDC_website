accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
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
})