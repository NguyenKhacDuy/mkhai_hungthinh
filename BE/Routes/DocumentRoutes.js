const router = require('express').Router()
const documentController = require("../Controllers/DocumentController");
var cors = require('cors')

router.post("/createDocument", documentController.createDocument);
router.post("/updateDocument", documentController.updateDocument);
router.post("/deleteDocument", documentController.deleteDocument);
router.get("/getAllMeetingSchedule", documentController.getAllMeetingSchedule);
router.get("/getAllNoti", documentController.getAllNoti);
router.get("/getAllTrainingDocument", documentController.getAllTrainingDocument);
router.post("/download", documentController.download);
router.get("/getLatestMeetingSchedule", documentController.getLatestMeetingSchedule);

module.exports = router