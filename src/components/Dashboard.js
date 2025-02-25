import React from 'react';
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  // Dummy Data for Graph
  const employeeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Employees',
        data: [300, 320, 330, 340, 345, 350],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: '#2563eb',
        borderWidth: 2,
      },
    ],
  };

  // Dummy Online Employees Data
  const onlineEmployees = [
    { id: 101, name: 'John Doe', timer: '02:15:30', status: 'Active' },
    { id: 102, name: 'Jane Smith', timer: '01:45:10', status: 'Active' },
    { id: 103, name: 'Mike Johnson', timer: '03:30:15', status: 'Active' },
  ];

  return (
    <div className="dashboard-container">
      <div className="row">
        {/* Graph Section */}
        <div className="col-md-6">
        <div className="column graph-section">
          <h2>Total Employees</h2>
          <Line data={employeeData} />
          <p className="employee-count">345 Employees</p>
        </div>

        {/* Online Employees Count */}
        <div className="column online-section">
          <h2>Online Employees</h2>
          <p className="online-count">Currently Active: {onlineEmployees.length}</p>
        </div>
      </div>
      </div>

      {/* Table for Online Employees */}
      <div className="row-table-section">
        <h2>Active Employees</h2>
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Running Timer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {onlineEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.timer}</td>
                <td className="status active">{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
