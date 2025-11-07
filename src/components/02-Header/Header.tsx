import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

import {
  BellRing,
  CircleUserRound,
  LayoutGrid,
  LogOut,
  PackageSearch,
  Settings,
  ShoppingCart,
  FileText,
  ClipboardList,
  Users,
  CalendarDays,
  FileCheck,
} from "lucide-react";

import { Tooltip } from "primereact/tooltip";
import logo from "../../assets/logo/logo.png";

const topRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <LayoutGrid />,
  },
  {
    path: "/leads",
    name: "Leads",
    icon: <PackageSearch />,
  },
  {
    path: "/assign-leads",
    name: "Assign Leads",
    icon: <ClipboardList />,
  },
  {
    path: "/book-confirmation",
    name: "Book Confirmation",
    icon: <FileCheck />,
  },
  {
    path: "/quotation",
    name: "Quotation",
    icon: <FileText />,
  },
  {
    path: "/invoice",
    name: "Invoice",
    icon: <ShoppingCart />,
  },
  {
    path: "/approval",
    name: "Approval",
    icon: <BellRing />,
  },
  {
    path: "/employees",
    name: "Employees",
    icon: <Users />,
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: <CalendarDays />,
  },
  {
    path: "/leave-request",
    name: "Leave Request",
    icon: <ClipboardList />,
  },
];

const bottomRoutes = [
  {
    path: "/settings",
    name: "Settings",
    icon: <Settings />,
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <CircleUserRound />,
  },
  {
    path: "/logout",
    name: "Logout",
    icon: <LogOut />,
  },
];

interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebarPaths = ["/login", "/register"];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <Tooltip target=".link" />
      <div className="main_container">
        {!hideSidebarPaths.includes(location.pathname) && (
          <>
            <div
              className="sidebar"
              style={{
                width: "75px",
                transition: "width 0.2s ease",
              }}
            >
              <div className="flex align-items-center justify-content-center logo-container">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="app-logo"
                  style={{
                    width: "40px",
                    height: "auto",
                  }}
                />
              </div>

              <section className="routes">
                {topRoutes.map((route) => (
                  <NavLink
                    to={route.path}
                    key={route.name}
                    className={({ isActive }) =>
                      `link ${isActive ? "active" : ""}`
                    }
                    data-pr-tooltip={route.name}
                    data-pr-position="right"
                  >
                    <div className="icon">{route.icon}</div>
                  </NavLink>
                ))}
              </section>

              <div className="bottom_section">
                {bottomRoutes.map((route) =>
                  route.name === "Logout" ? (
                    <NavLink
                      to="/logout"
                      key={route.name}
                      className={`link ${
                        location.pathname === "/logout" ? "active" : ""
                      }`}
                      onClick={handleLogout}
                      data-pr-tooltip={route.name}
                      data-pr-position="right"
                    >
                      <div className="icon">{route.icon}</div>
                    </NavLink>
                  ) : (
                    <NavLink
                      to={route.path}
                      key={route.name}
                      className={({ isActive }) =>
                        `link ${isActive ? "active" : ""}`
                      }
                      data-pr-tooltip={route.name}
                      data-pr-position="right"
                    >
                      <div className="icon">{route.icon}</div>
                    </NavLink>
                  )
                )}
              </div>
            </div>

            <main
              style={{
                width: "93vw",
                marginLeft: "90px",
                marginTop: "10px",
                marginBottom: "10px",
                marginRight: "10px",
                transition: "width 0.2s ease, margin-left 0.2s ease",
              }}
            >
              {children}
            </main>
          </>
        )}

        {hideSidebarPaths.includes(location.pathname) && (
          <main style={{ width: "100vw" }}>{children}</main>
        )}
      </div>
    </div>
  );
};

export default Header;
