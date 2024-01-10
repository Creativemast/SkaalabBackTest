const User = require('../models/User');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const { titleCase } = require('title-case');

const login = async (data) => {
    return new Promise(resolve => {
        User.findOne({ email: data.email })
            .exec((err, user) => {
            if (err) resolve({ status: false, error: err})
            else if (!user) resolve({ status: false, error: { message: 'User not found in database' } })
            else {
                if(user.isValid(data.password)) {
                    let token = jwt.sign({
                        id: user._id,
                        type: user.type,
                    },process.env.JWT_KEY, {expiresIn : process.env.EXP_TOKEN});

                    let refreshToken = jwt.sign({
                        id: user._id,
                        type: user.type,
                    },process.env.JWT_REFRESH_KEY, {expiresIn : process.env.EXP_REFRESH_TOKEN});

                    resolve({ 
                        status: true, 
                        data: {
                            token,
                            refreshToken,
                            user
                        }
                    })
                } else {
                    resolve({ status: false, error: { message: 'Invalid credentials' } })
                }
            }
        })
    })
}

const register = async (data) => {
    return new Promise(resolve => {
        User.findOne({email: data.email}, async (err, existedUser) => {
            if (err) resolve({ status: false, error: err })
            else if (existedUser) resolve({ status: false, error: { message: "Email already exist in database" } }) 
            else {
                let newUser = new User({
                    email: data.email.toLowerCase(),
                    password: User.hashPassword(data.password),
                    type: data.type,
                    first_name: titleCase(data.first_name),
                    last_name: titleCase(data.last_name)
                });

                newUser.save().then(savedUser => {
                    resolve({ status: true, data: savedUser })
                }).catch(err => {
                    resolve({ status: false, error: err })
                })
            }
        })
    })
}

const getAll = async () => {
    return new Promise(resolve => {
        User.find({}).then((users) => {
            resolve({ status: true, data: users })
        }).catch((err) => {
            resolve({ status: false, error: err })
        })
    })
}

module.exports.login = login;
module.exports.register = register;
module.exports.getAll = getAll;