const util = require("util");
const path = require("path");
const multer = require("multer");
const moment = require('moment')

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(`../../uploadResults`));
    },
    filename: (req, file, callback) => {
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }

    let date = moment(new Date()).format("x")
    let random = Math.floor(Math.random() * 1000)
    let filenameArr = file.originalname.split('.').reverse()
    let extension = filenameArr[0]
    filenameArr.splice(0,1)
    let filename  = filenameArr.join('').replace(/[,]/g,'_')

    let filenameResult = date + '-' + filename +'-'+ random  + '.' + extension;
    callback(null, filenameResult);
  }
});

let uploadManyFiles = multer({storage: storage}).array("images", 20);

let multipleUploadMiddleware = util.promisify(uploadManyFiles);
module.exports = multipleUploadMiddleware;