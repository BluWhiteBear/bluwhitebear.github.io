//URL was "https://localhost:3000"
const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = localStorage.getItem('userName')
appendMessage(name + ' joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  name == "New User"
  
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected...`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`, name)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message, username) {
  const messageElement = document.createElement('div')
  const messageWrapper = document.createElement('div')
  messageWrapper.className = "messageWrapper"
  if(username == name)
  {
    messageElement.className = "message clientMessage"
  }
  else
  {
    messageElement.className = "message remoteMessage"
  }
  messageElement.innerText = message
  messageWrapper.appendChild(messageElement)
  messageContainer.append(messageWrapper)
}