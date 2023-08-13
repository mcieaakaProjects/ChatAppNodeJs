const mysql= require('mysql2');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const logoutRoute = require('./routes/logoutRoute');
const landingPageRoute = require('./routes/landingPageRoute');
const userProfileRoute = require('./routes/userProfileRoute');
const homeRoute = require('./routes/homeRoute');
const chatPageRoute = require('./routes/chatPageRoute');
const middleware= require('./pageFiles/middleware');
const http = require('http');
const socketIO = require('socket.io');
const connection = require('./dbConnection');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);



app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('views'));
app.use(express.static('scripts'));

app.use('/', signupRoute);
app.use('/', loginRoute);
app.use('/', logoutRoute);
app.use('/', landingPageRoute);
app.use('/', userProfileRoute);
app.use('/', homeRoute);
app.use('/', middleware);
app.use('/', chatPageRoute);
// app.listen(3000, () => {
//   console.log('Listening on 3000');
// });

// signup/login---->welcome/landing page-->user profile-->logout

const connectedClients = new Set();

function broadcastChatMessage(senderSocket, senderId, senderUsername, message) {
  connectedClients.forEach((clientId) => {
    if (clientId !== senderId) {
      io.to(clientId).emit('chat message', {
        sender: senderUsername,
        message: message,
      });
    }
  });
}

io.on('connection', (socket) => {
  console.log('A user connected');

  connectedClients.add(socket.id);

    // Retrieve older messages from the database
    connection.query(
      'SELECT M.text_body, U.username AS sender FROM Message AS M ' +
      'JOIN userdetails AS U ON M.user_id = U.id ' +
      'WHERE M.chat_id = ? ' +
      'ORDER BY M.createdAt ASC',
      [1], // Replace with the appropriate chat ID
      (error, results) => {
        if (error) {
          console.error('Error fetching previous messages:', error);
        } else {
          // Emit the 'display messages' event to the client with the retrieved messages
          socket.emit('display messages', results);
        }
      }
    );


  socket.on('disconnect', () => {
    console.log('A user disconnected');
    connectedClients.delete(socket.id);
  });

  socket.on('authenticate', (username) => {
    if (username) {
      socket.user = {
        username: username,
      };
      console.log('User authenticated with username:', username);
    } else {
      socket.user = {
        username: null,
      };
      console.log('User not authenticated');
    }
  });

  socket.on('chat message', (message) => {
    if (socket.user && socket.user.username) {
     // const message = message;
      const senderUsername = socket.user.username;
  
      // Retrieve the user_id from the userdetails table based on the sender's username
      connection.query(
        'SELECT id FROM userdetails WHERE username = ?',
        [senderUsername],
        (error, results) => {
          if (error) {
            console.error('Error fetching user_id:', error);
          } else {
            if (results.length > 0) {
              const user_id = results[0].id;
  
              // Save the message to the database with the correct user_id
              connection.query(
                'INSERT INTO Message (chat_id, user_id, text_body) VALUES (?, ?, ?)',
                ['1', user_id, message],
                (error, results, fields) => {
                  if (error) {
                    console.error('Error saving message:', error);
                  } else {
                    // Broadcast the 'chat message' event to all connected clients (except the sender)
                    // broadcastChatMessage(socket, socket.id, socket.user.username, message);
                    const senderId= socket.id;
                    const senderUsername= socket.user.username;

                    connectedClients.forEach((clientId) => {
                      if (clientId !== senderId) {
                        io.to(clientId).emit('chat message', {
                          sender: senderUsername,
                          message: message,
                        });
                      }
                    });
                  }
                }
              );
            }
          }
        }
      );
    } else {
      console.log('Message sender not authenticated');
    }
  });
});


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });  
