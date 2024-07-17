import React from 'react';
import { Box, CssBaseline, Toolbar, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import useAuthCalls from "../service/useAuthCalls";
import MenuListItems from "../components/MenuListItems";

const UserLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuthCalls();

  return (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: "white" }}>
          Nobel Hızlı Okuma
        </Typography>
      </Toolbar>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box component="nav" sx={{ width: 240, flexShrink: 0 }}>
          <MenuListItems role="user" />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Kullanıcı Paneli
          </Typography>
          {user && <Button color="inherit" onClick={logout}>Logout</Button>}
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default UserLayout;
