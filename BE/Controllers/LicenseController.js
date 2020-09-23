const multipleUploadMiddleware = require("../Middlewares/MultipleImagesUploadMiddleware");
const jwtDecode = require('jwt-decode');
const moment = require('moment')
const Docxtemplater = require('docxtemplater')
const db = require('../Models')
const constants = require('../Global/Constants')
const User = db.User
const Department = db.Department
const License = db.License
const toVietnamese = require('../Common/n2vi.js')
const { separateTimeToUnit } = require('../Common/common')
const { Op } = require("sequelize");
const fs = require('fs');
const PizZip = require('pizzip')
const path = require('path');

let debug = console.log.bind(console);
exports.createLicense = async (req, res) => {
  try {
    let result = await multipleUploadMiddleware(req, res);
    
    debug(req.files);

    let files = req.files
    let body = req.body
    let token = req.headers.authorization.split(' ')[1]
    let tokenDecoded = jwtDecode(token);
    let departmentId = tokenDecoded.Department.id
    let creatorId =tokenDecoded.id
    let money = parseFloat(body.money)
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let fileNameArr = [];

    let licenseInfo = {}

    if (files.length > 0) {
      files.forEach(element => {
        fileNameArr.push(element.filename);
      });

      licenseInfo = {
        content: body.content,
        money: money,
        note: body.note,
        departmentId: departmentId,
        creatorId: creatorId,
        images: fileNameArr.join(),
        status: 0
      }  
    } else {
      licenseInfo = {
        content: body.content,
        money: money,
        note: body.note,
        departmentId: departmentId,
        creatorId: creatorId,
        status: 0
      } 
    }
      License.create(licenseInfo).then(License => {
            res.send({ status: 1, result: constants.SUCCESS})
        })  
  } catch (error) {
    
    debug(error);
    
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }
    return res.send(`Error when trying upload many files: ${error}}`);
  }
};

exports.updateLicense = async (req, res) => {
  try {
    let result = await multipleUploadMiddleware(req, res);
    
    debug(req.files);
    let licenseId = req.body.id
    let newfiles = req.files
    let oldFiles = req.body.oldFiles.split(',')
    let content = req.body.content
    let note = req.body.note
    let money = parseFloat(req.body.money)
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let fileNameArr = [];

    let licenseInfo = {}

    if (newfiles.length > 0 || oldFiles.length > 0) {

      if(oldFiles.length > 0) {
        oldFiles.forEach(element => {
          fileNameArr.push(element);
        });
      }

      if(newfiles.length > 0) {
        newfiles.forEach(element => {
          fileNameArr.push(element.filename);
        });
      }

      licenseInfo = {
        content: content,
        money: money,
        note: note,
        updatedAt: currentDate,
        images: fileNameArr.join(),
        status: 0
      }  
    } else {
      licenseInfo = {
        content: content,
        money: money,
        note: note,
        updatedAt: currentDate,
        status: 0
      } 
    }
      License.findByPk(licenseId)
      .then(license => {
        if(license.status == 0) {
          license.update(licenseInfo);
          res.send({ status: 1, result: "Success"})
        } else
          res.send({ status: 2, result: "License already approved"})
      })
  } catch (error) {
    
    debug(error);
    
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }
    return res.send(`Error when trying upload many files: ${error}}`);
  }
};

