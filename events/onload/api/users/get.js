accounts.getAllUsers().then(usrs => {
	let users = usrs;
	
    let value = req.query.value;
    let id = req.query.id;
    let allaccounts = []
    let people = []

    users.forEach(user => {
        allaccounts.push({
            "name":user.name,
            "displayname":user.displayname,
            "perms":user.perms,
            "badges":user.badges,
            "description":user.description,
            "banned":user.banned,
            "hidden":user.hidden,
            "id":user.id,
            "documentid":user.documentid
        })
    })

    if (!id) for (let index in allaccounts) {
        let acc = allaccounts[index]
        if (value) acc = acc[value]
        people.push(acc)
    }
    if (id) for (let index in allaccounts) {
        let acc = allaccounts[index]
        if (value) acc = acc[value]
        if (allaccounts[index].id == id) people.push(acc)
    }

    res.json(people)
})