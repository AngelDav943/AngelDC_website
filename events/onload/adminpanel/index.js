accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && user.perms.admin == true) {
        new page.loader({
            "res":res,
            "req":req,
            "basetemplate":"blogstyle.html",
            "template":fs.readFileSync(`${__dirname}/pages/admin/index.html`).toString(),
            "other":[
                "peopleonline:" + (JSON.stringify(users_online).replace('},',"<br>")),
                "sidebarsection:" + fs.readFileSync(`${__dirname}/pages/admin/sidebar.html`).toString()
            ]
        }).load()
    } else {
        res.redirect(`${page.url}`)
    }
})