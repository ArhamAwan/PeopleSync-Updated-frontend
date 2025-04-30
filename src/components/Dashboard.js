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
        label: "Employee Graph",
        data: [1, 3, 4, employees.length],
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderColor: "#2563eb",
        borderWidth: 2,
      },
    ],
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
    if (user?.role === "hr") {
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
    if (user?.role === "hr") {
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
          <div className="column graph-section">
            <h2>Total Employees</h2>
            <p className="employee-count">{employees.length} Employees</p>
            <Line data={employeeData} />
          </div>

          <div className="column online-section">
          <img src={bgIcon} height="150px" />
            <p className="online-count">{activeEmployees.length}</p>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <h2>Online Employees</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Table for Online Employees */}
      <div className="row-table-section">
        <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
          Active Employees
        </h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Checkin Time</th>
              <th>Status</th>
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
  );
};

export default Dashboard;
