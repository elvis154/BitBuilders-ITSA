import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, onSnapshot } from "firebase/firestore"; 
import { db as firestore } from "../utils/firebase"; 

const ChatComponent = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State for messages
  const [recipients, setRecipients] = useState([]); // State for available recipients
  const [selectedUser, setSelectedUser] = useState(""); // State for selected recipient
  const navigate = useNavigate();

  // Fetch current user from Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setPhotoURL(currentUser.photoURL || "");

        // Fetch additional user info from Firestore
        try {
          const userRef = doc(firestore, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserInfo(userSnap.data());
          } else {
            console.log("No such user!");
          }
        } catch (error) {
          console.log("Error getting user info:", error);
        }

        // Fetch recipients from Firestore
        const usersCollection = collection(firestore, "users");
        onSnapshot(usersCollection, (snapshot) => {
          const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecipients(userList.filter(u => u.id !== currentUser.uid)); // Exclude current user
        });
        
        // Listen for new messages
        const messagesCollection = collection(firestore, "messages");
        onSnapshot(messagesCollection, (snapshot) => {
          const msgList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMessages(msgList);
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle new message send
  const handleSendMessage = async () => {
    if (message.trim() === "" || !selectedUser) return;

    const messageObj = {
      text: message,
      sender: displayName,
      recipient: selectedUser,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(firestore, "messages"), messageObj);
      setMessage(""); // Clear the message input after sending
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  // Filter messages for the selected user
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.recipient === selectedUser && msg.sender === displayName) ||
      (msg.sender === selectedUser && msg.recipient === displayName)
  );

  // Rendering chat interface
  return (
    <div className="chat-container">
      {user && userInfo ? (
        <>
          <div className="chat-header">
            <img
              src={photoURL || userInfo.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="avatar"
            />
            <h3>{displayName || userInfo.name}</h3>
          </div>

          <div className="recipient-select">
            <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
              <option value="">Select Recipient</option>
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="chat-box">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender === displayName ? "sent" : "received"}`}>
                <p><strong>{msg.sender}:</strong> {msg.text}</p>
              </div>
            ))}
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update message state
            />
            <button onClick={handleSendMessage}>Send</button> {/* Send button */}
          </div>
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default ChatComponent;
