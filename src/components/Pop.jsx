import React, { useState } from 'react';
import '../styles/pop.css';

const PopUp = ({ togglePopup, addMember }) => {
  const [className, setClassName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add member to class
    const memberData = {
      className,
      studentRollNo,
      studentName,
      studentEmail,
    };

    addMember(memberData);

    // Clear inputs and close popup
    setClassName('');
    setStudentRollNo('');
    setStudentName('');
    setStudentEmail('');
    togglePopup();
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Create a Class</h2>
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