exports.getExecutingLicenseCreator = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let creatorId =tokenDecoded.id
      let license = await License.findAll({
          where: { 
            creatorId: creatorId,
            [Op.or]: [
              { status: 0},
              { status: 1}
            ]}, 
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      let result = []
      license.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.getExecutedLicenseCreator = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let creatorId =tokenDecoded.id
      const { page, size } = req.query;
      const limitAndOffset = getPagination(page, size)
      limit = limitAndOffset.limit;
      offset = limitAndOffset.offset;
      let pageInfo = {}

      let license = await License.findAndCountAll({
          where: { 
            creatorId: creatorId,
            [Op.or]: [
              { status: 2},
              { status: 3},
              { status: 4}
            ]},
          limit,
          offset,
          order: [
            ['updatedAt', 'DESC']
          ],
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content','cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      pageInfo.totalDocuments = license.count;
      pageInfo.totalPages = Math.ceil(license.count / limit);
      pageInfo.currentPage = parseInt(page);
      let result = []
      license.rows.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result, ...pageInfo})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.getWaitingApproveLicenseApprover = async function(req, res) {
    try {
      let license = await License.findAll({
          where: { 
            status: 0
           },  
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      let result = []
      license.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.getCompletedLicenseApprover = async function(req, res) {
    try {
      const { page, size } = req.query;
      const limitAndOffset = getPagination(page, size)
      limit = limitAndOffset.limit;
      offset = limitAndOffset.offset;
      let pageInfo = {}

      let license = await License.findAndCountAll({
          where: { 
            [Op.or]: [
              { status: 2},
              { status: 3},
              { status: 4}
            ]},  
          limit,
          offset,
          order: [
            ['updatedAt', 'DESC']
          ],
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      pageInfo.totalDocuments = license.count;
      pageInfo.totalPages = Math.ceil(license.count / limit);
      pageInfo.currentPage = parseInt(page);
      let result = []
      license.rows.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result, ...pageInfo})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.getApprovedLicenseApprover = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let approverId =tokenDecoded.id
      let license = await License.findAll({
          where: { 
            status: 1
           },  
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      let result = []
      license.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.getWaitingPayLicenseAccountant = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let departmentId = tokenDecoded.Department.id
      let accountantId =tokenDecoded.id

      let license = await License.findAll({
          where: { 
            status: 1
           },  
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      let result = []
      license.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.getCompletedLicenseAccountant = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let accountantId =tokenDecoded.id
      const { page, size } = req.query;
      const limitAndOffset = getPagination(page, size)
      limit = limitAndOffset.limit;
      offset = limitAndOffset.offset;
      let pageInfo = {}

      let license = await License.findAndCountAll({
          where: { 
            accountantId: accountantId,
            [Op.or]: [
              { status: 3},
              { status: 4}
            ]},  
          limit,
          offset,
          order: [
            ['updatedAt', 'DESC']
          ],
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'cancelReason', 'note', 'money','createdAt','updatedAt','status','departmentId','images']
      })
      pageInfo.totalDocuments = license.count;
      pageInfo.totalPages = Math.ceil(license.count / limit);
      pageInfo.currentPage = parseInt(page);
      let result = []
      license.rows.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result, ...pageInfo})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    
    return { limit, offset }
};

exports.approveLicense = async function(req, res) {
    try {
      let licenseId = req.body.id
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let approverId =tokenDecoded.id

      License.findByPk(licenseId)
      .then(license => {
        let returnValue = {
          status: 1,
          result: ''
        }
          if(license == undefined || license == null) {
            returnValue.status = 2
            returnValue.result = constants.LICENSE_NOT_EXIST            
          } else {  
            if(license.status == 0) {
              license.update({ status: 1, approverId: approverId })
              returnValue.status = 1
              returnValue.result = constants.SUCCESS 
            } else if (license.status == 1){
              returnValue.status = 2
              returnValue.result = constants.LICENSE_APPROVED  
            } else if (license.status == 2){
              returnValue.status = 2
              returnValue.result = constants.LICENSE_CANCELLED  
            } else {
              returnValue.status = 2
              returnValue.result = constants.LICENSE_EXCEPTION  
            }
          }
          return returnValue;
      })
      .then(result => {
        res.send({ status: result.status, result: result.result})
      })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.approvePayLicense = async function(req, res) {
    try {
      let licenseId = req.body.id
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let accountantId =tokenDecoded.id

      License.findByPk(licenseId)
      .then(license => {
        let returnValue = {
          status: 1,
          result: ''
        }
          if(license == undefined || license == null) {
            returnValue.status = 2
            returnValue.result = constants.LICENSE_NOT_EXIST            
          } else {  
            if(license.status == 1) {
              license.update({ status: 3, accountantId: accountantId })
              returnValue.status = 1
              returnValue.result = constants.SUCCESS 
            } else if (license.status == 3){
              returnValue.status = 2
              returnValue.result = constants.LICENSE_APPROVE_PAID  
            } else if (license.status == 4){
              returnValue.status = 2
              returnValue.result = constants.LICENSE_CANCELLED  
            } else {
              returnValue.status = 2
              returnValue.result = constants.LICENSE_EXCEPTION  
            }
          }
          return returnValue;
      })
      .then(result => {
        res.send({ status: result.status, result: result.result})
      })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.cancelLicense = async function(req, res) {
    try {
      let licenseId = req.body.id
      let cancelReason = req.body.cancelReason
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let userId =tokenDecoded.id
      let role = tokenDecoded.role

      License.findByPk(licenseId)
      .then(license => {
        let returnValue = {
          status: 1,
          result: ''
        }
        if(license == undefined || license == null) {
          returnValue.status = 2
          returnValue.result = constants.LICENSE_NOT_EXIST            
        } else {  
          if(license.status == 0 && role === 'Approver') {
            license.update({ status: 2, approverId: userId, cancelReason: cancelReason })
            returnValue.status = 1
            returnValue.result = constants.SUCCESS 
          } else if(license.status == 1 && role === 'Accountant') {
            license.update({ status: 4, accountantId: userId, cancelReason: cancelReason })
            returnValue.status = 1
            returnValue.result = constants.SUCCESS 
          } else if (license.status == 4 || license.status == 2){
            returnValue.status = 2
            returnValue.result = constants.LICENSE_CANCELLED  
          } else {
            returnValue.status = 2
            returnValue.result = constants.LICENSE_EXCEPTION  
          }
        }
        return returnValue;
      })
      .then(result => {
        res.send({ status: result.status, result: result.result})
      })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.deleteLicense = async function(req, res) {
    try {
      let licenseId = req.body.id
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let userId =tokenDecoded.id

      License.findByPk(licenseId)
      .then(async license => {
        let returnValue = {
          status: 1,
          result: ''
        }
        if(license == undefined || license == null) {
          returnValue.status = 2
          returnValue.result = constants.LICENSE_NOT_EXIST            
        } else {  
          if(license.status == 0 && license.creatorId === userId) {
            await License.destroy({where: { id: licenseId }});
            returnValue.status = 1
            returnValue.result = constants.SUCCESS 
          } else {
            returnValue.status = 2
            returnValue.result = constants.LICENSE_APPROVED   
          }
        }
        return returnValue;
      })
      .then(result => {
        res.send({ status: result.status, result: result.result})
      })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.statisticUser = async function(req, res) {
    try {
      let userId = req.body.id
      let startTime = req.body.startTime
      let endTime = req.body.endTime

      let user = await User.findOne({
            where: { 
              isActive: true,
              id: userId
             },
            include: {
                model: Department,
                attributes: ['id', 'departmentName', 'address']
            },
            attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
        })

      let returnValue = await statisticOneByOne(user, startTime, endTime)

      res.send(returnValue)
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.statisticDepartment = async function(req, res) {
    try {
      let departmentId = req.body.departmentId
      let startTime = req.body.startTime
      let endTime = req.body.endTime
      let staffStatistics = []
      let totalLicense = 0
      let totalMoney = 0
      
      let staffs = await User.findAll({
            where: {
              departmentId: departmentId,
              isActive: true,
              role: 0
            },
            include: {
              model: Department,
              attributes: ['id', 'departmentName', 'address']
            },
            attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
        })
      let directors = await User.findAll({
            where: {
              isActive: true,
              role: 1
            },
            include: {
              model: Department,
              attributes: ['id', 'departmentName', 'address']
            },
            attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
        })
      let accountants = await User.findAll({
          where: {
            isActive: true,
            role: 2
          },
          include: {
            model: Department,
            attributes: ['id', 'departmentName', 'address']
          },
          attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
      })
      let users = [...staffs, ...directors, ...accountants]

      for(let i = 0; i < users.length; i++) {
        let temp = await statisticOneByOne(users[i], startTime, endTime)

        if(temp.result.user.role === 'Creator') {
          totalLicense += temp.result.totalLicense
          totalMoney += temp.result.totalMoney
        }
        staffStatistics.push(temp.result)
      }

      let result = {
        staffStatistics: staffStatistics,
        totalLicenseDepartment: totalLicense, 
        totalMoneyDepartment: totalMoney
      }

      res.send({ status: 1, result: result})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

async function statisticOneByOne(user, startTime, endTime) {
    try {
      let userId = user.id
      let role = user.role
      let result = {}
      if(role === 'Creator') {
        let license = await License.findAll({
          where: { 
            creatorId: userId,
            updatedAt: {
              [Op.gte]: startTime,
              [Op.lte]: endTime
              },
            status: 3
          }, 
          attributes: ['money']
        })

        result = license.reduce((result, license) => {
            result.totalLicense ++
            result.totalMoney += license.money
            return result
        }, {user: user, totalLicense: 0, totalMoney: 0})
      } else  if(role === 'Approver') {
        let license = await License.findAll({
          where: { 
            approverId: userId,
            updatedAt: {
              [Op.gte]: startTime,
              [Op.lte]: endTime
              },
            status: 3
            }, 
          attributes: ['money']
        })

        result = license.reduce((result, license) => {
            result.totalLicense ++
            result.totalMoney += license.money
            return result
        }, {user: user, totalLicense: 0, totalMoney: 0})
      } else if(role === 'Accountant') {
        let license = await License.findAll({
          where: { 
            accountantId: userId,
            updatedAt: {
              [Op.gte]: startTime,
              [Op.lte]: endTime
              },
            status: 3
            }, 
          attributes: ['money']
        })

        result = license.reduce((result, license) => {
            result.totalLicense ++
            result.totalMoney += license.money
            return result
        }, {user: user, totalLicense: 0, totalMoney: 0})
      } else {
        return {status: 2, result: 'role not exist'}
      }
      
      return {status: 1, result: result}
    } catch (error) {
        return {status: 2, result: error}
    }
};

exports.getBill = async function(req, res) {
  try {
      const id = req.body.id
      if (!id) {
          throw 'ID required!'
      }

      let license = await License.findOne({
          where: { 
            id: id
          },
          include: 
          [{ model: User,
              as: 'Creator',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Approver',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: User,
              as: 'Accountant',
              attributes: ['id', 'fullname', 'dob', 'address', 'phone', 'username', 'role']
            },
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'note', 'money','createdAt','updatedAt', 'status']
      })

      if(license.status != 3) {
        res.send({ status: 2, result: 'license not success cant create bill' })
      }

      const timeObj = separateTimeToUnit(new Date())

      const bills = {
        number: license.id.toString().padStart(7, "0"),
        creator: license.Creator.fullname,
        department: license.Department.departmentName,
        createdAt: moment(license.createdAt).format('DD/MM/yyyy'),
        content: license.content,
        approver: license.Approver.fullname,
        accountant: license.Accountant.fullname,
        note: license.note,
        money: license.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        totalPriceByWord: `${toVietnamese(license.money)} đồng`,
        ...timeObj
      }
      const content = fs.readFileSync(path.resolve(__dirname, 'template.docx'), 'binary')
      
      let zip = new PizZip(content);
      let doc = new Docxtemplater(zip);

      doc.setData({...bills})

      doc.render()

      const buf = doc.getZip().generate({ type: 'nodebuffer' })

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=HoaDon.docx');
      res.end(buf, 'binary');
  } catch (error) {
      res.send({ status: 2, result: error })
  }
}

exports.downloadImage = async function(req, res) {
    try {
      let filename = req.body.filename

      res.download('./uploadResults/' + filename, fileName);  
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

