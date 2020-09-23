const jwt = require('jsonwebtoken')
const privateKey = require('../config').privateKey
const constants = require('../Global/Constants')
const permission = require('./UserPermission')

module.exports = function(req, res, next) {
    try {
        // console.log(req)
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null
        if (!token) {
            throw constants.AUTHORIZATION_FAILED
        }
        const decoded = jwt.verify(token, privateKey)
        // console.log(decoded)
        if (!decoded) {
            throw constants.AUTHORIZATION_FAILED
        }
        let path = req.originalUrl.split('?')[0].split('/')[3];

        if (!permission[decoded.role].includes(path)) {
            throw constants.PERMISSION_DENY
        }
        req.userId = decoded.id
        req.userCreatedAt = decoded.createdAt
        return next()
    } catch(error) {
        return res.send({ status: 2, result: error })
    }
    
}