import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import useCourseCalls from "../../service/useCourseCalls";
import { toastSuccessNotify, toastErrorNotify } from "../../helper/ToastNotify";
import "./NewCourse.css";

const NewCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postCourse, getCourses } = useCourseCalls();
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseLabel: "",
    courseContent: "",
    price: "",
    courseImage: "",
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCourseData((prevState) => ({
        ...prevState,
        courseImage: reader.result
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && value < 0) return; // Prevent negative values for price
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await postCourse(courseData);
      navigate("/nobelhizliokuma/admin-dashboard/kurslar");
    } catch (error) {
      toastErrorNotify("Failed to add course.");
    }
  };

  return (
    <Container>
      <Paper elevation={3} className="new-course-container">
        <Typography variant="h4" gutterBottom>Create New Course</Typography>
        <Box component="form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Course Name"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Course Label"
                name="courseLabel"
                value={courseData.courseLabel}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={courseData.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{ min: "0" }} // Prevent typing negative numbers
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Course Content"
                name="courseContent"
                value={courseData.courseContent}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={6}
                margin="normal"
                variant="outlined"
              />
              <Box
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Drop the files here...</p> :
                    <p>Drag & drop a course image here, or click to select one</p>
                }
              </Box>
              {courseData.courseImage && (
                <img
                  src={courseData.courseImage}
                  alt="Course"
                  className="course-image-preview"
                />
              )}
            </Grid>
          </Grid>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewCourse;
