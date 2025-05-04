import React, { useState, useEffect } from "react";
import "./ReportManagement.css";
import axios from "axios";
import { TextField } from "@mui/material";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/reports.json"
        );
        const data = res.data
          ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
          : [];

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTotalss = {};

        data.forEach((report) => {
          const reportDate = report.timestamp
            ? new Date(report.timestamp)
            : null;
          if (
            reportDate &&
            reportDate.getMonth() === currentMonth &&
            reportDate.getFullYear() === currentYear
          ) {
            if (!monthlyTotalss[report.email]) monthlyTotalss[report.email] = 0;
            monthlyTotalss[report.email] += report.totalTimeMinutes || 0;
          }
        });

        setReports(data);
        setMonthlyTotals(monthlyTotalss); // ⬅️ You'll need to define this in state
        setLoading(false);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  const formatMinutesToHHMM = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

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
            <th>Active Time</th>
            <th>Monthly Active Time</th>
            <th style={{ textAlign: "center" }}>Actions</th>
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
                <td
                  style={{
                    backgroundColor: "#f0f8ff",
                    fontWeight: "500",
                  }}
                >
                  {formatMinutesToHHMM(report.totalTimeMinutes || 0)}
                </td>
                <td
                  style={{
                    backgroundColor: "#e6ffe6",
                    fontWeight: "500",
                  }}
                >
                  {formatMinutesToHHMM(monthlyTotals[report.email] || 0)}
                </td>

                <td style={{ textAlign: "center" }}>
                  <button
                    className="r_btn"
                    onClick={() => setSelectedReport(report)}
                  >
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
          <div className="popup-contentR">
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
                  className="r_show"
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
