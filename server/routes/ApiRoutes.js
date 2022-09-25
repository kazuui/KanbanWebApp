const express = require('express');
const router = express.Router();
require('dotenv/config');
const db = require('../config/db.js');
const api = require("../controllers/apiController.js");

//Create a new task
router.route('/CreateTask').post(api.CreateTask);

//Retrieve tasks in a particular state
router.route('/GetTaskbyState').post(api.GetTaskbyState);

//Approve a task from “Doing to Done” state
router.route('/PromoteTask2Done').post(api.PromoteTask2Done);

module.exports = router;