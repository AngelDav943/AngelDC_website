app.post(`/setavatar`, async (req, res) => {
    accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then( user => {
        if ( user && user.banned == false ) {
            try {
                if(!req.files) {
                    console.log({
                        status: false,
                        message: 'No file uploaded'
                    });
                } else {
                    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                    let avatar = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    avatar.mv(`${__dirname}/assets/public/images/userprofiles/${user.id+1}.png`);

                    //send response
                    console.log({
                        status: true,
                        message: 'File is uploaded',
                        data: {
                            name: avatar.name,
                            mimetype: avatar.mimetype,
                            size: avatar.size
                        }
                    });
                }
            } catch (err) {
                console.log(err);
            }
            res.redirect(`/users/${user.id+1}`)
        }
    })
});

app.post(`/setbackground`, async (req, res) => {
    accounts.getUserByUID(cookies.getCookie(req.headers.cookie, "uid")).then( user => {
        if ( user && user.banned == false ) {
            try {
                if(!req.files) {
                    console.log({
                        status: false,
                        message: 'No file uploaded'
                    });
                } else {
                    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                    let avatar = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    avatar.mv(`${__dirname}/assets/public/images/userbackgrounds/${user.id+1}.png`);

                    //send response
                    console.log({
                        status: true,
                        message: 'File is uploaded',
                        data: {
                            name: avatar.name,
                            mimetype: avatar.mimetype,
                            size: avatar.size
                        }
                    });
                }
            } catch (err) {
                console.log(err);
            }
            res.redirect(`/users/${user.id+1}`)
        }
    })
});