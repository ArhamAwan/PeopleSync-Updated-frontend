import React, { useEffect, useState } from "react";
import "./EmployeeDetails.css";
import axios from "axios";

const EmployeeDetails = () => {
  const [employeesD, setEmployeesD] = useState([
    {
      id: 1,
      name: "John Doe",
      position: "Software Engineer",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Elm Street, Cityville",
      dob: "1990-01-15",
      description: "Passionate about coding and solving complex problems.",
      salary: 80000,
      benefits: 5000,
      deductions: 2000,
      netSalary: 83000,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "UI/UX Designer",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      address: "456 Oak Avenue, Townsville",
      dob: "1992-03-22",
      description: "Focused on creating user-friendly designs.",
      salary: 75000,
      benefits: 4000,
      deductions: 1500,
      netSalary: 77500,
      image: "https://via.placeholder.com/150",
    },
  ]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (employee) => {
    setEditForm({ ...employee });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === editForm.id
          ? { ...editForm, netSalary: calculateNetSalary(editForm) }
          : employee
      )
    );
    setIsEditing(false);
    setSelectedEmployee(null);
  };

  const calculateNetSalary = (employee) => {
    const salary = parseFloat(employee.salary) || 0;
    const benefits = parseFloat(employee.benefits) || 0;
    const deductions = parseFloat(employee.deductions) || 0;
    return salary + benefits - deductions;
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

    fetchEmployees();
  }, []);
  // console.log(employees);
  return (
    <div>
      <div className="search-row">
        <div className="heading-em">
          <h2>Employee Details</h2>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search employee by name..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      {/* List of Employee Profiles */}
      <div className="employee-cards">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="employee-card"
            onClick={() => setSelectedEmployee(employee)}
          >
            {/* <img
              src={`${process.env.PUBLIC_URL}/pexels-mart-production-7709149.jpg`}
              alt="Employee"
              className="profile-image"
            /> */}
            <div className="profile-container">
              <div className="profile-circle">
                {employee.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <h3>{employee.name}</h3>
            <p>{employee.role}</p>
          </div>
        ))}
      </div>

      {/* Popup for Employee Details */}
      {selectedEmployee && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing popup on click inside
          >
            <div className="popup-header">
              <h3>{selectedEmployee.name}</h3>
              <button
                className="edit-icon"
                onClick={() => handleEdit(selectedEmployee)}
              >
                ✎
              </button>
            </div>
            {/* <img
              src={selectedEmployee.image}
              alt={selectedEmployee.name}
              className="popup-image"
            /> */}
            <div className="profile-container">
              <div className="profile-circle">
                {selectedEmployee.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="employee-details">
              <p>
                <strong>Full Name:</strong> {selectedEmployee.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedEmployee.phone}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedEmployee.dob}
              </p>
              <p>
                <strong>Gender:</strong> {selectedEmployee.gender}
              </p>
              <p>
                <strong>ID Card:</strong> {selectedEmployee.idCard}
              </p>
              <p>
                <strong>Job Role:</strong> {selectedEmployee.role}
              </p>
              <p>
                <strong>Department:</strong> {selectedEmployee.department}
              </p>
              <p>
                <strong>Employee Type:</strong> {selectedEmployee.employeeType}
              </p>
              <p>
                <strong>Joining Date:</strong> {selectedEmployee.joiningDate}
              </p>
              <p>
                <strong>Salary:</strong> {selectedEmployee.salary}
              </p>
              <p>
                <strong>Bank Details:</strong> {selectedEmployee.bankDetails}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Password:</strong> {selectedEmployee.password}
              </p>
            </div>

            <button onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Employee Form */}
      {isEditing && (
        <div className="popup-overlay" onClick={() => setIsEditing(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Employee Details</h3>
            <form>
              <label>
                Full Name:
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Position:
                <input
                  type="text"
                  name="position"
                  value={editForm.position}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="dob"
                  value={editForm.dob}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Salary:
                <input
                  type="number"
                  name="salary"
                  value={editForm.salary}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Benefits:
                <input
                  type="number"
                  name="benefits"
                  value={editForm.benefits}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Deductions:
                <input
                  type="number"
                  name="deductions"
                  value={editForm.deductions}
                  onChange={handleFormChange}
                />
              </label>
              <button type="button" onClick={handleSave}>
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
