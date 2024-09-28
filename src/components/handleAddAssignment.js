import { storage } from "../utils/firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";

const handleAddAssignment = async (file) => {
  if (!file) {
    console.error("No file selected");
    return;
  }

  // Sanitize the file name (optional but recommended)
  const sanitizedFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  
  try {
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `assignments/${sanitizedFileName}`);
    
    // Upload the file to the reference
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const fileUrl = await getDownloadURL(storageRef);

    // Add the document to Firestore with the file URL
    await addDoc(collection(db, "assignments"), {
      fileUrl, // Store the download URL
      // Add other relevant fields (e.g., title, description)
      createdAt: new Date(), // Example of additional field
    });

    console.log("Assignment added successfully!");
    return true; // Indicate success
  } catch (error) {
    console.error("Error uploading file or saving data:", error);
    return false; // Indicate failure
  }
};
