const router = require('express').Router()
const DepartmentController = require('../Controllers/DepartmentController')

router.post("/createDepartment", DepartmentController.createDepartment);
router.post("/removeDepartment", DepartmentController.removeDepartment);
router.get("/getAllDepartment", DepartmentController.getAll);
router.post("/getAllUserInDepartment", DepartmentController.getAllUserInDepartment);

module.exports = router