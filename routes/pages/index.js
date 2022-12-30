const express = require('express')
const router = express.Router()

const roomController = require('../../controllers/room-countroller')


router.get('/:roomId', roomController.getIntoRoom)
router.get('/', roomController.getRoomId)



module.exports = router