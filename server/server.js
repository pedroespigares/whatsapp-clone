const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { writeFile, unlink, existsSync } = require("fs");
const path = require("path");

// Para hacerlo con framework:
// const io = require('socket.io')(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:4200", "http://localhost:5173"],
//     methods: ["GET", "POST"]
// })

var usersRoom1 = [];
var usersRoom2 = [];
var usersRoom3 = [];
var usersRoom4 = [];
var usersRoom5 = [];
var usersRoom6 = [];
var usersRoom7 = [];
var usersRoom8 = [];
var usersRoom9 = [];
var usersRoom10 = [];

var connectedUsersRoom1 = 0;
var connectedUsersRoom2 = 0;
var connectedUsersRoom3 = 0;
var connectedUsersRoom4 = 0;
var connectedUsersRoom5 = 0;
var connectedUsersRoom6 = 0;
var connectedUsersRoom7 = 0;
var connectedUsersRoom8 = 0;
var connectedUsersRoom9 = 0;
var connectedUsersRoom10 = 0;


app.use(express.static('public'))

io.on('connection', (socket) => {

  // Sacamos el directorio anterior para poder acceder a la carpeta public

  var prevFolder= path.dirname(__dirname).split('/').pop();
  socket.pathToUpload = prevFolder + '/public/userPhotos';

  // Setear ID del usuario
  socket.on('setID', (id) => {
    socket.userID = id;
  });

  console.log(`CONECTADO --> ID: ${socket.id}`);

  socket.connectedRoomUsers = 0;


  // Añadir usuario a la lista de usuarios
  
  socket.on('addUserToRoom', (data) => {
      socket.username = data.username;
      socket.room = data.room;
      socket.userPhoto = data.userPhoto;


      // Guardar foto de usuario en el servidor
      
      writeFile(`${socket.pathToUpload}/${socket.userID}.jpg`, socket.userPhoto, (err) => {
        if(err) console.log(err);
        socket.emit('userPhotoUploaded');
      });
      
      socket.join(data.room);

      var userData = {
        id: socket.userID,
        username: data.username,
      };

      switch(data.room){
        case '1':
          connectedUsersRoom1++;
          usersRoom1.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom1);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom1);
          break;
        case '2':
          connectedUsersRoom2++;
          usersRoom2.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom2);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom2);
          break;
        case '3':
          connectedUsersRoom3++;
          usersRoom3.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom3);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom3);
          break;
        case '4':
          connectedUsersRoom4++;
          usersRoom4.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom4);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom4);
          break;
        case '5':
          connectedUsersRoom5++;
          usersRoom5.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom5);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom5);
          break;
        case '6':
          connectedUsersRoom6++;
          usersRoom6.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom6);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom6);
          break;
        case '7':
          connectedUsersRoom7++;
          usersRoom7.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom7);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom7);
          break;
        case '8':
          connectedUsersRoom8++;
          usersRoom8.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom8);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom8);
          break;
        case '9':
          connectedUsersRoom9++;
          usersRoom9.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom9);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom9);
          break;
        case '10':
          connectedUsersRoom10++;
          usersRoom10.push(userData);
          io.to(socket.room).emit('newUserConnected', usersRoom10);
          io.to(socket.room).emit('usersConnected', connectedUsersRoom10);
          break;
      }
    });
  



  // Enviar mensaje
  socket.on("newMessage", (msg) => {
      var messageData = {
          message: msg,
          username: socket.username,
          id: socket.userID,
          date: new Date()
      }
      io.to(socket.room).emit('newMessage', messageData);
  })
  
  socket.on('typing', (data) => {
    io.to(socket.room).emit('typing', {userID: data.userID, typing: data.typing});
  });

  socket.on('getPhotoOfUser', (data) => {
    socket.emit('photoOfUser', {
      path: `userPhotos/${data.userID}.jpg`,
      userID: data.userID,
      username: data.username
    });
  });

  socket.on('singleUserPhoto', (data) => {
    socket.emit('singleUserPhoto', {
      path: `userPhotos/${data.userID}.jpg`,
      username: data.username
    });
  });

  // Desconectar usuario
  socket.on('disconnect', () => {
    switch(socket.room){
      case '1':
        connectedUsersRoom1--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom1});
        usersRoom1.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom1.splice(index, 1);
          }
        });
        break;
      case '2':
        connectedUsersRoom2--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom2});
        usersRoom2.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom2.splice(index, 1);
          }
        });
        break;
      case '3':
        connectedUsersRoom3--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom3});
        usersRoom3.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom3.splice(index, 1);
          }
        });
        break;
      case '4':
        connectedUsersRoom4--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom4});
        usersRoom4.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom4.splice(index, 1);
          }
        });
        break;
      case '5':
        connectedUsersRoom5--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom5});
        usersRoom5.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom5.splice(index, 1);
          }
        });
        break;
      case '6':
        connectedUsersRoom6--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom6});
        usersRoom6.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom6.splice(index, 1);
          }
        });
        break;
      case '7':
        connectedUsersRoom7--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom7});
        usersRoom7.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom7.splice(index, 1);
          }
        });
        break;
      case '8':
        connectedUsersRoom8--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom8});
        usersRoom8.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom8.splice(index, 1);
          }
        });
        break;
      case '9':
        connectedUsersRoom9--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom9});
        usersRoom9.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom9.splice(index, 1);
          }
        });
        break;
      case '10':
        connectedUsersRoom10--;
        io.to(socket.room).emit('userDisconnected', {id: socket.userID, username: socket.username, usersConnected: connectedUsersRoom10});
        usersRoom10.forEach((user, index) => {
          if(user.id == socket.userID){
            usersRoom10.splice(index, 1);
          }
        });
        break;
    }

    console.log(`DESCONECTADO --> ID: ${socket.userID}`);

    if(existsSync(`${socket.pathToUpload}/${socket.userID}.jpg`) == true){
      unlink(`${socket.pathToUpload}/${socket.userID}.jpg`, (err) => {
        if(err){
          console.log(err);
        }
      }
      );
    }

  });
});

server.listen(port, () => {
    console.log(`Whatsapp clone listening on port --> ${port}`)
  })