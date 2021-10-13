const post = require(`${__dirname}/../../server-modules/post.js`)

post.getAllTopics().then(topics => {
    let value = req.query.value;
    let topic = req.query.topic;
    let alltopics = []
    let jsontopics = []

    topics.forEach(topic => {
        alltopics.push(topic)
    })

    if (!topic) for (let index in alltopics) {
        let acc = alltopics[index]
        if (value) acc = acc[value]
        jsontopics.push(acc)
    }
    if (topic) for (let index in alltopics) {
        let acc = alltopics[index]
        if (value) acc = acc[value]
        if (alltopics[index].name == topic) jsontopics.push(acc)
    }

    res.json(jsontopics)
})