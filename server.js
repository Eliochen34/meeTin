const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')
const { pages } = require('./routes')
const users = {}
const port = process.env.PORT || 3000
const https = require('https')
const fs = require('fs')
const options = {
  key: fs.readFileSync('../../../etc/ssl/private.key'),
  cert: fs.readFileSync('../../../etc/ssl/certificate.crt')
}

https.createServer(options).listen(443)


app.engine('hbs', handlebars({ extname: '.hbs' }))

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// app.set('view engine', 'ejs')
app.use(express.static('public'))


io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, userName) => { // 有其他人加入房間時，傳入roomId和userId
    socket.join(roomId)
    users[socket.id] = userName
    console.log(users)
    socket.to(roomId).emit('user-connected', userId, userName) // 當有人進來時廣播該使用者userId
    // socket.to(roomId).emit('chat-message', 'hello')

    socket.on('send-chat-message', message => {
      io.to(roomId).emit('chat-message', {
        message: message,
        name: users[socket.id]
      }) // 使用socket是給其他人，使用io是給所有人，連自己也會看到
    })

    // 以下用來比較
    // socket.on('messages', message => { 
    //   io.to(roomId).emit('createMessage', message)
    // })
    socket.on('disconnect', () => { // 當有人離開房間時
      socket.to(roomId).emit('user-disconnected', users[socket.id], userId)
      delete users[socket.id]
    })
  })
})

app.use(pages)

server.listen(port)

module.exports = app