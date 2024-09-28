// ChatApp.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import ChatBox from './ChatBox';
import ChatList from './ChatList';
import '../styles/chatapp.css';

const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="chatapp-container">
      {currentUser ? (
        <>
          <ChatList currentUser={currentUser} selectChat={setSelectedUser} />
          {selectedUser ? (
            <ChatBox currentUser={currentUser} selectedUser={selectedUser} />
          ) : (
            <div className="no-chat-selected">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </>
      ) : (
        <div className="no-user-logged-in">
          <p>Please log in to access chat features.</p>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
