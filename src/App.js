import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import axios from "axios";
import "animate.css";
import LogoutIcon from '@mui/icons-material/Logout';

// Import your components
import Dashboard from "./components/Dashboard";
import AddEmployee from "./components/AddEmployee";
import ReportManagement from "./components/ReportManagement";
import LeaveManagement from "./components/LeaveManagement";
import EmployeeDetails from "./components/EmployeeDetails";
import Timer from "./components/Timer";
import RequestLeaves from "./components/RequestLeaves";
import PersonalDetails from "./components/PersonalDetails";
import Login from "./components/login";
import { Button } from "@mui/material";
import RequestedChanges from "./components/RequestedChanges";

const logo = "/assets/gg.png";

function Layout() {
  const [user, setUser] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingCount2, setPendingCount2] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser(null);
    setTimeout(() => navigate("/login"), 0); // Ensures navigation happens after state update
  };
  const fetchLeaves = async () => {
    const res = await axios.get(
      "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
    );
    const data = res.data || {};
    const pending = Object.values(data).filter(
      (leave) => leave.status === "PENDING"
    );
    setPendingCount(pending.length);
  };
  const fetchRequests = async () => {
    const res = await axios.get(
      "https://people-sync-33225-default-rtdb.firebaseio.com/requests.json"
    );
    const data2 = res.data || {};
    const pending2 = Object.values(data2).filter(
      (reqq) => reqq.status === "pending"
    );
    setPendingCount2(pending2.length);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const u = localStorage.getItem("user");
      if (u != null) {
        setUser(JSON.parse(u));
        clearInterval(interval);
      }
    }, 200);
  });

  useEffect(() => {
    fetchLeaves();
    fetchRequests();
    const interval = setInterval(fetchLeaves, 5000);
    const interval2 = setInterval(fetchRequests, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);

  return (
    <div className="container">
      {/* Show sidebar only if not on login page */}
      {!isLoginPage && (
        <div className="left-container">
          <img id="logom" src={logo} alt="Logo" />
          {user?.role === "hr" ? (
            <nav>
              <ul>
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <a href="/add-employee">Add Employee</a>
                </li>
                <li>
                  <a href="/report-management">Report Management</a>
                </li>
                <li style={{ position: "relative" }}>
                  <a href="/leave-management">Leave Management</a>
                  {pendingCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "-20px",
                        background: "pink",
                        color: "blue",
                        borderRadius: "50%",
                        padding: "2px 10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {pendingCount}
                    </span>
                  )}
                </li>
                <li style={{ position: "relative" }}>
                  <a href="/requested-changes">Requested Changes</a>
                  {pendingCount2 > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "-20px",
                        background: "pink",
                        color: "blue",
                        borderRadius: "50%",
                        padding: "2px 10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {pendingCount2}
                    </span>
                  )}
                </li>
                <li>
                  <a href="/employee-details">Employee Details</a>
                </li>
                <li>
                  <a href="/timer">Timer</a>
                </li>
                <li>
                  <a href="/request-leaves">Request Leaves</a>
                </li>
                <li>
                  <a href="/personal-details">Personal Details</a>
                </li>
              </ul>
            </nav>
          ) : user?.role === "marketing team" ||
            user?.role === "development team" ||
            user?.role === "sales team" ||
            user?.role === "ai specialist" ? (
            <nav>
              <ul>
                <li>
                  <a href="/timer">Dashboard</a>
                </li>
                <li>
                  <a href="/request-leaves">Request Leaves</a>
                </li>
                <li>
                  <a href="/personal-details">Personal Details</a>
                </li>
              </ul>
            </nav>
          ) : (
            ""
          )}
        </div>
      )}

      {/* Adjust right-container width based on login page */}
      <div className={`right-container ${isLoginPage ? "full-width" : ""}`}>
        {!isLoginPage && (
          <div className="Nav-header-top">
            <h1>{user?.name}</h1>
            <img
              src={`${process.env.PUBLIC_URL}/pexels-mart-production-7709149.jpg`}
              alt="Profile"
              className="profile-image"
            />
            <Button
              variant="contained"
              style={{ maxWidth: "min-content", marginLeft: "20px" }}
              onClick={logoutHandler}
              className="logout"
            >
              Logout&nbsp; <LogoutIcon fontSize="small"/>
            </Button>
          </div>
        )}

        <div className="container-main">
          <Routes>
            {/* Routes that are always accessible */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} /> {/* Default route */}
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/add-employee"
              element={<ProtectedRoute element={<AddEmployee />} />}
            />
            <Route
              path="/report-management"
              element={<ProtectedRoute element={<ReportManagement />} />}
            />
            <Route
              path="/leave-management"
              element={<ProtectedRoute element={<LeaveManagement />} />}
            />
            <Route
              path="/requested-changes"
              element={<ProtectedRoute element={<RequestedChanges />} />}
            />
            <Route
              path="/employee-details"
              element={<ProtectedRoute element={<EmployeeDetails />} />}
            />
            <Route
              path="/timer"
              element={<ProtectedRoute element={<Timer />} />}
            />
            <Route
              path="/request-leaves"
              element={<ProtectedRoute element={<RequestLeaves />} />}
            />
            <Route
              path="/personal-details"
              element={<ProtectedRoute element={<PersonalDetails />} />}
            />
            {/* Catch-all route (redirect to login if no route matched) */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
