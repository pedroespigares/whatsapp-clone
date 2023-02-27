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
    $("body").html(`
            <div class="row">
                <aside class="col-3 p-0 m-0">
                    <header class="d-flex justify-content-between align-items-center sidebar-header">
                        <div id="sidebar_header" class="d-flex align-items-center justify-content-center gap-3">       
                        </div>
                        <div class="d-flex align-items-center justify-content-center gap-3">
                            <i class="fa-solid fa-users"></i>
                            <i class="fa-sharp fa-solid fa-circle-notch"></i>
                            <i class="fa-solid fa-message"></i>
                            <i class="fa-solid fa-ellipsis-v" data-bs-toggle="dropdown" aria-expanded="false" title="User options"></i>
                            <ul class="dropdown-menu">
                            <li><a class="dropdown-item logout">Logout</a></li>
                            </ul>
                        </div>
                    </header>
                    <div class="d-flex flex-column justify-content-start align-items-center chat-group gap-3">
                        <p id="usersConnected" class="text-center mt-3"></p>
                        <div id="user-list" class="align-self-start ps-5"></div>
                    </div>
                </aside>
                
                <main class="col-9 d-flex flex-column justify-content-start align-items-center p-0 m-0">
                    <header class="chat-header d-flex justify-content-between align-items-center w-100">
                        <div class="d-flex justify-content-center align-items-center gap-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Logo" class="avatar">
                            <h3 class="mb-0 room-number chat-header-title">Room ${room}</h3>
                        </div>
                        <div class="d-flex justify-content-center align-items-center gap-3 pe-4 search-in-chat">
                            <i class="fa-solid fa-search"></i>
                            <i class="fa-solid fa-ellipsis-v"></i>
                        </div>
                    </header>
                    <div id="chat-messages" class="chat-messages w-100 d-flex flex-column justify-content-start">
                    </div>
                    <div class="chat-type d-flex justify-content-evenly align-items-center w-100 gap-3 ps-3 pe-3 pt-3 pb-3">
                        <i class="fa-sharp fa-regular fa-face-smile"></i>
                        <label id="chatImageInputLabel" for="chatImageInput"><i class="fa-solid fa-paperclip" title="Upload files"></i></label>
                        <input type="file" id="chatImageInput">
                        <input id="newMessage" type="text" class="form-control" placeholder="Write a message...">
                        <i class="fa-solid fa-microphone"></i>
                    </div>
                </main>
            </div>`);
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
    $("#chat-messages").append(`
                <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">You have joined the chat</p>
            `);
  } else {
    $("#chat-messages").append(`
                <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">${lastUser.username} has joined the chat</p>
            `);
  }

  socket.emit("singleUserPhoto", {
    userID: actualUser.id,
    username: actualUser.username,
  });

  socket.on("singleUserPhoto", function (data) {
    $("#sidebar_header").html(`
                <img src=${data.path} alt="User Photo" class="d-inline-block align-text-top rounded-circle avatar">
                <h3 class="mb-0 usernameInHeader">${data.username}</h3>
            `);
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
  $("#user-list").append(`
        <div class="card chat-preview w-100 mb-4">
              <div class="row g-0 w-100">
                <div class="col-md-2 d-flex justify-content-center align-items-center">
                  <img src="${data.path}" id="${data.userID}-img" alt="User Photo" class="d-inline-block align-text-top rounded-circle avatar me-5">
                </div>
                <div class="col-md-10 d-flex justify-content-center align-items-center">
                  <div class="card-body p-0 ps-3">
                    <input type="hidden" value="${data.userID}">
                    <h5 class="card-title list-username mb-0">${data.username}</h5>
                    <p class="card-text typing mt-2">Typing...</p>
                    <p class="card-text typingInPrivate mt-2">Typing in your DM...</p>
                  </div>
                </div>
              </div>
          </div>
        `);
});

// Cuando se desconecta un usuario
socket.on("userDisconnected", function (userData) {
  let userID = userData.id;
  let username = userData.username;
  $(`input[value="${userID}"]`).parent().parent().parent().parent().remove();
  $("#chat-messages").append(`
              <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">${username} has left the chat</p>
          `);
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
    $("#chat-messages").append(`
              <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
  } else {
    $("#chat-messages").append(`
              <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-0">${messageData.username}</h6>
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
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
    $("#private-chat-messages").append(`
              <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
  } else {
    $("#private-chat-messages").append(`
              <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-0">${messageData.username}</h6>
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
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
      $("#chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    } else {
      $("#chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    }
  }else{
    if (messageData.id === socket.id) {
      $("#chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
    } else {
      $("#chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
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
      $("#private-chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    } else {
      $("#private-chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    }
  }else{
    if (messageData.id === socket.id) {
      $("#private-chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
    } else {
      $("#private-chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
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

    $(".chat-group").append(`
          <div class="card chat-preview room-preview w-100 mb-4">
                <div class="row g-0 w-100">
                  <div class="col-md-2 d-flex justify-content-center align-items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Logo" class="d-inline-block align-text-top rounded-circle avatar">
                  </div>
                  <div class="col-md-10 d-flex justify-content-center align-items-center">
                    <div class="card-body p-0 ps-3">
                      <h5 class="card-title list-room mb-0">Back to <span id="roomNumberInCard">${room}</span></h5>
                    </div>
                  </div>
                </div>
            </div>
          `);

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