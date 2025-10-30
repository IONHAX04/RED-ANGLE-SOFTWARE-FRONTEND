import React, { type JSX } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "../02-Header/Header";
import Login from "../../pages/00-Login/Login";
import Dashboard from "../../pages/01-Dashboard/Dashboard";

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
                  <Dashboard />
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
