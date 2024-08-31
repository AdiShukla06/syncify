require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');

const serviceAccount = require('./private.json');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.VITE_SOCKET_TYPE,
    project_id: process.env.VITE_SOCKET_PROJECT_ID,
    private_key_id: process.env.VITE_SOCKET_PRIVATE_KEY_ID,
    private_key: process.env.VITE_SOCKET_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.VITE_SOCKET_CLIENT_EMAIL,
    client_id: process.env.VITE_SOCKET_CLIENT_ID,
    auth_uri: process.env.VITE_SOCKET_AUTH_URI,
    token_uri: process.env.VITE_SOCKET_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.VITE_SOCKET_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.VITE_SOCKET_CLIENT_X509_CERT_URL,
  })
});

const firestore = admin.firestore();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
  });

  socket.on('sendMessage', async (messageData) => {
    const { projectId, message, timestamp, sender } = messageData;

    try {
      // Save to Firestore
      await firestore.collection('projects').doc(projectId).collection('messages').add({
        sender,
        message,
        timestamp
      });

      // Emit message to other clients
      io.to(projectId).emit('receiveMessage', messageData);
    } catch (error) {
      console.error('Error saving message to Firestore:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('Listening on *:3001');
});
