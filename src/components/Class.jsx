import React, { useState } from 'react';
import PopUp from '../components/Pop';
import '../styles/class.css';

const Class = () => {
  const [members, setMembers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const addMember = (memberData) => {
    if (members.length < 100) {
      setMembers([...members, memberData]);
    } else {
      alert('You have reached the limit of 100 members!');
    }
  };

  return (
    <div className="class-container">
      <h2>Class Information</h2>
      <table>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td>{member.className}</td>
              <td>{member.studentRollNo}</td>
              <td>{member.studentName}</td>
              <td>{member.studentEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-more-btn" onClick={togglePopup}>
        Add More Members
      </button>
      {isPopupOpen && <PopUp togglePopup={togglePopup} addMember={addMember} />}
    </div>
  );
};

export default Class;