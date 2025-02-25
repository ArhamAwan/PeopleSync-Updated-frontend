import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

// Import your components
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import ReportManagement from './components/ReportManagement';
import LeaveManagement from './components/LeaveManagement';
import EmployeeDetails from './components/EmployeeDetails';
import Timer from './components/Timer';
import RequestLeaves from './components/RequestLeaves';
import PersonalDetails from './components/PersonalDetails';

const logo = '/assets/gg.png';

function App() {
  return (
    <Router>
      <div className="container">
        {/* Left Sidebar */}
        <div className="left-container">
          <img id="logom" src={logo} alt="Logo" />
          <nav>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/add-employee">Add Employee</a></li>
              <li><a href="/report-management">Report Management</a></li>
              <li><a href="/leave-management">Leave Management</a></li>
              <li><a href="/employee-details">Employee Details</a></li>
              <li><a href="/timer">Timer</a></li>
              <li><a href="/request-leaves">Request Leaves</a></li>
              <li><a href="/personal-details">Personal Details</a></li>
            </ul>
          </nav>
        </div>

        {/* Right Content */}
        <div className="right-container">
          <div className="Nav-header-top">
            <h1>Abdullah Hassan</h1>
            <img 
  src={`${process.env.PUBLIC_URL}/pexels-mart-production-7709149.jpg`} 
  alt="Employee" 
  className="profile-image" 
/>

          </div>

          {/* Dynamic Content Area */}
          <div className="container-main">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/report-management" element={<ReportManagement />} />
              <Route path="/leave-management" element={<LeaveManagement />} />
              <Route path="/employee-details" element={<EmployeeDetails />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/request-leaves" element={<RequestLeaves />} />
              <Route path="/personal-details" element={<PersonalDetails />} />
              <Route path="/" element={<Dashboard />} /> {/* Default view */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
