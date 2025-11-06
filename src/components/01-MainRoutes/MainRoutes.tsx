import React, { type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../02-Header/Header";
import Login from "../../pages/00-Login/Login";
import Dashboard from "../../pages/01-Dashboard/Dashboard";
import Settings from "../../pages/11-Settings/Settings";
import Leads from "../../pages/02-Leads/Leads";
import LeaveReq from "../../pages/10-LeaveReq/LeaveReq";
import Attendance from "../../pages/09-Attendance/Attendance";
import Employees from "../../pages/08-Employees/Employees";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  // const isLoggedIn = localStorage.getItem("userDetails");
  // const location = useLocation();

  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children;
};

const MainRoutes: React.FC = () => {
  return (
    <div>
      <div>
        <Header>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave-request"
              element={
                <ProtectedRoute>
                  <LeaveReq />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/add"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Header>
      </div>
    </div>
  );
};

export default MainRoutes;
