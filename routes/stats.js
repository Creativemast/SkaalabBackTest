const express = require("express");
const StatsController = require('../controllers/stats');
const authJwt = require('../middleware/verify-jwt-token');
const router = express.Router();

/**
 * GET COMPLETED TASKS PER DAY
 */
router.get('/completed-tasks', [authJwt.verifyToken], StatsController.getCompletedTasksPerDay);

/**
 * GET COMPLETION RATE
 */
router.get('/completion-rate', [authJwt.verifyToken], StatsController.getCompletionRate);

/**
 * GET COMPLETED TASKS PER MONTH
 */
router.get('/completed-tasks-month', [authJwt.verifyToken], StatsController.getCompletedTasksPerMonth);

module.exports = router;