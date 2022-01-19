const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', '/views')
app.set('view engine', 'ejs')
app.set(express.static('public'))
app.set(express.urlencoded({extended: true}))

const rooms = {}

app.get('/', (req, res) => {
  res.render('index', {rooms: rooms})
})

app.get('/:room', (res, req) => {
  res.render('room', {roomName: req.params.room})
})

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})