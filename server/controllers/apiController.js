require('dotenv/config');
const db = require('../config/db.js');
const {nodemailer, transporter} = require('../config/email');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const e = require('express');
const bcrypt = require('bcrypt');

//Other functions
const { checkGroup, createDateTime } = require('../helpers/helpers');
const { getSingleTask, getTaskAmount, getSingleTaskByID } = require('./taskController');
const { getOneApp } = require("./applicationController");
const { getUsersInGroup } = require("./groupController");

//Create a new task
exports.CreateTask = catchAsyncErrors ( async (req, res, next) => {

    const { username, password, app_acronym, task_note, task_desc } = req.body;
    // var app_acronym = req.body.app_acronym;
    var task_name = req.body.task_name;
    // var task_note = req.body.task_note;

    if (task_name){
        task_name = task_name.trim()
    }

    // app_acronym = app_acronym.trim()
    var appCreateGroups
    var userInGroup

    //If app_acronym/ task_name/ username and password not entered
    if(!app_acronym || !task_name || !username || !password ){
        res.status(400).send({
            code:400
        })
    } else if (task_name.length > 50){
        console.log("more than 50")
        res.status(406).send({
            code:406
        })
    }else {
        //Check username
        let sql = `SELECT * FROM user WHERE username = ${JSON.stringify(username)}`;
        var userResults = await db.promise().query(sql)
        userResults = userResults[0][0]
        if(!userResults){
            res.status(401).send({
                code:401
            })
        } else {
            //Check password
            const dbPassword = userResults.password;
            const checkPassword = await bcrypt.compare(JSON.stringify(password), dbPassword)
            if(!checkPassword){
                res.status(401).send({
                    code:401
                })
            } else {
                // Check if there is app exists
                const appData = await getOneApp(app_acronym);
                if(!appData){
                    console.log("app does not exists")
                    res.status(404).send({
                        code:404
                    })
                } else {
                    // Get app create groups
                    appCreateGroups = JSON.parse(appData.app_permit_create);

                    //check if user is in group
                    for(var i = 0 ; i < appCreateGroups.length; i++){
                        let groupName = appCreateGroups[i]

                        userInGroup = await checkGroup(groupName, username);
                        if(userInGroup.length){
                            break
                        }
                    }
                    //If user not in group
                    if(!userInGroup.length){
                        res.status(403).send({
                            code:403
                        })
                    } else {
                        //Check if task name exist
                        const existingTask = await getSingleTask(task_name, app_acronym);
                        if(existingTask){
                            res.status(409).send({
                                code:409
                            })
                        } else {
                            //Create task
                            const taskAmount = await getTaskAmount(app_acronym);

                            const taskID = `${appData.app_acronym}_${+appData.app_Rnumber + taskAmount}`;
                            const taskState= "open";

                            const createDate = new Date().toISOString().slice(0, 10);
                            const date = createDateTime();

                            const createTaskNote = JSON.stringify(`[${username}] created task "${task_name}" on ${date} \nTask state: ${taskState}\n${task_note?"\nNotes:\n" + task_note : ""}`);

                            let sql = `INSERT INTO task (task_id, task_name, task_description, task_notes, task_app_acronym, task_state, task_creator, task_owner,  task_createDate) VALUES(${JSON.stringify(taskID)},${JSON.stringify(task_name)},${!task_desc?null:JSON.stringify(task_desc)},${createTaskNote},${JSON.stringify(app_acronym)},${JSON.stringify(taskState)},${JSON.stringify(username)}, ${JSON.stringify(username)}, ${JSON.stringify(createDate)})`;
                            db.query(sql, (error, results) => {
                                if (error) {
                                    res.status(500).send({
                                        code:500
                                    })
                                } else {
                                    res.status(201).send({
                                        code:201,
                                        message:`Task '${task_name}' successfully created.`
                                    })
                                }
                            })
                        }
                    }
                }
            }
        }
    }
})

//Retrieve tasks in a particular state
exports.GetTaskbyState = catchAsyncErrors ( async (req, res, next) => {

    const { username, password, app_acronym } = req.body;
    // var app_acronym = req.body.app_acronym;

    // app_acronym = app_acronym.trim()
    // task_state = task_state.trim()

    var task_state = req.body.task_state;
    
    if(task_state){
        task_state = task_state.toLowerCase();
    }

    //If app_acronym/ task_state/ username and password not entered
    if(!app_acronym || !task_state || !username || !password){
        res.status(400).send({
            code:400
        })
    } else {
        //Check username
        let sql = `SELECT * FROM user WHERE username = ${JSON.stringify(username)}`;
        var userResults = await db.promise().query(sql)
        userResults = userResults[0][0]
        if(!userResults){
            res.status(401).send({
                code:401
            })
        } else {
            //Check password
            const dbPassword = userResults.password;
            const checkPassword = await bcrypt.compare(JSON.stringify(password), dbPassword)
            if(!checkPassword){
                res.status(401).send({
                    code:401
                })
            } else {
                // Check if there is app exists
                const appData = await getOneApp(app_acronym);
                if(!appData){
                    console.log("app does not exists")
                    res.status(404).send({
                        code:404
                    })
                } else {

                    if(task_state === "open" || task_state === "todolist" || task_state === "doing" || task_state === "done" || task_state === "close"){
                        // Get Task of app by state
                        let sql = `SELECT * FROM task WHERE task_app_acronym = ${JSON.stringify(app_acronym)} AND task_state = ${JSON.stringify(task_state)}`;
                        db.query(sql, (error, results) => {
                            if (error) {
                                res.status(500).send({
                                    code:500
                                })
                            } else {
                                res.status(200).send({
                                    code:200,
                                    result: results
                                })
                            }
                        })
                    } else {
                        res.status(406).send({
                            code:406
                        })
                    }
                }
            }
        }
    }
})

