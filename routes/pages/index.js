const express = require('express')
const router = express.Router()

const roomController = require('../../controllers/room-controller')
const userController = require('../../controllers/user-controller')


router.get('/login', userController.getLoginPage)
router.get('/register', userController.getRegisterPage)

router.get('/rooms', roomController.getRooms)
router.get('/:roomId', roomController.getIntoRoom)
router.get('/', roomController.getRoomId)



module.exports = router