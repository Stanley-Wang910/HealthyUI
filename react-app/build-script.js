const WebSocket = require('ws')
const socket = new WebSocket('ws://localhost:35729')

socket.on('open', function open() {
  socket.send('reload')
  socket.close()
})
