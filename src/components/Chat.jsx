import React, { useEffect, useState } from 'react';
import { auth, provider, db } from '../utils/firebase'; // Path to your firebase configuration
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import '../styles/chat.css'; // Import the CSS file

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Check for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch messages from Firestore
    const messagesRef = collection(db, 'messages');
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    // Cleanup the subscriptions
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
    if (message.trim() === '') return; // Prevent sending empty messages

    await addDoc(collection(db, 'messages'), {
      text: message,
      uid: user.uid,
      createdAt: new Date(),
    });

    setMessage(''); // Clear the input field after sending
  };

  return (
    <Box className="chat-container">
      <Typography variant="h4" align="center" className="chat-title">
        Chat Application
      </Typography>
      <Paper elevation={3} className="messages-paper">
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id} className="message-item">
              <Avatar className="message-avatar">{msg.uid[0]}</Avatar>
              <ListItemText
                primary={msg.text}
                secondary={`User ID: ${msg.uid}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      {user ? (
        <Box component="form" onSubmit={handleSendMessage} className="message-form">
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
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
