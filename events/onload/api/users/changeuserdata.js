accounts.verifyuser(cookies.getCookie(req.headers.cookie, "uid")).then(user => {
    if (user && req.query.name && req.query.value) {
        let newdata = {}
        newdata[req.query.name] = req.query.value;

        accounts.changeuserdata(cookies.getCookie(req.headers.cookie, "uid"),newdata).then(dataresponse => {
            if (dataresponse) {
                res.redirect(`${page.url}/users/${user.id+1}`)
            } else {
                res.send("Error.")
            }
        });
    }
});