const statsService = require('../services/stats');

exports.getCompletedTasksPerDay = async (req, res, next) => {
    try {
        let queryParams = req.query;
        const result = await statsService.getCompletedTasksPerDay(queryParams);      

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
};

exports.getCompletionRate = async (req, res, next) => {
    try {
        let queryParams = req.query;
        const result = await statsService.getCompletionRate(queryParams);      

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
};

exports.getCompletedTasksPerMonth = async (req, res, next) => {
    try {
        let queryParams = req.query;
        const result = await statsService.getCompletedTasksPerMonth(queryParams);      

        if (result.status) res.status(200).json(result)
        else res.status(400).json({ message: result.error.message })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message })
    }
};