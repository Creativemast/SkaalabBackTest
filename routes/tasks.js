const express = require("express");
const TasksController = require('../controllers/tasks');
const authJwt = require('../middleware/verify-jwt-token');
const router = express.Router();

/**
 * GET TASKS
 */
router.get('', [authJwt.verifyToken], TasksController.getAll);

/**
 * CREATE NEW TASK
 */
router.post('', [authJwt.verifyToken], TasksController.create);

/**
 * UPDATE TASK
 */
router.put('/:id', [authJwt.verifyToken], TasksController.update);


module.exports = router;