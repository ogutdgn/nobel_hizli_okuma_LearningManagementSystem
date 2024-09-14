import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useEnrollmentCalls from "../../service/useEnrollmentCalls";
import { Box, Typography, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const StudentClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getEnrollments } = useEnrollmentCalls();
  const { enrollments } = useSelector(state => state.enrollment);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    getEnrollments();
  }, [dispatch]);

  const userEnrollment = enrollments.find(enrollment =>
    enrollment.studentId._id === user._id
  );

  const handleNavigate = () => {
    navigate(""); // Buraya routing pathini ekleyeceksin
  };

  if (!userEnrollment) {
    return (
      <Box sx={{ padding: 2 }}>
        <Alert icon={<InfoIcon />} severity="info">
          Kayıtlı olduğunuz bir sınıf bulunmamakta.
        </Alert>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleNavigate}>
            Sınıflara Kaydol
          </Button>
        </Box>
      </Box>
    );
  }

  const teacherName = `${userEnrollment.teacherId.firstName} ${userEnrollment.teacherId.lastName}`;
  const students = enrollments.filter(enrollment => 
    enrollment.teacherId._id === userEnrollment.teacherId._id
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>{teacherName} Öğretmenin Sınıfı</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Adı Soyadı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((studentEnrollment, index) => (
              <TableRow 
                key={studentEnrollment.studentId._id} 
                sx={{ backgroundColor: studentEnrollment.studentId._id === user._id ? '#f0f0f0' : 'white' }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`${studentEnrollment.studentId.firstName} ${studentEnrollment.studentId.lastName}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentClass;
