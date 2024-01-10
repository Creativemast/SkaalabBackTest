const jwt = require('jsonwebtoken');
const User = require('../models/User');

verifyToken =  (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' })
    }

    let fetchedToken = token;
    if (token.includes('Bearer "')) {
        fetchedToken = token.replace('Bearer "', "");
        if (fetchedToken[fetchedToken.length - 1] == '"') {
            fetchedToken = fetchedToken.substring(0, fetchedToken.length - 1);
        }
    } else if (token.includes('Bearer ')) {
        fetchedToken = token.replace('Bearer ', "");
    }
    
    jwt.verify(fetchedToken, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Fail to authentication, Error -> " + err });
        }
        req.decoded = decoded;
        User.updateOne({_id: decoded.id}, {$set:{last_signin_date: new Date()}}).exec().then(info => {
            next();
        }).catch(e => res.status(401).send({ message: "Fail to update last sign in date field, Error -> " + err }));
    })
}

verifyRefreshToken =  (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' })
    }

    let fetchedToken = token;
    if (token.includes('Bearer "')) {
        fetchedToken = token.replace('Bearer "', "");
        if (fetchedToken[fetchedToken.length - 1] == '"') {
            fetchedToken = fetchedToken.substring(0, fetchedToken.length - 1);
        }
    } else if (token.includes('Bearer ')) {
        fetchedToken = token.replace('Bearer ', "");
    }

    jwt.verify(fetchedToken, process.env.JWT_REFRESH_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Fail to authentication, Error -> " + err });
        }
        req.decoded = decoded;
        User.updateOne({_id: decoded.id}, {$set:{last_signin_date: new Date()}}).exec().then(info => {
            next();
        }).catch(e => res.status(401).send({ message: "Fail to update last sign in date field, Error -> " + err }));
    })
}

const authJwt = {
    verifyToken: verifyToken,
    verifyRefreshToken: verifyRefreshToken,
};

module.exports = authJwt;