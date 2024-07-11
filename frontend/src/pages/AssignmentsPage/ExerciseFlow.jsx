// ExerciseFlow.js

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Box, Typography, LinearProgress, Button } from '@mui/material';
import { updateAssignmentProgress } from '../../features/assignmentSlice';
import axios from 'axios';

// Import your exercise components
import DotEyeExercise from '../../components/Studies/reading_exercises/13-dot-eye/DotEyeExercise';
import GrowingObjects from '../../components/Studies/reading_exercises/growing-objects/GrowingObjects';
import OpeningObjects from '../../components/Studies/reading_exercises/opening-objects/OpeningObjects';

// Create a mapping of exercise types to components
const exerciseComponentMapping = {
  'dot-eye-exercise': DotEyeExercise,
  'growing-objects': GrowingObjects,
  'opening-objects': OpeningObjects,
};

const ExerciseFlow = ({ exercises, assignmentId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [intervalId, setIntervalId] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);

  useEffect(() => {
    // Fetch exercise data
    const fetchExerciseData = async () => {
      try {
        const response = await axios.get('/api/exercises/');
        setExerciseData(response.data);
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    fetchExerciseData();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalId);
    }
  }, [timeLeft, intervalId]);

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeLeft(600); // Reset timer to 10 minutes
      dispatch(updateAssignmentProgress({ assignmentId, progress: currentExerciseIndex + 1 }));
    } else {
      // Handle completion
      alert('All exercises completed!');
    }
  };

  if (!exerciseData) {
    return <Typography>Loading...</Typography>;
  }

  const currentExercise = exercises[currentExerciseIndex];
  const CurrentExerciseComponent = exerciseComponentMapping[currentExercise.type];

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Exercise {currentExerciseIndex + 1} of {exercises.length}
        </Typography>
        {CurrentExerciseComponent && <CurrentExerciseComponent />}
        <Box mt={4}>
          <Typography variant="h6">Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</Typography>
          <LinearProgress variant="determinate" value={(600 - timeLeft) / 6} />
        </Box>
        <Box mt={4}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNextExercise} 
            disabled={timeLeft > 0}
          >
            Next Exercise
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ExerciseFlow;
