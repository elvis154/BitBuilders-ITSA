import React, { useState } from 'react';
import '../styles/pop.css';

const PopUp = ({ togglePopup, addMember }) => {
  const [className, setClassName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create member data
    const memberData = {
      className,
      studentRollNo: parseInt(studentRollNo), // Ensure Roll No is a number
      studentName,
      studentEmail,
    };

    try {
      // Add member to class
      await addMember(memberData);
      // Clear inputs
      setClassName('');
      setStudentRollNo('');
      setStudentName('');
      setStudentEmail('');
      togglePopup();
    } catch (err) {
      // Handle error, e.g., show an error message
      setError('Failed to add member. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Create a Class</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Class Name:
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </label>
          <label>
            Student Roll No:
            <input
              type="number"
              value={studentRollNo}
              onChange={(e) => setStudentRollNo(e.target.value)}
              required
            />
          </label>
          <label>
            Student Name:
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </label>
          <label>
            Student Email:
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
          </label>
          <div className="button-container">
            <button type="submit">Submit</button>
            <button type="button" className="close-button" onClick={togglePopup}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
