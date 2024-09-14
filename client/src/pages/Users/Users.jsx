import React, { useState, useEffect } from 'react';
import { Button, Container, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import UserRender from './UserRender'; // Students componentini import ediyoruz

const Users = () => {
  const [userData, setUserData] = useState("students");

  // Redux'tan kullanıcı bilgilerini çekiyoruz
  const { user } = useSelector(state => state.auth);

  // Eğer öğretmense sayfa yüklendiğinde otomatik olarak öğrencilerim datasını getir
  useEffect(() => {
    if (user?.isTeacher) {
      setUserData("students");
    }
  }, [user]);

  const handleUserChange = (userType) => {
    setUserData(userType);
  };

  return (
    <Container>
      <Box mt={4}>
        <Box mb={2}>
          {/* Eğer kullanıcı admin ise hem öğrenciler hem öğretmenler butonları */}
          {user?.isAdmin && (
            <>
              <Button
                onClick={() => handleUserChange("students")}
                style={{
                  backgroundColor: userData === "students" ? "#4F45E4" : "#fff",
                  color: userData === "students" ? "#fff" : "#4F45E4",
                  marginRight: "10px",
                  border: "1px solid #4F45E4"
                }}
              >
                Öğrenciler
              </Button>
              <Button
                onClick={() => handleUserChange("teachers")}
                style={{
                  backgroundColor: userData === "teachers" ? "#4F45E4" : "#fff",
                  color: userData === "teachers" ? "#fff" : "#4F45E4",
                  border: "1px solid #4F45E4"
                }}
              >
                Öğretmenler
              </Button>
            </>
          )}

          {/* Eğer kullanıcı teacher ise sadece öğrencilerim butonu */}
          {user?.isTeacher && !user?.isAdmin && (
            <Button
              onClick={() => handleUserChange("students")}
              style={{
                backgroundColor: userData === "students" ? "#4F45E4" : "#fff",
                color: userData === "students" ? "#fff" : "#4F45E4",
                border: "1px solid #4F45E4"
              }}
            >
              Öğrencilerim
            </Button>
          )}
        </Box>

        {/* Section içeriği */}
        <Box>
          {/* Burada Students componentini userData prop'una göre render ediyoruz */}
          <UserRender userType={userData} user={user} />
        </Box>
      </Box>
    </Container>
  );
};

export default Users;
