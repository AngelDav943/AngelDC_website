String.prototype.hashCode=function(seed=0){let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;for(let i=0,ch;i<this.length;i++){ch=this.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0);};

app.post(`/newaccount`, async (req, res) => {
    var name = req.body.user;
    var pass = req.body.pass.hashCode();
    var invk = req.body.inv;
    
    if (invk == process.env['inv_key']) {
        accounts.createUser(req.headers.cookie, name, pass, invk).then(() => {
            res.redirect('/login')
        })
    }
});

app.get(`/users/:user`, (req, res) => {
    eval(fs.readFileSync(`${__dirname}/events/awake/users:appget/users:user.js`).toString())
})

