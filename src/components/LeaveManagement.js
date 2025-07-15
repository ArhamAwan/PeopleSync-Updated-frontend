import React, { useState, useEffect } from "react";
import "./LeaveManagement.css";
import axios from "axios";
import { FaCalendarAlt, FaUserClock, FaCheck, FaTimes } from "react-icons/fa";

const LeaveManagement = () => {
  const [user, setUser] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayRequests, setDisplayRequests] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const u = localStorage.getItem("user");
      if (u != null) {
        const userObject = JSON.parse(u);
        setUser(userObject);
        clearInterval(interval);
      }
    }, 500);
  }, []);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
        );
        const data = res.data
          ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
          : [];

        setLeaveRequests(data);
        setDisplayRequests([...data].reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleApproval = async (id, action) => {
    try {
      const status = action === "APPROVED" ? "APPROVED" : "REJECTED";

      const fieldToUpdate = user.role === "hr" ? "statusHr" : "statusExec";

      await axios.patch(
        `https://people-sync-33225-default-rtdb.firebaseio.com/leaves/${id}.json`,
        { [fieldToUpdate]: status }
      );

      console.log(`Leave request ${status.toLowerCase()}`);

      // Fetch fresh leave data after approval/rejection
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
      );
      const data = res.data
        ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
        : [];

      setLeaveRequests(data);
      setDisplayRequests([...data].reverse());
    } catch (error) {
      console.error(
        `Error ${
          action === "approve" ? "approving" : "rejecting"
        } leave request:`,
        error
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheck className="status-icon approved" />;
      case "REJECTED":
        return <FaTimes className="status-icon rejected" />;
      default:
        return <FaUserClock className="status-icon pending" />;
    }
  };

  return (
    <div className="dashboard-container leave-management">
      {/* Table Section */}
      <div className="row-table-section">
        <h4 className="myTableHeader">Leave Management</h4>

        <div className="report-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th className="fade-in-heading">Employee</th>
                <th className="fade-in-heading">Leave Type</th>
                <th className="fade-in-heading">
                  <div className="sortable-header">
                    <span>Dates</span>
                    <FaCalendarAlt className="header-icon" />
                  </div>
                </th>
                <th className="fade-in-heading">Days</th>
                <th className="fade-in-heading">HR Status</th>
                <th className="fade-in-heading">Exec Status</th>
                <th className="fade-in-heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="loading-indicator">
                      Loading leave requests...
                    </div>
                  </td>
                </tr>
              ) : displayRequests.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="no-data-message">
                      No leave requests found
                    </div>
                  </td>
                </tr>
              ) : (
                displayRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="employee-name">
                        {request.employeeName}
                      </div>
                      <div className="employee-email">
                        {request.employeeEmail}
                      </div>
                    </td>
                    <td className="leave-type-cell">{request.leaveType}</td>
                    <td className="date-range-cell">
                      <div className="date-range">
                        <span className="start-date">{request.startDate}</span>
                        <span className="date-separator">to</span>
                        <span className="end-date">{request.endDate}</span>
                      </div>
                    </td>
                    <td className="days-cell">{request.totalLeaves} days</td>
                    {/* HR Status */}
                    <td>
                      {request.statusHr === "PENDING" ? (
                        <div className="status-badge pending">
                          {getStatusIcon(request.statusHr)}
                          <span>{request.statusHr}</span>
                        </div>
                      ) : (
                        <div
                          className={`status-badge ${request.statusHr.toLowerCase()}`}
                        >
                          {getStatusIcon(request.statusHr)}
                          <span>{request.statusHr}</span>
                        </div>
                      )}
                    </td>

                    {/* EXEC Status */}
                    <td>
                      {request.statusExec === "PENDING" ? (
                        <div className="status-badge pending">
                          {getStatusIcon(request.statusExec)}
                          <span>{request.statusExec}</span>
                        </div>
                      ) : (
                        <div
                          className={`status-badge ${request.statusExec.toLowerCase()}`}
                        >
                          {getStatusIcon(request.statusExec)}
                          <span>{request.statusExec}</span>
                        </div>
                      )}
                    </td>

                    <td>
                      {user.role === "hr" && request.statusHr === "PENDING" ? (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApproval(request.id, "APPROVED")
                            }
                          >
                            <FaCheck /> APPROVE
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleApproval(request.id, "REJECTED")
                            }
                          >
                            <FaTimes /> REJECT
                          </button>
                        </div>
                      ) : user.role === "executive" &&
                        request.statusExec === "PENDING" ? (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApproval(request.id, "APPROVED")
                            }
                          >
                            <FaCheck /> APPROVE
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleApproval(request.id, "REJECTED")
                            }
                          >
                            <FaTimes /> REJECT
                          </button>
                        </div>
                      ) : (
                        <span className="processed-label">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
