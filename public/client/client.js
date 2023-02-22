var socket = io();

      socket.on('connect', function(){
          socket.emit('setID',socket.id);
      });
      
      var usernameInput = $('#usernameInput');
      var addUsernameBtn = $('#addUsernameBtn');
      var messageInput = $('#newMessage');


      socket.on('usersConnected', function(users){
          $('#usersConnected').html(`Users connected: ${users}`);
      });

      addUsernameBtn.on('click', function(){
          socket.emit('addUsername', usernameInput.val());
          usernameInput.val('');
      });

      usernameInput.on('keyup', function(e){
          if(e.keyCode === 13){
              socket.emit('addUsername', usernameInput.val());
              usernameInput.val('');

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
      });

      messageInput.on('keyup', function(e){
          if(e.keyCode === 13){
              socket.emit('newMessage', messageInput.val());
              messageInput.val('');
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
      })
