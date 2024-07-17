import { useDispatch } from "react-redux";
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail, addUser, putUser, deleteUser } from "../features/userSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useUserCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getUsers = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/users");
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Users could not be fetched.");
    }
  };

  const getStudents = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/users?filter[isTeacher]=false&filter[isAdmin]=false");
      console.log(data);
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Students could not be fetched.");
    }
  };

  const getTeachers = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/users?filter[isTeacher]=true");
      console.log(data);
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Students could not be fetched.");
    }
  };

  const postUser = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.post("/api/users/", userInfo);
      dispatch(addUser(data.data));
      toastSuccessNotify("User added successfully.");
    } catch (error) {
      console.error("Error creating user:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("User could not be added.");
    }
  };

  const updateUser = (userInfo) => async (dispatch) => {
    dispatch(fetchStart());

    // Password alanını userInfo'dan sil
    const { password, ...updatedUserInfo } = userInfo;

    // console.log(updatedUserInfo);

    try {
      const { data } = await axiosWithToken.put(`/api/users/${updatedUserInfo._id}/`, updatedUserInfo);
      dispatch(putUser(data.data));
      // dispatch(updateUserSuccess(data.data));  // authSlice'deki user state'ini güncelle
      console.log(data.data);
      toastSuccessNotify("Kullanıcı bilgileri başarıyla güncellendi.");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("User could not be updated.");
    }
  };

  const removeUser = (userId) => async (dispatch) => {
    dispatch(fetchStart());
    try {
      const response = await axiosWithToken.delete(`/api/users/${userId}/`);
      if (response.status === 204) {
        dispatch(deleteUser(userId));
        toastSuccessNotify("User deleted successfully.");
      } else {
        throw new Error(response.data?.message || "User could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      dispatch(fetchFail());
      if (error.response && error.response.status === 404) {
        toastErrorNotify("User not found.");
      } else {
        toastErrorNotify("User could not be deleted.");
      }
    }
  };

  return { getUsers, getStudents, getTeachers, postUser, updateUser, removeUser };
};

export default useUserCalls;
