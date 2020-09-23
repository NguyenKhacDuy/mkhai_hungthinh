const MultipleFilesUploadMiddleware = require("../Middlewares/MultipleFileUploadMiddleware");
const multipleImagesUploadMiddleware = require("../Middlewares/MultipleImagesUploadMiddleware");
const db = require('../Models')
const constants = require('../Global/Constants')
const User = db.User
const Department = db.Department
const Document = db.Document
const jwtDecode = require('jwt-decode');
const moment = require('moment')
var sequelizePagination = require('sequelize-paginate-cursor');
var sequelize = require("sequelize");

let debug = console.log.bind(console);
exports.createDocument = async (req, res) => {
  try {
    let files = {};
    let type = req.query.type
    let token = req.headers.authorization.split(' ')[1]
    let tokenDecoded = jwtDecode(token);
    let departmentId = tokenDecoded.Department.id
    let creatorId =tokenDecoded.id
    let creatorRole = tokenDecoded.role

    if (type == 0) { //lich hop
      await multipleImagesUploadMiddleware(req, res);
      debug(req.files);
      files = req.files;
    } else if (type == 1) { //thong bao + tai lieu dao tao
      await MultipleFilesUploadMiddleware(req, res); 
      debug(req.files);
      files = req.files;
    } else if(type == 2) {
      if(creatorRole == 'Approver') {
        await MultipleFilesUploadMiddleware(req, res); 
        debug(req.files);
        files = req.files;
      } else {
        res.send({ status: 2, result: 'Permission denied'})
      }
    }
    
    let body = req.body
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let fileNameArr = [];
    let documentInfo = {}

    if (files.length > 0) {
      files.forEach(element => {
        fileNameArr.push(element.filename);
      });

      documentInfo = {
        content: body.content,
        title: body.title,
        departmentId: departmentId,
        creatorId: creatorId,
        files: fileNameArr.join(),
        type: type,
        isActive: 1
      }  
    } else {
      documentInfo = {
        content: body.content,
        title: body.title,
        departmentId: departmentId,
        creatorId: creatorId,
        type: type,
        isActive: 1
      } 
    }
      Document.create(documentInfo).then(Document => {
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

exports.updateDocument = async (req, res) => {
  try {
    let newfiles = {};
    let type = req.query.type
    let token = req.headers.authorization.split(' ')[1]
    let tokenDecoded = jwtDecode(token);
    let departmentId = tokenDecoded.Department.id
    let creatorId =tokenDecoded.id
    let creatorRole = tokenDecoded.role

    if (type == 0) { //lich hop
      await multipleImagesUploadMiddleware(req, res);
      debug(req.files);
      newfiles = req.files;
    } else if (type == 1) { //thong bao + tai lieu dao tao
      await MultipleFilesUploadMiddleware(req, res); 
      debug(req.files);
      newfiles = req.files;
    } else if(type == 2) {
      if(creatorRole == 'Approver') {
        await MultipleFilesUploadMiddleware(req, res); 
        debug(req.files);
        newfiles = req.files;
      } else {
        res.send({ status: 2, result: 'Permission denied'})
      }
    }
    
    let body = req.body
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let fileNameArr = [];
    let oldFiles = body.oldFiles.split(',')
    let documentInfo = {}
    let documentId = body.id

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

      documentInfo = {
        content: body.content,
        title: body.title,
        departmentId: departmentId,
        files: fileNameArr.join(),
        isActive: 1,
        updatedAt: currentDate
      }  
    } else {
      documentInfo = {
        content: body.content,
        title: body.title,
        departmentId: departmentId,
        updatedAt: currentDate,
        isActive: 1
      } 
    }
      Document.findByPk(documentId).then(document => {
        if(document.isActive == 0) {
          res.send({ status: 2, result: "Document not exist"})
        } 

        if(document.creatorId == creatorId) {
          document.update(documentInfo);
          res.send({ status: 1, result: "Success"})
        } else {
          res.send({ status: 2, result: "Cannot modify document of another user"})
        }
      })
  } catch (error) {
    
    debug(error);
    
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }
    return res.send(`Error when trying upload many files: ${error}}`);
  }
};

exports.deleteDocument = async function(req, res) {
    try {
      let documentId = req.body.id
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let userId =tokenDecoded.id
      let role =tokenDecoded.role

      Document.findByPk(documentId).then(document => {
        if(document.isActive == 0) {
          res.send({ status: 2, result: "Document not exist"})
        } 

        if(document.creatorId == userId || role === 'Approver') {
          document.update({isActive: 0});
          res.send({ status: 1, result: "Success"})
        } else {
          res.send({ status: 2, result: "Cannot modify document of another user"})
        }
      })
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    
    return { limit, offset }
};

exports.getAllMeetingSchedule = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let accountantId =tokenDecoded.id
      const { page, size } = req.query;
      const limitAndOffset = getPagination(page, size)
      limit = limitAndOffset.limit;
      offset = limitAndOffset.offset;
      let pageInfo = {}

      let document = await Document.findAndCountAll({
          where: { 
            isActive: 1, 
            type: 0,
          },
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
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'title','createdAt','updatedAt','files']
      })
      pageInfo.totalDocuments = document.count;
      pageInfo.totalPages = Math.ceil(document.count / limit);
      pageInfo.currentPage = parseInt(page);
      let result = []
      document.rows.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result, ...pageInfo})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};


