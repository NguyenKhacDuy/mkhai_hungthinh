const db = require('../Models')
const Department = db.Department
const User = db.User
const constants = require('../Global/Constants')
const moment = require('moment')

exports.createDepartment = async function(req, res) {
    try {
        const departmentInfo = req.body
        if (!departmentInfo) {
            throw 'departmentInfo required!' 
        }
        const department = await Department.findOne({ 
            where: { departmentName: departmentInfo.departmentName },
            attributes: ['id','isActive'] 
            })

        if(department) {
            if (department.isActive) {
                throw 'Department existed!'
            }

            if (!department.isActive) {
                const updateInfo = {
                    isActive: true,
                    UpdatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                }

                await Department.findByPk(department.id).then(department => department.update(updateInfo))
                res.send({ status: 1, result: constants.SUCCESS })
            }
        } else {
            Department.create(departmentInfo).then(Department => {
                res.send({ status: 1, result: constants.SUCCESS, departmentId: Department.get('id') })
            })   
        }
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.removeDepartment = async function(req, res) {
    try {
        const departmentId = req.body.departmentId
        if (!departmentId) {
            throw 'DepartmentId required!'
        }

        if (departmentId.length == 0 || departmentId == undefined || departmentId == "") {
            throw 'Empty Department!'
        }

        let users = await User.findAll({
            where: { 
                isActive: true,
                departmentId: departmentId
            },
            attributes: ['id']
        })

        if(users.length > 0) {
            res.send({ staus: 3, result: "The department contains staff" })
        } else {
            const updateInfo = {
                isActive: false,
                UpdatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            }
            await Department.findByPk(departmentId).then(department => department.update(updateInfo))
            res.send({ status: 1, result: constants.SUCCESS })
        }
        
    } catch (error) {
        res.send({ staus: 2, result: error })
    }
}

exports.getAll = async function(req, res) {
    try {
        let departments = await Department.findAll({
            where: { isActive: true },
            attributes: ['id', 'departmentName', 'address']
        })
        res.send({ status: 1, result: departments })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.getAllUserInDepartment = async function(req, res) {
    try {
        const departmentId = req.body.departmentId
        if (!departmentId) {
            throw 'DepartmentId required!'
        }

        if (departmentId.length == 0 || departmentId == undefined || departmentId == "") {
            throw 'Empty Department!'
        }

        let users = await User.findAll({
            where: { 
                isActive: true,
                departmentId: departmentId
             },
            attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
        })
        const usersInfo = users.map(user => ({ ...user.dataValues, role: user.get('role') }))
        res.send({ status: 1, result: usersInfo })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}