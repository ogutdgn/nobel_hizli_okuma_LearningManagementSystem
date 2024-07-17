import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, Card, CardContent, CardActions, Button, Typography, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import ReactLoading from 'react-loading';
import useCourseCalls from "../../service/useCourseCalls";

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getCourses, removeCourse } = useCourseCalls();
  const { courses, loading, error } = useSelector(state => state.course);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getCourses();
  }, [dispatch]);

  const handleDelete = async (courseId) => {
    if (!deleting) {
      setDeleting(true);
      try {
        await dispatch(removeCourse(courseId));
        getCourses();
      } catch (e) {
        console.error(e);
      } finally {
        setDeleting(false);
      }
    }
  };
  

  const handleAddCourse = () => {
    navigate("/nobelhizliokuma/admin-dashboard/yeni-kurs");
  };

  const handleEditCourse = (courseId) => {
    navigate(`${courseId}`);
  };

  if (loading) return <ReactLoading type="bubbles" color="#000" />;
  if (error) return <p>Error loading courses.</p>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Courses</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddCourse}
        style={{ marginBottom: "20px" }}
      >
        Add Course
      </Button>
      <Grid container spacing={3}>
        {courses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" component="div">
                    {course.courseName}
                  </Typography>
                  {course.isPublish ? (
                    <PublishedWithChangesIcon style={{ color: 'green' }} />
                  ) : (
                    <UnpublishedIcon style={{ color: 'grey' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {course.courseContent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.courseLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${course.price}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEditCourse(course._id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(course._id)} color="secondary" disabled={deleting}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses;
