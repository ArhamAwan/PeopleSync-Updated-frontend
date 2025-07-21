// === REQUESTED CHANGES ===
// Displays all requested changes to employee data, with real-time updates.
import React, { useState, useEffect } from "react";
import "./LeaveManagement.css";
import axios from "axios";

const RequestedChanges = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/requests.json"
      );
      const data = res.data
        ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
        : [];
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // === REAL-TIME UPDATES ===
  // useEffect with setInterval to auto-refresh requested changes every 5 seconds.
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproval = async (request, action) => {
    try {
      const { id, email, fieldName, fieldValue } = request;

      if (action === "approve") {
        // Step 1: Update request status to APPROVED
        await axios.patch(
          `https://people-sync-33225-default-rtdb.firebaseio.com/requests/${id}.json`,
          { status: "APPROVED" }
        );
        // Step 2: Find employee by email and update their field
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json"
        );
        const employees = res.data;

        const employeeEntry = Object.entries(employees).find(
          ([_, emp]) => emp.email === email
        );

        if (employeeEntry) {
          const [empId] = employeeEntry;

          await axios.patch(
            `https://people-sync-33225-default-rtdb.firebaseio.com/employees/${empId}.json`,
            { [fieldName]: fieldValue }
          );
          console.log(
            `Field "${fieldName}" updated to "${fieldValue}" for employee ${email}`
          );
        } else {
          console.warn(`Employee with email ${email} not found.`);
        }
      } else if (action === "reject") {
        // Step 1: Update request status to REJECTED
        await axios.patch(
          `https://people-sync-33225-default-rtdb.firebaseio.com/requests/${id}.json`,
          { status: "REJECTED" }
        );
      }

      // Step 3: Refresh requests
      const updatedRes = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/requests.json"
      );
      const updatedData = updatedRes.data
        ? Object.entries(updatedRes.data).map(([id, obj]) => ({ id, ...obj }))
        : [];
      setRequests(updatedData);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // === TABLE RENDER ===
  // Renders the requested changes table, mapping raw field names to human-readable labels.
  return (
    <div className="leave-management">
      <div className="row-table-section">
        <h4 className="myTableHeader">
          Requested Changes
        </h4>
                <div className="report-table-container">
          <table className="employee-table" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>
              <tr>
                <th style={{ width: '15%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Employee</th>
                <th style={{ width: '20%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Email</th>
                <th style={{ width: '12%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Field</th>
                <th style={{ width: '20%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Requested Value</th>
                <th style={{ width: '12%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Status</th>
                <th style={{ width: '21%', padding: '12px 8px', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(35px)' }}>Actions</th>
              </tr>
            </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-indicator" style={{ padding: '12px 8px', textAlign: 'center' }}>Loading leave requests...</td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data-message" style={{ padding: '12px 8px', textAlign: 'center' }}>No leave requests found</td>
              </tr>
            ) : (
              [...requests].reverse().map((request) => (
                <tr key={request.id}>
                  <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{request.name}</td>
                  <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{request.email}</td>
                  <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {request.fieldName === 'employeeType' ? 'Employee Type' :
                     request.fieldName === 'name' ? 'Name' :
                     request.fieldName === 'phone' ? 'Phone' :
                     request.fieldName === 'email' ? 'Email' :
                     request.fieldName === 'designation' ? 'Designation' :
                     request.fieldName === 'role' ? 'Role' :
                     request.fieldName === 'salary' ? 'Salary' :
                     request.fieldName === 'bankDetails' ? 'Bank Details' :
                     request.fieldName === 'password' ? 'Password' :
                     request.fieldName === 'dob' ? 'Date of Birth' :
                     request.fieldName === 'gender' ? 'Gender' :
                     request.fieldName === 'idCard' ? 'ID Card' :
                     request.fieldName === 'joiningDate' ? 'Joining Date' :
                     request.fieldName.charAt(0).toUpperCase() + request.fieldName.slice(1)}
                  </td>
                  <td style={{ padding: '12px 8px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {request.fieldName && request.fieldName.toLowerCase() === "password"
                      ? "••••••••"
                      : request.fieldValue}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {request.status === "pending" ? (
                      <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          className="approve-btn"
                          onClick={() => handleApproval(request, "approve")}
                          style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleApproval(request, "reject")}
                          style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                        >
                          Reject
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

export default RequestedChanges;
