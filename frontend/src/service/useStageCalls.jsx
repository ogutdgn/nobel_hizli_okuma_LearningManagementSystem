import { useDispatch } from 'react-redux';
import useAxios from './useAxios';
import { fetchStart, fetchSuccess, fetchFail, addStage, updateStage, deleteStage as removeStage, setStageOrder } from '../features/stageSlice';
import { toastErrorNotify, toastSuccessNotify } from '../helper/ToastNotify';
import { useState } from 'react';

const useStageCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const getStagesByCourse = async (courseId) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`/api/stages?filter[courseId]=${courseId}`);
      console.log(data.data);
      dispatch(fetchSuccess(data.data));
      return data.data;
    } catch (error) {
      console.error('Error fetching stages:', error.response?.data || error.message);
      dispatch(fetchFail(error.message));
      toastErrorNotify('Stages could not be fetched.');
      return [];
    }
  };

  const postStage = async (stageInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.post("/api/stages", stageInfo);
      dispatch(addStage(data.data));
      toastSuccessNotify("Stage added successfully.");
    } catch (error) {
      console.error("Error creating stage:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Stage could not be added.");
    }
  };

  const updateStageData = async (stageInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`/api/stages/${stageInfo._id}`, stageInfo);
      dispatch(updateStage(data.data));
      toastSuccessNotify("Stage updated successfully.");
    } catch (error) {
      console.error("Error updating stage:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Stage could not be updated.");
    }
  };

  const updateStageStatus = async (stageId, isDone) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.patch(`/api/stages/${stageId}/isDone`, { isDone });
      console.log(data.data);
      dispatch(updateStage(data.data));
      toastSuccessNotify("Stage status updated successfully.");
    } catch (error) {
      console.error("Error updating stage status:", error.response?.data || error.message);
      dispatch(fetchFail());
      toastErrorNotify("Stage status could not be updated.");
    }
  };

  const deleteStage = async (stageId) => {
    if (deleteInProgress) return;
    setDeleteInProgress(true);
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`/api/stages/${stageId}`);
      dispatch(removeStage(stageId));
      toastSuccessNotify('Stage deleted successfully.');
    } catch (error) {
      console.error('Error deleting stage:', error.response?.data || error.message);
      dispatch(fetchFail(error.message));
      toastErrorNotify('Stage could not be deleted.');
    } finally {
      setDeleteInProgress(false);
    }
  };

  return { getStagesByCourse, postStage, updateStageData, updateStageStatus, deleteStage };
};

export default useStageCalls;
