const { v4: uuidv4 } = require('uuid')

const roomController = {
  getRoomId: (req, res, next) => {
    res.redirect(`/${uuidv4()}`)
  },
  getIntoRoom: (req, res, next) => {
    res.render('room', { roomId: req.params.room })
  },
  getRooms: (req, res) => {
    res.render('rooms')
  }
}

module.exports = roomController
