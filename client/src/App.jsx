import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchMe } from "./redux/authSlice.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Profile from "./pages/Profile.jsx";

import CandidateDashboard from "./pages/candidate/CandidateDashboard.jsx";
import FindJobs from "./pages/candidate/FindJobs.jsx";
import JobDetails from "./pages/candidate/JobDetails.jsx";
import MyApplications from "./pages/candidate/MyApplications.jsx";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.jsx";
import JobForm from "./pages/recruiter/JobForm.jsx";
import Applicants from "./pages/recruiter/Applicants.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [dispatch, token, user]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/candidate/login" element={<AuthPage role="candidate" mode="login" />} />
      <Route path="/candidate/register" element={<AuthPage role="candidate" mode="register" />} />
      <Route path="/recruiter/login" element={<AuthPage role="recruiter" mode="login" />} />
      <Route path="/recruiter/register" element={<AuthPage role="recruiter" mode="register" />} />

      <Route element={<ProtectedRoute role="candidate" />}>
        <Route path="/candidate" element={<DashboardLayout role="candidate" />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="jobs" element={<FindJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="recruiter" />}>
        <Route path="/recruiter" element={<DashboardLayout role="recruiter" />}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs/new" element={<JobForm />} />
          <Route path="jobs/:id/edit" element={<JobForm />} />
          <Route path="jobs/:id/applicants" element={<Applicants />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
