if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helper')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { pages } = require('./routes')
const users = {}

const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
const https = require('https')
const fs = require('fs')
const options = {
  key: fs.readFileSync('./private.key'),
  cert: fs.readFileSync('./certificate.crt')
}

https.createServer(options).listen(443)

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

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

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(pages)

server.listen(port)

module.exports = app
