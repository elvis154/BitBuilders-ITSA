import React, { useEffect, useState } from 'react';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../styles/chatbox.css';

const ChatBox = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Ensure selectedUser is defined
  const chatId = selectedUser ? [currentUser.uid, selectedUser.uid].sort().join("_") : "";

  // Fetch chat messages and listen for updates
  useEffect(() => {
    if (chatId) {
      const q = query(
        collection(db, "chats"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map(doc => doc.data());
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [chatId]);

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() === "" || !selectedUser || !selectedUser.uid) return;

    try {
      await addDoc(collection(db, "chats"), {
        chatId,
        text: inputMessage,
        senderId: currentUser.uid,
        receiverId: selectedUser.uid,
        timestamp: new Date(),
        isRead: false,
      });

      setInputMessage(""); // Clear input after sending
      setIsTyping(false);  // Stop typing indicator
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle typing status
  const handleTyping = () => {
    setIsTyping(true);
  };

  // Upload file (image)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser || !selectedUser.uid) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {
        setUploading(true);
      },
      (error) => {
        console.error("File upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          await addDoc(collection(db, "chats"), {
            chatId,
            text: "",
            senderId: currentUser.uid,
            receiverId: selectedUser.uid,
            timestamp: new Date(),
            isRead: false,
            fileUrl: downloadURL,
            fileType: file.type,
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === currentUser.uid ? "user" : "other"}`}>
            {message.text}
            {message.fileUrl && (
              <div className="file-preview">
                {message.fileType.startsWith("image") ? (
                  <img src={message.fileUrl} alt="uploaded-file" />
                ) : (
                  <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">Download File</a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="typing-indicator">
        {isTyping && <p>Typing...</p>}
      </div>
      <form onSubmit={handleSendMessage} className="chatbox-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleTyping}
        />
        <input type="file" onChange={handleFileUpload} />
        <button type="submit" disabled={uploading}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
