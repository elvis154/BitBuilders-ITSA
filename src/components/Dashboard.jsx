import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions, 
  Grid, 
  TextField, 
  Typography, 
  Stack, 
  Box 
} from '@mui/material';
import Calendar from '../components/Calendar.jsx';

const Dashboard = () => {
  const [subjects, setSubjects] = useState(['Software Engineering', 'Computer Networking']);
  const [newSubject, setNewSubject] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    file: null,
    fileURL: null // Store URL for viewing and downloading
  });

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const addSubject = () => {
    if (newSubject.trim() !== '') {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (newAssignment.title && newAssignment.dueDate) {
      setAssignments([...assignments, newAssignment]);
      setNewAssignment({
        title: '',
        description: '',
        dueDate: '',
        file: null,
        fileURL: null
      });
      setShowAssignmentForm(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Generate URL for the file
      setNewAssignment({ ...newAssignment, file, fileURL });
    }
  };

  return (
    <Box className="dashboard" sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
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
                  borderColor: '#5D7AF5', // Set the border color
                  color: '#5D7AF5', // Set the text color
                  '&:hover': {
                    backgroundColor: '#5D7AF5', // Background color on hover
                    color: 'white', // Text color on hover
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
                      shrink: true
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
                <Box sx={{ mt: 4 }}>
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
                            <a href={assignment.fileURL} download={assignment.file.name}>
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
