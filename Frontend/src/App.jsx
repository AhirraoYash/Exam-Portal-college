

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";

// Public pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import MCQTestPage from "./pages/MCQTestPage";
import ResultsPage from "./pages/Results";
import ProfilePage from "./pages/ProfilePage";


import StudentLayout from "./components/StudentLayout";

// Admin layout + pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentApprovalsPage from "./pages/Admin/StudentApprovalsPage";
import ManageTestsPage from "./pages/Admin/ManageTestsPage";
import CreateTestPage from "./pages/Admin/CreateTestPage";
import AllStudentsPage from "./pages/Admin/AllStudentsPage";
import TestDetail from "./pages/Admin/TestDetail";
import TestResultsPage from "./pages/Admin/TestResultsPage";
import AddTeacherPage from "./pages/Admin/AddTeacherPage";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/test/:testId" element={<MCQTestPage />} />

          {/* Student layout routes */}
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/results/:testId?" element={<ResultsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin routes — sidebar + header rendered ONCE in AdminLayout */}
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="StudentApprovalsPage" element={<StudentApprovalsPage />} />
            <Route path="manage-tests" element={<ManageTestsPage />} />
            <Route path="create-test" element={<CreateTestPage />} />
            <Route path="all-students" element={<AllStudentsPage />} />
            <Route path="tests/:testId" element={<TestDetail />} />
            <Route path="test-results/:testId" element={<TestResultsPage />} />
            <Route path="add-teacher" element={<AddTeacherPage />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
