const express = require("express");
const UsersController = require('../controllers/users');
const authJwt = require('../middleware/verify-jwt-token');
const router = express.Router();

/**
 * GET USERS
 */
router.get('', [authJwt.verifyToken], UsersController.getAll);

module.exports = router;