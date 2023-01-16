const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const roomController = require('../../controllers/room-controller')
const userController = require('../../controllers/user-controller')

const { generalErrorHandler } = require('../../middleware/error-handler')

router.get('/register', userController.getRegisterPage)
router.post('/register', userController.register)
router.get('/login', userController.getLoginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)

router.get('/rooms', roomController.getRooms)
router.get('/rooms/new', roomController.getNewRoomPage)
router.post('/rooms', roomController.addNewRoom)
router.get('/:roomId', roomController.getIntoRoom)
// router.get('/rooms/:roomId', roomController.getIntoRoom)
router.get('/', roomController.getRoomId)
router.use('/', generalErrorHandler)

module.exports = router
