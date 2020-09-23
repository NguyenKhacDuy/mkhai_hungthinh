const router = require('express').Router()
const UserController = require('../Controllers/UserController')

// router.get('/getAllDriver', UserController.getAllDriver)
// router.get('/getAllFreeDriver', UserController.getAllFreeDriver)
// router.get('/getAllManager', UserController.getAllManager)
router.post('/createUser', UserController.createUser)
router.get('/getAllUser', UserController.getAll)
router.put('/removeUsers', UserController.removeUsers)
router.put('/updateUser', UserController.updateUser)
router.put('/changePassword', UserController.changePassword)

module.exports = router