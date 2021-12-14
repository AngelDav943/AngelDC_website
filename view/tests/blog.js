const accounts = require(`${__dirname}/../../server-modules/accounts.js`);
const blogmanager = require(`${__dirname}/../../server-modules/blog.js`);

blogmanager.getPost_withTimestamp(1639519380782).then(data => {
	console.log(data)
})

blogmanager.getAllPosts().then(data => {
	res.send(data)
})