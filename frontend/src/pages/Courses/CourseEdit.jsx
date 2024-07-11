import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Select from 'react-select';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Switch,
  Alert,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useCourseCalls from "../../service/useCourseCalls";
import useExerciseCalls from "../../service/useExerciseCalls";
import useStageCalls from "../../service/useStageCalls";
import { toastSuccessNotify, toastErrorNotify, toastInfoNotify } from "../../helper/ToastNotify";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import "./CourseEdit.css";

const ItemType = 'EXERCISE';

const CourseEdit = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeCourse, loading, error } = useSelector((state) => state.course);
  const { exercises, loading: exercisesLoading } = useSelector((state) => state.exercise);
  const { stages, loading: stagesLoading } = useSelector((state) => state.stage);
  const { getCourseById, putCourse } = useCourseCalls();
  const { getExercises } = useExerciseCalls();
  const { getStagesByCourse, postStage, updateStageData, deleteStage } = useStageCalls();

  const [courseData, setCourseData] = useState({
    courseName: "",
    courseContent: "",
    courseLabel: "",
    price: "",
    isPublish: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingStage, setIsEditingStage] = useState(false);
  const [isNewStage, setIsNewStage] = useState(false);
  const [newStage, setNewStage] = useState({
    description: "",
    exercises: [],
  });
  const [formError, setFormError] = useState("");
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationCallback, setConfirmationCallback] = useState(() => () => {});
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedStages, setSelectedStages] = useState([]);

  useEffect(() => {
    getExercises();
    getCourseById(courseId);
    getStagesByCourse(courseId);
  }, [dispatch]);

  useEffect(() => {
    if (activeCourse && activeCourse.length > 0) {
      setCourseData({
        courseName: activeCourse[0].courseName,
        courseContent: activeCourse[0].courseContent,
        courseLabel: activeCourse[0].courseLabel,
        price: activeCourse[0].price,
        isPublish: activeCourse[0].isPublish,
      });
    }
  }, [activeCourse]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handlePublishToggle = () => {
    const newIsPublish = !courseData.isPublish;
    setConfirmationMessage(`Are you sure you want to ${newIsPublish ? 'publish' : 'unpublish'} this course?`);
    setConfirmationCallback(() => async () => {
      try {
        await putCourse({ ...courseData, isPublish: newIsPublish, _id: courseId });
        setCourseData({ ...courseData, isPublish: newIsPublish });
        toastInfoNotify(`Course ${newIsPublish ? 'published' : 'unpublished'} successfully.`);
      } catch (error) {
        toastErrorNotify(`Failed to ${newIsPublish ? 'publish' : 'unpublish'} course.`);
      }
    });
    setConfirmationOpen(true);
  };

  const validateCourseData = () => {
    if (!courseData.courseName || !courseData.courseContent || !courseData.courseLabel || !courseData.price) {
      setValidationError("All course fields are required.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const validateStageData = () => {
    if (!newStage.description) {
      setValidationError("Stage description is required.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateCourseData()) return;

    setConfirmationMessage("Are you sure you want to save the course?");
    setConfirmationCallback(() => async () => {
      try {
        await putCourse({ ...courseData, _id: courseId });
        navigate("/nobelhizliokuma/admin-dashboard/kurslar");
      } catch (error) {
        console.log(error);
      }
    });
    setConfirmationOpen(true);
  };

  const handleSelectStage = (stage) => {
    const selectedExercises = stage.exercises.map((exercise) => ({
      value: exercise,
      label: exercise,
    }));
    setNewStage(stage);
    setIsEditingStage(true);
    setIsNewStage(false);
    setIsSortingEnabled(stage.exercises.length > 1);
  };

  const handleAddStage = () => {
    setNewStage({
      description: "",
      exercises: [],
    });
    setIsEditingStage(true);
    setIsNewStage(true);
  };

  const handleStageInputChange = (e) => {
    const { name, value } = e.target;
    setNewStage({ ...newStage, [name]: value });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(newStage.exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNewStage({ ...newStage, exercises: items });
  };

  const handleRemoveExercise = (index) => {
    setNewStage((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleExerciseChange = (selectedOptions) => {
    const selectedExercises = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setNewStage({ ...newStage, exercises: selectedExercises });
  };

  const handleSaveStage = async () => {
    if (!validateStageData()) return;

    setConfirmationMessage("Are you sure you want to save the stage?");
    setConfirmationCallback(() => async () => {
      try {
        if (isNewStage) {
          await postStage({
            description: newStage.description,
            exercises: newStage.exercises,
            courseId: courseId
          });
        } else {
          console.log(newStage);
          await updateStageData({ ...newStage, isSwap: false });
        }
        setNewStage({
          description: "",
          exercises: [],
        });
        setIsEditingStage(false);
        getStagesByCourse(courseId);
      } catch (error) {
        console.log(error);
      }
    });
    setConfirmationOpen(true);
  };

  const handleDeleteStage = (stageId) => {
    setConfirmationMessage("Are you sure you want to delete this stage?");
    setConfirmationCallback(() => async () => {
      try {
        await deleteStage(stageId);
        getStagesByCourse(courseId);
      } catch (error) {
        console.log(error);
      }
    });
    setConfirmationOpen(true);
  };

  const handleBack = () => {
    setIsEditingStage(false);
    setIsNewStage(false);
  };

  const exerciseOptions = exercises.map(exercise => ({
    value: exercise.title,
    label: exercise.title
  }));

  if (error) return <p>Error loading course details.</p>;

  return (
    <Container>
      {validationError && <Alert severity="error">{validationError}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box>
            <TextField
              label="Course Name"
              name="courseName"
              value={courseData.courseName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Course Label"
              name="courseLabel"
              value={courseData.courseLabel}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={courseData.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
              required
            />
            <TextField
              label="Course Content"
              name="courseContent"
              value={courseData.courseContent}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1">Publish:</Typography>
              <Switch
                checked={courseData.isPublish}
                onChange={handlePublishToggle}
                color="primary"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {isEditingStage ? (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{isNewStage ? "Add Stage" : "Edit Stage"}</Typography>
                <IconButton onClick={handleBack}>
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              {isNewStage && (
                <Typography variant="h6">
                  Aşama {stages.length + 1}
                </Typography>
              )}
              <TextField
                label="Stage Description"
                name="description"
                value={newStage.description}
                onChange={handleStageInputChange}
                fullWidth
                margin="normal"
                required
              />
              <Select
                isMulti
                options={exerciseOptions}
                onChange={handleExerciseChange}
                value={newStage.exercises.map(exercise => ({ value: exercise, label: exercise }))}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Egzersizleri seçin..."
                styles={{ container: base => ({ ...base, flex: 1 }) }}
              />
              <IconButton onClick={() => setIsSortingEnabled(!isSortingEnabled)} disabled={newStage.exercises.length < 2}>
                <LowPriorityIcon />
              </IconButton>
              <Grid item xs={12}>
                {isSortingEnabled && newStage.exercises.length > 1 && (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="exercises" direction="vertical">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{ marginTop: '10px' }}
                        >
                          {newStage.exercises.map((exercise, index) => (
                            <Draggable key={exercise} draggableId={exercise} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: "none",
                                    padding: "8px 16px",
                                    margin: "0 0 8px 0",
                                    minHeight: "36px",
                                    backgroundColor: "#fff",
                                    color: "#333",
                                    display: "flex",
                                    alignItems: "center",
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <Typography variant="body2" style={{ marginRight: "8px" }}>{index + 1}.</Typography>
                                  {exercise}
                                  <IconButton size="small" onClick={() => handleRemoveExercise(index)}>
                                    <RemoveIcon />
                                  </IconButton>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveStage}
                style={{ marginTop: "20px" }}
              >
                {isNewStage ? "Add Stage" : "Save Stage"}
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">Stages</Typography>
              <Box display="flex" alignItems="center">
                <TextField
                  label="Search Stages"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                {stages.length === 0 ? (
                  <Typography>No stages available</Typography>
                ) : (
                  [...stages]
                    .filter((stage) => stage.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .sort((a, b) => a.order - b.order)
                    .map((stage) => (
                      <Card key={stage._id} style={{ marginBottom: "10px" }}>
                        <CardContent>
                          <Typography variant="h5">{stage.title}</Typography>
                          <Typography>{stage.description}</Typography>
                          <Typography>
                            Exercises:
                            <ul>
                              {stage.exercises.map((exercise, index) => (
                                <li key={index}>{exercise}</li>
                              ))}
                            </ul>
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSelectStage(stage)}
                          >
                            Edit Stage
                          </Button>
                          <IconButton onClick={() => handleDeleteStage(stage._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    ))
                )}
              </Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleAddStage}
                style={{ marginTop: "10px" }}
              >
                Add New Stage
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: "20px" }}>
        Save
      </Button>
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={() => {
          confirmationCallback();
          setConfirmationOpen(false);
        }}
        message={confirmationMessage}
      />
    </Container>
  );
};

export default CourseEdit;
