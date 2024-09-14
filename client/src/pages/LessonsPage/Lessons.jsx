import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Box,
  Avatar,
  Button
} from "@mui/material";
import useUserCalls from "../../service/useUserCalls";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const dispatch = useDispatch();
  const { getTeachers } = useUserCalls();
  const { users, loading } = useSelector((state) => state.user);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      await getTeachers();
    };
    fetchTeachers();
  }, [dispatch]);

  useEffect(() => {
    setTeachers(users.filter(user => user.isTeacher));
  }, [useSelector((state) => state.user.users)]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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

  const handleMoreInfo = (id) => {
    navigate(`${id}`);
  };

  return (
    <CardContainer container>
      {teachers.map((teacher) => (
        <Grid item key={teacher._id} style={{ flexShrink: 0, marginRight: '16px' }}>
          <Card style={{ width: '300px', display: 'flex', alignItems: 'center' }}>
            {teacher.profilePictureUrl ? (
              <ProfilePicture src={teacher.profilePictureUrl} alt={`${teacher.firstName} ${teacher.lastName}`} />
            ) : (
              <ProfilePicture></ProfilePicture>
            )}
            <CardContent style={{ flex: 1 }}>
              <Typography variant="h6" component="div">
                {teacher.firstName} öğretmenin sınıfı
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {teacher.firstName} {teacher.lastName}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleMoreInfo(teacher._id)}>
                Daha Fazla Bilgi
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </CardContainer>
  );
};

export default Classes;
