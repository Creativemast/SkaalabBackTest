const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        email: {
            type: String
        },
        password: {
            type: String
        },
        first_name: {
            type: String
        }, 
        last_name: {
            type: String
        }, 
        type: {
            type: String,
            enum: [
                'SIMPLE',
                'ADMIN'
            ]
        },
        created_date: {
            type: Date,
            default: Date.now
        }
    }
);

User.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

User.methods.isValid = function (hashedpassword) {
    return bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User', User)