import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);

  // Dummy Data for Graph
  const employeeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Employees",
        data: [300, 320, 330, 340, 345, 350],
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
  }, []);

  useEffect(() => {
    const fetchActiveEmployees = async () => {
      try {
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json"
        );
        console.log("response...", res);
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
  }, []);

  return (
    <div className="dashboard-container">
      <div className="row">
        {/* Graph Section */}
        <div className="col-md-6">
          <div className="column graph-section">
            <h2>Total Employees</h2>
            <Line data={employeeData} />
            <p className="employee-count">{employees.length} Employees</p>
          </div>

          {/* Online Employees Count */}
          <div className="column online-section">
            <h2>Online Employees</h2>
            <p className="online-count">
              Currently Active: {activeEmployees.length}
            </p>
          </div>
        </div>
      </div>

      {/* Table for Online Employees */}
      <div className="row-table-section">
        <h2>Active Employees</h2>
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
            {activeEmployees.map((employee) => (
              <tr key={employee.email}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.dateTime}</td>
                <td className="status active">
                  {employee.start && employee.pause ? "On Break" : "Active"}
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
