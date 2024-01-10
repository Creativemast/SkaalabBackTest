const User = require('../models/User');
const jwt = require('jsonwebtoken');
const usersService = require('../services/users');

exports.login = async (req, res, next) => {
    try {
        const result = await usersService.login(req.body);
        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
};

exports.register = async (req, res, next) => {
    try {
        const result = await usersService.register(req.body);
        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
};


exports.refreshToken = async (req, res, next) => {
    try {
        let accessToken = jwt.sign({
            id: req.decoded.id,
            type: req.decoded.type,
        },process.env.JWT_KEY, {expiresIn : process.env.EXP_TOKEN});

        let refreshToken = jwt.sign({
            id: req.decoded.id,
            type: req.decoded.type,
        },process.env.JWT_REFRESH_KEY, {expiresIn : process.env.EXP_REFRESH_TOKEN});
    
        return res.status(200).json({
            accessToken,
            refreshToken
        });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}