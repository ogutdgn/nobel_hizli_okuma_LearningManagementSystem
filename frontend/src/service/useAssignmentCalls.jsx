import { useDispatch } from "react-redux";
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail, addAssignment, updateAssignment, deleteAssignment, setDeletingId } from "../features/assignmentSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useAssignmentCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getAssignments = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/assignments/");
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching assignments:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Assignments could not be fetched.");
    }
  };

  const postAssignment = async (assignmentInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.post("/api/assignments/", assignmentInfo);
      dispatch(addAssignment(data.data));
      toastSuccessNotify("Assignment added successfully.");
    } catch (error) {
      console.error("Error creating assignment:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Assignment could not be added.");
    }
  };

  const putAssignment = async (assignmentInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`/api/assignments/${assignmentInfo._id}/`, assignmentInfo);
      dispatch(updateAssignment(data.data));
      toastSuccessNotify("Assignment updated successfully.");
    } catch (error) {
      console.error("Error updating assignment:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Assignment could not be updated.");
    }
  };

  const updateAssignmentStatus = async (assignmentId, isDone) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.patch(`/api/assignments/${assignmentId}/isDone`, { isDone });
      dispatch(updateAssignment(data));
      toastSuccessNotify("Assignment status updated successfully.");
    } catch (error) {
      console.error("Error updating assignment status:", error.response?.data || error.message);
      dispatch(fetchFail(error.message));
      toastErrorNotify("Assignment status could not be updated.");
    }
  };

  const removeAssignment = (assignmentId) => async (dispatch) => {
    dispatch(fetchStart());
    dispatch(setDeletingId(assignmentId));
    try {
      const response = await axiosWithToken.delete(`/api/assignments/${assignmentId}/`);
      if (response.status === 204) {
        dispatch(deleteAssignment(assignmentId));
        toastSuccessNotify(response.data?.message || "Assignment deleted successfully.");
      } else {
        throw new Error(response.data?.message || "Assignment could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error.response?.data || error.message);
      dispatch(fetchFail());
      if (error.response && error.response.status === 404) {
        toastErrorNotify("Assignment not found.");
      } else {
        toastErrorNotify(error.message || "Assignment could not be deleted.");
      }
    } finally {
      dispatch(setDeletingId(null));
    }
  };

  const getAssignmentsByStudent = async (studentId) => {
    try {
      const { data } = await axiosWithToken.get(`/api/assignments?filter[studentId]=${studentId}`);
      return data.data;
    } catch (error) {
      console.error("Error fetching assignments:", error.response?.data || error.message);
      toastErrorNotify("Assignments could not be fetched.");
      return [];
    }
  };

  return { getAssignments, postAssignment, putAssignment, updateAssignmentStatus, removeAssignment, getAssignmentsByStudent };
};

export default useAssignmentCalls;
