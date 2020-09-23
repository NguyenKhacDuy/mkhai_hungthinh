const db = require('../Models')
const User = db.User
const Department = db.Department
const constants = require('../Global/Constants')
const moment = require('moment')
const crypto = require('crypto')

exports.createUser = async function(req, res) {
    try {
        const userInfo = req.body
        if (!userInfo) {
            throw 'UserInfo required!' 
        }
        const user = await User.findOne({ where: { username: userInfo.username, isActive: true } })
        if (user) {
            throw 'Username existed!'
        }
        User.create(userInfo).then(User => {
            res.send({ status: 1, result: constants.SUCCESS, userId: User.get('id') })
        })   
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.removeUsers = async function(req, res) {
    try {
        const userId = req.body.userId
        if (!userId) {
            throw 'List UserID required!'
        }

        let abc = typeof userIds

        if (userId.length == 0 || userId == undefined || userId == "") {
            throw 'Empty user!'
        }

        const updateInfo = {
            isActive: false,
            updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }
        await User.findByPk(userId).then(user => user.update(updateInfo))
        res.send({ status: 1, result: constants.SUCCESS })
    } catch (error) {
        res.send({ staus: 2, result: error })
    }
}

exports.updateUser = async function(req, res) {
    try {
        const userInfo = req.body
        if (!userInfo) {
            throw 'UserInfo required!'
        }
        await User.findByPk(userInfo.id).then(user => user.update({
            ...userInfo, 
            updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }))
        res.send({ status: 1, result: constants.SUCCESS })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.getAll = async function(req, res) {
    try {
        let users = await User.findAll({
            where: { isActive: true },
            include: {
                model: Department,
                attributes: ['id', 'departmentName','address']
            },
            attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
        })
        const usersInfo = users.map(user => ({ ...user.dataValues, role: user.get('role') }))
        res.send({ status: 1, result: usersInfo })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.changePassword = async function(req, res) {
    try {
        const { oldPass, newPass } = req.body
        const { userId } = req
        let user = await User.findByPk(userId)
        let pass = user.get("password")
        const hashPass = crypto.createHash('sha1').update(oldPass).digest('base64')
        if ( pass !== hashPass) {
            throw 'Wrong current password!'
        }
        user.update({ 
            password: newPass,
            updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            }).then(user => {
            res.send({ status: 1, result: constants.SUCCESS })
        })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}