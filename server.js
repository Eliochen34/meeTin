const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/peerjs', peerServer)
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => { 
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId) // 有其他人加入房間時，讓房間裡的其他人看到，拿掉broadcast
  })
})

server.listen(3000)