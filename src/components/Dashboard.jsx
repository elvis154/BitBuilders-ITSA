import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
  Stack,
  Box,
  CardActions,
} from '@mui/material';
import Calendar from '../components/Calendar.jsx';
import { db, storage } from '../utils/firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    file: null,
  });
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  // Fetch subjects and assignments from Firebase when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map((doc) => doc.data().name);
      setSubjects(subjectsList);
    };

    const fetchAssignments = async () => {
      const assignmentsCollection = collection(db, 'assignments');
      const assignmentsSnapshot = await getDocs(assignmentsCollection);
      const assignmentsList = assignmentsSnapshot.docs.map((doc) => doc.data());
      setAssignments(assignmentsList);
    };

    fetchSubjects();
    fetchAssignments();
  }, []);

  // Function to add a new subject
  const addSubject = async () => {
    if (newSubject.trim() !== '') {
      await addDoc(collection(db, 'subjects'), { name: newSubject });
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  // Function to handle adding a new assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (newAssignment.title && newAssignment.dueDate) {
      try {
        // Check if there is a file to upload
        let fileURL = null;
        if (newAssignment.file) {
          const sanitizedFileName = newAssignment.file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
          const storageRef = ref(storage, `assignments/${sanitizedFileName}`);
          await uploadBytes(storageRef, newAssignment.file);
          fileURL = await getDownloadURL(storageRef);
        }

        // Add new assignment to Firestore
        await addDoc(collection(db, 'assignments'), {
          title: newAssignment.title,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
          fileURL: fileURL || null, // Store the download URL or null
        });

        // Update state and reset form
        setAssignments([...assignments, { ...newAssignment, fileURL }]);
        setNewAssignment({
          title: '',
          description: '',
          dueDate: '',
          file: null,
        });
        setShowAssignmentForm(false);
        alert('Assignment added successfully!');
      } catch (error) {
        console.error('Error uploading file or saving data:', error);
        alert('Failed to add assignment. Please try again.');
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAssignment({ ...newAssignment, file });
    }
  };

  return (
    <Box
      className="dashboard"
      sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh', maxHeight: '90vh', overflowY: 'auto' }}
    >
      <Typography variant="h3" color="primary" sx={{ mb: 4 }}>
        TE cmpn B
      </Typography>

      <Grid container spacing={4}>
        {/* Subjects Menu */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardHeader title="Subjects" />
            <CardContent>
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {subjects.map((subject, index) => (
                  <li key={index} style={{ marginBottom: '1rem' }}>
                    <Typography variant="h6" color="textSecondary">
                      {subject}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="New Subject"
                  variant="outlined"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" color="primary" onClick={addSubject}>
                  Add
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignments Section */}
        <Grid item xs={12} sm={8}>
          <Card>
            <CardHeader title="Assignments to be submitted" />
            <CardContent>
              <Calendar />
              <Button
                variant="outlined"
                onClick={() => setShowAssignmentForm(true)}
                sx={{
                  mt: 2,
                  borderColor: '#5D7AF5',
                  color: '#5D7AF5',
                  '&:hover': {
                    backgroundColor: '#5D7AF5',
                    color: 'white',
                  },
                }}
              >
                Add
              </Button>

              {showAssignmentForm && (
                <form onSubmit={handleAddAssignment} style={{ marginTop: '1rem' }}>
                  <TextField
                    label="Title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Description"
                    multiline
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Due Date"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <input type="file" onChange={handleFileUpload} />
                  <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
                    Submit
                  </Button>
                </form>
              )}

              {/* Assignment List */}
              {assignments.length > 0 && (
                <Box
                  className="assignments-section"
                  sx={{ mt: 4, maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}
                >
                  {assignments.map((assignment, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{assignment.title}</Typography>
                        <Typography>{assignment.description}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Due:</strong> {assignment.dueDate}
                        </Typography>
                        {assignment.fileURL && (
                          <CardActions>
                            <a href={assignment.fileURL} target="_blank" rel="noopener noreferrer">
                              View File
                            </a>
                            <a href={assignment.fileURL} download={assignment.fileURL.split('/').pop()}>
                              Download File
                            </a>
                          </CardActions>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
