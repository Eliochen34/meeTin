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

app.get('/:roomId', (req, res) => {
  res.render('room', { roomId: req.params.roomId })
})

io.on('connection', socket => {
  socket.on('join-room', () => {
    console.log("joined room")
  })
})

server.listen(3000)