//Approve a task from “Doing to Done” state
exports. PromoteTask2Done = catchAsyncErrors ( async (req, res, next) => {

    const { username, password, app_acronym, task_id } = req.body;

    const date = createDateTime();
    var appCreateGroups
    var userInGroup

    //If app_acronym/ task_id/ username and password not entered
    if(!app_acronym || !task_id || !username || !password){
        res.status(400).send({
            code:400
        })
    } else {
        //Check username
        let sql = `SELECT * FROM user WHERE username = ${JSON.stringify(username)}`;
        var userResults = await db.promise().query(sql)
        userResults = userResults[0][0]
        if(!userResults){
            res.status(401).send({
                code:401
            })
        } else {
            //Check password
            const dbPassword = userResults.password;
            const checkPassword = await bcrypt.compare(JSON.stringify(password), dbPassword)
            if(!checkPassword){
                res.status(401).send({
                    code:401
                })
            } else {
                // Check if there is app exists
                const appData = await getOneApp(app_acronym);
                if(!appData){
                    console.log("app does not exists")
                    res.status(404).send({
                        code:404
                    })
                } else {
                    // Get app done groups
                    appCreateGroups = JSON.parse(appData.app_permit_done);

                    //check if user is in group
                    for(var i = 0 ; i < appCreateGroups.length; i++){
                        let groupName = appCreateGroups[i]

                        userInGroup = await checkGroup(groupName, username);
                        if(userInGroup.length){
                            break
                        }
                    }
                    //If user not in group
                    if(!userInGroup.length){
                        res.status(403).send({
                            code:403
                        })
                    } else {
                        //Check if task exist
                        const existingTask = await getSingleTaskByID(task_id, app_acronym);
                        if(!existingTask){
                            res.status(404).send({
                                code:404
                            })
                        } else {
                            const task_name = existingTask.task_name
                            const task_currState = existingTask.task_state

                            if(task_currState !== "doing"){
                                res.status(406).send({
                                    code:406
                                })
                            } else {
                                //Promote task to Done
                                const updateNote = JSON.stringify(`[${username}] moved "${task_name}" to done on ${date} \nPrevious State: ${task_currState}\nTask State: done\n\n`)

                                let sql = `UPDATE task SET task_state = "done" , task_notes = CONCAT(${updateNote}, task_notes), task_owner = ${JSON.stringify(username)} WHERE (task_id = ${JSON.stringify(task_id)})`;
                                db.query(sql, async (error, results) => {
                                    if (error) {
                                        res.status(500).send({
                                            code:500
                                        })
                                    } else {
                                        res.status(200).send({
                                            code:200,
                                            message:`'${task_id}' successfully promoted to done.`
                                        })

                                        const currentAppData = await getOneApp(app_acronym)
                                        const appCreateStateGroup = JSON.parse(currentAppData.app_permit_create)

                                        var receiverEmailArr = []
                                        var allUsersEmail

                                        for(var i = 0 ; i < appCreateStateGroup.length; i++){
                                            const usersInCreatePermit = await getUsersInGroup(appCreateStateGroup[i])
                                            // console.log(usersInCreatePermit);
                                            
                                            let previousEmail
                                            for(var x = 0 ; x < usersInCreatePermit.length; x++){
                                                const userEmail = usersInCreatePermit[x].email
                                                const checkSameEmail = (userEmail !== previousEmail)
                                                
                                                if (userEmail && checkSameEmail){
                                                    let receiverEmail=usersInCreatePermit[x].email
                                                    receiverEmailArr.push(receiverEmail)
                                                    previousEmail = usersInCreatePermit[x].email
                                                }
                                            }
                                        }

                                        allUsersEmail = JSON.stringify(receiverEmailArr).replace(/\s|\[|\]/g,"")

                                        var emailSubject = `A task has been completed in ${app_acronym} by ${username}`

                                        var emailBody = 
                                        `
                                        <div>
                                            <h3>TASK "<span style="text-transform: uppercase;">${task_name}</span>" IS MOVED TO DONE</h3>
                                            <h5>[${username}] has moved the task "${task_name}" to DONE on ${date}</h5>
                                        </div>
                                        `

                                        // send mail with defined transport object
                                        let info = await transporter.sendMail({
                                            from: 'kanban_app@example.com' , // sender address
                                            to: allUsersEmail , // list of receivers
                                            subject: emailSubject , // Subject line
                                            // text: "Hello world?", // plain text body
                                            html: emailBody , // html body
                                        });

                                        console.log("Message sent: %s", info.messageId);
                                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                                        // Preview only available when sending through an Ethereal account
                                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
    }
})