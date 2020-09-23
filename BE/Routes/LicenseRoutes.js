const router = require('express').Router()
const LicenseController = require("../Controllers/LicenseController");
var cors = require('cors')

router.post("/createLicense", LicenseController.createLicense);
router.get("/getExecutingLicenseCreator", LicenseController.getExecutingLicenseCreator);
router.get("/getExecutedLicenseCreator", LicenseController.getExecutedLicenseCreator);
router.get("/getWaitingApproveLicenseApprover", LicenseController.getWaitingApproveLicenseApprover);
router.get("/getApprovedLicenseApprover", LicenseController.getApprovedLicenseApprover);
router.get("/getCompletedLicenseApprover", LicenseController.getCompletedLicenseApprover);
router.get("/getWaitingPayLicenseAccountant", LicenseController.getWaitingPayLicenseAccountant);
router.get("/getCompletedLicenseAccountant", LicenseController.getCompletedLicenseAccountant);
router.post("/approveLicense", LicenseController.approveLicense);
router.post("/approvePayLicense", LicenseController.approvePayLicense);
router.post("/cancelLicense", LicenseController.cancelLicense);
router.post("/deleteLicense", LicenseController.deleteLicense);
router.post("/updateLicense", LicenseController.updateLicense);
router.post("/statisticUser", LicenseController.statisticUser);
router.post("/statisticDepartment", LicenseController.statisticDepartment);
router.post("/getBill", LicenseController.getBill);
router.post("/downloadImage", LicenseController.downloadImage);

module.exports = router