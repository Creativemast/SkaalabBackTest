const express = require("express");
const AuthController = require('../controllers/auth');
const checkRequest = require('../middleware/check-request');
const authJwt = require('../middleware/verify-jwt-token');
const router = express.Router();

/**
 * LOGIN ROUTE
 */
router.post('/login', [checkRequest.checkBody], AuthController.login);

/**
 * REGISTER ROUTE
 */
router.post('/register', [checkRequest.checkBody], AuthController.register);


/**
 * REFRESH TOKEN
 */
router.post('/refreshToken', [authJwt.verifyRefreshToken], AuthController.refreshToken);

module.exports = router;