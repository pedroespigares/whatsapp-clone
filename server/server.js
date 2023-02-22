const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Para hacerlo con framework:
// const io = require('socket.io')(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:4200", "http://localhost:5173"],
//     methods: ["GET", "POST"]
// })

var usersConnected = 0;
var users = [];
var ids= 0;

app.use(express.static('public'))

io.on('connection', (socket) => {
  socket.username = "";
  ids++;
  
  socket.on('setID', (id) => {
    socket.userID = id;
  });

  usersConnected++;

  console.log(`CONECTADO --> ID: ${ids}`);

  io.emit('usersConnected', usersConnected);

  socket.on('addUsername', (username) => {
      socket.username = username;

      var userData = {
        id: socket.userID,
        username: username,
      };

      var exists = false;

      users.forEach(user => {
        if(user.id == userData.id){
          exists = true;
        }
      });

      if(!exists){
          users.push(userData);
      } else{
          users.forEach(user => {
              if(user.id == userData.id){
                  user.username = userData.username;
              }
          });
      }

      console.log(users);
      io.emit('newUserConnected', users);
    });
  
  socket.on("newMessage", (msg) => {
      var messageData = {
          message: msg,
          username: socket.username,
          id: socket.userID,
          date: new Date()
      }
      io.emit('newMessage', messageData);
  })

  socket.on('disconnect', () => {
    usersConnected--;
    io.emit('usersConnected', usersConnected);
    io.emit('userDisconnected', {id: socket.userID, username: socket.username});
    console.log(`DESCONECTADO --> ID: ${ids}`);
    users.forEach(user => {
      if(user.id == socket.userID){
        users.splice(users.indexOf(user), 1);
      }
    });
  });
});

server.listen(port, () => {
    console.log(`Whatsapp clone listening on port --> ${port}`)
  })