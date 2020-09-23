const db = require('../Models')
const User = db.User
const Department = db.Department
const jwt = require('jsonwebtoken')
const privateKey = require('../config').privateKey
const constants = require('../Global/Constants')
const crypto = require('crypto')

module.exports.loginHandle = async function(req, res) {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(401).end()
    }
    try {
        const hashPassword = crypto.createHash('sha1').update(password).digest('base64')
        // const hashPassword = password
        const user = await User.findOne({
            where: { Username: username, Password: hashPassword, isActive: true },
            include: {
                model: Department,
                attributes: ['id', 'departmentName','address']
            },
            attributes: ['id','fullname', 'dob', 'role', 'address', 'phone', 'username', 'createdAt']
        })

        if (!user) {
            throw constants.LOGIN_FAILED
        }
        let userInfo = { ...user.dataValues, role: user.get('role')}
        let token = jwt.sign(userInfo, privateKey, {expiresIn: '12h'})
        const data = {
            status: 1,
            result: {
                token: token,
                userInfo: userInfo
            }
        }
        res.send(data)
    } catch (error) {
        res.send({status: 2, result: error})
    }
}