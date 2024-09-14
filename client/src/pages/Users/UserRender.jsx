import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useUserCalls from "../../service/useUserCalls";
import useEnrollmentCalls from "../../service/useEnrollmentCalls";
import Users from "./Users";

const UserRender = ({ userType, user }) => {
  const dispatch = useDispatch();
  const { getStudents, getTeachers, updateUser, removeUser } = useUserCalls();
  const { getEnrollmentsByTeacher } = useEnrollmentCalls();
  const { users, loading, error } = useSelector(state => state.user);
  const { enrollments } = useSelector(state => state.enrollment);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (user?.isAdmin) {
        // Admin can view all students or teachers
        if (userType === "students") {
          await getStudents();
        } else if (userType === "teachers") {
          await getTeachers();
        }
      }  if (user?.isTeacher) {
        // Teacher can only view their own students
        await getEnrollmentsByTeacher(user._id);
      }
    };

    fetchData();
  }, [dispatch, userType]);


  useEffect(() => {
    let filtered = user?.isTeacher ? enrollments.map(enrollment => enrollment.studentId) : users;
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterOption === "banned") {
      filtered = filtered.filter(user => !user.isActive);
    } else if (filterOption === "notBanned") {
      filtered = filtered.filter(user => user.isActive);
    } else if (filterOption === "alphabetical") {
      filtered = filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
    }
    setFilteredUsers(filtered);
  }, [searchQuery, filterOption, users, enrollments, filteredUsers, user?.isTeacher]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleBanUser = () => {
    setOpenBanDialog(true);
  };

  const handleDeleteUser = () => {
    setOpenDeleteDialog(true);
  };

  const handleBanConfirm = async () => {
    await dispatch(updateUser({ ...selectedUser, isActive: false }));
    handleMenuClose();
    setOpenBanDialog(false);
    userType === "students" ? getStudents() : getTeachers();
  };

  const handleUnbanUser = async () => {
    await dispatch(updateUser({ ...selectedUser, isActive: true }));
    handleMenuClose();
    userType === "students" ? getStudents() : getTeachers();
  };

  const handleDeleteConfirm = async () => {
    await dispatch(removeUser(selectedUser._id));
    handleMenuClose();
    setOpenDeleteDialog(false);
    userType === "students" ? getStudents() : getTeachers();
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div>
      <Box display="flex" mb={2}>
        <TextField
          type="text"
          placeholder={userType === "students" ? "Öğrenci Aratın" : "Öğretmen Aratın"}
          required
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          sx={{
            marginRight: "10px",
            width: "70%"
          }}
        />
        <FormControl variant="outlined" sx={{
          marginRight: "10px",
          width: "30%"
        }}>
          <InputLabel>Filtre</InputLabel>
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            label="Filtre"
          >
            <MuiMenuItem value="">Hepsi</MuiMenuItem>
            <MuiMenuItem value="banned">Banlı Olanlar</MuiMenuItem>
            <MuiMenuItem value="notBanned">Bansız Olanlar</MuiMenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>İsim/Soyisim</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Hareketler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: user.isActive ? 'green' : 'red',
                    }}
                  ></Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuClick(event, user)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {selectedUser?.isActive ? (
                      <MenuItem onClick={handleBanUser}>{userType === "students" ? "Öğrenciyi Banla" : "Öğretmeni Banla"}</MenuItem>
                    ) : (
                      <MenuItem onClick={handleUnbanUser}>Banı Aç</MenuItem>
                    )}
                    <MenuItem onClick={handleDeleteUser}>{userType === "students" ? "Öğrenciyi Sil" : "Öğretmeni Sil"}</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openBanDialog} onClose={() => setOpenBanDialog(false)}>
        <DialogTitle>{userType === "students" ? "Öğrenciyi Banla" : "Öğretmeni Banla"}</DialogTitle>
        <DialogContent>Bu kullanıcıyı banlamak istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBanDialog(false)}>Cancel</Button>
          <Button onClick={handleBanConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>{userType === "students" ? "Öğrenciyi Sil" : "Öğretmeni Sil"}</DialogTitle>
        <DialogContent>Bu kullanıcıyı silmek istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserRender;
