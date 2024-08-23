const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');

const serviceAccount = require('../private.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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
