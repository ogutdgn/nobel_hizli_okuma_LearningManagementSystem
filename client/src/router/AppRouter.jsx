import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRouter from "./PrivateRouter";
import Dashboard from "../pages/Dashboard";
import HomePage from "../pages/HomePage";
import Users from "../pages/Users/Users";
import StudentAssignments from "../pages/AssignmentsPage/StudentAssignments";
import AdminAssignments from "../pages/AssignmentsPage/AdminAssignments";
import ExercisesHome from "../pages/ExercisesPage/ExercisesHome";
import Courses from "../pages/Courses/Courses";
import CourseEdit from "../pages/Courses/CourseEdit";
import Profile from "../pages/Profile";
import Progress from "../pages/Progress";
import DotEyeExercise from "../components/Studies/reading_exercises/13-dot-eye/DotEyeExercise";
import GrowingObjects from "../components/Studies/reading_exercises/growing-objects/GrowingObjects";
import SimilarWords from "../components/Studies/reading_exercises/similar-words/SimilarWords";
import OpeningObjects from "../components/Studies/reading_exercises/opening-objects/OpeningObjects";
import SpeedReadingTest from "../components/Studies/reading_tests/SpeedReadingExercise";
import NewCourse from "../pages/Courses/NewCourse";
import ExerciseNavigator from "../components/ExerciseNavigator";

const renderExerciseRoutes = (basePath) => {
  return [
    <>
      <Route key="dot-eye" path={`${basePath}/13-nokta-egzersizi`} element={<DotEyeExercise />} />
      <Route key="vertical-opening" path={`${basePath}/acilan-nesneler`} element={<OpeningObjects />} />
      <Route key="growing-objects" path={`${basePath}/buyuyen-sekiller`} element={<GrowingObjects />} />
      <Route key="similar-words" path={`${basePath}/benzer-kelimeler`} element={<SimilarWords />} />
      <Route key="speed-reading-test" path={`${basePath}/okuma-testi`} element={<SpeedReadingTest />} />
    </>
  ];
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="banned" element={<div>Banned User Page</div>} />
        
        <Route path="nobelhizliokuma/admin-dashboard" element={<PrivateRouter isAdminRoute={true} />}>
          <Route path="" element={<Dashboard role="admin" />}>
            <Route index element={<HomePage />} />
            <Route path="kullanicilar" element={<Users />} />
            <Route path="odevler" element={<AdminAssignments />} />
            <Route path="egzersizler" element={<ExercisesHome />} />
            <Route path="kurslar" element={<Courses />} />
            <Route path="kurslar/:courseId" element={<CourseEdit />} /> 
            <Route path="yeni-kurs" element={<NewCourse />} />
            <Route path="profil" element={<Profile />} />
            {renderExerciseRoutes("/nobelhizliokuma/admin-dashboard/egzersizler")}
          </Route>
        </Route>

        <Route path="nobelhizliokuma" element={<PrivateRouter isAdminRoute={false} />}>
          <Route path="" element={<Dashboard role="user" />}>
            <Route index element={<HomePage />} />
            <Route path="ilerlemeler" element={<Progress />} />
            <Route path="odevler" element={<StudentAssignments />} />
            <Route path="egzersizler" element={<ExercisesHome />} />
            <Route path="profil" element={<Profile />} />
            {renderExerciseRoutes("/nobelhizliokuma/egzersizler")}
          </Route>
          <Route path="ders" element={<ExerciseNavigator />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
