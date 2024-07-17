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
  InputLabel
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useUserCalls from "../../service/useUserCalls";
import useEnrollmentCalls from "../../service/useEnrollmentCalls";
import useAssignmentCalls from "../../service/useAssignmentCalls";

const Teachers = () => {
  const dispatch = useDispatch();
  const { getTeachers, updateUser, removeUser } = useUserCalls();
  const { getEnrollmentsByStudent } = useEnrollmentCalls();
  const { getAssignmentsByStudent } = useAssignmentCalls();
  const { users, loading, error } = useSelector(state => state.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEnrollmentsDialog, setOpenEnrollmentsDialog] = useState(false);
  const [openAssignmentsDialog, setOpenAssignmentsDialog] = useState(false);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    getTeachers();
  }, [dispatch]);

  useEffect(() => {
    let filtered = users;
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
  }, [searchQuery, filterOption, users]);

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

  const handleViewEnrollments = async () => {
    const data = await getEnrollmentsByStudent(selectedUser._id);
    console.log(data);
    setEnrollments(data);
    setOpenEnrollmentsDialog(true);
    handleMenuClose();
  };

  const handleViewAssignments = async () => {
    const data = await getAssignmentsByStudent(selectedUser._id);
    setAssignments(data);
    setOpenAssignmentsDialog(true);
    handleMenuClose();
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
    getTeachers();
  };

  const handleUnbanUser = async () => {
    await dispatch(updateUser({ ...selectedUser, isActive: true }));
    handleMenuClose();
    getTeachers();
  };

  const handleDeleteConfirm = async () => {
    await dispatch(removeUser(selectedUser._id));
    handleMenuClose();
    setOpenDeleteDialog(false);
    getTeachers();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div>
      <h1>Öğrenciler</h1>
      <Box display="flex" mb={2}>
        <TextField
          type="text"
          placeholder="Öğrenci Aratın"
          required
          // variant="outlined"
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
            <MuiMenuItem value="alphabetical">Alfabeye Göre</MuiMenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
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
                    <MenuItem onClick={handleViewEnrollments}>Kayıtlı Olduğu Kurslar</MenuItem>
                    <MenuItem onClick={handleViewAssignments}>Ödevleri</MenuItem>
                    {selectedUser?.isActive ? (
                      <MenuItem onClick={handleBanUser}>Öğrenciyi Banla</MenuItem>
                    ) : (
                      <MenuItem onClick={handleUnbanUser}>Banı Aç</MenuItem>
                    )}
                    <MenuItem onClick={handleDeleteUser}>Öğrenciyi Sil</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openEnrollmentsDialog} onClose={() => setOpenEnrollmentsDialog(false)}>
        <DialogTitle>Kayıtlı Olduğu Kurslar</DialogTitle>
        <DialogContent>
          {enrollments.length ? (
            enrollments.map(enrollment => (
              <p key={enrollment._id}>{enrollment.courseId.courseName}</p>
            ))
          ) : (
            <p>Kayıtlı olduğu kurs bulunmamaktadır.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEnrollmentsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAssignmentsDialog} onClose={() => setOpenAssignmentsDialog(false)}>
        <DialogTitle>Ödevleri</DialogTitle>
        <DialogContent>
          {assignments.length ? (
            assignments.map(assignment => (
              <p key={assignment._id}>{assignment.taskContent}</p>
            ))
          ) : (
            <p>Ödev bulunmamaktadır.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignmentsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBanDialog} onClose={() => setOpenBanDialog(false)}>
        <DialogTitle>Öğrenciyi Banla</DialogTitle>
        <DialogContent>Bu öğrenciyi banlamak istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBanDialog(false)}>Cancel</Button>
          <Button onClick={handleBanConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Öğrenciyi Sil</DialogTitle>
        <DialogContent>Bu öğrenciyi silmek istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Teachers;
