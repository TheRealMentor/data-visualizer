const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  setInterval(() => {
    socket.emit('data', {timestamp: new Date(), value: Math.floor(Math.random() * 100)});
  }, 1000);
});

httpServer.listen(3001);
console.log('Server started on port 3001');
