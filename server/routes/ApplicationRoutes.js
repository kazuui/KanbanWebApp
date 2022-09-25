const express = require('express');
const router = express.Router();
require('dotenv/config');
const db = require('../config/db.js');
const appli = require("../controllers/applicationController");

//Get all applications
router.route('/apps').get(appli.getAllApps);

//Create application
router.route('/apps/create').post(appli.createApp);

//Create application
router.route('/apps/update').post(appli.updateApp);

//Get one specific application
// router.route('/apps/:id').get(appli.getOneApp);

module.exports = router;