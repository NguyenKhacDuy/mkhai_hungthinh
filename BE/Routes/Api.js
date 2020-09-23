const router = require('express').Router()

const user = require('./UserRoutes')
const department = require('./DepartmentRoutes')
const license = require('./LicenseRoutes')
const document = require('./DocumentRoutes')

router.use('/user', user)
router.use('/department', department)
router.use('/license', license)
router.use('/document', document)

module.exports = router