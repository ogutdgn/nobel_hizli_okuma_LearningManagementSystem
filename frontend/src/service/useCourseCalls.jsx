import { useDispatch } from "react-redux";
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail, addCourse, updateCourse, deleteCourse, setDeletingId, setCourse } from "../features/courseSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useCourseCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getCourses = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/courses/");
      console.log("Fetched courses:", data.data); // Log the fetched data
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Courses could not be fetched.");
    }
  };

  const getCourseById = async (courseId) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`/api/courses?filter[_id]=${courseId}`);
      dispatch(setCourse(data.data));
    } catch (error) {
      console.error("Error fetching course by ID:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Course could not be fetched.");
    }
  };

  const postCourse = async (courseInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.post("/api/courses/", courseInfo);
      console.log("Added course:", data.data); // Log the added course
      dispatch(addCourse(data.data));
      toastSuccessNotify("Course added successfully.");
      getCourses();
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Course could not be added.");
    }
  };

  const putCourse = async (courseInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`/api/courses/${courseInfo._id}/`, courseInfo);
      console.log("Updated course:", data.data); // Log the updated course
      dispatch(updateCourse(data.data));
      toastSuccessNotify("Course updated successfully.");
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Course could not be updated.");
    }
  };

  const removeCourse = (courseId) => async (dispatch) => {
    console.log("zdasd");
    dispatch(fetchStart());
    dispatch(setDeletingId(courseId));
    try {
      const response = await axiosWithToken.delete(`/api/courses/${courseId}/`);
      if (response.status === 204) {
        console.log("Deleted course:", courseId); // Log the deleted course ID
        dispatch(deleteCourse(courseId));
        toastSuccessNotify(response.data?.message || "Course deleted successfully.");
      } else {
        throw new Error(response.data?.message || "Course could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error.message);
      dispatch(fetchFail());
      if (error.response && error.response.status === 404) {
        toastErrorNotify("Course not found.");
      } else {
        toastErrorNotify(error.message || "Course could not be deleted.");
      }
    } finally {
      dispatch(setDeletingId(null));
    }
  };

  return { getCourses, getCourseById, postCourse, putCourse, removeCourse };
};

export default useCourseCalls;
