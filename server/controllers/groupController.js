require('dotenv/config');
const db = require('../config/db.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.getUserGroup = catchAsyncErrors ( async (username) => {
    let sql = `SELECT user.user_id, user.username, group_concat(kanban_web_app.group.group_name) AS group, group_concat(kanban_web_app.group.group_id) AS group_id FROM user LEFT JOIN user_in_group ON user.user_id = user_in_group.user_id LEFT JOIN kanban_web_app.group ON user_in_group.group_id = kanban_web_app.group.group_id WHERE user.username=${JSON.stringify(username)}`;

    const results = await db.promise().query(sql);
    return results[0]
});

exports.getUsersInGroup = catchAsyncErrors ( async (groupName) => {
    let sql = `SELECT user.user_id, user.username, user.email, kanban_web_app.group.group_name, kanban_web_app.group.group_id FROM user LEFT JOIN user_in_group ON user.user_id = user_in_group.user_id LEFT JOIN kanban_web_app.group ON user_in_group.group_id = kanban_web_app.group.group_id WHERE kanban_web_app.group.group_name=${JSON.stringify(groupName)}`;
    const results = await db.promise().query(sql);
    return results[0]
});

//Get all groups
exports.getGroups = catchAsyncErrors ( async (req, res, next) => {
    let sql = `SELECT * FROM kanban_web_app.group`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
});

//Create group
exports.createGroup = catchAsyncErrors ( async (req, res, next) => {

    const groupName = await JSON.stringify(req.body.groupName);

    let sql = `INSERT INTO kanban_web_app.group (group_name) VALUES (${groupName})`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
});

exports.getAllUserInGroup = catchAsyncErrors (async (req,res,next) =>{

    const {
        groupName
    } = req.body;

    const allUsers = await this.getUsersInGroup(groupName)

    console.log((allUsers[0]).email)
    res.send(allUsers)
})

//Get group ID by name
// exports.getGroupID = (req, res, next) => {
//     const { groupName } = req.params;

//     let sql = `SELECT * FROM kanban_web_app.group WHERE group_name = ${groupName}`;
//     db.query(sql, (error, results) => {
//         if (error) {
//             res.send("Error");
//         } else {
//             res.send(results);
//         }
//     })
// };