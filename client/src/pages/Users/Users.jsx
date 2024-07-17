import React, { useState } from 'react';
import UserRender from "./UserRender";
import { Button, Container, Box, CircularProgress } from '@mui/material';

const Users = () => {
  const [user, setUser] = useState("students");
  const [loading, setLoading] = useState(false);

  const handleUserChange = (userType) => {
    setLoading(true);
    setTimeout(() => {
      setUser(userType);
      setLoading(false);
    }, 250);
  };

  return (
    <Container>
      <Box mt={4}>
        <Box mb={2}>
          <Button
            onClick={() => handleUserChange("students")}
            style={{
              backgroundColor: user === "students" ? "#4F45E4" : "#fff",
              color: user === "students" ? "#fff" : "#4F45E4",
              marginRight: "10px",
              border: "1px solid #4F45E4"
            }}
          >
            Öğrenciler
          </Button>
          <Button
            onClick={() => handleUserChange("teachers")}
            style={{
              backgroundColor: user === "teachers" ? "#4F45E4" : "#fff",
              color: user === "teachers" ? "#fff" : "#4F45E4",
              border: "1px solid #4F45E4"
            }}
          >
            Öğretmenler
          </Button>
        </Box>
        <Box>
          {loading ? <CircularProgress /> : (user === "students" ? <UserRender userType={"students"} /> : <UserRender userType={"teachers"} />)}
        </Box>
      </Box>
    </Container>
  );
}

export default Users;
