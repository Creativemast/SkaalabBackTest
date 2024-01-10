checkBody = async (req, res, next) => {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return  res.status(401).json({
            status: false,
            response: "Empty body!",
            error: "Empty !",
            data: {}
        });
    }
    next();
}

const checkRequest = {
    checkBody
}
module.exports = checkRequest;