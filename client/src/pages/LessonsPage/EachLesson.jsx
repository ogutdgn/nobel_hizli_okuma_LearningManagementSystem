import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import Select from "react-select";
import useLessonCalls from "../../service/useLessonCalls";
import useUserCalls from "../../service/useUserCalls";
import { useParams } from "react-router-dom";
import { styled } from "@mui/system";

const EachLesson = () => {
  const dispatch = useDispatch();
  const { getLessonByTeacher, postLesson } = useLessonCalls();
  const { getStudents } = useUserCalls();
  const { lessons, loading } = useSelector((state) => state.lesson);
  const { users } = useSelector((state) => state.user);
  const { teacherId } = useParams();

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState(null);

  const fetchLessons = async () => {
    const lessonData = await getLessonByTeacher(teacherId);

    setStudents(lessonData.map(lesson => lesson.studentId));
  };

  useEffect(() => {
    getLessonByTeacher(teacherId)
    // fetchLessons();
  }, [dispatch]);

  console.log(lessons);

  useEffect(() => {
    const fetchStudents = async () => {
      await getStudents();
    };
    fetchStudents();
  }, [dispatch]);

  const handleAddStudent = async () => {
    if (newStudent) {
      await postLesson({ studentId: newStudent.value, teacherId });
      setNewStudent(null);
    }
    fetchLessons();
  };

  const CardContainer = styled(Grid)({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    padding: '16px'
  });

  const ProfilePicture = styled(Avatar)({
    width: '60px',
    height: '60px',
    marginRight: '16px'
  });

  const enrolledStudentIds = students.map(student => student._id);
  const studentOptions = users
    .filter(user => !user.isTeacher && !enrolledStudentIds.includes(user._id))
    .map(student => ({
      value: student._id,
      label: `${student.firstName} ${student.lastName}`
    }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <h2>Lesson Details</h2>
      <CardContainer container>
        {students.length > 0 ? (
          students.map((student) => (
            <Grid item key={student._id} style={{ flexShrink: 0, marginRight: '16px' }}>
              <Card style={{ width: '300px', display: 'flex', alignItems: 'center' }}>
                {student.profilePictureUrl ? (
                  <ProfilePicture src={student.profilePictureUrl} alt={`${student.firstName} ${student.lastName}`} />
                ) : (
                  <ProfilePicture></ProfilePicture>
                )}
                <CardContent style={{ flex: 1 }}>
                  <Typography variant="h6" component="div">
                    {student.firstName} {student.lastName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" component="div">
            Öğrenci bulunmamakta.
          </Typography>
        )}
      </CardContainer>
      <Box mt={4}>
        <Select
          value={newStudent}
          onChange={setNewStudent}
          options={studentOptions}
          placeholder="Öğrenci seçin..."
        />
        <Button variant="contained" color="primary" onClick={handleAddStudent} fullWidth>
          Öğrenci Ekle
        </Button>
      </Box>
    </div>
  );
};

export default EachLesson;
