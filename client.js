const io = require('socket.io-client');
const socket = io('ws://127.0.0.1:3001', {transports: ['websocket']});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('data', data => {
  console.log(data);
});
