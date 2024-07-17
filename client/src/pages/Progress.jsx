import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardContent, Typography, Box, Button, IconButton } from "@mui/material";
import ReactLoading from 'react-loading';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useEnrollmentCalls from "../service/useEnrollmentCalls";
import useStageCalls from "../service/useStageCalls";
import { motion } from "framer-motion";

const Progress = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { getEnrollmentsByStudent } = useEnrollmentCalls();
  const { getStagesByCourse, updateStageIsDone } = useStageCalls();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({});
  const [currentStageIndex, setCurrentStageIndex] = useState({});

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      const enrollmentsData = await getEnrollmentsByStudent(user._id);
      setEnrollments(enrollmentsData);
      setLoading(false);
    };
    if (user._id) {
      fetchEnrollments();
    }
  }, [user._id]);

  useEffect(() => {
    const fetchStages = async () => {
      for (const enrollment of enrollments) {
        const stages = await getStagesByCourse(enrollment.courseId._id);
        const totalStages = stages.length;
        const completedStages = stages.filter(stage => stage.isDone).length;
        const firstIncompleteStage = stages.findIndex(stage => !stage.isDone);
        setProgressData(prevData => ({
          ...prevData,
          [enrollment.courseId._id]: {
            stages,
            totalStages,
            completedStages,
            percentage: (completedStages / totalStages) * 100,
            currentStageIndex: firstIncompleteStage === -1 ? totalStages - 1 : firstIncompleteStage,
          },
        }));
      }
    };
    if (enrollments.length > 0) {
      fetchStages();
    }
  }, [enrollments]);

  const handleStartStage = (courseId, stageIndex) => {
    const stage = progressData[courseId].stages[stageIndex];
    console.log(stage._id);
    navigate('/nobelhizliokuma/ders', { state: { exercises: stage.exercises, lessonId: stage._id, lessonType: "progress" } });
  };

  const handleCompleteStage = async (courseId, stageId, nextStageIndex) => {
    await updateStageIsDone(stageId, true);
    setProgressData(prevData => {
      const updatedStages = prevData[courseId].stages.map(stage => stage._id === stageId ? { ...stage, isDone: true } : stage);
      const completedStages = updatedStages.filter(stage => stage.isDone).length;
      const percentage = (completedStages / updatedStages.length) * 100;
      return {
        ...prevData,
        [courseId]: {
          ...prevData[courseId],
          stages: updatedStages,
          completedStages,
          percentage,
          currentStageIndex: nextStageIndex,
        },
      };
    });
  };

  if (loading) return <ReactLoading type="bubbles" color="#000" />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Courses</Typography>
      <Grid container spacing={3}>
        {enrollments.map(enrollment => {
          const progress = progressData[enrollment.courseId._id] || {};
          const isCompleted = progress.percentage === 100;
          const currentStageIndex = progress.currentStageIndex || 0;
          const currentStage = progress.stages ? progress.stages[currentStageIndex] : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={enrollment.courseId._id}>
              <Card style={{ position: 'relative', overflow: 'hidden' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {enrollment.courseId.courseName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {enrollment.courseId.courseContent}
                  </Typography>
                  {progress.totalStages !== undefined && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Progress: %{Math.round(progress.percentage)}
                      </Typography>
                      <Box sx={{ width: '100%', mt: 2, position: 'relative', height: 10, backgroundColor: '#d3d3d3', borderRadius: 5 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percentage}%` }}
                          transition={{ duration: 2 }}
                          style={{
                            height: '100%',
                            backgroundColor: 'green',
                            borderRadius: 5,
                          }}
                        />
                      </Box>
                      {currentStage && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={() => setCurrentStageIndex(prevState => ({
                            ...prevState,
                            [enrollment.courseId._id]: Math.max(currentStageIndex - 1, 0)
                          }))}>
                            <ArrowBackIcon />
                          </IconButton>
                          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>{currentStage.title}</Typography>
                          <IconButton onClick={() => setCurrentStageIndex(prevState => ({
                            ...prevState,
                            [enrollment.courseId._id]: Math.min(currentStageIndex + 1, progress.stages.length - 1)
                          }))}>
                            <ArrowForwardIcon />
                          </IconButton>
                        </Box>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => handleStartStage(enrollment.courseId._id, currentStageIndex)}
                        disabled={progress.stages && progress.stages[currentStageIndex].isDone && currentStageIndex !== 0}
                      >
                        {progress.stages && progress.stages[currentStageIndex].isDone ? `Önce ${progress.stages.find(stage => !stage.isDone).title} aşamayı yapınız` : "Hemen Başla"}
                      </Button>
                    </>
                  )}
                </CardContent>
                {isCompleted && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      bgcolor: 'rgba(0, 128, 0, 0.7)', 
                      color: 'white', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      flexDirection: 'column' 
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 50 }} />
                    <Typography variant="h5">Course Completed!</Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Progress;
