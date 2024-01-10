const tasksService = require('../services/tasks');

exports.getAll = async (req, res, next) => {
    try {
        let queryParams = req.query;
        const result = await tasksService.getAll(
            req.decoded,
            queryParams
        );      

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
};

exports.create = async (req, res, next) => {
    try {
        const result = await tasksService.create(req.body);

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
};

exports.update = async (req, res, next) => {
    try {
        const result =  await tasksService.update(req.params.id, req.body);

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
};