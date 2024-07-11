import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import ReactLoading from 'react-loading';
import useAssignmentCalls from '../../service/useAssignmentCalls';
import { useNavigate } from 'react-router-dom';

const StudentAssignments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { getAssignmentsByStudent } = useAssignmentCalls();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const data = await getAssignmentsByStudent(user._id);
        if (data && Array.isArray(data)) {
          setAssignments(data);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    if (user._id) {
      fetchAssignments();
    }
  }, [dispatch]);

  const handleStartAssignment = (assignment) => {
    console.log(assignment.taskContent);
    navigate('/nobelhizliokuma/ders', { state: { exercises: assignment.taskContent, lessonId: assignment._id, lessonType: "assignment" } });
  };

  if (loading) return <ReactLoading type="bubbles" color="#000" />;

  const activeAssignments = assignments.filter(assignment => !assignment.isDone);
  const completedAssignments = assignments.filter(assignment => assignment.isDone);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Assignments</Typography>
      {activeAssignments.length === 0 ? (
        <Typography variant="h6" gutterBottom>Aktif ödev bulunmamaktadır.</Typography>
      ) : (
        activeAssignments.map(assignment => (
          <Card key={assignment._id} style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h5">{assignment.taskContent.join(', ')}</Typography>
              <Typography variant="body2" color="textSecondary">
                Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleStartAssignment(assignment)}>
                Start Assignment
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      {completedAssignments.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>Geçmiş Ödevler</Typography>
          {completedAssignments.map(assignment => (
            <Card key={assignment._id} style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h5">{assignment.taskContent.join(', ')}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default StudentAssignments;
