import React, { useState } from 'react';
import './EmployeeDetails.css';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Elm Street, Cityville',
      dob: '1990-01-15',
      description: 'Passionate about coding and solving complex problems.',
      salary: 80000,
      benefits: 5000,
      deductions: 2000,
      netSalary: 83000,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'UI/UX Designer',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      address: '456 Oak Avenue, Townsville',
      dob: '1992-03-22',
      description: 'Focused on creating user-friendly designs.',
      salary: 75000,
      benefits: 4000,
      deductions: 1500,
      netSalary: 77500,
      image: 'https://via.placeholder.com/150',
    },
    // Add more employees as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');
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
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === editForm.id ? { ...editForm, netSalary: calculateNetSalary(editForm) } : employee
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

  return (
    <div className="employee-details-container">
      <h2>Employee Details</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search employee by name..."
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>

      {/* List of Employee Profiles */}
      <div className="employee-cards">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="employee-card"
            onClick={() => setSelectedEmployee(employee)}
          >
            <img src={employee.image} alt={employee.name} className="employee-image" />
            <h3>{employee.name}</h3>
            <p>{employee.position}</p>
          </div>
        ))}
      </div>

      {/* Popup for Employee Details */}
      {selectedEmployee && (
        <div className="popup-overlay" onClick={() => setSelectedEmployee(null)}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing popup on click inside
          >
            <div className="popup-header">
              <h3>{selectedEmployee.name}</h3>
              <button className="edit-icon" onClick={() => handleEdit(selectedEmployee)}>
                ✎
              </button>
            </div>
            <img
              src={selectedEmployee.image}
              alt={selectedEmployee.name}
              className="popup-image"
            />
            <p><strong>Position:</strong> {selectedEmployee.position}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
            <p><strong>Address:</strong> {selectedEmployee.address}</p>
            <p><strong>Date of Birth:</strong> {selectedEmployee.dob}</p>
            <p><strong>Description:</strong> {selectedEmployee.description}</p>
            <p><strong>Salary:</strong> ${selectedEmployee.salary}</p>
            <p><strong>Benefits:</strong> ${selectedEmployee.benefits}</p>
            <p><strong>Deductions:</strong> ${selectedEmployee.deductions}</p>
            <p><strong>Net Salary:</strong> ${selectedEmployee.netSalary}</p>
            <button onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Employee Form */}
      {isEditing && (
        <div className="popup-overlay" onClick={() => setIsEditing(false)}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
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
