


const roomController = {
  getRoomId: (req, res, next) => {
    res.redirect(`/${uuidv4()}`)
  },
  getIntoRoom: (req, res, next) => {
    res.render('room', { roomId: req.params.room })
  } 
}

module.exports = roomController