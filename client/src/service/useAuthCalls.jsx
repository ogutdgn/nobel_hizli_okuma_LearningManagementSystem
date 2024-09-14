// import axios from "axios"
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify"
import { useNavigate } from "react-router-dom"
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice"
import { useDispatch } from "react-redux"
// import {  useSelector } from "react-redux"
import useAxios from "./useAxios"

const useAuthCalls = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { token } = useSelector((state) => state.auth)
  const { axiosWithToken, axiosPublic } = useAxios()

  const login = async (userInfo) => {
    // console.log(userInfo);
    dispatch(fetchStart())
    try {
      // const { data } = await axios.post(
      //   `${process.env.REACT_APP_BASE_URL}/auth/login/`,
      //   userInfo
      // )
      const { data } = await axiosPublic.post("/api/auth/login/", userInfo)
      dispatch(loginSuccess(data))
      toastSuccessNotify("Login işlemi basarili.")
      
      if (data.user.isActive){
        if (data.user.isAdmin){
          navigate("nobelhizliokuma/admin-dashboard")
        } else if (data.user.isTeacher) {
          navigate("nobelhizliokuma/ogretmen-paneli")
        } else {
          navigate("nobelhizliokuma/ogrenci-paneli")
        }
      } else {
        navigate("/banned")
      }

    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Login işlemi başarisiz oldu.")
      console.log(error)
    }
  }

  const register = async (userInfo) => {
    dispatch(fetchStart())
    try {
      // const { data } = await axios.post(
      //   `${process.env.REACT_APP_BASE_URL}/users/`,
      //   userInfo
      // )
      const { data } = await axiosPublic.post("/api/users/", userInfo)
      dispatch(registerSuccess(data))
      navigate("")
    } catch (error) {
      dispatch(fetchFail())
    }
  }

  const logout = async () => {
    dispatch(fetchStart())
    try {
      await axiosWithToken("/api/auth/logout/")
      toastSuccessNotify("Çıkış işlemi başarili.")
      dispatch(logoutSuccess())
      navigate("/")
    } catch (error) {
      dispatch(fetchFail())
      toastErrorNotify("Çıkış işlemi başarisiz oldu.")
    }
  }

  return { login, register, logout }
}

export default useAuthCalls
