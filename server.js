const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => { // 有其他人加入房間時，傳入roomId和userId
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId) // 當有人進來時廣播該使用者userId
    socket.on('disconnect', () => { // 當有人離開房間時
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)