require('dotenv/config');
const db = require('../config/db.js');
const {nodemailer, transporter} = require('../config/email');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const { getOneApp } = require("./applicationController");
const { createDateTime } = require("../helpers/helpers");
const { getUserEmail } = require("./userController");
const { getUsersInGroup } = require("./groupController");


//Get amount of task in app
exports.getTaskAmount = catchAsyncErrors ( async (task_app_acronym) => {
    let sql = `SELECT * FROM kanban_web_app.task WHERE task_app_acronym = ${JSON.stringify(task_app_acronym)}`;

    const results = await db.promise().query(sql);
    return (results[0]).length
});

//Get task plan
exports.getTaskPlan = catchAsyncErrors ( async (task_name, task_app_acronym) => {
    let sql = `SELECT task_plan FROM kanban_web_app.task WHERE task_name = ${JSON.stringify(task_name)} AND task_app_acronym = ${JSON.stringify(task_app_acronym)}`;

    const results = await db.promise().query(sql);
    return ((results[0][0]).task_plan)
});

// Get task description
exports.getTaskDescription = catchAsyncErrors ( async (task_name, task_app_acronym) => {
    let sql = `SELECT task_description FROM kanban_web_app.task WHERE task_name = ${JSON.stringify(task_name)} AND task_app_acronym = ${JSON.stringify(task_app_acronym)}`;

    const results = await db.promise().query(sql);
    return ((results[0][0]).task_description)
});

//get task name
exports.getSingleTask = catchAsyncErrors ( async (task_name,task_app_acronym) => {
    let sql = `SELECT * FROM kanban_web_app.task WHERE task_name = ${JSON.stringify(task_name)} AND task_app_acronym = ${JSON.stringify(task_app_acronym)}`;
    const results = await db.promise().query(sql);
    return results[0][0];
});

//get task by ID
exports.getSingleTaskByID = catchAsyncErrors ( async (task_id,task_app_acronym) => {
    let sql = `SELECT * FROM kanban_web_app.task WHERE task_id = ${JSON.stringify(task_id)} AND task_app_acronym = ${JSON.stringify(task_app_acronym)}`;
    const results = await db.promise().query(sql);
    return results[0][0];
});


//Get Audit note of task
exports.getTaskAudit = catchAsyncErrors ( async (task_name,task_app_acronym) => {
    let sql = `SELECT task_notes FROM kanban_web_app.task WHERE task_name = ${JSON.stringify(task_name)} AND task_app_acronym = ${JSON.stringify(task_app_acronym)}`;

    const results = await db.promise().query(sql);
    return (JSON.stringify((results[0][0]).task_notes))
});

//Get all task
exports.getTasksOfApp = catchAsyncErrors ( async (req, res, next) => {
    const { acronym } = req.params;

    let sql = `SELECT * FROM task WHERE task_app_acronym = "${acronym}"`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
});

//Create task
exports.createTask = catchAsyncErrors ( async (req, res, next) => {
    const { 
        application,
        taskName,
        addToPlan,
        taskDescription,
        taskNote,
        username
    } = req.body;

    const existingTask = await this.getSingleTask(taskName, application);

    if (!taskName.replace(/\s/g, '').length){
        res.status(200).send("no task name");
    } else if(existingTask){
        res.status(200).send("task exists");
    } else {
        const appData = await getOneApp(application);
        const taskAmount = await this.getTaskAmount(application);

        const taskID = `${appData.app_acronym}_${+appData.app_Rnumber + taskAmount}`;
        const taskState= "open";

        const createDate = new Date().toISOString().slice(0, 10);
        const date = createDateTime();

        const createTaskNote = JSON.stringify(`[${username}] created task "${taskName}" on ${date} \nTask state: ${taskState}\n${taskNote?"\nNotes:\n" + taskNote : ""}`);

        let sql = `INSERT INTO task (task_id, task_name, task_description, task_notes, task_plan, task_app_acronym, task_state, task_creator
        , task_owner, task_createDate) VALUES(${JSON.stringify(taskID)},${JSON.stringify(taskName)},${JSON.stringify(taskDescription)},${createTaskNote},${addToPlan.length? JSON.stringify(addToPlan) : null},${JSON.stringify(application)},${JSON.stringify(taskState)}
        ,${JSON.stringify(username)}, ${JSON.stringify(username)}, ${JSON.stringify(createDate)})`;
        db.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                res.send("Error");
            } else {
                res.send("success");
            }
        })
    }
});

