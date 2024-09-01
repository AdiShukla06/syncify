import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import admin from 'firebase-admin';
import cors from 'cors';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: String(process.env.VITE_SOCKET_TYPE),
    project_id: String(process.env.VITE_SOCKET_PROJECT_ID),
    private_key_id: String(process.env.VITE_SOCKET_PRIVATE_KEY_ID),
    private_key: String(process.env.VITE_SOCKET_PRIVATE_KEY.replace(/\\n/g, '\n')),
    client_email: String(process.env.VITE_SOCKET_CLIENT_EMAIL),
    client_id: String(process.env.VITE_SOCKET_CLIENT_ID),
    auth_uri: String(process.env.VITE_SOCKET_AUTH_URI),
    token_uri: String(process.env.VITE_SOCKET_TOKEN_URI),
    auth_provider_x509_cert_url: String(process.env.VITE_SOCKET_AUTH_PROVIDER_X509_CERT_URL),
    client_x509_cert_url: String(process.env.VITE_SOCKET_CLIENT_X509_CERT_URL),
  })
});

const firestore = admin.firestore();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://syncify-pink.vercel.app', // Deployed Vercel app
  'http://localhost:5173' // Local development
   
];

// Setup CORS for Express
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

// Setup CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

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

