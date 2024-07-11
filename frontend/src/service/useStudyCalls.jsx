// useStudyCalls.js

import { useDispatch } from 'react-redux';
import useAxios from "./useAxios";
import { fetchStart, fetchSuccess, fetchFail } from '../features/studySlice';
import { toastErrorNotify } from '../helper/ToastNotify';

const useStudyCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const getStudies = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get('/api/exercises/');
      dispatch(fetchSuccess(data.data));
    } catch (error) {
      console.error('Error fetching studies:', error.response?.data || error.message);
      dispatch(fetchFail(error.response?.data || error.message));
      toastErrorNotify('Exercises could not be fetched.');
    }
  };

  return { getStudies };
};

export default useStudyCalls;
