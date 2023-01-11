const express = require('express')
const router = express.Router()

const roomController = require('../../controllers/room-controller')
const userController = require('../../controllers/user-controller')

const { generalErrorHandler } = require('../../middleware/error-handler')

router.get('/register', userController.getRegisterPage)
router.post('/register', userController.register)
router.get('/login', userController.getLoginPage)
router.post('/login', userController.login)

router.get('/rooms', roomController.getRooms)
router.get('/:roomId', roomController.getIntoRoom)
router.get('/', roomController.getRoomId)
router.use('/', generalErrorHandler)

module.exports = router
