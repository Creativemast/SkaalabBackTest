const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema(
    {
        name: { 
            type: String 
        },
        description: { 
            type: String 
        },
        status: {
            type: String,
            default: 'NOT_COMPLETED'
        },
        user: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        completion_date: { 
            type: Date
        },
        creation_date: { 
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('Task', Task)