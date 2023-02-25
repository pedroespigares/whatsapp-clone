export class Views {
    chatView(room){
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
    }

    selfJoinedChat(){
        $("#chat-messages").append(`
                <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">You have joined the chat</p>
            `);
    }

    otherJoinedChat(user){
        $("#chat-messages").append(`
                <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">${user} has joined the chat</p>
            `);
    }

    userDisconnected(username){
        $("#chat-messages").append(`
              <p class="chat-notification text-center mt-4 mb-4 me-4 p-2 w-25 align-self-center">${username} has left the chat</p>
          `);
    }

    changeSidebarHeader(path, username){
        $("#sidebar_header").html(`
                <img src=${path} alt="User Photo" class="d-inline-block align-text-top rounded-circle avatar">
                <h3 class="mb-0 usernameInHeader">${username}</h3>
            `);
    }

    addIntoUserList(data){
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
    }

    selfMessage(messageData, hours, minutes){
        $("#chat-messages").append(`
              <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
    }

    selfPrivateMessage(messageData, hours, minutes){
        $("#private-chat-messages").append(`
              <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
    }

    otherUserMessage(messageData, hours, minutes){
        $("#chat-messages").append(`
              <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-0">${messageData.username}</h6>
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
    }

    otherUserPrivateMessage(messageData, hours, minutes){
        $("#private-chat-messages").append(`
              <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-0">${messageData.username}</h6>
                  <p class="single-message-content m-0">${messageData.message}</p>
                  <p class="single-message-date mb-0 align-self-end">${hours}:${minutes}</p>
              </div>
              `);
    }

    selfMessageWithImg(messageData, hours, minutes){
        $("#chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    }

    selfPrivateMessageWithImg(messageData, hours, minutes){
        $("#private-chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    }

    otherUserMessageWithImg(messageData, hours, minutes){
        $("#chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    }

    otherUserPrivateMessageWithImg(messageData, hours, minutes){
        $("#private-chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <img src=${messageData.path}>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download" title="Download file"></i>
                </div>
                `);
    }

    selfMessageWithFile(filename, hours, minutes){
        $("#chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
    }

    selfPrivateMessageWithFile(filename, hours, minutes){
        $("#private-chat-messages").append(`
                <div class="single-message-my-user mt-4 mb-4 me-4 p-3 align-self-end d-flex flex-column">
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
    }

    otherUserMessageWithFile(messageData, filename, hours, minutes){
        $("#chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
    }

    otherUserPrivateMessageWithFile(messageData, filename, hours, minutes){
        $("#private-chat-messages").append(`
                <div class="single-message-other-user mt-4 mb-4 ms-4 p-3 align-self-start d-flex flex-column gap-2">
                  <h6 class="single-message-username mb-2">${messageData.username}</h6>
                    <p class="single-message-content fileNotImg m-0">${filename}</p>
                    <p class="single-message-date mt-2 mb-2 align-self-end">${hours}:${minutes}</p>
                    <i class="fa-solid fa-download"></i>
                </div>
                `);
    }

    addRoomToList(room){
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
    }
}