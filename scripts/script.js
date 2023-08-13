const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

const socket = io();
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get the authenticated username from the cookie
const username = getCookie('username') || '';
socket.emit('authenticate', username);
let lastSenderId = null; // Track the last sender's ID to avoid duplication


//this is original
// function appendMessage(sender, message, messageType) {
//     const messageDiv = document.createElement('div');
//     const messageClass = messageType === 'sent' ? 'sent' : 'received';
//     messageDiv.innerHTML = `<div class="message ${messageClass}" ><strong>${sender}:</strong> ${message}</div><br>`;

//     if (messageType === 'sent') {
//         messageDiv.classList.add('sent-message');
//       } else {
//         messageDiv.classList.add('received-message');
//       }

//     chatWindow.appendChild(messageDiv);
//     chatWindow.scrollTop = chatWindow.scrollHeight;
// }

function appendMessage(sender, message, messageType) {
    const messageDiv = document.createElement('div');
    const messageClass = messageType === 'sent' ? 'sent' : 'received';
    messageDiv.innerHTML = `<div class="message ${messageClass}" ><strong>${sender}:</strong> ${message}</div><br>`;
    
    // Add alignment CSS class based on messageType
    if (messageType === 'sent') {
        messageDiv.classList.add('sent-message');
    } else {
        messageDiv.classList.add('received-message');
    }

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

//this is the original
sendButton.addEventListener('click', (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (message !== '') {
        appendMessage('You', message, 'sent');
        socket.emit('chat message', message); // Send the message to the server
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});


socket.on('chat message', (data) => {
  // 'data' object now contains 'sender' and 'message'
  appendMessage(data.sender, data.message, 'received');
});

// Add a listener for the 'display messages' event
socket.on('display messages', (messages) => {
    // 'messages' should be an array of message objects
    messages.forEach((message) => {
      // Append each message to the chat window
      messageType = message.sender === 'You' ? 'sent' : 'received';
      appendMessage(message.sender, message.text_body, 'received');
    });
  });
  