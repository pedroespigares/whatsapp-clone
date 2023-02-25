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

  if($("#imageInput").val() != ""){
    socket.emit("addUserToRoom", {
      username: username,
      room: room,
      userPhoto: photo,
    });

    $("#usernameInput").val();
    $("body").addClass("container-fluid");
    views.chatView(room);
  } else {
    $('#photo-error').css('display', 'block');
  }
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
    if($("#newMessage").val() != ""){
      socket.emit("newMessage", $("#newMessage").val());
      $("#newMessage").val("");
    }
  }
});

// Cuando se envía un mensaje en privado
$(document).on("keyup", "#newPrivateMessage", function (e) {
  if (e.keyCode === 13) {
    if($("#newPrivateMessage").val() != ""){
      socket.emit("newPrivateMessage", $("#newPrivateMessage").val());
      $("#newPrivateMessage").val("");
    }
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
    views.otherUserMessage(messageData, hours, minutes);
  }

  $(".single-message-username").css("color", "#ee50af");
  $("#chat-messages").animate(
    { scrollTop: $("#chat-messages").prop("scrollHeight") },
    500
  );
});

// Cuando se envía un mensaje privado
socket.on("newPrivateMessage", function (messageData) {
  let formattedDate = new Date(messageData.date);
  let hours = formattedDate.getHours();
  let minutes = formattedDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (messageData.id === socket.id) {
    views.selfPrivateMessage(messageData, hours, minutes);
  } else {
    views.otherUserPrivateMessage(messageData, hours, minutes);
  }
   
  $(".single-message-username").css("color", "#ee50af");
  $("#private-chat-messages").animate(
    { scrollTop: $("#private-chat-messages").prop("scrollHeight") },
    500
  );
});


// Cuando se envía un mensaje con archivo
socket.on('mesaggeWithFile', function (messageData) {
  socket.emit('handleMessageWithFile', messageData);
});


// Cuando se envía un mensaje privado con archivo
socket.on('privateMesaggeWithFile', function (messageData) {
  socket.emit('handlePrivateMessageWithFile', messageData);
});


// Escritura de mensajes con archivos
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

socket.on("WritePrivateMesaggeWithFile", function (messageData) {
  let formattedDate = new Date(messageData.date);
  let hours = formattedDate.getHours();
  let minutes = formattedDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let filename = messageData.path.split('/').pop();

  if(messageData.type.includes('image')){
    if (messageData.id === socket.id) {
      views.selfPrivateMessageWithImg(messageData, hours, minutes);
    } else {
      views.otherUserPrivateMessageWithImg(messageData, hours, minutes);
    }
  }else{
    if (messageData.id === socket.id) {
      views.selfPrivateMessageWithFile(filename, hours, minutes);
    } else {
      views.otherUserPrivateMessageWithFile(messageData, filename, hours, minutes);
    }
  }

  $(".single-message-username").css("color", "#ee50af");
  $("#private-chat-messages").animate(
    { scrollTop: $("#private-chat-messages").prop("scrollHeight") },
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

// Cuando se escribe un mensaje privado (para mostrar el icono de enviar)
$(document).on("keyup", "#newPrivateMessage", function () {
  if ($("#newPrivateMessage").val() !== "") {
    $(".fa-microphone").removeClass("fa-microphone").addClass("fa-paper-plane");
    socket.emit("typingInPrivate", { userID: socket.id, typing: true });
  } else {
    $(".fa-paper-plane")
      .removeClass("fa-paper-plane")
      .addClass("fa-microphone");
    socket.emit("typingInPrivate", { userID: socket.id, typing: false });
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

// Cuando se está escribiendo un mensaje privado (para mostrar el texto "typing in your DM...")
socket.on("typingInPrivate", function (data) {
  if (!data.typing) {
    setInterval(function () {
      $(`input[value="${data.userID}"]`)
        .siblings(".typingInPrivate")
        .css("display", "none");
    }, 3000);
  } else {
    $(`input[value="${data.userID}"]`)
      .siblings(".typingInPrivate")
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

$(document).on("change", "#privateChatImageInput", function (e) {
  socket.emit("uploadFileFromPrivateChat", {
    buffer: e.target.files[0],
    name: e.target.files[0].name,
    type: e.target.files[0].type,
  });
});

// Evento para descargar el archivo
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

    $('#chat-messages').replaceWith(`
    <div id="private-chat-messages" class="private-chat-messages w-100 d-flex flex-column justify-content-start">
    </div>
    `);

    $('#newMessage').replaceWith(`
      <input id="newPrivateMessage" type="text" class="form-control" placeholder="Write a message...">
    `)

    $('#chatImageInput').replaceWith(`<input type="file" id="privateChatImageInput">`);

    $('#chatImageInputLabel').replaceWith(`
      <label id="privateChatImageInputLabel" for="privateChatImageInput"><i class="fa-solid fa-paperclip" title="Upload files"></i></label>
    `);

    socket.emit('StartPrivateMessage', userID);
    socket.emit('notifyUser', {
      from: socket.id,
      to: userID
    });
    
    if($('.dm-notification').length > 0){
      socket.emit('deleteNotification', socket.id);
    }
  }
});

socket.on('notifyUser', function (userID) {
  let inputOfUser = $(`input[value="${userID}"]`);
  let divFromUser = inputOfUser.parent();

  divFromUser.append(`
    <p class="card-text dm-notification mt-2">Wants to DM you!</p>
  `);
});

socket.on('deleteNotification', function (userID) {
  let inputOfUser = $(`input[value="${userID}"]`);
  let divFromUser = inputOfUser.parent();

  divFromUser.find('.dm-notification').remove();
});

$(document).on('click', '.room-preview', function () {
  let room = $('#roomNumberInCard').text();

  socket.emit('leavePrivateMessages');

  $(".room-preview").html('');

  $('.chat-header-title').text(room);
  $('.chat-header-title').siblings('img').attr('src', "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png");
  $('.chat-header-title').siblings('img').removeClass('rounded-circle');
  $('.list-username').css('pointer-events', 'auto');

  $('#private-chat-messages').replaceWith(`
  <div id="chat-messages" class="chat-messages w-100 d-flex flex-column justify-content-start">
  </div>`);

  $('#newPrivateMessage').replaceWith(`
    <input id="newMessage" type="text" class="form-control" placeholder="Write a message...">
  `)

  $('#privateChatImageInput').replaceWith(`<input type="file" id="chatImageInput">`);

  $('#privateChatImageInputLabel').replaceWith(`
      <label id="chatImageInputLabel" for="chatImageInput"><i class="fa-solid fa-paperclip" title="Upload files"></i></label>
    `);
});