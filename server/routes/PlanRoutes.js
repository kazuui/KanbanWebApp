const express = require('express');
const router = express.Router();
require('dotenv/config');
const db = require('../config/db.js');
const plans = require("../controllers/planController.js");

//Get all plans of a specific application
router.route('/apps/plans/:acronym').get(plans.getPlansOfApp);

//Create plan
router.route('/apps/plans/create').post(plans.createPlan);

module.exports = router;