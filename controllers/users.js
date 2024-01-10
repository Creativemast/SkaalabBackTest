const usersService = require('../services/users');

exports.getAll = async (req, res, next) => {
    try {
        const result = await usersService.getAll();      

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
};