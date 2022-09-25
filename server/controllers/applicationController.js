require('dotenv/config');
const db = require('../config/db.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Get one Application
exports.getOneApp = catchAsyncErrors ( async (appAcronym) => {
    let sql = `SELECT * FROM kanban_web_app.application WHERE app_acronym = ${JSON.stringify(appAcronym)}`;

    const results = await db.promise().query(sql);
    return results[0][0]
});

//Get all application
exports.getAllApps = catchAsyncErrors ( async (req, res, next) => {
    let sql = `SELECT * FROM application ORDER BY app_acronym ASC`;
    // let sql = `SELECT * FROM application ORDER BY app_startDate ASC`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
});

exports.allApps = catchAsyncErrors ( async (req, res, next) => {
    let sql = `SELECT * FROM application ORDER BY app_acronym ASC`;
    // let sql = `SELECT * FROM application ORDER BY app_startDate ASC`;

    const results = await db.promise().query(sql);
    return results[0]
});

//Create application
exports.createApp = catchAsyncErrors ( async (req, res, next) => {
    // const appAcronym = await JSON.stringify(req.body.appAcronym);
    // const permitCreate = await JSON.stringify(req.body.permitCreate);
    const { 
        appAcronym,
        appDescription,
        appRNum,
        appStartDate,
        appEndDate,
        permitCreate,
        permitOpen,
        permitToDoList,
        permitDoing,
        permitDone
    } = req.body;

    // console.log(appAcronym)

    // var app_RNum

    // if (Number.isInteger(appRNum)){
    //     app_RNum = appRNum;
    // } else {
    //     app_RNum = Math.round(appRNum);
    // }

    // console.log(app_RNum);

    const existingApplication = await this.getOneApp(appAcronym);

    if(!appAcronym.replace(/\s/g, '').length){
        res.status(200).send("no app name");
    } else if(existingApplication){
        // console.log("App acronym already exists")
        res.send("App acronym already exists");
    } else {
        
        // let sql = `INSERT INTO kanban_web_app.application (app_acronym, app_permit_create) VALUES (${appAcronym}, '${permitCreate}')`
    
        let sql = `INSERT INTO application (app_acronym, app_description, app_Rnumber, app_startDate, app_endDate, app_permit_create, app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done) VALUES (${JSON.stringify(appAcronym)}, 
        ${JSON.stringify(appDescription)}, ${appRNum}, ${JSON.stringify(appStartDate)}, ${JSON.stringify(appEndDate)}, 
        '${JSON.stringify(permitCreate)}', '${JSON.stringify(permitOpen)}', '${JSON.stringify(permitToDoList)}', '${JSON.stringify(permitDoing)}', 
        '${JSON.stringify(permitDone)}')`;
        db.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                res.send("Error");
            } else {
                // console.log("done")
                res.send("success");
            }
        })
    }
});

//Update application
exports.updateApp = catchAsyncErrors ( async (req, res, next) => {
    const { 
        appAcronym,
        permitCreate,
        permitOpen,
        permitToDoList,
        permitDoing,
        permitDone
    } = req.body;

    // console.log(
    //     appAcronym,
    //     permitCreate,
    //     permitOpen,
    //     permitToDoList,
    //     permitDoing,
    //     permitDone
    // )

    const existingApplication = await this.getOneApp(appAcronym);
    const existingCreate = existingApplication.app_permit_create;
    const existingOpen = existingApplication.app_permit_open;
    const existingToDoList = existingApplication.app_permit_toDoList;
    const existingDoing = existingApplication.app_permit_doing;
    const existingDone = existingApplication.app_permit_done;

    // console.log(existingApplication)

    if (permitCreate === existingCreate && 
    permitOpen === existingOpen && 
    permitToDoList === existingToDoList &&
    permitDoing === existingDoing &&
    permitDone === existingDone){
        res.send("no permit change")
    } else {
        let sql = `UPDATE application SET app_permit_create = '${JSON.stringify(permitCreate)}', app_permit_open = '${JSON.stringify(permitOpen)}', app_permit_toDoList = '${JSON.stringify(permitToDoList)}', app_permit_doing = '${JSON.stringify(permitDoing)}', app_permit_done = '${JSON.stringify(permitDone)}' WHERE app_acronym = ${JSON.stringify(appAcronym)}`;
        db.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                res.send("Error");
            } else {
                // console.log("done")
                res.send("success");
            }
        })
    }
});