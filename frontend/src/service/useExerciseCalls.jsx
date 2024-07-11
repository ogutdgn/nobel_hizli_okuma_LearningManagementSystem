import { useDispatch, useSelector } from "react-redux";
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail, addExercise, updateExercise, deleteExercise, setExercise } from "../features/exerciseSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useExerciseCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();
  const { fetched } = useSelector((state) => state.exercise);

  const getExercises = async () => {
    if (fetched) return; // If already fetched, do nothing

    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("/api/exercises/");
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error("Error fetching exercises:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Exercises could not be fetched.");
    }
  };

  const postExercise = async (exerciseInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.post("/api/exercises/", exerciseInfo);
      dispatch(addExercise(data.data));
      toastSuccessNotify("Exercise added successfully.");
    } catch (error) {
      console.error("Error creating exercise:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Exercise could not be added.");
    }
  };

  const putExercise = async (exerciseInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`/api/exercises/${exerciseInfo._id}/`, exerciseInfo);
      dispatch(updateExercise(data.data));
      toastSuccessNotify("Exercise updated successfully.");
    } catch (error) {
      console.error("Error updating exercise:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Exercise could not be updated.");
    }
  };

  const removeExercise = (exerciseId) => async (dispatch) => {
    dispatch(fetchStart());
    try {
      const response = await axiosWithToken.delete(`/api/exercises/${exerciseId}/`);
      if (response.status === 204) {
        dispatch(deleteExercise(exerciseId));
        toastSuccessNotify(response.data?.message || "Exercise deleted successfully.");
      } else {
        throw new Error(response.data?.message || "Exercise could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error.response?.data || error.message);
      dispatch(fetchFail());
      if (error.response && error.response.status === 404) {
        toastErrorNotify("Exercise not found.");
      } else {
        toastErrorNotify(error.message || "Exercise could not be deleted.");
      }
    }
  };

  return { getExercises, postExercise, putExercise, removeExercise };
};

export default useExerciseCalls;
