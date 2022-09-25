require('dotenv/config');
const db = require('../config/db.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Get one Application
exports.checkPlanName = catchAsyncErrors ( async (plan_MVP_name ,appAcronym) => {
    let sql = `SELECT * FROM kanban_web_app.plan WHERE plan_MVP_name = ${plan_MVP_name} AND plan_app_acronym = ${JSON.stringify(appAcronym)}`;

    const results = await db.promise().query(sql);
    return results[0][0]
});

//Get all plan
exports.getPlansOfApp = catchAsyncErrors ( async (req, res, next) => {
    const { acronym } = req.params;

    let sql = `SELECT * FROM plan WHERE plan_app_acronym = "${acronym}"`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
});

//Create plan
exports.createPlan = catchAsyncErrors ( async (req, res, next) => {
    const { 
        planMVPName,
        planStartDate,
        planEndDate,
        application
    } = req.body;
    
    const existingPlan = await this.checkPlanName(JSON.stringify(planMVPName), application);

    if(!planMVPName.replace(/\s/g, '').length){
        res.send("no plan");
    } else if(existingPlan){
        console.log("plan exists");
        res.send("plan exists");
    } else {
        let sql = `INSERT INTO plan (plan_MVP_name, plan_startDate, plan_endDate, plan_app_acronym) VALUES (${JSON.stringify(planMVPName)}, ${planStartDate? JSON.stringify(planStartDate) : null}, 
        ${planEndDate? JSON.stringify(planEndDate) : null}, ${JSON.stringify(application)})`;
        db.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                res.send("Error");
            } else {
                console.log("success")
                res.send("success");
            }
        })
    }
});