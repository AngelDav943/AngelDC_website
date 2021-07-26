accounts.getUserByID(parseInt(req.params.user)-1).then(user => {
    accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then(currentuser => {
        if (user) {
            //.toLowerCase().replace(/[^0-9]*/g, "")
            let acc_config = ""
            let isonline = "offline"
            let onlinecolor = "#f04f39"
            let banstatus = ""
            let commentcount = 0

            for (let online_user in users_online) {
                if (users_online[online_user].id == user.id) {
                    isonline = "online"; 
                    onlinecolor = "#39f06e";
                }
            }

            if (user.banned == true) banstatus = "<article class='alert'><p style='right'>This person is currently banned</p></article>"
            if (currentuser) {
                console.log(currentuser.name +" is looking at "+ user.name +" profile.") 
                if (user.id == currentuser.id) {
                    acc_config = fs.readFileSync(`${__dirname}/pages/users/accountconfig.html`);
                }
            }
            let badges = JSON.parse(fs.readFileSync(`${__dirname}/assets/public/badges.json`));
            let htmlbadge = ''
            let htmlbadgeinfo = ''
			
            if (user.badges.length > 0) user.badges.forEach((badgeid) => {
                badges.forEach(currentbadge => {
                    if (currentbadge.id == badgeid) {
                        htmlbadge = `${htmlbadge} <li><img src="${currentbadge.image}" style="float:left; height:35px; width:35px; object-fit: cover;"></li>`
                        htmlbadgeinfo = `${htmlbadgeinfo} <li><img src="${currentbadge.image}" style="float:left; height:35px; width:35px; object-fit: cover;"><h4>${currentbadge.name}</h4>"${currentbadge.description}"</li><br>`
                    }
                })
            })
            let profile = `__rooturl/assets/images/userprofiles/${user.id+1}.png`
            let profile_exists = fs.existsSync(`${__dirname}/assets/public/images/userprofiles/${user.id+1}.png`)
            if (!profile_exists) profile = `__rooturl/assets/images/userprofiles/UserDefault.png`
            
            /**/
            let background = `__rooturl/assets/images/userbackgrounds/${user.id+1}.png`
            let background_exists = fs.existsSync(`${__dirname}/assets/public/images/userbackgrounds/${user.id+1}.png`)
            if (!background_exists) background = ``
            let backgroundpage = ''
            if (background != ``) backgroundpage = '<img id="profile_background" src="'+background+'">'

			let isbot = ""
			if (user.perms.bot == true) isbot = `<b style="font-size:50%;color: #ffffff;background-color: #ff7c00;padding: 4px;margin: 0px 10px;border-radius: 1000px;">BOT</b>`

            new page.loader({
                "res":res,
                "req":req,
                "title":`@${user.name}`,
                "template":fs.readFileSync(`${__dirname}/pages/users/users.html`).toString(),
                "other":[
                    "displayname:" + `${user.displayname}`,
                    "username:" + `${user.name}`,
                    "userindex:" + `${user.id+1}`,

                    "onlinestatus:" + isonline,
                    "onlinecolor:" + onlinecolor,
                    
                    "userdesc:" + `${user.description || "nothingness..." }`,
                    "friendsamount:" + `0`,
                    "userdescinput:" + `${user.description.replace(/<br>/g, String.fromCharCode(10)) || "nothingness..." }`,
                    
                    "badges:" + htmlbadge,
                    "badgesinfo:" + htmlbadgeinfo,
                    
                    "accountconfig:" + acc_config,
                    "commentcount:" + commentcount,
                    
                    "accprofile:" + profile,
                    "banstatus:" + banstatus,

                    "userbackground:" + backgroundpage,
					"isbot:" + isbot
                ]
            }).load()
        }
    })
})