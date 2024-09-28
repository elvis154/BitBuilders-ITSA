// ChatList.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import '../styles/chatlist.css';

const ChatList = ({ currentUser, selectChat }) => {
  const [users, setUsers] = useState([]);

  // Fetch users and track online status
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      const usersList = usersCollection.docs
        .map(doc => ({ ...doc.data(), id: doc.id })) // Ensure we have a unique ID
        .filter(user => user.uid !== currentUser.uid);
      setUsers(usersList);
    };

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id })) // Ensure we have the document's ID
        .filter(user => user.uid !== currentUser.uid);
      setUsers(usersList);
    });

    fetchUsers();

    // Set current user's status to online
    const userStatusRef = doc(db, "users", currentUser.uid);
    updateDoc(userStatusRef, { isOnline: true });

    return () => {
      updateDoc(userStatusRef, { isOnline: false });
    };
  }, [currentUser]);

  return (
    <div className="chatlist-container">
      <h3>Available Users</h3>
      <ul>
        {users.map((user) => (
          // Use user.uid or fallback to user.id as a unique key
          <li key={user.uid || user.id} onClick={() => selectChat(user)}>
            {user.name}
            {user.isOnline ? (
              <span className="online-status">Online</span>
            ) : (
              <span className="offline-status">Offline</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
