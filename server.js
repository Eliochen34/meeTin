const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')
const { pages } = require('./routes')


app.engine('hbs', handlebars({ extname: '.hbs' }))

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// app.set('view engine', 'ejs')
app.use(express.static('public'))


io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => { // 有其他人加入房間時，傳入roomId和userId
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId) // 當有人進來時廣播該使用者userId
    // socket.to(roomId).emit('chat-message', 'hello')

    socket.on('send-chat-message', message => {
      io.to(roomId).emit('chat-message', message) // 使用socket是給其他人，使用io是給所有人，連自己也會看到
    })

    // 以下用來比較
    // socket.on('messages', message => { 
    //   io.to(roomId).emit('createMessage', message)
    // })
    socket.on('disconnect', () => { // 當有人離開房間時
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

app.use(pages)

server.listen(3000)

module.exports = app