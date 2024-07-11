import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useAssignmentCalls from "../../service/useAssignmentCalls";
import useUserCalls from "../../service/useUserCalls";
import useExerciseCalls from "../../service/useExerciseCalls";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Alert,
  MenuItem,
  FormControl,
  Select as MuiSelect,
  InputLabel,
  Menu,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import FilterListIcon from '@mui/icons-material/FilterList';
import './Assignments.css';

const AdminAssignments = () => {
  const dispatch = useDispatch();
  const { getAssignments, postAssignment, removeAssignment } = useAssignmentCalls();
  const { getStudents } = useUserCalls();
  const { getExercises } = useExerciseCalls();
  const { assignments, loading, error, deletingId } = useSelector(state => state.assignment);
  const { user } = useSelector(state => state.auth);
  const { users } = useSelector(state => state.user);
  const { exercises } = useSelector(state => state.exercise);

  const [deleting, setDeleting] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    studentId: "",
    teacherId: user._id,
    taskContent: [],
    dueDate: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // Yeni eklenen durum filtreleme
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    getAssignments();
    getStudents();
    getExercises();
  }, [dispatch]);

  const handleDelete = async (assignmentId) => {
    if (!deleting) {
      setDeleting(true);
      try {
        await dispatch(removeAssignment(assignmentId));
        getAssignments();
      } catch (e) {
        console.error(e);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAssignment.dueDate) {
      setFormError("Due date is required.");
      return;
    }
    try {
      await dispatch(postAssignment(newAssignment));
      setNewAssignment({
        studentId: "",
        teacherId: user._id,
        taskContent: [],
        dueDate: null
      });
      setFormError("");
      setIsSortingEnabled(false);
    } catch (e) {
      console.error(e);
    }
    getAssignments();
    setNewAssignment(prevState => ({
      ...prevState,
      taskContent: [],
      dueDate: null
    }));
  };

  const handleStudentChange = (selectedOption) => {
    setNewAssignment({ ...newAssignment, studentId: selectedOption.value });
  };

  const handleExerciseChange = (selectedOptions) => {
    const selectedExercises = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setNewAssignment({ ...newAssignment, taskContent: selectedExercises });
  };

  const handleDateChange = (date) => {
    setNewAssignment({ ...newAssignment, dueDate: date });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(newAssignment.taskContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNewAssignment({ ...newAssignment, taskContent: items });
  };

  const handleFilterMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };

  const studentOptions = users.map(user => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName}`
  }));

  const exerciseOptions = exercises.map(exercise => ({
    value: exercise.title,
    label: exercise.title
  }));

  const filteredAssignments = assignments.filter(assignment => {
    const taskContentArray = Array.isArray(assignment.taskContent) ? assignment.taskContent : [];
    const searchTermMatch = assignment.studentId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.teacherId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskContentArray.some(content => content.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = filterStatus === 'all' || (filterStatus === 'completed' ? assignment.isDone : !assignment.isDone);
    return searchTermMatch && statusMatch;
  });

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Ödevler yüklenirken hata oluştu.</p>;

  const today = new Date();
  const maxDueDate = new Date();
  maxDueDate.setDate(today.getDate() + 14);

  return (
    <Container className="assignments-container">
      <Typography variant="h4" gutterBottom>Ödev Listesi</Typography>
      {formError && <Alert severity="error">{formError}</Alert>}
      <Box component="form" onSubmit={handleSubmit} className="assignment-form">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Select
              options={studentOptions}
              onChange={handleStudentChange}
              className="student-select"
              placeholder="Öğrenci seçin..."
              isSearchable
              styles={{ container: base => ({ ...base, width: '100%' }) }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ display: 'flex', alignItems: 'center' }}>
            <Select
              isMulti
              options={exerciseOptions}
              onChange={handleExerciseChange}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Egzersizleri seçin..."
              styles={{ container: base => ({ ...base, flex: 1 }) }}
            />
            <IconButton
              onClick={() => setIsSortingEnabled(!isSortingEnabled)}
              disabled={newAssignment.taskContent.length < 2} // Sadece 2 veya daha fazla egzersiz varsa aktif
            >
              <LowPriorityIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              selected={newAssignment.dueDate}
              onChange={handleDateChange}
              minDate={today}
              maxDate={maxDueDate}
              placeholderText="Teslim tarihi seçin..."
              className="date-picker"
              required
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            {isSortingEnabled && newAssignment.taskContent.length > 1 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="exercises" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ display: 'flex', overflowX: 'auto', marginTop: '10px' }}
                    >
                      {newAssignment.taskContent.map((exercise, index) => (
                        <Draggable key={exercise} draggableId={exercise} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: "8px 16px",
                                margin: "0 8px",
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
                              <IconButton size="small" onClick={() => {
                                const newTaskContent = [...newAssignment.taskContent];
                                newTaskContent.splice(index, 1);
                                setNewAssignment({ ...newAssignment, taskContent: newTaskContent });
                              }}>
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
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button type="submit" variant="contained" color="primary" style={{ width: 'fit-content', marginTop: '16px' }}>Ödev Ekle</Button>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" alignItems="center" marginTop={2}>
        <TextField
          type="text"
          placeholder="Ödev arayın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          fullWidth
          margin="normal"
        />
        <IconButton
          aria-controls="filter-menu"
          aria-haspopup="true"
          onClick={handleFilterMenuClick}
          style={{ marginLeft: '10px' }}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={() => handleFilterChange('all')}>Tümü</MenuItem>
          <MenuItem onClick={() => handleFilterChange('completed')}>Tamamlananlar</MenuItem>
          <MenuItem onClick={() => handleFilterChange('incomplete')}>Tamamlanmayanlar</MenuItem>
        </Menu>
      </Box>
      <Typography variant="h5" gutterBottom>Aktif Ödevler</Typography>
      <TableContainer component={Paper}>
        <Table className="assignment-table">
          <TableHead>
            <TableRow>
              <TableCell>Öğrenci</TableCell>
              <TableCell>Ödev</TableCell>
              <TableCell>Veriliş Tarihi</TableCell>
              <TableCell>Son Tarih</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Sil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments?.map(assignment => (
              <TableRow key={assignment._id} className="assignment-item">
                <TableCell>{assignment.studentId?.firstName} {assignment.studentId?.lastName}</TableCell>
                <TableCell>{assignment.taskContent.join(', ')}</TableCell>
                <TableCell>{new Date(assignment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span style={{ color: assignment.isDone ? 'green' : 'red' }}>
                    {assignment.isDone ? 'Tamamlandı' : 'Tamamlanmadı'}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(assignment._id)}
                    disabled={deletingId === assignment._id}
                    className="delete-button"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminAssignments;
