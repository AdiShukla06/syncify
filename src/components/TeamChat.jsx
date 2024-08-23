// src/components/TeamChat.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import socket from '../socket';

const TeamChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const projectId = useSelector((state) => state.project.currentProject.id);
  const user = useSelector((state) => state.auth.user);
  const firestore = getFirestore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          setUserName('Anonymous');
        }
      }
    };

    fetchUserName();
  }, [user?.uid, firestore]);

  useEffect(() => {
    socket.emit('joinProject', projectId);

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      scrollToBottom();
    });

    return () => {
      socket.off('receiveMessage'); // Clean up the event listener when component unmounts
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
    const senderName = userName || "Anonymous";

    const messageData = {
      projectId,
      message,
      sender: senderName,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(firestore, 'projects', projectId, 'messages'), messageData);
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
          onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }} // Send message on Enter key press
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TeamChat;
