import { useDispatch } from "react-redux";
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail, addLesson, updateLesson, deleteLesson } from "../features/lessonSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useLessonCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getLesson = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/lessons/");
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching lessons:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("lessones could not be fetched.");
    }
  };

  const postLesson = async (lessonInfo) => {
    dispatch(fetchStart());
    console.log(lessonInfo);
    try {
      const { data } = await axiosWithToken.post("/api/lessons/", lessonInfo);
      dispatch(addLesson(data.data));
      toastSuccessNotify("Lesson added successfully.");
    } catch (error) {
      console.error("Error creating lesson:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Lesson could not be added.");
    }
  };

  const putLesson = async (lessonInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`/api/lessons/${lessonInfo._id}/`, lessonInfo);
      dispatch(updateLesson(data.data));
      toastSuccessNotify("Lesson updated successfully.");
    } catch (error) {
      console.error("Error updating lessons:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Lesson could not be updated.");
    }
  };

  const removeLesson = (lessonId) => async (dispatch) => {
    dispatch(fetchStart());
    try {
      const response = await axiosWithToken.delete(`/api/lessones/${lessonId}/`);
      if (response.status === 204) {
        dispatch(deleteLesson(lessonId));
        toastSuccessNotify(response.data?.message || "Lesson deleted successfully.");
      } else {
        throw new Error(response.data?.message || "Lesson could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error.response?.data || error.message);
      dispatch(fetchFail());
      if (error.response && error.response.status === 404) {
        toastErrorNotify("Lesson not found.");
      } else {
        toastErrorNotify(error.message || "Lesson could not be deleted.");
      }
    }
  };

  const getLessonByStudent = async (studentId) => {
    try {
      const { data } = await axiosWithToken.get(`/api/lessons?filter[studentId]=${studentId}`);
      dispatch(fetchSuccess(data.data));    } catch (error) {
      console.error("Error fetching lessons:", error.response?.data || error.message);
      toastErrorNotify("lessones could not be fetched.");
      return [];
    }
  };

  const getLessonByTeacher = async (teacherId) => {
    try {
      const { data } = await axiosWithToken.get(`/api/lessons?filter[teacherId]=${teacherId}`);
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching lessons:", error.response?.data || error.message);
      toastErrorNotify("lessones could not be fetched.");
      return [];
    }
  };

  return { getLesson, postLesson, putLesson, removeLesson, getLessonByStudent, getLessonByTeacher };
};

export default useLessonCalls;
