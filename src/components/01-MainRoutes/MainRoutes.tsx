import React, { type JSX } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "../02-Header/Header";
import Login from "../../pages/00-Login/Login";
// import Dashboard from "../../pages/01-Dashboard/Dashboard";
import Settings from "../../pages/11-Settings/Settings";
import Leads from "../../pages/02-Leads/Leads";
import LeaveReq from "../../pages/10-LeaveReq/LeaveReq";
import Attendance from "../../pages/09-Attendance/Attendance";
import Employees from "../../pages/08-Employees/Employees";
import ViewLeads from "../02-LeadsComponents/ViewLeads/ViewLeads";
import AssignLeads from "../03-AssignLeads/AssignLeads";
import BookConfirmation from "../../pages/03-BookConfirmation/BookConfirmation";
import AddQuotation from "../04-QuotationComponents/AddQuotation/AddQuotation";
import Invoice from "../../pages/04-Invoice/Invoice";
import Approval from "../../pages/05-Approval/Approval";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("userDetails");
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

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
                  <Settings />
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
              path="/leads"
              element={
                <ProtectedRoute>
                  <ViewLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign-leads"
              element={
                <ProtectedRoute>
                  <AssignLeads />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-confirmation"
              element={
                <ProtectedRoute>
                  <BookConfirmation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quotation"
              element={
                <ProtectedRoute>
                  <AddQuotation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoice"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />

            <Route
              path="/approval"
              element={
                <ProtectedRoute>
                  <Approval />
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
