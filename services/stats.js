const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const { eachDayOfInterval, format, eachMonthOfInterval } = require('date-fns');

const getCompletedTasksPerDay = async (queryParams) => {
    return new Promise(resolve => {
        try {
            const dateRange = eachDayOfInterval({
                start: new Date(queryParams.startingDate),
                end: new Date(queryParams.endingDate),
            });
            const formattedDates = dateRange.map(date => format(date, 'dd/MM'));

            let currentUser = queryParams.currentUser;
            let startingDate = new Date(queryParams.startingDate);
            let endingDate = new Date(queryParams.endingDate);

            let miniQuery = {
                status: 'COMPLETED',
                completion_date: {
                    $gte: startingDate,
                    $lte: endingDate,
                },
            };
            if (currentUser != 'ALL') miniQuery.user = mongoose.Types.ObjectId(currentUser)

            Task.aggregate([
              {
                $match: miniQuery
              },
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%d/%m', date: '$completion_date' },
                  },
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  date: '$_id',
                  count: 1,
                  _id: 0,
                },
              },
            ]).exec((err, completedTasks ) => {
                if (err) {
                    console.log(err);
                    resolve({ status: false, error: err })
                } else {
                    const completedTasksMap = new Map(
                        completedTasks.map(task => [task.date, task.count])
                    );
                    const result = formattedDates.map(date => ({
                        date,
                        count: completedTasksMap.get(date) || 0,
                    }));
                    resolve({ status: true, data: result})
                }
            });
        } catch (error) {
            resolve({ status: false, error: error })
        }
    })
}

const getCompletionRate = async (queryParams) => {
    return new Promise(async resolve => {
        try {
            let currentUser = queryParams.currentUser;
            let startingDate = new Date(queryParams.startingDate);
            let endingDate = new Date(queryParams.endingDate);
            let totalTasksQuery = {
                creation_date: {
                    $gte: new Date(startingDate),
                    $lte: new Date(endingDate),
                },
            }
            if (currentUser != 'ALL') totalTasksQuery.user = mongoose.Types.ObjectId(currentUser)
            const totalTasks = await Task.countDocuments(totalTasksQuery);
        
            let completedTasksQuery = {
                status: 'COMPLETED',
                creation_date: {
                    $gte: new Date(startingDate),
                    $lte: new Date(endingDate),
                },
            }
            if (currentUser != 'ALL') completedTasksQuery.user = mongoose.Types.ObjectId(currentUser)
            const completedTasks = await Task.countDocuments(completedTasksQuery);

            const completionRate = (completedTasks / totalTasks) * 100 || 0;
            resolve({ status: true, data: { totalTasks, completedTasks, completionRate }})
        } catch (error) {
            resolve({ status: false, error: error })
        }
    })
}

const getCompletedTasksPerMonth = async (queryParams) => {
    return new Promise(resolve => {
        try {
            const currentMonth = new Date();
            const dateRange = eachMonthOfInterval({
                start: new Date(currentMonth.getFullYear(), 0, 1),
                end: new Date(currentMonth.getFullYear(), 11, 31),
            });
            const formattedMonths = dateRange.map(month => format(month, 'MM/yyyy'));

            let currentUser = queryParams.currentUser;

            let miniQuery = {};
            if (currentUser !== 'ALL') miniQuery.user = mongoose.Types.ObjectId(currentUser);

            Task.aggregate([
                {
                    $match: miniQuery
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%m/%Y', date: '$creation_date' },
                        },
                        completedCount: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0]
                            }
                        },
                        totalCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        month: '$_id',
                        completedCount: 1,
                        totalCount: 1,
                        _id: 0,
                    },
                },
            ]).exec((err, tasks) => {
                if (err) {
                    console.log(err);
                    resolve({ status: false, error: err })
                } else {
                    const tasksMapObject = tasks.map(task => [
                            task.month, 
                            {
                                month: task.month,
                                completedCount: task.completedCount,
                                totalCount: task.totalCount
                            }
                        ] 
                    );
                    const tasksMap = new Map(tasksMapObject);
                    const result = formattedMonths.map(month => tasksMap.get(month) || {
                        month,
                        completedCount: 0,
                        totalCount: 0
                    });
                    resolve({ status: true, data: result })
                }
            });
        } catch (error) {
            resolve({ status: false, error: error })
        }
    })
}

module.exports.getCompletedTasksPerDay = getCompletedTasksPerDay;
module.exports.getCompletionRate = getCompletionRate;
module.exports.getCompletedTasksPerMonth = getCompletedTasksPerMonth;