exports.getAllNoti = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let accountantId =tokenDecoded.id
      const { page, size } = req.query;
      const limitAndOffset = getPagination(page, size)
      limit = limitAndOffset.limit;
      offset = limitAndOffset.offset;
      let pageInfo = {}

      let document = await Document.findAndCountAll({
          where: { 
            isActive: 1, 
            type: 1,
          },
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
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'title','createdAt','updatedAt','files']
      })
      pageInfo.totalDocuments = document.count;
      pageInfo.totalPages = Math.ceil(document.count / limit);
      pageInfo.currentPage = parseInt(page);
      let result = []
      document.rows.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result, ...pageInfo})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};
exports.getAllTrainingDocument = async function(req, res) {
    try {
      let token = req.headers.authorization.split(' ')[1]
      let tokenDecoded = jwtDecode(token);
      let accountantId =tokenDecoded.id
      const { page, size } = req.query;
      const limitAndOffset = getPagination(page, size)
      limit = limitAndOffset.limit;
      offset = limitAndOffset.offset;
      let pageInfo = {}

      let document = await Document.findAndCountAll({
          where: { 
            isActive: 1, 
            type: 2,
          },
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
            {model: Department,
                attributes: ['id', 'departmentName','address']
            }],
          attributes: ['id', 'content', 'title','createdAt','updatedAt','files']
      })
      pageInfo.totalDocuments = document.count;
      pageInfo.totalPages = Math.ceil(document.count / limit);
      pageInfo.currentPage = parseInt(page);
      let result = []
      document.rows.forEach(item => {
        result.push(item.dataValues)
      });
      res.send({ status: 1, result: result, ...pageInfo})
    } catch (error) {
        res.send({ status: 2, result: error })
    }
};

exports.download = async function(req, res) {
    try {
      let filename = req.body.filename

      res.download('./uploadResults/' + filename, filename);  
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

exports.getLatestMeetingSchedule = async function(req, res) {
    try {
      let document = await Document.findAll({
        attributes: [[sequelize.fn("max", sequelize.col('id')), 'max']],
        where: {
          type: 0,
          isActive: 1
        },
      }).then(function(item){
          return Document.findOne({
              where: {
                  id: item[0].dataValues.max
              },
              attributes: ['id', 'content', 'title','createdAt','updatedAt','files']
          })
      }).then(function(result){
          res.send({ status: 1, result: result })
      });
    } catch (error) {
        res.send({ status: 2, result: error })
    }
}