//Move Task
exports.moveTaskState = catchAsyncErrors ( async (req, res, next) => {
    const {
        username,
        updateType,
        taskInfo
    } = req.body;

    let taskID = taskInfo.task_id
    let taskName = taskInfo.task_name
    let currentState = taskInfo.task_state

    const date = createDateTime();
    var updateNote
    var newState

    if (updateType === "promote"){
        switch (currentState) {
            case "open":
                newState = "toDoList"
                break;
            case "toDoList":
                newState = "doing"
                break;
            case "doing":
                newState = "done"
                break;
            case "done":
                newState = "close"
                break;
        }
    } else {
        switch (currentState) {
            case "doing":
                newState = "toDoList"
                break;
            case "done":
                newState = "doing"
                break;
        }
    }

    updateNote = JSON.stringify(`[${username}] moved "${taskName}" to ${newState} on ${date} \nPrevious State: ${currentState}\nTask State: ${newState}\n\n`)

    let sql = `UPDATE task SET task_state = ${JSON.stringify(newState)} , task_notes = CONCAT(${updateNote}, task_notes), task_owner = ${JSON.stringify(username)} WHERE (task_id = ${JSON.stringify(taskID)})`;
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error)
            res.send("Error");
        } else {
            console.log("success")
            res.send("success");
        }
    })
});

//Move Task
exports.moveTask = catchAsyncErrors ( async (req, res, next) => {
    const {
        username, 
        application,
        updateType,
        currentState,
        taskID,
        taskName,
        addToPlan,
        taskDescription,
        taskNote
    } = req.body;

    const date = createDateTime();
    var addPlan
    var updateNote
    var newState

    let existingPlan = (await this.getTaskPlan(taskName, application))

    if (!addToPlan.length){
        if (!existingPlan){
            addPlan = null
        } else {
            addPlan = existingPlan
        }
    } else {
        addPlan = addToPlan
    }

    let checkPlanChanged = (existingPlan !== addPlan)

    if (updateType === "promote"){
        switch (currentState) {
            case "open":
                newState = "toDoList"
                break;
            case "toDoList":
                newState = "doing"
                break;
            case "doing":
                newState = "done"
                break;
            case "done":
                newState = "close"
                break;
        }
    } else {
        switch (currentState) {
            case "doing":
                newState = "toDoList"
                break;
            case "done":
                newState = "doing"
                break;
        }
    }

    // console.log("---")
    // console.log(addToPlan)
    // console.log(existingPlan)
    // console.log(addPlan)
    // console.log(checkPlanChanged)

    // let existingAudit = await this.getTaskAudit(taskName,application);
    updateNote = JSON.stringify(`[${username}] moved "${taskName}" to ${newState} on ${date} \nTask State: ${newState}\n${taskNote?"\nNotes:\n" + taskNote +"\n" : ""} \n`)

    let sql = `UPDATE task SET ${checkPlanChanged? "task_plan = "+ addPlan +"," : "" } ${taskDescription? "task_description = " + JSON.stringify(taskDescription)+"," : ""} task_state = ${JSON.stringify(newState)} , task_notes = CONCAT(${updateNote}, task_notes), task_owner = ${JSON.stringify(username)} WHERE (task_id = ${JSON.stringify(taskID)})`;
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error)
            res.send("Error");
        } else {
            console.log("success")
            res.send("success");
        }
    })
});

