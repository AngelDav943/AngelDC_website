const fs = require('fs');

var accounts = require(`${__dirname}/accounts.js`);
var cookies = require(`${__dirname}/cookies.js`);

let websiteurl = 'https://angeldc943.repl.co'

class loader {
    constructor(configtable) { // loader constructor
        this.res = configtable.res
        this.req = configtable.req
        this.basetemplate = `${__dirname}/../assets/server/basetemplates/${configtable.basetemplate || "default.html"}`;
        this.custombasetemplate = configtable.custombasetemplate || "";
        this.templatedir = configtable.templatedir || "";
        this.template = configtable.template || "";
        this.other = configtable.other || [];
        this.rename = configtable.rename || [];
        this.title = configtable.title || "";
    }

    load() { // loads the html
        if (this.res && this.req) {
            this.other.push('')
            let dirtemplate = `${__dirname}/../view${this.templatedir}.html`
            let other = this.other
            let rename = this.rename

            if(!fs.existsSync(dirtemplate) && !fs.existsSync(this.templatedir) && this.template == "") { // checks if page exists
                this.res.status(404)
				dirtemplate = `${__dirname}/../pages/error.html`
                other = [
                    "500templateerrormessage:" + '404: Page not found',
                    "500templateerrorcode:" + '404',
                    "500templateerrortitle:" + (this.req.path.substring(1) + " isn't a valid page")
                ]
                console.log(this.templaterdir)
            }

            if (fs.existsSync(this.templatedir)) dirtemplate = this.templatedir

            var classmain = "main dark-mode"
            var htmltemplate = fs.readFileSync(this.basetemplate).toString();
            
            if (this.custombasetemplate != "") htmltemplate = this.custombasetemplate

            accounts.verifyuser(cookies.getCookie(this.req.headers.cookie, "uid")).then(account => {
                let section = null;
                if (fs.existsSync(dirtemplate) && !section) section = fs.readFileSync(dirtemplate).toString()
                if (this.template && !section && !fs.existsSync(dirtemplate)) section = this.template
                if (account && account.banned == true) section = fs.readFileSync(`${__dirname}/../pages/banned.html`)

                htmltemplate = htmltemplate.replace(/<¡templatesectionmain>/g, section);
                htmltemplate = htmltemplate.replace(/<¡defaultheader>/g, fs.readFileSync(`${__dirname}/../assets/server/templates/navigationbar.html`).toString());
                htmltemplate = htmltemplate.replace(/<¡templatesectionclass>/g, classmain);

				if (rename.length > 0) rename.forEach( object => {
                    let thing = object.replace(":","|/|objectSEPARATOR|/|").split("|/|objectSEPARATOR|/|");
                    htmltemplate = htmltemplate.replace(new RegExp(`${thing[0]}`,"g"), thing[1]);
                });

                if (other.length > 0) other.forEach( object => {
                    let thing = object.replace(":","|/|objectSEPARATOR|/|").split("|/|objectSEPARATOR|/|");
                    htmltemplate = htmltemplate.replace(new RegExp(`<¡${thing[0]}>`,"g"), thing[1]);
                });


				let profile = `__rooturl/assets/images/userprofiles/UserDefault.png`

                if (account) {
                    let profile_exists = fs.existsSync(`${__dirname}/../assets/public/images/userprofiles/${account.id+1}.png`)
                    if (profile_exists) profile = `__rooturl/assets/images/userprofiles/${account.id+1}.png`
                    
                    htmltemplate = htmltemplate.replace(/<¡usertopbar>/g, new templater({
                        "templatedir":"usertopbar",
                        "other":[
                            "userdisplay:" + account.displayname,
                            "username:" + account.name,
                            "userid:" + (account.id+1),
                            "profile:" + (profile)
                        ]
                    }).load());
                    

                    let backgroundpage = ''
                    let background = `__rooturl/assets/images/userbackgrounds/${account.id+1}.png`
                    let background_exists = fs.existsSync(`${__dirname}/../assets/public/images/userbackgrounds/${account.id+1}.png`)
                    if (!background_exists) background = ``
                    if (background != ``) backgroundpage = fs.readFileSync(`${__dirname}/../assets/server/templates/profilebackground.html`).toString().replace(/__profilebackground/g,background)
                    htmltemplate = htmltemplate.replace(/<¡userbackground>/g,backgroundpage)
					

                } else {
					 htmltemplate = htmltemplate.replace(/<¡userbackground>/g,"")
                    htmltemplate = htmltemplate.replace(/<¡usertopbar>/g, `<a style="float:right;" class="button" href="${websiteurl}/login" >Login</a>`)
                }
				htmltemplate = htmltemplate.replace(/<¡user_profile>/g,profile)

                return account
            }).then(user => {

                if (user) {
                    htmltemplate = htmltemplate.replace(/<¡user_displayname>/g, user.displayname)
                    htmltemplate = htmltemplate.replace(/<¡user_id>/g, user.id+1)
                    htmltemplate = htmltemplate.replace(/<¡user_username>/g, user.name)
                } else {
                    htmltemplate = htmltemplate.replace(/<¡user_[a-z]*>/g, "")
                }

                htmltemplate = htmltemplate.replace(/__pagetitle/g, this.title)
                htmltemplate = htmltemplate.replace(/__rooturl/g, websiteurl);

                if(!this.res.headersSent) this.res.send(htmltemplate) // send html

            })
        }
    }
}

class templater {
    constructor(configtable) {
        this.templatedir = `${__dirname}/../assets/server/templates/${configtable.templatedir || "-NO.DIR-."}.html`;
        this.template = configtable.template || "";
        this.other = configtable.other || [];
    }

    load() {
        var template;
        if (fs.existsSync(this.templatedir)) {
            template = fs.readFileSync(this.templatedir).toString();
        } else if (this.template != "") {
            template = this.template
        }

        if (this.other.length > 0) this.other.forEach( object => {
            let thing = object.replace(":","|/|objectSEPARATOR|/|").split("|/|objectSEPARATOR|/|");
            template = template.replace(new RegExp(`<¡${thing[0]}>`,"g"), thing[1]);
        });

        template = template.replace(/__rooturl/g, websiteurl);
        return template
    }
}

module.exports = {
    url: websiteurl,
    loader,
    templater
}