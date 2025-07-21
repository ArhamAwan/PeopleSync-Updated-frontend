// === LEAVE MANAGEMENT ===
// Displays and manages leave requests, with real-time updates and approval/rejection logic.
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

  // === REAL-TIME UPDATES ===
  // useEffect with setInterval to auto-refresh leave requests every 5 seconds.
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
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(fetchLeaveRequests, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // === APPROVAL LOGIC ===
  // Handles approval/rejection of leave requests by HR/Exec roles, updates Firebase and refreshes data.
  const handleApproval = async (id, action) => {
    try {
      const status = action === "APPROVED" ? "APPROVED" : "REJECTED";

      const fieldToUpdate = user.role === "hr" ? "statusHr" : "statusExec";

      await axios.patch(
        `https://people-sync-33225-default-rtdb.firebaseio.com/leaves/${id}.json`,
        { [fieldToUpdate]: status }
      );

      console.log(`Leave request ${status?.toLowerCase()}`);

      // Fetch fresh leave data after approval/rejection
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
      );
      const data = res.data
        ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
        : [];

      setLeaveRequests(data);
      setDisplayRequests([...data].reverse());
      if (window.fetchLeaves) window.fetchLeaves();
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

  // === TABLE RENDER ===
  // Renders the leave requests table with sticky headers and no horizontal scroll.
  return (
    <div className="dashboard-container leave-management">
      {/* Table Section */}
      <div className="row-table-section">
        <h4 className="myTableHeader">Leave Management</h4>

        <div className="report-table-container">
          <table className="employee-table" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>
              <tr>
                <th className="fade-in-heading" style={{ width: '20%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Employee</th>
                <th className="fade-in-heading" style={{ width: '12%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Leave Type</th>
                <th className="fade-in-heading" style={{ width: '20%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>
                  <div className="sortable-header">
                    <span>Dates</span>
                    <FaCalendarAlt className="header-icon" />
                  </div>
                </th>
                <th className="fade-in-heading" style={{ width: '10%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Days</th>
                <th className="fade-in-heading" style={{ width: '12%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>HR Status</th>
                <th className="fade-in-heading" style={{ width: '12%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Exec Status</th>
                <th className="fade-in-heading" style={{ width: '14%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <div className="loading-indicator">
                      Loading leave requests...
                    </div>
                  </td>
                </tr>
              ) : displayRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <div className="no-data-message">
                      No leave requests found
                    </div>
                  </td>
                </tr>
              ) : (
                displayRequests.map((request) => (
                  <tr key={request.id}>
                    <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <div className="employee-name">
                        {request.employeeName}
                      </div>
                      <div className="employee-email">
                        {request.employeeEmail}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{request.leaveType}</td>
                    <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <div className="date-range">
                        <span className="start-date">{request.startDate}</span>
                        <span className="date-separator">to</span>
                        <span className="end-date">{request.endDate}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{request.totalLeaves} days</td>
                    {/* HR Status */}
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      {request.statusHr === "PENDING" ? (
                        <div className="status-badge pending">
                          {getStatusIcon(request.statusHr)}
                          <span>{request.statusHr}</span>
                        </div>
                      ) : (
                        <div
                          className={`status-badge ${request?.statusHr?.toLowerCase()}`}
                        >
                          {getStatusIcon(request.statusHr)}
                          <span>{request.statusHr}</span>
                        </div>
                      )}
                    </td>

                    {/* EXEC Status */}
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      {request.statusExec === "PENDING" ? (
                        <div className="status-badge pending">
                          {getStatusIcon(request.statusExec)}
                          <span>{request.statusExec}</span>
                        </div>
                      ) : (
                        <div
                          className={`status-badge ${request?.statusExec?.toLowerCase()}`}
                        >
                          {getStatusIcon(request.statusExec)}
                          <span>{request.statusExec}</span>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      {user.role === "hr" && request.statusHr === "PENDING" ? (
                        <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApproval(request.id, "APPROVED")
                            }
                            style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                          >
                            <FaCheck /> APPROVE
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleApproval(request.id, "REJECTED")
                            }
                            style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                          >
                            <FaTimes /> REJECT
                          </button>
                        </div>
                      ) : user.role === "executive" &&
                        request.statusExec === "PENDING" ? (
                        <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApproval(request.id, "APPROVED")
                            }
                            style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                          >
                            <FaCheck /> APPROVE
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleApproval(request.id, "REJECTED")
                            }
                            style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
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
