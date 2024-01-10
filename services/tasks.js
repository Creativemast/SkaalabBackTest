const { default: mongoose } = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");

const getAll = async (decoded, queryParams) => {
    return new Promise(resolve => {
        let page = parseInt(queryParams.page);
        let size = parseInt(queryParams.size);
        let miniQuery = {} 
        if (decoded.type == 'SIMPLE') miniQuery = { user: mongoose.Types.ObjectId(decoded.id) };

        let sort = queryParams.sort;
        let sortColumn = queryParams.sortColumn;
        
        if (queryParams.status != 'ALL') miniQuery.status = queryParams.status;
        if (queryParams.startingDate != '') miniQuery.creation_date = { $gte: new Date(queryParams.startingDate) }
        if (queryParams.endingDate != '') {
            let finishDay = new Date(queryParams.endingDate);
            if (miniQuery.creation_date) miniQuery.creation_date = { $gte: new Date(queryParams.startingDate), $lte: finishDay };
            else miniQuery.creation_date = { $lte: finishDay }
        }

        let query = [
            { $match: miniQuery },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
        ]

        if (queryParams.sort && queryParams.sortColumn) {
            let sortField = queryParams.sortColumn;
            if (sortField === 'name') {
                sortField = 'name';
            }
            if (sortField === 'user') {
                sortField = 'user';
            }
            if (sortField === 'completion_date') {
                sortField = 'completion_date';
            }
            if (sortField === 'creation_date') {
                sortField = 'creation_date';
            }

            const sortOrder = queryParams.sort === 'asc' ? 1 : -1;
            query.push({ $sort: { [sortField]: sortOrder } });
        }

        if (queryParams.q) {
            const searchRegex = new RegExp(queryParams.q, 'i');
            const orCondition = [
                { 'name': searchRegex },
                { 'description': searchRegex },
            ];
            query.push({ $match: { $or: orCondition } });
        }
        
        if (page != -1 && size != -1) {
            query.push({ $skip: (page - 1) * size });
            query.push({ $limit: size })
        }
        
        Task.aggregate(query).exec((err, tasks) => {
            if (err) {
                console.log(err);
                resolve({ status: false, error: err })
            } else {
                Task.countDocuments(miniQuery).exec((err, count) => {
                    if (err) resolve({ status: false, error: err })
                    else {
                        resolve({ status: true, data: tasks, total: count})
                    }
                })
            }
        })
    })
}

const create = async (body) => {
    return new Promise(resolve => {
        const newTask = new Task({
            name: body.name,
            description: body.description,
            user: mongoose.Types.ObjectId(body.user)
        });
        newTask.save()
        .then(task => {
            resolve({ status: true, data: task })
        })
        .catch(err => {
            resolve({ status: false, error: err })
        })
    })
}

const update = async (id, body) => {
    return new Promise(resolve => {
        Task.findById(id).exec((err, task) => {
            if (err) resolve({ status: false, error: err })
            else if (task) {
                task.name = body.name;
                task.description = body.description;
                task.user = body.user;
                if (task.status != body.status && body.status === 'COMPLETED') {
                    task.status = body.status;
                    task.completion_date = new Date();
                }

                task.save().then(updatedTask => {
                    resolve({ status: true, data: updatedTask })
                })
                .catch(err => {
                    resolve({ status: false, data: err })
                })
            } else resolve({ status: false, error: 'Task not found' })
        })
    })
}

module.exports.getAll = getAll;
module.exports.create = create;
module.exports.update = update;