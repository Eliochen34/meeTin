const { v4: uuidv4 } = require('uuid')
const { Room } = require('../models')

const roomController = {
  getRoomId: (req, res, next) => {
    res.redirect(`/${uuidv4()}`)
  },
  getIntoRoom: (req, res, next) => {
    return Room.findByPk(req.params.roomId, { raw: true })
      .then(room => {
        // console.log(room)
        if (!room) throw new Error("Room didn't exist!")
        res.render('room', { roomId: req.params.roomId })
      })
      .catch(err => next(err))
  },
  getRooms: (req, res, next) => {
    Room.findAll({ raw: true })
      .then(rooms => res.render('rooms', { rooms }))
      .catch(err => next(err))
  },
  getNewRoomPage: (req, res, next) => {
    res.render('add-room')
  },
  addNewRoom: (req, res, next) => {
    const { title, content } = req.body
    console.log(req.body)
    if (!title) throw new Error('Room title is required!')
    return Room.create({
      title,
      content
    })
      .then(() => res.redirect('rooms'))
      .catch(err => next(err))
  }
}

module.exports = roomController
