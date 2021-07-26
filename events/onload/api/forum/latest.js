post.getAllTopics().then(topics => {
    let posts = []
    topics.forEach(currenttopic => {
        currenttopic.posts.forEach(currentpost => {
            let p = currentpost
            currentpost.topic = currenttopic.name
            posts.push(currentpost)
        })
    })
    let latest = {
        "timestamp":0
    }
    posts.forEach(post => {
        if (post.timestamp > latest.timestamp) {
            latest = post
        }
    })
    res.json(latest)
})