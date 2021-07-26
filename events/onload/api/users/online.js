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