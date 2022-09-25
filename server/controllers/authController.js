require('dotenv/config');
const db = require('../config/db.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const helpers = require('../helpers/helpers');
const Groups = require('./groupController');
const application = require('./applicationController');
const e = require('express');

//Min 8 Max 10; Aplha, Num , Special
const validPassword = (password) => {

    password = password.replaceAll("\"", "");

    let regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/
    if (!regExp.test(password)){
        return false;
    } else {
        return true;
    }
    // if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/.test(password)) return true; check for password length
    // if (!/[0-9]/g.test(password)) return false; //check for numbers
    // if (!/[a-zA-Z]/.test(password)) return false; //check for alphabets
    // if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return false; //check for special characters
    // return false;
};

//Login
exports.doLogin = catchAsyncErrors ( async (req, res, next) => {
    const username = await JSON.stringify(req.body.username);
    const password = await JSON.stringify(req.body.password);

    // Check if admin
    var userAdmin = "";
    var userRole = "";

    let sql = `SELECT user.user_id, user.username, kanban_web_app.group.group_id, 
    kanban_web_app.group.group_name FROM user LEFT JOIN user_in_group ON user.user_id = user_in_group.user_id 
    LEFT JOIN kanban_web_app.group ON user_in_group.group_id = kanban_web_app.group.group_id 
    WHERE kanban_web_app.group.group_name = 'admin' AND user.username = ${username}`;
    db.query(sql, (error, checkAdmin) => {
        if (error) {
            res.send("Error");
        } else {
            if (checkAdmin[0] === undefined){
                // userAdmin = 0
                userAdmin = false
                userRole = "user"
            } else {
                // userAdmin = 1
                userAdmin = true
                userRole = "admin"
            }
        }
    })
  
    if (username === `""` || password === `""`) {
        if (username === `""` && password !==`""`) {
            res.send("username empty");
        } else if (username !== `""` && password === `""`){
            res.send("password empty")
        } else {
            res.send("username and password empty")
        }
     } else {
        let sql = `SELECT * FROM user WHERE username = ${username}`;
        db.query(sql, (error, results) => {
            if (error || !results.length) {
                res.send("Wrong password/username");
            } else {

                const [result] = results;
                const userStatus = result.status;

                if (userStatus === 0){
                    res.send("deactivated");
                } else {
                    const checkPassword = result.password;
                    bcrypt.compare(password, checkPassword).then(check => {
                        if (!check) {
                          res.send("Wrong password/username");
                        } else {
                            
                            const user = results;
                            result.password = undefined;
                            // console.log(check, result);

                            const User = { name: req.body.username};
                            const accessToken = jwt.sign(User , process.env.ACCESS_TOKEN_SECRET , {expiresIn: '1d'}
                                //, {expiresIn: 1800} //Expires in 30 mins
                                ); 
                            const refreshToken = jwt.sign(User , process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
                                
                            const userInfo = Object.assign(result, {token: accessToken}, {role: userRole});

                            // console.log(userInfo);
                            res.json(userInfo);
                        }
                        //return null;
                    })
                }
            }
        })
    };
});


//Create new user 
exports.createUser = catchAsyncErrors ( async (req, res, next) => {
    const username = JSON.stringify(req.body.username);
    const password = JSON.stringify(req.body.password);
    const email = JSON.stringify(req.body.email);
    const status = 1;

    // const password = req.body.password;

    if (username === `""` || password === `""`){
        res.send("Fill in username and password to create new user");
    } else {

        const checkPasswordValid = validPassword(password);

        // console.log(password);
        // console.log(checkPasswordValid);

        if(checkPasswordValid === false){
            res.send("password criteria")
        } else {
            let sql = `SELECT username FROM user WHERE username = ${username}`;
            db.query(sql, (error, results) => {
                if (error){
                    res.send(error);
                } else {
                    if (results.length){
                        res.send("existed");
                    } else {
                        bcrypt.hash(password, saltRounds, (error, hash) => {
                            if (error){
                                res.send(error);
                            } else {
                                hashPassword = JSON.stringify(hash);
                                let sql = `INSERT INTO user (username, password, email, status) VALUES (${username}, ${hashPassword},${email},${status})`;
                                db.query(sql, (error, results) => {
                                    if (error){
                                        res.send("Error");
                                    } else {
                                        res.send("success");
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
});

//Update specific user
exports.updateUser = catchAsyncErrors ( async (req, res, next) => {
    const { id } = req.params;

    const password = JSON.stringify(req.body.password);
    const email = JSON.stringify(req.body.email);
    // const groupUpdate = req.body.selectedGroups;
    const checkPasswordValid = validPassword(password);

    if (password == `""`) {
        let sql = `UPDATE user SET user.email = ${email} WHERE user.user_id = ${id}`;
        db.query(sql, (error, results) => {
            if (error){
                res.send("failed");
            } else {
                res.send("success");
            }
        });
    } else {
        if (checkPasswordValid == false){
            res.send("password criteria")
        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err){
                    res.send(err);
                }else{
                    hashPassword = JSON.stringify(hash);
        
                    let sql = `UPDATE user SET user.password = ${hashPassword} , user.email = ${email} WHERE user.user_id = ${id}`;
                    db.query(sql, (error, results) => {
                        if (error){
                            res.send("failed");
                        } else {
                            res.send("success");
                        }
                    });
                }
            });
        }
    }
});

//Delete user groups
exports.refreshUserGroups = catchAsyncErrors ( async (req, res, next) => {
    const { id } = req.params;
    //remove all groups from user first
    let sql = `DELETE FROM user_in_group WHERE user_id = ${id};`
    db.query(sql, (error, results) => {
            if (error){
                res.send("failed");
            } else {
                res.send("success");
            }
        });
});

//Update user groups
exports.updateUserGroups = catchAsyncErrors ( async (req, res, next) => {
    const { id } = req.params;
    const groupID = req.body.getGroupID;

    let sql = `INSERT INTO user_in_group (user_id, group_id) VALUES (${id}, ${groupID})`;
        db.query(sql, (error, results) => {
            if (error){
                res.send("failed");
            } else {
                res.send("success");
            }
        });
});

//Add Users to groups
exports.addUserGroups = catchAsyncErrors ( async (req, res, next) => {

    const username = JSON.stringify(req.body.username);
    const groupID = req.body.getGroupID;

    var thisUserID = "";

    //find userID
    let findID = `SELECT user_id FROM user WHERE username = ${username}`
    db.query(findID, (error, results) => {
        if (error){
            res.send("failed");
        } else {
            const [result] = results;
            thisUserID= (result.user_id);
            
            //Insert user
            let sql = `INSERT INTO user_in_group (user_id, group_id) VALUES (${thisUserID}, ${groupID})`;
            db.query(sql, (error, results) => {
                if (error){
                    res.send("failed");
                } else {
                    res.send("success");
                }
            });
        }
    });
});

//Get user access rights
exports.checkUserInGroup = catchAsyncErrors ( async (req, res, next) => {
    const { groupName, username } = req.body;

    const check = await helpers.checkGroup(groupName, username);
    if (!check.length){
        res.send(false)
    }else {
        res.send(true)
    }
});

//Get user access rights
exports.getAccessRights = catchAsyncErrors ( async (req, res, next) => {
    const { username } = req.body;
    
    const apps = await application.allApps()
    var accessArr = [];
    
    //Loop app data
    for(var i = 0 ; i < apps.length; i++){
        let currentApp = apps[i]
        let appName = currentApp.app_acronym;
        //Get permit data
        let permitData = Object.entries(currentApp).slice(5, 10)

        let app = {app: appName}

        // console.log(permitData)

        //Loop app states
        for(var x = 0 ; x < permitData.length; x++){
        
        var stateName

        if (permitData[x][0] === "app_permit_create"){
            stateName = "create"
        } else if(permitData[x][0] === "app_permit_open"){
            stateName = "open"
        } else if(permitData[x][0] === "app_permit_toDoList"){
            stateName = "toDoList"
        } else if(permitData[x][0] === "app_permit_doing"){
            stateName = "doing"
        } else if(permitData[x][0] === "app_permit_done"){
            stateName = "done"
        }

        let stateGroups = JSON.parse(permitData[x][1])
        let accessOutcome

        //Check if user is in state groups
        for(var a = 0 ; a < stateGroups.length; a++){

            let groupName = stateGroups[a];
            let response = await helpers.checkGroup(groupName, username)

            if(!response.length){
                accessOutcome = false
            } else {
                accessOutcome = true
                break
            }
        }
        //Set state access
        app[stateName] = accessOutcome
        }
        accessArr.push(app)
    }
    // console.log(accessArr)
    res.send(accessArr)
    // res.send(JSON.stringify(accessArr))
});