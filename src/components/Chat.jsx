import React, { useEffect, useState, useRef } from 'react';
import { auth, provider, db } from '../utils/firebase';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import '../styles/chat.css';

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Reference for auto scroll

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      scrollToBottom();
    });

    return () => {
      unsubscribe();
      unsubscribeMessages();
    };
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '' || !user) return;

    await addDoc(collection(db, 'messages'), {
      text: message,
      uid: user.uid,
      userName: user.displayName,
      createdAt: new Date(),
    });

    setMessage('');
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box className="chat-page">
      <Typography variant="h4" className="chat-title">
        Real-Time Chat
      </Typography>
      <Paper elevation={3} className="messages-paper">
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.uid === user?.uid ? 'sent' : 'received'}`}
            >
              <strong>{msg.userName}</strong>: {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Paper>
      {user ? (
        <Box component="form" onSubmit={handleSendMessage} className="chat-form">
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <Button variant="contained" type="submit" className="send-button">
            Send
          </Button>
        </Box>
      ) : (
        <Button variant="contained" onClick={handleLogin} className="login-button">
          Login with Google
        </Button>
      )}
    </Box>
  );
};

export default Chat;
