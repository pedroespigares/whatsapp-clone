import { Views } from "../helpers/views.js";
const views = new Views();

var photo;

function uploadUserPhoto(files) {
  photo = files[0];
}

var socket = io();

// Setear ID del usuario
socket.on("connect", function () {
  socket.emit("setID", socket.id);
});

//   Cuando la foto de usuario se haya subido al servidor sale como que se ha conectado
socket.on("usersConnected", function (users) {
  socket.on("userPhotoUploaded", function () {
    $("#usersConnected").html(`Users connected: ${users}`);
  });
});

// OnChange del input de la foto de usuario
$(document).on("change", "#imageInput", function (e) {
  uploadUserPhoto(e.target.files);
  $("#userPhotoLabel").html(`Uploaded! <i class="fa-solid fa-check" class="w-50"></i>`);
});

// Cuando se envía el formulario de creación de usuario
$(document).on("submit", "#joinChat", function (e) {
  e.preventDefault();
  let username = $("#usernameInput").val();
  let room = $("#chatSelect").val();

  socket.emit("addUserToRoom", {
    username: username,
    room: room,
    userPhoto: photo,
  });

  //   socket.on('userPhotoUploaded', function(){

  $("#usernameInput").val();
  $("body").addClass("container-fluid");
  views.chatView(room);
});
//   });

// Para cerrar sesión recargamos la página
$(document).on("click", ".logout", function () {
  window.location.reload();
});

// Cuando se conecta un nuevo usuario
socket.on("newUserConnected", function (users) {

  $("#user-list").html("");

  let lastUser = users[users.length - 1];
  let actualUser;

  if (users.length == 1) {
    actualUser = users[users.length - 1];
  } else {
    users.forEach(function (user) {
        if (user.id == socket.id) {
            actualUser = user;
        }
    });
  }

  if (lastUser.id == socket.id) {
    views.selfJoinedChat();
  } else {
    views.otherJoinedChat(lastUser.username);
  }

  socket.emit("singleUserPhoto", {
    userID: actualUser.id,
    username: actualUser.username,
  });

  socket.on("singleUserPhoto", function (data) {
    views.changeSidebarHeader(data.path, data.username)
  });

  $("#usersConnected").html(`Users connected: ${users.length}`);

  users.forEach(function (user) {
    socket.emit("getPhotoOfUser", {
      userID: user.id,
      username: user.username,
    });
  });
});

// Sacamos la foto del usuario que se ha conectado
socket.on("photoOfUser", function (data) {
  views.addIntoUserList(data);
});

// Cuando se desconecta un usuario
socket.on("userDisconnected", function (userData) {
  let userID = userData.id;
  let username = userData.username;
  $(`input[value="${userID}"]`).parent().parent().parent().parent().remove();
  views.userDisconnected(username);
  $("#usersConnected").html(`Users connected: ${userData.usersConnected}`);
  $("#chat-messages").animate(
    { scrollTop: $("#chat-messages").prop("scrollHeight") },
    500
  );
});

// Cuando se escribe un mensaje
$(document).on("keyup", "#newMessage", function (e) {
  if (e.keyCode === 13) {
    socket.emit("newMessage", $("#newMessage").val());
    $("#newMessage").val("");
  }
});

// Cuando se envía un mensaje
socket.on("newMessage", function (messageData) {
  let formattedDate = new Date(messageData.date);
  let hours = formattedDate.getHours();
  let minutes = formattedDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (messageData.id === socket.id) {
    views.selfMessage(messageData, hours, minutes);
  } else {
    views.otherMessage(messageData, hours, minutes);
  }

  $(".single-message-username").css("color", "#ee50af");
  $("#chat-messages").animate(
    { scrollTop: $("#chat-messages").prop("scrollHeight") },
    500
  );
});

socket.on('mesaggeWithFile', function (messageData) {
  socket.emit('handleMessageWithFile', messageData);
});

socket.on('WriteMesaggeWithFile', function (messageData) {
  let formattedDate = new Date(messageData.date);
  let hours = formattedDate.getHours();
  let minutes = formattedDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let filename = messageData.path.split('/').pop();

  if(messageData.type.includes('image')){
    if (messageData.id === socket.id) {
      views.selfMessageWithImg(messageData, hours, minutes);
    } else {
      views.otherUserMessageWithImg(messageData, hours, minutes);
    }
  }else{
    if (messageData.id === socket.id) {
      views.selfMessageWithFile(filename, hours, minutes);
    } else {
      views.otherUserMessageWithFile(messageData, filename, hours, minutes);
    }
  }

  $(".single-message-username").css("color", "#ee50af");
  $("#chat-messages").animate(
    { scrollTop: $("#chat-messages").prop("scrollHeight") },
    500
  );
});

// Cuando se escribe un mensaje (para mostrar el icono de enviar)
$(document).on("keyup", "#newMessage", function () {
  if ($("#newMessage").val() !== "") {
    $(".fa-microphone").removeClass("fa-microphone").addClass("fa-paper-plane");
    socket.emit("typing", { userID: socket.id, typing: true });
  } else {
    $(".fa-paper-plane")
      .removeClass("fa-paper-plane")
      .addClass("fa-microphone");
    socket.emit("typing", { userID: socket.id, typing: false });
  }
});

// Cuando se está escribiendo un mensaje (para mostrar el texto "typing...")
socket.on("typing", function (data) {
  if (!data.typing) {
    setInterval(function () {
      $(`input[value="${data.userID}"]`)
        .siblings(".typing")
        .css("display", "none");
    }, 3000);
  } else {
    $(`input[value="${data.userID}"]`)
      .siblings(".typing")
      .css("display", "block");
  }
});


// OnChange del input de la imagen para enviarla al servidor y que la suba
$(document).on("change", "#chatImageInput", function (e) {
  socket.emit("uploadFile", {
    buffer: e.target.files[0],
    name: e.target.files[0].name,
    type: e.target.files[0].type,
  });
});

$(document).on('click', '.fa-download', function () {
  let src = $(this).siblings('img').attr('src');
  let srcNotImg = $(this).siblings('.fileNotImg').text();
  let actualURL = window.location.href;
  var filename;

  if(src === undefined){
    filename = srcNotImg.split('/').pop();
    fetch(`${actualURL}${srcNotImg}`)
      .then((response) => {
        let blob = new Blob([response], {type: 'application/pdf'});
        saveAs(blob, filename);
      });
  }else{
    filename = src.split('/').pop();
    fetch(`${actualURL}${src}`)
    .then((response) => response.blob())
    .then((blob) => {
      saveAs(blob, filename);
    });
  }
});

$(document).on('click', '.list-username', function () {
  let userID = $(this).siblings('input').val();

  if(userID !== socket.id){
    $('.list-username').css('pointer-events', 'none');
    let room = $('.room-number').text();
    let username = $(this).text();
    let userPhoto = $(`#${userID}-img`).attr('src');

    $('.chat-header-title').text(username); 
    $('.chat-header-title').siblings('img').attr('src', userPhoto);
    $('.chat-header-title').siblings('img').addClass('rounded-circle');

    views.addRoomToList(room);

    $('#chat-messages').html('');
  }
});


$(document).on('click', '.room-preview', function () {
  let room = $('#roomNumberInCard').text();
  let roomToJoin = room.split(' ').pop();
  socket.emit('joinRoom', roomToJoin);
  $(".room-preview").html('');

  $('.chat-header-title').text(room);
  $('.chat-header-title').siblings('img').attr('src', "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png");
  $('.chat-header-title').siblings('img').removeClass('rounded-circle');
  $('.list-username').css('pointer-events', 'auto');
});