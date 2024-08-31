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
    type: String(import.meta.env.VITE_SOCKET_TYPE),
    project_id: String(import.meta.env.VITE_SOCKET_PROJECT_ID),
    private_key_id: String(import.meta.env.VITE_SOCKET_PRIVATE_KEY_ID),
    private_key: String(import.meta.env.VITE_SOCKET_PRIVATE_KEY.replace(/\\n/g, '\n')),
    client_email: String(import.meta.env.VITE_SOCKET_CLIENT_EMAIL),
    client_id: String(import.meta.env.VITE_SOCKET_CLIENT_ID),
    auth_uri: String(import.meta.env.VITE_SOCKET_AUTH_URI),
    token_uri: String(import.meta.env.VITE_SOCKET_TOKEN_URI),
    auth_provider_x509_cert_url: String(import.meta.env.VITE_SOCKET_AUTH_PROVIDER_X509_CERT_URL),
    client_x509_cert_url: String(import.meta.env.VITE_SOCKET_CLIENT_X509_CERT_URL),
  })
});

const firestore = admin.firestore();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173', // Local development
      'https://syncify-pink.vercel.app' // Deployed Vercel app
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

app.use(cors((req, callback) => {
  const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://syncify-pink.vercel.app' // Deployed Vercel app
  ];
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true });
  } else {
    callback(null, { origin: false });
  }
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
