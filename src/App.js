import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
  Link
} from "react-router-dom";
import "./App.css";
import axios from "axios";
import "animate.css";
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';

// Import Silk component
import Silk from './Silk';

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
import ScheduleMeeting from "./components/ScheduleMeeting";

const logo = "/assets/gg.png";

const wallpapers = [
  process.env.PUBLIC_URL + '/walls/wall 1.jpg',
  process.env.PUBLIC_URL + '/walls/wall 2.jpg',
  process.env.PUBLIC_URL + '/walls/wall 3.jpg',
  process.env.PUBLIC_URL + '/walls/wall 4.jpg',
];

function WallpapersBg() {
  return (
    <div className="wallpapers-bg" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'url(/walls/bg2.jpeg) center center / cover no-repeat',
      zIndex: 0
    }}>
    </div>
  );
}

function Layout() {
  const [user, setUser] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingCount2, setPendingCount2] = useState(0);

  // Function to get display name (first name only if full name is long)
  const getDisplayName = (fullName) => {
    if (!fullName) return "";
    const firstName = fullName.split(' ')[0];
    return fullName.length > 15 ? firstName : fullName;
  };

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
    // Count leaves where either statusHr or statusExec is PENDING
    const pending = Object.values(data).filter(
      (leave) => leave.statusHr === "PENDING" || leave.statusExec === "PENDING"
    );
    setPendingCount(pending.length);
  };
  window.fetchLeaves = fetchLeaves;
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
    <div>
      <WallpapersBg />
      {/* Top Navbar and Sidebar only when not on login page */}
      {!isLoginPage && (
        <>
          <div className="top-navbar">
            <div className="navbar-profile">
              <span>
                Hi, {getDisplayName(user?.name)}
              </span>
              <div className="profile-circle-mini">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <Button
                variant="contained"
                onClick={logoutHandler}
                className="logout"
              >
                Logout&nbsp; <LogoutIcon fontSize="small"/>
              </Button>
            </div>
          </div>
          <div className="left-container">
            {(user?.role === "hr" || user?.role ==="executive") ? (
              <nav>
                <div className="sidebar-category">Main</div>
                <ul>
                  <li><Link to="/dashboard"><span className="sidebar-icon"><DashboardIcon fontSize="inherit" /></span>Dashboard</Link></li>
                  <li><Link to="/add-employee"><span className="sidebar-icon"><PersonAddIcon fontSize="inherit" /></span>Add Employee</Link></li>
                  <li><Link to="/report-management"><span className="sidebar-icon"><AssessmentIcon fontSize="inherit" /></span>Report Management</Link></li>
                </ul>
                <div className="sidebar-category">{user?.role.toUpperCase()} Actions</div>
                <ul>
                  <li style={{ position: "relative" }}>
                    <Link to="/leave-management"><span className="sidebar-icon"><CalendarMonthIcon fontSize="inherit" /></span>Leave Management</Link>
                    {pendingCount > 0 && (
                      <span className="sidebar-notification-badge">{pendingCount}</span>
                    )}
                  </li>
                  <li style={{ position: "relative" }}>
                    <Link to="/requested-changes"><span className="sidebar-icon"><ChangeCircleIcon fontSize="inherit" /></span>Requested Changes</Link>
                    {pendingCount2 > 0 && (
                      <span className="sidebar-notification-badge">{pendingCount2}</span>
                    )}
                  </li>
                  <li><Link to="/employee-details"><span className="sidebar-icon"><PeopleIcon fontSize="inherit" /></span>Employee Details</Link></li>
                </ul>
                <div className="sidebar-category">Personal</div>
                <ul>
                  <li><Link to="/timer"><span className="sidebar-icon"><TimerIcon fontSize="inherit" /></span>Timer</Link></li>
                  <li><Link to="/request-leaves"><span className="sidebar-icon"><TimeToLeaveIcon fontSize="inherit" /></span>Request Leaves</Link></li>
                  <li><Link to="/personal-details"><span className="sidebar-icon"><AccountCircleIcon fontSize="inherit" /></span>Personal Details</Link></li>
                  <li><Link to="/schedule-meeting"><span className="sidebar-icon"><EventIcon fontSize="inherit" /></span>Schedule Meeting</Link></li>
                </ul>
              </nav>
            ) : (
              user?.role === "development team" ||
              user?.role === "sales team" ||
              user?.role === "ai specialist" ? (
                <nav>
                  <ul>
                    <li><Link to="/timer"><span className="sidebar-icon"><DashboardIcon fontSize="inherit" /></span>Dashboard</Link></li>
                    <li><Link to="/request-leaves"><span className="sidebar-icon"><TimeToLeaveIcon fontSize="inherit" /></span>Request Leaves</Link></li>
                    <li><Link to="/personal-details"><span className="sidebar-icon"><AccountCircleIcon fontSize="inherit" /></span>Personal Details</Link></li>
                    <li><Link to="/schedule-meeting"><span className="sidebar-icon"><EventIcon fontSize="inherit" /></span>Schedule Meeting</Link></li>
                  </ul>
                </nav>
              ) : (
                ""
              )
            )}
          </div>
        </>
      )}
      {/* Main Content */}
      {!isLoginPage ? (
        <div className="container">
          <div className={`right-container`}>
            <div className="logo-container">
              <img id="logom" src={logo} alt="Logo" />
            </div>
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
                <Route
                  path="/schedule-meeting"
                  element={<ProtectedRoute element={<ScheduleMeeting />} />}
                />
                {/* Catch-all route (redirect to login if no route matched) */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
        </Routes>
      )}
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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111',
        color: '#fff',
        fontSize: '1.5rem',
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0
      }}>
        This site is not supported on mobile devices. Please use a desktop browser.
      </div>
    );
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
