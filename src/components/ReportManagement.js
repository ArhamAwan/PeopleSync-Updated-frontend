import React, { useState, useEffect } from "react";
import "./ReportManagement.css";
import axios from "axios";
import { TextField } from "@mui/material";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/reports.json"
        );
        const data = res.data
          ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
          : [];
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="report-management">
      <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
        Report Management
      </h4>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading reports...</td>
            </tr>
          ) : reports.length === 0 ? (
            <tr>
              <td colSpan="4">No reports found</td>
            </tr>
          ) : (
            [...reports].reverse().map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.email}</td>
                <td>{report.dateTime}</td>
                <td>
                  <button onClick={() => setSelectedReport(report)}>
                    View Report
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Report Popup */}
      {selectedReport && (
        <div className="popup">
          <div className="popup-content">
            <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
              Report Details
            </h4>
            <div className="report-details">
              <div className="report-field">
                <h3>Name</h3>
                <p>{selectedReport.name}</p>
              </div>
              <div className="report-field">
                <h3>Email</h3>
                <p>{selectedReport.email}</p>
              </div>
              <div className="report-field">
                <h3>Date & Time</h3>
                <p>{selectedReport.dateTime}</p>
              </div>
              <div className="report-field">
                <h3>Report</h3>
                <TextField
                  value={selectedReport.report}
                  multiline
                  rows={4}
                  fullWidth
                  size="small"
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                />
              </div>
            </div>

            {/* <button onClick={() => setSelectedReport(null)}>Close</button> */}
            <div className="close-icon" onClick={() => setSelectedReport(null)}>
              &#x2715; {/* Unicode for the 'X' symbol */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
