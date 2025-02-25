import React from 'react';
import './AddEmployee.css';

const AddEmployee = () => {
  return (
    <form className="add-employee-form">
      <h2>Add Employee</h2>

      {/* Personal Information */}
      <div className="section">
        <h3>Personal Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter full name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter email" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" placeholder="Enter phone number" required />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="national-id">National ID / SSN</label>
            <input type="text" id="national-id" placeholder="Enter ID/SSN" required />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="section">
        <h3>Job Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Job Role</label>
            <select id="role" required>
              <option value="">Select role</option>
              <option value="manager">Manager</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="hr">HR</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input type="text" id="department" placeholder="Enter department name" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="joining-date">Joining Date</label>
            <input type="date" id="joining-date" required />
          </div>
          <div className="form-group">
            <label htmlFor="employee-type">Employee Type</label>
            <select id="employee-type" required>
              <option value="">Select type</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contractor">Contractor</option>
              <option value="intern">Intern</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddEmployee;
