import { io } from 'socket.io-client';

const socket = io(process.env.NODE_ENV === 'production' 
    ? 'https://syncify-s8i1.onrender.com/' 
    : 'http://localhost:3001');
