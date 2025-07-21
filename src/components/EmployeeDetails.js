import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./EmployeeDetails.css";
import axios from "axios";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { FaUser, FaPhone, FaCalendarAlt, FaIdCard, FaUserTie, FaUsers, FaUserClock, FaCalendarCheck, FaDollarSign, FaUniversity, FaEnvelope, FaKey, FaVenusMars } from "react-icons/fa";

// === EMPLOYEE DETAILS ===
// Shows detailed info for each employee, allows editing and deleting, uses a modal popup.

// Component for the employee details popup
const EmployeeDetailsPopup = ({ selectedEmployee, setSelectedEmployee, editField, editValue, setEditField, setEditValue, updateHandler, handleDeleteClick, showArchives, fieldIcons, fields, getInitials }) => {
  if (!selectedEmployee) return null;
  
  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={() => setSelectedEmployee(null)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-button"
          onClick={() => setSelectedEmployee(null)}
        >
          <CloseIcon />
        </button>
        
        <div className="profile-container2">
          {selectedEmployee.image ? (
            <img 
              src={selectedEmployee.image} 
              alt={selectedEmployee.name} 
              className="popup-image"
            />
          ) : (
            <div className="profile-circle">
              {getInitials(selectedEmployee.name)}
            </div>
          )}
        </div>
        
        <div className="employee-details">
          <h2>{selectedEmployee.name}</h2>
          
          {fields.map((field) => {
            if (!selectedEmployee[field]) return null;
            
            return (
              <p key={field}>
                <span className="field-label">
                  {fieldIcons[field]} <strong>{field.charAt(0).toUpperCase() + field.slice(1)}</strong>
                </span>
                
                {editField === field ? (
                  <div className="edit-field">
                    {field === "role" ? (
                      <select
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="hr">HR</option>
                        <option value="executive">Executive</option>
                        <option value="development team">Development Team</option>
                        <option value="sales team">Sales Team</option>
                        <option value="ai specialist">AI Specialist</option>
                      </select>
                    ) : (
                      <input
                        type={field === "password" ? "password" : "text"}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                      />
                    )}
                    <div className="action-buttons">
                      <button className="save-button" onClick={updateHandler}>
                        Save
                      </button>
                      <button 
                        className="cancel-button" 
                        onClick={() => {
                          setEditField(null);
                          setEditValue("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="field-value">
                    <span className="value">
                      {field === "password" 
                        ? "••••••••" 
                        : selectedEmployee[field]}
                    </span>
                    <button 
                      className="edit-button"
                      onClick={() => {
                        setEditField(field);
                        setEditValue(selectedEmployee[field]);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </div>
                )}
              </p>
            );
          })}
          
          {!showArchives && (
            <div className="action-buttons">
              <button className="delete-button" onClick={handleDeleteClick}>
                Delete Employee
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [archives, setArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [showArchives, setShowArchives] = useState(false);
  const cardsContainerRef = useRef(null);

  const fields = [
    "name",
    "phone",
    "dob",
    "gender",
    "idCard",
    "designation",
    "role",
    "employeeType",
    "joiningDate",
    "salary",
    "bankDetails",
    "email",
    "password",
  ];

  const fieldIcons = {
    name: <FaUser />,
    phone: <FaPhone />,
    dob: <FaCalendarAlt />,
    gender: <FaVenusMars />,
    idCard: <FaIdCard />,
    designation: <FaUserTie />,
    role: <FaUsers />,
    employeeType: <FaUserClock />,
    joiningDate: <FaCalendarCheck />,
    salary: <FaDollarSign />,
    bankDetails: <FaUniversity />,
    email: <FaEnvelope />,
    password: <FaKey />,
  };

  // === EDIT LOGIC ===
  // Handles editing of employee fields, including setting editField and editValue, and updating Firebase.
  const updateHandler = async () => {
    if (!selectedEmployee || !editField) return;
    try {
      const { email } = selectedEmployee;
      const response = await axios.get(
        `https://people-sync-33225-default-rtdb.firebaseio.com/employees.json`
      );
      const employees = response.data;
      const employeeKey = Object.keys(employees).find(
        (key) => employees[key].email === email
      );

      if (employeeKey) {
        await axios.patch(
          `https://people-sync-33225-default-rtdb.firebaseio.com/employees/${employeeKey}.json`,
          { [editField]: editValue }
        );
        setSelectedEmployee({ ...selectedEmployee, [editField]: editValue });
        setEditField(null);
        setEditValue("");
      } else {
        console.error("Employee not found");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  
  // === DELETE LOGIC ===
  // Handles deleting an employee (moves to archives, removes from users in Firebase).
  const deleteHandler = async (email) => {
    try {
      // 1. Move employee to archives
      const empRes = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json"
      );
      const empData = empRes.data;
      const empKey = Object.keys(empData).find(
        (key) => empData[key].email === email
      );

      if (empKey) {
        const employee = empData[empKey];

        // Save to archives
        await axios.post(
          "https://people-sync-33225-default-rtdb.firebaseio.com/archives.json",
          employee
        );

        // Delete from employees
        await axios.delete(
          `https://people-sync-33225-default-rtdb.firebaseio.com/employees/${empKey}.json`
        );

        console.log("Employee moved to archives");
      } else {
        console.log("Employee not found");
      }

      // 2. Delete from users
      const userRes = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/users.json"
      );
      const userData = userRes.data;
      const userKey = Object.keys(userData).find(
        (key) => userData[key].email === email
      );

      if (userKey) {
        await axios.delete(
          `https://people-sync-33225-default-rtdb.firebaseio.com/users/${userKey}.json`
        );
        console.log("User deleted");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    window.location.reload();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name?.toLowerCase().includes(searchTerm)
  );

  const filteredArchives = archives.filter((employee) =>
    employee.name?.toLowerCase().includes(searchTerm)
  );
  
  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirm = (email) => {
    deleteHandler(email);
    setOpenConfirm(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
    
    const fetchArchives = async () => {
      try {
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/archives.json"
        );
        const data = res.data;
        const formatted = Object.keys(data || {}).map((key) => ({
          id: key,
          ...data[key],
        }));
        setArchives(formatted);
      } catch (error) {
        console.error("Error fetching archives:", error);
      }
    };

    fetchEmployees();
    fetchArchives();
  }, []);

  // Reset scroll position when switching tabs
  useEffect(() => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollTop = 0;
    }
  }, [showArchives]);

  return (
    <div className="employee-details-wrapper">
      <div className="search-row">
        <div className="heading-em">
          <h4 className="myTableHeader">
            Employee Details
          </h4>
        </div>

        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search Employee"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      <div className="tab-buttons">
        <button 
          className={`tab-button ${!showArchives ? 'active' : ''}`} 
          onClick={() => setShowArchives(false)}
        >
          Active Employees
        </button>
        <button 
          className={`tab-button ${showArchives ? 'active' : ''}`} 
          onClick={() => setShowArchives(true)}
        >
          Archives
        </button>
      </div>

      <div className="employee-cards-container">
        <div className="employee-cards" ref={cardsContainerRef}>
          {(showArchives ? filteredArchives : filteredEmployees).length > 0 ? (
            (showArchives ? filteredArchives : filteredEmployees).map((employee, index) => (
              <div
                key={employee.id || index}
                className="employee-card"
                onClick={() => setSelectedEmployee(employee)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {employee.image ? (
                  <img src={employee.image} alt={employee.name} />
                ) : (
                  <div className="profile-circle">
                    {getInitials(employee.name)}
                  </div>
                )}
                <h3>{employee.name || "Unknown"}</h3>
                <p>{employee.designation || employee.role || "No designation"}</p>
                <p>{employee.email || "No email"}</p>
              </div>
            ))
          ) : (
            <div className="no-employees-message">
              <p>No {showArchives ? "archived" : "active"} employees found</p>
            </div>
          )}
        </div>
      </div>

      {/* Render popup using portal */}
      <EmployeeDetailsPopup 
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        editField={editField}
        editValue={editValue}
        setEditField={setEditField}
        setEditValue={setEditValue}
        updateHandler={updateHandler}
        handleDeleteClick={handleDeleteClick}
        showArchives={showArchives}
        fieldIcons={fieldIcons}
        fields={fields}
        getInitials={getInitials}
      />

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
          style: {
            background: 'rgba(25, 30, 45, 0.95)',
            borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '32px 24px',
            minWidth: 340,
            maxWidth: 420,
            color: '#fff',
            textAlign: 'center',
          }
        }}
        style={{zIndex:"10000000"}}
        aria-labelledby="alert-dialog-title"
      >
        <div style={{ color: '#f44336', fontWeight: 700, fontSize: '1.22rem', marginBottom: 18 }}>
          Delete Employee
        </div>
        <div style={{ color: '#fff', marginBottom: 18, fontSize: '1.08rem' }}>
          Are you sure you want to <b>permanently delete</b> this employee? This action cannot be undone.
        </div>
        <DialogActions style={{ justifyContent: 'center', gap: 16, marginTop: 18 }}>
          <Button onClick={() => setOpenConfirm(false)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, fontWeight: 600, padding: '8px 22px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(selectedEmployee?.email)}
            autoFocus
            style={{ background: '#f44336', color: '#fff', borderRadius: 8, fontWeight: 700, padding: '8px 22px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeDetails;
