import React, { useState, useEffect } from "react";
import "./ReportManagement.css";
import axios from "axios";
import { TextField, InputAdornment, Button, Pagination } from "@mui/material";
import { FaEye, FaRegClock, FaCalendarAlt, FaEnvelope, FaUser, FaTimes, FaSearch, FaFileExport, FaFilter, FaSortAmountDown, FaSortAmountUp, FaChartBar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [displayReports, setDisplayReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [reportsPerPage] = useState(10);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });

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
        setFilteredReports(data);
        setMonthlyTotals(monthlyTotalss);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter reports based on search term and date range
  useEffect(() => {
    let results = [...reports]; // Create a copy to avoid modifying the original
    
    // Filter by search term
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(report => 
        (report.name && report.name.toLowerCase().includes(term)) || 
        (report.email && report.email.toLowerCase().includes(term)) ||
        (report.report && report.report.toLowerCase().includes(term))
      );
    }
    
    // Filter by date range
    if (startDate && endDate) {
      results = results.filter(report => {
        const reportDate = report.timestamp ? new Date(report.timestamp) : null;
        if (!reportDate) return false;
        
        return reportDate >= startDate && reportDate <= endDate;
      });
    }
    
    setFilteredReports(results);
    // Reset to first page when filters change
    setPage(1);
  }, [searchTerm, startDate, endDate, reports]);
  
  // Sort and paginate the filtered reports
  useEffect(() => {
    // Sort reports
    let sortedReports = [...filteredReports];
    if (sortConfig.key) {
      sortedReports.sort((a, b) => {
        // Handle different data types for sorting
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle timestamp specifically for date sorting
        if (sortConfig.key === 'timestamp') {
          aValue = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          bValue = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        }
        
        // Handle totalTimeMinutes for time sorting
        if (sortConfig.key === 'totalTimeMinutes') {
          aValue = a.totalTimeMinutes || 0;
          bValue = b.totalTimeMinutes || 0;
        }
        
        // Handle strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle numbers and dates
        return sortConfig.direction === 'asc' 
          ? (aValue - bValue) 
          : (bValue - aValue);
      });
    }
    
    // Calculate pagination
    const indexOfLastReport = page * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const paginatedReports = sortedReports.slice(indexOfFirstReport, indexOfLastReport);
    
    setDisplayReports(paginatedReports);
  }, [filteredReports, page, reportsPerPage, sortConfig]);

  const formatMinutesToHHMM = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const handleExport = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Email,Date & Time,Active Time,Monthly Active Time,Report\n";
    
    filteredReports.forEach(report => {
      const activeTime = formatMinutesToHHMM(report.totalTimeMinutes || 0);
      const monthlyTime = formatMinutesToHHMM(monthlyTotals[report.email] || 0);
      const reportText = report.report ? `"${report.report.replace(/"/g, '""')}"` : "";
      
      csvContent += `"${report.name}","${report.email}","${report.dateTime}","${activeTime}","${monthlyTime}",${reportText}\n`;
    });
    
    // Create download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reports_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setFilteredReports(reports);
    setShowFilters(false);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSort = (key) => {
    // If the same key is clicked, toggle direction
    // Otherwise set new key with default direction 'desc'
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'desc' ? <FaSortAmountDown className="sort-icon" /> : <FaSortAmountUp className="sort-icon" />;
  };

  return (
    <div className="dashboard-container report-management">
      {/* Dashboard cards row */}
      <div className="row">
        {/* Summary Card */}
        <div className="glass-card reports-summary-card">
          <div className="card-header">
            <h2>Reports Summary</h2>
            <div className="report-count-wrapper">
              <p className="report-count">{reports.length}</p>
              <span className="report-label">Total Reports</span>
            </div>
          </div>
          
          <div className="report-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FaChartBar />
              </div>
              <div className="stat-content">
                <span className="stat-value">{filteredReports.length}</span>
                <span className="stat-label">Filtered Reports</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <FaRegClock />
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {formatMinutesToHHMM(
                    Object.values(monthlyTotals).reduce((sum, val) => sum + val, 0)
                  )}
                </span>
                <span className="stat-label">Total Monthly Hours</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search & Filter Card */}
        <div className="glass-card reports-filter-card">
          <div className="card-header">
            <h2>Search & Filters</h2>
          </div>
          
          <div className="search-container">
            <TextField
              placeholder="Search by name, email or report content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            
            <div className="filter-actions">
              <Button 
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
                variant="outlined"
                startIcon={<FaFilter />}
              >
                Date Filters
              </Button>
              
              <Button 
                className="export-btn"
                onClick={handleExport}
                variant="outlined"
                startIcon={<FaFileExport />}
                disabled={filteredReports.length === 0}
              >
                Export CSV
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="date-filters-container animate__animated animate__fadeIn">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="date-filters">
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    className="date-picker"
                    slotProps={{
                      textField: {
                        size: "small",
                        className: "date-picker"
                      }
                    }}
                  />
                  
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    className="date-picker"
                    slotProps={{
                      textField: {
                        size: "small",
                        className: "date-picker"
                      }
                    }}
                  />
                  
                  <Button 
                    onClick={resetFilters} 
                    variant="outlined"
                    className="reset-btn"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </LocalizationProvider>
            </div>
          )}
        </div>
      </div>
      
      <div className="horizontal-divider"></div>
      
      {/* Table Section */}
      {reports.length > 0 && (
        <div className="row-table-section">
          <h4 className="myTableHeader">
            EMPLOYEE REPORTS
          </h4>

          <div className="report-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable-header fade-in-heading">
                    <FaUser style={{ marginRight: "8px" }} />Employee
                    {getSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('email')} className="sortable-header fade-in-heading">
                    <FaEnvelope style={{ marginRight: "8px" }} />Email
                    {getSortIcon('email')}
                  </th>
                  <th onClick={() => handleSort('timestamp')} className="sortable-header fade-in-heading">
                    <FaCalendarAlt style={{ marginRight: "8px" }} />Date & Time
                    {getSortIcon('timestamp')}
                  </th>
                  <th onClick={() => handleSort('totalTimeMinutes')} className="sortable-header fade-in-heading">
                    <FaRegClock style={{ marginRight: "8px" }} />Active Time
                    {getSortIcon('totalTimeMinutes')}
                  </th>
                  <th className="fade-in-heading">
                    <FaRegClock style={{ marginRight: "8px" }} />Monthly Active Time
                  </th>
                  <th style={{ textAlign: "center" }} className="fade-in-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading reports...</td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="6">No reports found</td>
                  </tr>
                ) : (
                  displayReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.name}</td>
                      <td>{report.email}</td>
                      <td>{report.dateTime}</td>
                      <td className="active-time-cell">
                        {formatMinutesToHHMM(report.totalTimeMinutes || 0)}
                      </td>
                      <td className="monthly-time-cell">
                        {formatMinutesToHHMM(monthlyTotals[report.email] || 0)}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <button
                          className="view-report-btn"
                          onClick={() => setSelectedReport(report)}
                        >
                          <FaEye style={{ marginRight: "6px" }} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredReports.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {Math.min((page - 1) * reportsPerPage + 1, filteredReports.length)} - {Math.min(page * reportsPerPage, filteredReports.length)} of {filteredReports.length} reports
              </div>
              <div className="simple-pagination">
                <button 
                  className="pagination-btn prev"
                  onClick={() => page > 1 && handlePageChange(null, page - 1)}
                  disabled={page === 1}
                >
                  <FaChevronLeft />
                </button>
                <div className="page-number">
                  {page}
                </div>
                <button 
                  className="pagination-btn next"
                  onClick={() => page < Math.ceil(filteredReports.length / reportsPerPage) && handlePageChange(null, page + 1)}
                  disabled={page >= Math.ceil(filteredReports.length / reportsPerPage)}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Popup */}
      {selectedReport && (
        <div className="popup">
          <div className="popup-contentR">
            <h4 className="popup-header">
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
                  className="report-text-field"
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

            <div className="close-icon" onClick={() => setSelectedReport(null)}>
              <FaTimes />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
