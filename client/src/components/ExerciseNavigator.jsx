import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import ProgressBar from '../components/ProgressBar';
import useStageCalls from '../service/useStageCalls';
import useAssignmentCalls from '../service/useAssignmentCalls';
import DotEyeExercise from '../components/Studies/reading_exercises/13-dot-eye/DotEyeExercise';
import GrowingObjects from '../components/Studies/reading_exercises/growing-objects/GrowingObjects';
import SimilarWords from '../components/Studies/reading_exercises/similar-words/SimilarWords';
import OpeningObjects from '../components/Studies/reading_exercises/opening-objects/OpeningObjects';
import SpeedReadingTest from '../components/Studies/reading_tests/SpeedReadingExercise';

const ExerciseNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exercises = location.state.exercises || [];
  const lessonId = location.state.lessonId;
  const lessonType = location.state.lessonType;
  const [currentStep, setCurrentStep] = useState(0);
  const { updateStageStatus } = useStageCalls();
  const { updateAssignmentStatus } = useAssignmentCalls();


  const handleNext = async () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
        if (lessonType == "progress") {
          await updateStageStatus(lessonId, true) 
          navigate('/nobelhizliokuma/ilerlemeler');
        }
        if (lessonType == "assignment") {
          await updateAssignmentStatus(lessonId, true) 
          navigate('/nobelhizliokuma/odevler');
        }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderExercise = (exerciseTitle) => {
    switch (exerciseTitle) {
      case '13 Nokta Göz Egzersizi':
        return <DotEyeExercise />;
      case 'Büyüyen Şekiller':
        return <GrowingObjects />;
      case 'Benzer Kelimeler':
        return <SimilarWords />;
      case 'Açılan Nesneler':
        return <OpeningObjects />;
      case 'Okuma Testi':
        return <SpeedReadingTest />;
      default:
        return <Typography variant="h5">Bilinmeyen Egzersiz</Typography>;
    }
  };

  const steps = exercises.map((exercise, index) => ({
    name: exercise.title,
    status: index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'
  }));

  return (
    <Container style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {exercises.map((exercise, index) => (
              <span key={index}>{exercise}{index < exercises.length - 1 ? ', ' : ''}</span>
            ))}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
        <Box>
          {renderExercise(exercises[currentStep])}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <IconButton onClick={handleBack} disabled={currentStep === 0}>
          <ArrowBackIcon />
        </IconButton>
        <ProgressBar steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <IconButton onClick={handleNext}>
          {currentStep === exercises.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
        </IconButton>
      </Box>
    </Container>
  );
};

export default ExerciseNavigator;
