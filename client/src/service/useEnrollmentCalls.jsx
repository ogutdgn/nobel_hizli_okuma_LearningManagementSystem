import { useDispatch } from "react-redux";
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail, addEnrollment, updateEnrollment, deleteEnrollment } from "../features/enrollmentSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useEnrollmentCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getEnrollments = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/enrollments/");
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching enrollments:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Enrollments could not be fetched.");
    }
  };

  const postEnrollment = async (enrollmentInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.post("/api/enrollments/", enrollmentInfo);
      dispatch(addEnrollment(data.data));
      toastSuccessNotify("Enrollment added successfully.");
    } catch (error) {
      console.error("Error creating enrollment:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Enrollment could not be added.");
    }
  };

  const putEnrollment = async (enrollmentInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`/api/enrollments/${enrollmentInfo._id}/`, enrollmentInfo);
      dispatch(updateEnrollment(data.data));
      toastSuccessNotify("Enrollment updated successfully.");
    } catch (error) {
      console.error("Error updating enrollment:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Enrollment could not be updated.");
    }
  };

  const removeEnrollment = (enrollmentId) => async (dispatch) => {
    dispatch(fetchStart());
    try {
      const response = await axiosWithToken.delete(`/api/enrollments/${enrollmentId}/`);
      if (response.status === 204) {
        dispatch(deleteEnrollment(enrollmentId));
        toastSuccessNotify(response.data?.message || "Enrollment deleted successfully.");
      } else {
        throw new Error(response.data?.message || "Enrollment could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error.response?.data || error.message);
      dispatch(fetchFail());
      if (error.response && error.response.status === 404) {
        toastErrorNotify("Enrollment not found.");
      } else {
        toastErrorNotify(error.message || "Enrollment could not be deleted.");
      }
    }
  };

  const getEnrollmentsByTeacher = async (teacherId) => {
    try {
      const { data } = await axiosWithToken.get(`/api/enrollments?filter[teacherId]=${teacherId}`);
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching enrollments:", error.response?.data || error.message);
      toastErrorNotify("Enrollments could not be fetched.");
      return [];
    }
  };

  return { getEnrollments, postEnrollment, putEnrollment, removeEnrollment, getEnrollmentsByTeacher };
};

export default useEnrollmentCalls;
