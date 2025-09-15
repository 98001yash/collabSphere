import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StudentDashboard from "../pages/StudentDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import ProfilePage from "../pages/ProfilePage";
import LandingPage from "../pages/LandingPage";
import CreateProjectPage from "../pages/CreateProjectPage";
import EndorsedProjects from "../pages/EndorsedProjects";
import NotificationsPage from "../pages/NotificationsPage"; // 👈 import
import OpportunityListPage from "../pages/OpportunityListPage";
import OpportunityDetailPage from "../pages/OpportunityDetailPage";
import CreateOpportunityPage from "../pages/CreateOpportunityPage";
import ManageOpportunitiesPage from "../pages/ManageOpportunitiesPage";
import MyApplicationsPage from "../pages/MyApplicationsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboards */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/faculty" element={<FacultyDashboard />} />
      <Route path="/student/create-project" element={<CreateProjectPage />} />

      {/* Profile */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Faculty specific */}
      <Route path="/faculty/endorsed-projects" element={<EndorsedProjects />} />

  {/* Notifications */}
<Route path="/notifications" element={<NotificationsPage />} /> 
<Route path="/student/notifications" element={<NotificationsPage />} /> 
<Route path="/faculty/notifications" element={<NotificationsPage />} /> 


 <Route path="/opportunities" element={<OpportunityListPage />} />
      <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
      <Route path="/opportunities/create" element={<CreateOpportunityPage />} />
      <Route path="/opportunities/manage" element={<ManageOpportunitiesPage />} />
      <Route path="/opportunities/my-applications" element={<MyApplicationsPage />} />


      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />


    </Routes>
  );
};

export default AppRoutes;
