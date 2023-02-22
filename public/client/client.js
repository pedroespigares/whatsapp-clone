var socket = io();

      socket.on('connect', function(){
          socket.emit('setID',socket.id);
      });
      
      socket.on('usersConnected', function(users){
          $('#usersConnected').html(`Users connected: ${users}`);
      });

      $(document).on('click', '#addUsernameBtn', function(){
          socket.emit('addUsername', usernameInput.val());
          usernameInput.val('');
          $('body').addClass('container-fluid');
          $("body").html(`
            <div class="row">
                <aside class="col-4 p-0 m-0">
                    <header class="d-flex justify-content-between align-items-center sidebar-header">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Logo" class="avatar">
                        <div class="d-flex align-items-center justify-content-center gap-3">
                            <i class="fa-solid fa-users"></i>
                            <i class="fa-sharp fa-solid fa-circle-notch"></i>
                            <i class="fa-solid fa-message"></i>
                            <i class="fa-solid fa-ellipsis-v" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul class="dropdown-menu">
                            <li><a class="dropdown-item">Logout</a></li>
                            </ul>
                        </div>
                    </header>
                    <div class="d-flex flex-column justify-content-start align-items-center chat-group gap-3">
                        <!-- <div class="d-flex justify-content-center align-items-center gap-3 w-75 mt-3 mb-3 search-chat">
                        <i class="fa-solid fa-user-plus"></i>
                        <input id="usernameInput" type="text" class="form-control" placeholder="Change username">
                        <i id="addUsernameBtn" class="fa-solid fa-plus"></i>
                        </div> -->
                        <p id="usersConnected" class="text-center"></p>
                        <div id="user-list" class="align-self-start ps-5"></div>
                    </div>
                </aside>
                
                <main class="col-8 d-flex flex-column justify-content-start align-items-center p-0 m-0">
                    <header class="chat-header d-flex justify-content-between align-items-center w-100">
                        <div class="d-flex justify-content-center align-items-center gap-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Logo" class="avatar">
                            <h3 class="mb-0">Usuario</h3>
                        </div>
                        <div class="d-flex justify-content-center align-items-center gap-3 pe-4 search-in-chat">
                            <i class="fa-solid fa-search"></i>
                            <i class="fa-solid fa-ellipsis-v"></i>
                        </div>
                    </header>
                    <div id="chat-messages" class="chat-messages w-100 d-flex flex-column justify-content-start">

                    </div>
                    <div class="chat-type d-flex justify-content-evenly align-items-center w-100 gap-3 ps-3 pe-3 pt-3 pb-3">
                        <i class="fa-solid fa-face-smile"></i>
                        <i class="fa-solid fa-paperclip"></i>
                        <input id="newMessage" type="text" class="form-control" placeholder="Escribe un mensaje">
                        <i class="fa-solid fa-microphone"></i>
                    </div>
                </main>
            </div>`)
      });

      
      $(document).on('keyup', '#usernameInput', function(e){
          if(e.keyCode === 13){
              socket.emit('addUsername', $('#usernameInput').val());
              $('#usernameInput').val('');

            $('body').addClass('container-fluid');
            $("body").html(`
            <div class="row">
                <aside class="col-4 p-0 m-0">
                    <header class="d-flex justify-content-between align-items-center sidebar-header">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Logo" class="avatar">
                        <div class="d-flex align-items-center justify-content-center gap-3">
                            <i class="fa-solid fa-users"></i>
                            <i class="fa-sharp fa-solid fa-circle-notch"></i>
                            <i class="fa-solid fa-message"></i>
                            <i class="fa-solid fa-ellipsis-v" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul class="dropdown-menu">
                            <li><a class="dropdown-item">Logout</a></li>
                            </ul>
                        </div>
                    </header>
                    <div class="d-flex flex-column justify-content-start align-items-center chat-group gap-3">
                        <!-- <div class="d-flex justify-content-center align-items-center gap-3 w-75 mt-3 mb-3 search-chat">
                        <i class="fa-solid fa-user-plus"></i>
                        <input id="usernameInput" type="text" class="form-control" placeholder="Change username">
                        <i id="addUsernameBtn" class="fa-solid fa-plus"></i>
                        </div> -->
                        <p id="usersConnected" class="text-center"></p>
                        <div id="user-list" class="align-self-start ps-5"></div>
                    </div>
                </aside>
                
                <main class="col-8 d-flex flex-column justify-content-start align-items-center p-0 m-0">
                    <header class="chat-header d-flex justify-content-between align-items-center w-100">
                        <div class="d-flex justify-content-center align-items-center gap-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Logo" class="avatar">
                            <h3 class="mb-0">Usuario</h3>
                        </div>
                        <div class="d-flex justify-content-center align-items-center gap-3 pe-4 search-in-chat">
                            <i class="fa-solid fa-search"></i>
                            <i class="fa-solid fa-ellipsis-v"></i>
                        </div>
                    </header>
                    <div id="chat-messages" class="chat-messages w-100 d-flex flex-column justify-content-start">

                    </div>
                    <div class="chat-type d-flex justify-content-evenly align-items-center w-100 gap-3 ps-3 pe-3 pt-3 pb-3">
                        <i class="fa-solid fa-face-smile"></i>
                        <i class="fa-solid fa-paperclip"></i>
                        <input id="newMessage" type="text" class="form-control" placeholder="Escribe un mensaje">
                        <i class="fa-solid fa-microphone"></i>
                    </div>
                </main>
            </div>`)
          }
      });

      socket.on('newUserConnected', function(users){
          $('#user-list').html('');
          let lastUser = users[users.length - 1];
          $('#chat-messages').append(`
              <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">${lastUser.username} has joined the chat</p>
          `);
          users.forEach(function(user){
              $('#user-list').append(`
              <div class="card chat-preview w-100">
                    <div class="row g-0">
                      <div class="col-md-2 d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-user p-3 pe-5"></i>
                      </div>
                      <div class="col-md-10 d-flex justify-content-center align-items-center">
                        <div class="card-body p-0 ps-3">
                          <input type="hidden" value="${user.id}">
                          <h5 class="card-title mb-0">${user.username}</h5>
                        </div>
                      </div>
                    </div>
                </div>
              `);
          });
      });

      socket.on('userDisconnected', function(userData){
          let userID = userData.id;
          let username = userData.username;
          $(`input[value="${userID}"]`).parent().parent().parent().parent().remove();
          $('#chat-messages').append(`
              <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">${username} has left the chat</p>
          `);
          $('#chat-messages').animate({scrollTop: $('#chat-messages').prop("scrollHeight")}, 500);
      });

      $(document).on('keyup', '#newMessage', function(e){
          if(e.keyCode === 13){
              socket.emit('newMessage', $('#newMessage').val());
              $('#newMessage').val('');
          }
      });

      socket.on('newMessage', function(messageData){
          let formattedDate = new Date(messageData.date);
          let hours = formattedDate.getHours();
          let minutes = formattedDate.getMinutes();
          if(messageData.id === socket.id){
              $('#chat-messages').append(`
              <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
          }else{
              $('#chat-messages').append(`
              <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-0">${messageData.username}</h6>
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
          }
          
          $(".single-message-username").css('color', "#ee50af");
          $('#chat-messages').animate({scrollTop: $('#chat-messages').prop("scrollHeight")}, 500);
      })