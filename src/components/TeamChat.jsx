import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const socket = io('http://localhost:3001');

const TeamChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const projectId = useSelector((state) => state.project.currentProject.id);
  const user = useSelector((state) => state.auth.user); // Get the current user from Redux state
  const firestore = getFirestore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinProject', projectId);

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesQuery = query(collection(firestore, 'projects', projectId, 'messages'), orderBy('timestamp'));
      const querySnapshot = await getDocs(messagesQuery);
      const fetchedMessages = querySnapshot.docs.map(doc => doc.data());

      setMessages(fetchedMessages);
      scrollToBottom();
    };

    fetchMessages();
  }, [firestore, projectId]);

  const sendMessage = async () => {
    // Ensure the sender's name is defined
    const senderName = user?.name || "Anonymous"; // Fallback to "Anonymous" if user.name is undefined

    const messageData = {
      projectId,
      message,
      sender: senderName, // Use the validated name
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to Firebase
      await addDoc(collection(firestore, 'projects', projectId, 'messages'), messageData);

      // Emit message to other clients
      socket.emit('sendMessage', messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TeamChat;
