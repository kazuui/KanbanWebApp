require('dotenv/config');
const db = require('../config/db.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Check if user is in a specific group
exports.checkGroup = catchAsyncErrors ( async (groupName, username) => {
    let sql = `SELECT user.user_id, user.username, kanban_web_app.group.group_id, 
    kanban_web_app.group.group_name FROM user LEFT JOIN user_in_group ON user.user_id = user_in_group.user_id 
    LEFT JOIN kanban_web_app.group ON user_in_group.group_id = kanban_web_app.group.group_id 
    WHERE kanban_web_app.group.group_name = ${JSON.stringify(groupName)} AND 
    user.username = ${JSON.stringify(username)}`;
    const results = await db.promise().query(sql);
    return results[0]
});

//Create Date
exports.createDateTime = () => {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
};