//Update task
exports.updateTask = catchAsyncErrors ( async (req, res, next) => {
    const {
        username, 
        application,
        currentState,
        taskID,
        taskName,
        addToPlan,
        taskDescription,
        taskNote
    } = req.body;

    const date = createDateTime();
    var addPlan

    // console.log("---")
    // console.log(taskNote)

    if (!addToPlan.length){
        addPlan = null
    } else {
        addPlan = addToPlan
    }
    
    let existingPlan = (await this.getTaskPlan(taskName, application))
    let existingDesc = (await this.getTaskDescription(taskName, application))
    let checkPlanChanged = (existingPlan !== addPlan)

    if(!checkPlanChanged && !taskDescription.length && !taskNote){
        res.send("no changes");
    } else {
        var updateNote = JSON.stringify(`[${username}] edited "${taskName}" ${
            checkPlanChanged && taskDescription.length
            ?"plan and description "
            :checkPlanChanged && !taskDescription.length
            ?"plan "
            :taskDescription.length && !checkPlanChanged
            ?"description "
            :""
        }on ${date}${!taskNote?"":" (added task note)"}\nTask State: ${currentState}\n${!checkPlanChanged?"":!existingPlan?"\nPrevious plan: \nnone assigned":"\nPrevious Plan: "+existingPlan}${!taskDescription.length?"":!existingDesc.length?"\nPrevious description:\nnone":"\nPrevious description: "+existingDesc +"\n"}${taskNote?"Notes:\n" + taskNote +"\n" : ""}\n`)

        let sql = `UPDATE task SET ${addPlan !== existingPlan? "task_plan = "+ JSON.stringify(addPlan) +"," : "" } ${taskDescription.length? "task_description = " + JSON.stringify(taskDescription)+"," : ""} task_notes = CONCAT(${updateNote}, task_notes) WHERE (task_id = ${JSON.stringify(taskID)})`;

        db.query(sql, (error, results) => {
            if (error) {
                console.log(error)
                res.send("Error");
            } else {
                if (addPlan !== existingPlan && !taskDescription.length){
                    res.send("plan change")
                } else if (taskDescription.length && addPlan === existingPlan ){
                    res.send("desc change")
                } else if (!taskDescription.length && !addPlan && taskNote){
                    res.send("note add")
                }else {
                    res.send("plan desc");
                }
            }
        })

    }
});

//Testing email
exports.sendTestEmail = catchAsyncErrors( async() => {

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'test@example.com', // sender address
        to: "jiayi.ang98@hotmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
})

//Send email when task is moved to done state
exports.sendDoneTaskEmail = catchAsyncErrors( async (req, res, next) => {
    const {
        username,
        taskInfo
    } = req.body;

    const date = createDateTime();
    let application = taskInfo.task_app_acronym
    const currentAppData = await getOneApp(application)
    const appDoneStateGroup = JSON.parse(currentAppData.app_permit_done)
    var taskName = taskInfo.task_name
    var receiverEmailArr = []
    var allUsersEmail
    
    // console.log(appDoneStateGroup);
    // console.log(appDoneStateGroup.length);

    for(var i = 0 ; i < appDoneStateGroup.length; i++){
        const usersInDonePermit = await getUsersInGroup(appDoneStateGroup[i])
        // console.log(usersInDonePermit);
        
        let previousEmail
        for(var x = 0 ; x < usersInDonePermit.length; x++){
            const userEmail = usersInDonePermit[x].email
            const checkSameEmail = (userEmail !== previousEmail)
            
            if (userEmail && checkSameEmail){
                let receiverEmail=usersInDonePermit[x].email
                receiverEmailArr.push(receiverEmail)
                previousEmail = usersInDonePermit[x].email
            }
        }
    }

    allUsersEmail = JSON.stringify(receiverEmailArr).replace(/\s|\[|\]/g,"")
    console.log(allUsersEmail)

    var emailSubject = `A task has been completed in ${application} by ${username}`
    // var emailSubject = `${username} has completed the task ${taskName} in ${application}`
    
    var emailBody = 
    `
    <div>
        <h3>TASK "<span style="text-transform: uppercase;">${taskName}</span>" IS MOVED TO DONE</h3>
        <h5>[${username}] has moved the task "${taskName}" to DONE on ${date}</h5>
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
})