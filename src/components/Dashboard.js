import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import { Paper } from "@mui/material";
import bgIcon from "../utilities/bg-icon.svg";
import "chart.js/auto";
import axios from "axios";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState({});
  const [activeEmployees, setActiveEmployees] = useState([]);

  // Dummy Data for Graph
  const employeeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Employee Growth",
        data: [1, 3, 4, employees.length],
        backgroundColor: "rgba(110, 142, 251, 0.2)",
        borderColor: "#6e8efb",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6e8efb",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
    ],
  };

  const onlineData = {
    labels: ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM"],
    datasets: [
      {
        label: "Active Employees",
        data: [2, 3, 4, 3, 4, activeEmployees.length],
        backgroundColor: "rgba(0, 210, 255, 0.2)",
        borderColor: "#00d2ff",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#00d2ff",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Dummy Online Employees Data
  const onlineEmployees = [
    { id: 101, name: "John Doe", timer: "02:15:30", status: "Active" },
    { id: 102, name: "Jane Smith", timer: "01:45:10", status: "Active" },
    { id: 103, name: "Mike Johnson", timer: "03:30:15", status: "Active" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const u = localStorage.getItem("user");
      if (u != null) {
        setUser(JSON.parse(u));
        clearInterval(interval);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (user?.role === "hr" || user?.role ==="executive") {
      // console.log("user" ,user)

      const fetchEmployees = async () => {
        try {
          const res = await axios.get(
            "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json"
          );
          const data = res.data
            ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
            : [];
          setEmployees(data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };

      fetchEmployees();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "hr" || user?.role ==="executive") {
      const fetchActiveEmployees = async () => {
        try {
          const res = await axios.get(
            "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json"
          );
          // console.log("response...", res);
          if (!res.data) return setActiveEmployees([]);
          const nineHoursAgo = Date.now() - 9 * 60 * 60 * 1000;

          const data = Object.values(res.data).filter(
            (entry) => entry.start === true && entry.timestamp >= nineHoursAgo
          );
          setActiveEmployees(data);
          // console.log("nineHoursAgo:", nineHoursAgo, " Timer", entry.dateTime);
        } catch (error) {
          console.error("Error fetching active employees:", error);
        }
      };

      fetchActiveEmployees();
      const interval = setInterval(fetchActiveEmployees, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <div className="row">
        {/* Graph Section */}
        <div className="col-md-6">
          <div className="column glass-card total-employees-card">
            <div className="card-header">
              <h2>Total Employees</h2>
              <div className="employee-count-wrapper">
                <p className="employee-count">{employees.length}</p>
                <span className="employee-label">Employees</span>
              </div>
            </div>
            <div className="chart-container">
              <Line data={employeeData} options={chartOptions} />
            </div>
          </div>

          <div className="column glass-card online-employees-card">
            <div className="card-header">
              <h2>Online Employees</h2>
              <div className="online-count-wrapper">
                <p className="online-count">{activeEmployees.length}</p>
                <span className="online-label">Active Now</span>
              </div>
            </div>
            <div className="activity-indicators">
              <div className="activity-dot active"></div>
              <div className="activity-dot active"></div>
              <div className="activity-dot active"></div>
              <div className="activity-dot"></div>
              <div className="activity-dot"></div>
            </div>
            <div className="status-message">
              <span className="status-dot"></span>
              System Active
            </div>
          </div>
        </div>
      </div>

      {/* Table for Online Employees */}
      <div className="row">
      <div className="row-table-section">
        <h4 className="myTableHeader">
          Active Employees
        </h4>
        <table>
          <thead>
            <tr>
              <th className="fade-in-heading">Name</th>
              <th className="fade-in-heading">Email</th>
              <th className="fade-in-heading">Checkin Time</th>
              <th className="fade-in-heading">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...activeEmployees].reverse().map((employee) => (
              <tr key={employee.email}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.dateTime}</td>
                <td className="status active">
                  <span>
                    {" "}
                    {employee.start && employee.pause ? "On Break" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
