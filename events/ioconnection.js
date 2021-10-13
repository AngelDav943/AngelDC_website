const accounts = require(`${__dirname}/server-modules/accounts.js`);
const cookies = require(`${__dirname}/server-modules/cookies.js`);
const fetch = require('node-fetch');

let socket_cookies = socket.handshake.headers.cookie
let emoji_rejex = /(:)(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])(:)/g
socket.removeAllListeners();
accounts.getUserByUID(cookies.getCookie(socket_cookies,"uid")).then(account => {
    var token = function() {
        var rand = function() {
            return Math.random().toString(36).substr(2); // remove `0.`
        };
        hash = ""
        for (i = 0; i < 16; i++) { // to make it longer
            let r = rand()
            hash = hash + r;
        }
        return hash; 
    };

    let user_token = token();
    socket.emit('connected',user_token)
    var accountuser;

    if (!account) {
        accountuser = {
            "name":"Guest",
            "displayname":"Guest",
            "id":-101,
            "banned":false
        }
    } else {
        accountuser = {
            "name": account.name,
            "displayname": account.displayname,
            "id": account.id,
            "perms": account.perms,
            "banned": account.banned,
        }
    }

    if (!accountuser.banned) {
        accountuser.visiting = socket.handshake.headers.referer.replace(page.url,"")

        users_online[user_token] = accountuser
        //console.log(accountuser.name +" is looking at "+ accountuser.visiting)

        let adminbroad_cansend = true;
        socket.on("send_annoucement", (arg) => {
            if (accountuser && accountuser.id != -101 && accountuser.perms.admin == true && adminbroad_cansend == true) {
                io.emit("connection_status",{
                    "title":`@${accountuser.name} (Admin)`,
                    "content": arg.message,
                    "color": (arg.color || "")
                });
                adminbroad_cansend = false
                setTimeout(() => {
                    adminbroad_cansend = true
                },5000)
            }
        })

        socket.on('chat/connected', arg => {
            let alreadyconnected = 0
            for (let index in users_online) {
                if (users_online[index].id == accountuser.id) alreadyconnected++;
            }
            if (accountuser.banned == false && accountuser.id != -101 && alreadyconnected == 1) {
                io.emit("chat/joinmessage",{
                    "user":`${accountuser.displayname} @${accountuser.name}`,
                    "message": "Joined"
                });
            }
        })

        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            var embedRegex = /(https?:\/\/[^]+\/[^]+(.png|.jpg|.gif|.ico|.PNG))/g

            let splittedtext = text.split(' ')
            let finaltext = ''
            splittedtext.forEach(text => {
                let converted = false
                if (embedRegex.test(text) && !converted) {
                    finaltext = `${finaltext} <embed style="max-width:90%; height:auto;" src="${text}">`
                    converted = true
                } else if (urlRegex.test(text) && !converted) {
                    finaltext = `${finaltext} <a style="color:#cac4ff;"  href="${text}">${text}</a>`
                    converted = true
                } else if (!converted) {
                    finaltext = `${finaltext} ${text}`
                    converted = true
                }
            })

            return finaltext
        }

        let chat_cansend = true;
        socket.on('chat/sendmessage', arg => {
            if (!emoji_rejex.test(arg)) arg = arg.replace(/[^\u0000-\u00ff]/g,"")
            if (emoji_rejex.test(arg)) arg = arg.substring(1,arg.length-1)
            arg = arg.replace(/</g,"").replace(/>/g,"")
            if (arg.replace(/ /g,"") != "" && chat_cansend && accountuser.banned == false && accountuser.id != -101) {
                let messagesent = ""
                if (arg) arg.split(" ").forEach(text => {
                    messagesent = `${messagesent} ${urlify(text)}`
                })

                let profile = `${page.url}/assets/images/userprofiles/${accountuser.id+1}.png`
                let profile_exists = fs.existsSync(`${__dirname}/assets/public/images/userprofiles/${accountuser.id+1}.png`)
                if (!profile_exists) profile = `${page.url}/assets/images/userprofiles/UserDefault.png`
                
                io.emit("chat/newmessage",{
                    "user":`${accountuser.displayname}<;userseparator;>@${accountuser.name}`,
                    "userid": accountuser.id+1,
                    "accprofile": profile,
                    "message": messagesent.substring(0,255)
                });
                chat_cansend = false
                setTimeout(() => {
                    chat_cansend = true
                },1000)
            }
        })

        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', () => {
            setTimeout(() => {
                delete users_online[user_token]
            }, 600)
            let alreadyconnected = 0
            for (let index in users_online) {
                if (users_online[index].id == accountuser.id) alreadyconnected++;
            }
            if (accountuser.banned == false && accountuser.id != -101 && accountuser.visiting == "/chat" && alreadyconnected < 1) {
                io.emit("chat/joinmessage",{
                    "user":`${accountuser.displayname} @${accountuser.name}`,
                    "message": "Left"
                });
            }
        });
    }
})