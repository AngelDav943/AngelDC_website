let id = parseInt(req.query.id);

if (id) {
	let profile = `${page.url}/assets/images/userprofiles/UserDefault.png`

	let profile_exists = fs.existsSync(`${__dirname}/../../assets/public/images/userprofiles/${id}.png`)
    if (profile_exists) profile = `${page.url}/assets/images/userprofiles/${id}.png`

	res.redirect(profile)
} else {
	res.send("user id not valid")
}