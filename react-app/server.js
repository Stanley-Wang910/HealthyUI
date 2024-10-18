const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 35729 }) // Example port number

wss.on('connection', function connection(ws) {
  console.log('WebSocket server connected')
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })

  // Broadcast to all clients
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  // Use this broadcast function when files change
})
