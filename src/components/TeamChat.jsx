import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import socket from '../socket';
import { getAuth } from 'firebase/auth';
import { setTheme, clearUser } from '../redux/authSlice'; 


const TeamChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const projectId = useSelector((state) => state.project.currentProject.id);
  const user = useSelector((state) => state.auth.user);
  const firestore = getFirestore();
  const messagesEndRef = useRef(null);
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const theme = useSelector((state) => state.auth.theme); 


  useEffect(() => {
    // Fetch historical messages on component mount
    const fetchMessages = async () => {
      const messagesQuery = query(collection(firestore, 'projects', projectId, 'messages'), orderBy('timestamp'));
      const querySnapshot = await getDocs(messagesQuery);
      const fetchedMessages = querySnapshot.docs.map(doc => doc.data());

      setMessages(fetchedMessages);
      scrollToBottom(); // Scroll to bottom after loading historical messages
    };

    fetchMessages();
  }, [firestore, projectId]);

  useEffect(() => {
    // Handle real-time updates via socket
    socket.emit('joinProject', projectId);

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      scrollToBottom(); // Scroll to bottom after receiving a new message
    });

    return () => {
      socket.off('receiveMessage'); // Clean up the event listener when the component unmounts
    };
  }, [projectId]);

  const sendMessage = async () => {
    const senderName = firebaseUser.displayName || "Anonymous";

    const messageData = {
      projectId,
      message,
      sender: senderName,
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit('sendMessage', messageData); // Emit message via socket
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Use this effect to ensure the chat loads from the bottom when first rendered
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`flex flex-col h-full p-4  shadow-lg ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-950 text-gray-100'}`}>
      <div className={`flex-grow overflow-y-auto mb-4 p-2  rounded-lg shadow-inner ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-black text-gray-100'}`}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 flex ${msg.sender === firebaseUser.displayName ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === firebaseUser.displayName ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
              <strong>{msg.sender}:</strong> <span>{msg.message}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex sticky bottom-3">
        <input
          type="text"
          className={`flex-grow p-3 rounded-l-lg border border-gray-600  focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-950 text-gray-100'}`}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }} // Send message on Enter key press
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeamChat;
