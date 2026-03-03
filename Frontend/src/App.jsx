

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
// Import your page components
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import MCQTestPage from './pages/MCQTestPage';
import ResultsPage from './pages/Results';
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentApprovalsPage from "./pages/Admin/StudentApprovalsPage";
import ManageTestsPage from "./pages/Admin/ManageTestsPage";
import CreateTestPage from "./pages/Admin/CreateTestPage";
import ProfilePage from "./pages/ProfilePage";
import AllStudentsPage from "./pages/Admin/AllStudentsPage";
import TestDetail from "./pages/Admin/TestDetail";
import TestResultsPage from "./pages/Admin/TestResultsPage";
import AddTeacherPage from "./pages/Admin/AddTeacherPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/test/:testId" element={<MCQTestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* All admin routes share one SidebarProvider instance */}
        <Route path="/admin/*" element={
          <SidebarProvider>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="StudentApprovalsPage" element={<StudentApprovalsPage />} />
              <Route path="manage-tests" element={<ManageTestsPage />} />
              <Route path="create-test" element={<CreateTestPage />} />
              <Route path="all-students" element={<AllStudentsPage />} />
              <Route path="tests/:testId" element={<TestDetail />} />
              <Route path="test-results/:testId" element={<TestResultsPage />} />
              <Route path="add-teacher" element={<AddTeacherPage />} />
            </Routes>
          </SidebarProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;