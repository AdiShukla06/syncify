import io from 'socket.io-client';

// Determine the correct URL based on the environment
const socketURL = process.env.NODE_ENV === 'production' 
  ? 'https://syncify-s8i1.onrender.com'  // Render deployed server
  : 'http://localhost:3001';             // Local development server

const socket = io(socketURL);

export default socket;
