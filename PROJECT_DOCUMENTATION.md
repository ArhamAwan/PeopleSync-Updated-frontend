# PeopleSync-Updated-frontend: Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Key Technologies Used](#3-key-technologies-used)
4. [Component-by-Component Breakdown](#4-component-by-component-breakdown)
5. [Feature Explanations & User Flows](#5-feature-explanations--user-flows)
6. [Special Logic & Implementation Details](#6-special-logic--implementation-details)
7. [Styling & Responsiveness](#7-styling--responsiveness)
8. [Data Flow & Firebase Integration](#8-data-flow--firebase-integration)
9. [Authentication & Role-Based UI](#9-authentication--role-based-ui)
10. [How to Run, Build, and Develop](#10-how-to-run-build-and-develop)
11. [Tips for Demoing or Presenting](#11-tips-for-demoing-or-presenting)
12. [Further Improvements (Optional for Q&A)](#12-further-improvements-optional-for-qa)

---

## 1. Project Overview
PeopleSync is a modern HR management system frontend built with React. It features:
- Employee management (add, edit, delete, view details)
- Leave management (request, approve/reject, annual limits)
- Employee activity reports (timer, monthly/active time)
- Real-time updates (auto-refresh, notification badges)
- Glassmorphic, responsive UI
- Firebase Realtime Database backend
- Role-based UI (HR, Executive, Employee, etc.)
- Custom notifications, modals, and validation

---

## 2. Project Structure

```
PeopleSync-Updated-frontend/
├── public/                # Static assets (images, icons, manifest)
├── src/
│   ├── components/        # All React components (UI, logic)
│   ├── firebase.js        # Firebase configuration
│   ├── App.js             # Main app component, routing, sidebar, global logic
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md              # Project info
```

### Key Files/Folders:
- **components/**: All main UI and logic (AddEmployee, Dashboard, EmployeeDetails, LeaveManagement, etc.)
- **firebase.js**: Sets up Firebase Realtime Database connection.
- **App.js**: Handles routing, layout, sidebar, notification badges, and global logic (user greeting, mobile restriction, etc.).
- **index.js**: React entry point.
- **public/assets/**: Logos, backgrounds, and images.

---

## 3. Key Technologies Used
- **React**: UI framework (functional components, hooks, portals)
- **Firebase Realtime Database**: Backend for all data (employees, leaves, reports, etc.)
- **Material UI (MUI)**: UI components (buttons, dialogs, icons)
- **React Icons**: Iconography
- **Axios**: HTTP requests to Firebase
- **EmailJS**: Email notifications (for leave requests, etc.)
- **Glassmorphism CSS**: Modern, frosted-glass UI
- **React Portals**: For modals/popups outside normal DOM flow

---

## 4. Component-by-Component Breakdown

### App.js
- **Purpose:** Main entry for the app UI, routing, sidebar, and global logic.
- **Key Features:**
  - Routing (using React Router) to all pages/components
  - Sidebar with navigation and notification badges (pending leaves, requested changes)
  - User greeting (shows first name if name is long)
  - Mobile restriction overlay (blocks app on small screens)
  - Global state for user info, notification counts
  - Fetches pending leave/request counts every 5 seconds for real-time badges
- **Where Used:** Always rendered (except on login page)
- **Key Functions:**
  - `fetchLeaves`, `fetchRequests`: Fetch and count pending items for badges
  - `logoutHandler`: Clears user and redirects to login
  - Mobile check: Shows overlay if window width < 900px

### firebase.js
- **Purpose:** Firebase config and initialization
- **Key Features:**
  - Exports Firebase app and database reference
  - Used for CRUD operations in all components
- **Where Used:** Imported in any component needing direct Firebase SDK access (most use Axios for REST API)

### Dashboard.js
- **Purpose:** Main landing page after login
- **Key Features:**
  - Shows total employees, online employees, and quick stats
  - Uses cards with glassmorphic design
  - Responsive layout
- **Where Used:** `/dashboard` route

### AddEmployee.js
- **Purpose:** Add new employees via a multi-step form
- **Key Features:**
  - Multi-step form (Personal Info, Job Details, Account Details)
  - Validates all fields (name, phone, DOB, email, etc.)
  - **DOB restriction:** Only allows users 18+ (max date and validation)
  - Password must be at least 7 characters
  - On submit: creates employee and user in Firebase, sends email with credentials
  - Shows custom toast notifications for success/error
- **Where Used:** `/add-employee` route
- **Key Functions:**
  - `validateStep`: Validates each form step
  - `handleSubmit`: Submits new employee to Firebase
  - `showToast`: Shows custom notification

### EmployeeDetails.js
- **Purpose:** View and edit details for any employee (popup/modal)
- **Key Features:**
  - Shows all employee fields (name, email, role, etc.)
  - Edit any field (with animated input, validation)
  - **Role edit:** Dropdown with predefined roles
  - **Password edit:** Must be at least 7 characters
  - Delete employee (moves to archives, removes from users)
  - Uses React Portal for popup
  - Edit buttons are compact, icon-only, and animated
  - All changes reflected in real-time
- **Where Used:** `/employee-details` route, popup from employee list
- **Key Functions:**
  - `updateHandler`: Handles field updates (with validation)
  - `deleteHandler`: Moves employee to archives and deletes from users

### PersonalDetails.js
- **Purpose:** View and edit logged-in user's own details
- **Key Features:**
  - Shows all personal fields
  - Edit any field (with validation)
  - **Password edit:** Must be at least 7 characters
  - Uses modal popup for editing
- **Where Used:** `/personal-details` route
- **Key Functions:**
  - `handleEdit`, `handleModalSave`: Edit and save personal fields

### LeaveManagement.js
- **Purpose:** Manage all leave requests (HR/Exec roles)
- **Key Features:**
  - Table of all leave requests (employee, type, dates, days, status, actions)
  - Approve/reject leave (HR/Exec roles)
  - **Annual leave limit:** Cannot request more than 15 days per year (enforced in RequestLeaves.js)
  - Table auto-refreshes every 5 seconds (real-time)
  - Sticky headers, no horizontal scroll, glassmorphic style
  - Email column: single-line with ellipsis for overflow
  - Notification badge in sidebar for pending requests
- **Where Used:** `/leave-management` route
- **Key Functions:**
  - `handleApproval`: Approve/reject leave, updates Firebase, triggers sidebar badge update

### RequestLeaves.js
- **Purpose:** Employees request new leaves
- **Key Features:**
  - Form to request leave (type, dates, reason)
  - **Annual leave limit:** Cannot request more than 15 days per year (checks all approved/pending leaves for current year)
  - Shows leave summary and history
  - Custom toast notifications for errors/success
- **Where Used:** `/request-leaves` route
- **Key Functions:**
  - `handleSubmit`: Validates and submits leave request
  - `showToast`: Shows custom notification

### ReportManagement.js
- **Purpose:** View all employee activity reports
- **Key Features:**
  - Table of all reports (employee, email, date, active time, monthly time, actions)
  - View report details in a modal (React Portal)
  - Table: sticky headers, no horizontal scroll, glassmorphic style
  - Email column: single-line with ellipsis for overflow
  - Pagination, search, and export to CSV
- **Where Used:** `/report-management` route
- **Key Functions:**
  - `setSelectedReport`: Opens report details modal

### RequestedChanges.js
- **Purpose:** Track all requested changes to employee data
- **Key Features:**
  - Table of all requested changes (pending updates)
  - Real-time updates (auto-refresh every 5 seconds)
  - Maps raw field names to human-readable labels
- **Where Used:** `/requested-changes` route

### Timer.js
- **Purpose:** Employee time tracking
- **Key Features:**
  - Start, pause, resume, and stop timer (with activity report)
  - State is persisted in localStorage for reliability
  - All actions update Firebase (for audit/history)
  - Custom notification (toast) for all actions (no browser alerts)
  - Buttons are context-aware (enabled/disabled based on state)
- **Where Used:** `/timer` route
- **Key Functions:**
  - `startTimer`, `pauseTimer`, `resumeTimer`, `stopTimer`: Timer logic
  - `showToast`: Shows custom notification

### ScheduleMeeting.js
- **Purpose:** Schedule meetings via embedded booking widget
- **Key Features:**
  - Embeds external booking iframe
  - Loads external script for widget
- **Where Used:** `/schedule-meeting` route

---

## 5. Feature Explanations & User Flows

### Authentication & Role-Based UI
- **Where:** App.js, login.js, localStorage
- **How:**
  - On login, user info (name, email, role) is stored in localStorage
  - App.js reads user info and sets global state
  - Sidebar and routes are conditionally rendered based on user role (HR, Executive, Employee, etc.)
  - Only HR/Exec see Leave Management, Requested Changes, Add Employee, etc.

### Adding an Employee
- **Where:** AddEmployee.js
- **How:**
  - Multi-step form collects all required info
  - Validates each field (name, phone, DOB, email, etc.)
  - **DOB restriction:** Only allows users 18+ (max date and validation)
  - On submit, creates employee and user in Firebase, sends email with credentials
  - Shows custom toast notification for success/error

### Editing Employee Details
- **Where:** EmployeeDetails.js (popup/modal)
- **How:**
  - Click edit icon next to any field to open input/select
  - For role: shows dropdown with predefined roles
  - For password: must be at least 7 characters
  - On save, updates Firebase and closes input
  - Delete button moves employee to archives and removes from users

### Leave Management & Requests
- **Where:** LeaveManagement.js, RequestLeaves.js
- **How:**
  - Employees request leave via form (type, dates, reason)
  - **Annual leave limit:** Checks all approved/pending leaves for current year; blocks if over 15 days
  - HR/Exec see all leave requests in table, can approve/reject
  - Table auto-refreshes every 5 seconds
  - Sidebar badge shows number of pending requests (updates instantly after action)
  - Email column: single-line with ellipsis for overflow

### Employee Reports
- **Where:** ReportManagement.js
- **How:**
  - Table shows all reports (employee, email, date, active time, monthly time)
  - View button opens report details modal (React Portal)
  - Table: sticky headers, no horizontal scroll, glassmorphic style
  - Email column: single-line with ellipsis for overflow
  - Pagination, search, and export to CSV

### Timer
- **Where:** Timer.js
- **How:**
  - Employees start, pause, resume, and stop timer
  - On stop, must submit activity report
  - All actions update Firebase and show custom notification
  - Timer state is persisted in localStorage

### Notifications & Real-Time Updates
- **Where:** App.js, Timer.js, RequestLeaves.js, LeaveManagement.js, RequestedChanges.js
- **How:**
  - Custom toast notification component (glassmorphic, top-center)
  - Used for timer actions, leave requests, errors, etc.
  - Tables auto-refresh every 5 seconds using setInterval in useEffect
  - Sidebar badges update instantly after actions (via global fetch functions)

### Modals & Popups
- **Where:** EmployeeDetails.js, ReportManagement.js, PersonalDetails.js
- **How:**
  - Use React Portal to render modals outside normal DOM flow
  - Glassmorphic style: blurred background, rounded corners, drop shadow
  - Animated transitions for edit fields

---

## 6. Special Logic & Implementation Details

- **React Portals:** Used for all modals/popups to ensure overlays are not constrained by parent containers (see EmployeeDetails.js, ReportManagement.js).
- **Sticky Table Headers:** CSS `position: sticky` keeps headers visible while scrolling (see all main tables).
- **Field Name Mapping:** RequestedChanges.js maps raw DB keys to readable labels for user-friendly display.
- **Edit Button Animation:** Edit fields animate in with fade/slide for smooth UX (see EmployeeDetails.js, PersonalDetails.js).
- **Timer State:** Uses localStorage to persist timer state across reloads (see Timer.js).
- **Role-Based UI:** Sidebar and routes are conditionally rendered based on user role (see App.js).
- **Auto-Refresh:** setInterval in useEffect for real-time data sync (see LeaveManagement.js, RequestedChanges.js, App.js for badges).
- **Annual Leave Limit:** RequestLeaves.js checks all approved/pending leaves for current year and blocks if over 15 days.
- **Mobile Restriction:** App.js blocks app on screens <900px with a full-screen overlay.
- **Single-Line Email Columns:** Email columns in tables use CSS for ellipsis and no wrapping.

---

## 7. Styling & Responsiveness
- **Glassmorphism:** All cards, tables, and modals use frosted-glass backgrounds, blur, and transparency (see all .css files).
- **Consistent Color Palette:** Blues, dark backgrounds, white text for a modern look.
- **Responsive Design:** Media queries in CSS ensure layout adapts to desktop and mobile (though mobile is blocked for this app).
- **Animations:** Fade-in, slide, and scale for modals, edit fields, and cards.
- **Sidebar:** Fixed, glassmorphic, with notification badges and section headers.

---

## 8. Data Flow & Firebase Integration
- **How Data is Fetched:** Most components use Axios to call the Firebase Realtime Database REST API (e.g., `axios.get('.../leaves.json')`).
- **How Data is Updated:** POST, PATCH, and DELETE requests via Axios update Firebase (see AddEmployee.js, LeaveManagement.js, etc.).
- **Real-Time Sync:** Tables and badges auto-refresh every 5 seconds to stay up-to-date.
- **Firebase Config:** See `src/firebase.js` for setup (most logic uses REST API for simplicity).

---

## 9. Authentication & Role-Based UI
- **User Info:** Stored in localStorage after login (see login.js, App.js)
- **Role-Based Rendering:** Sidebar and routes are conditionally rendered based on user role (see App.js)
- **Protected Routes:** Only accessible if user is logged in (see ProtectedRoute in App.js)

---

## 10. How to Run, Build, and Develop

### Prerequisites
- Node.js and npm installed

### Install Dependencies
```
npm install
```

### Start Development Server
```
npm start
```
- Runs the app at http://localhost:3000

### Build for Production
```
npm run build
```
- Outputs static files to `build/`

### Firebase Setup
- Update `src/firebase.js` with your Firebase project config
- Make sure your Firebase Realtime Database rules allow read/write for development

---

## 11. Tips for Demoing or Presenting
- Highlight real-time updates (open two tabs, show instant sync)
- Show role-based UI (login as HR, Exec, Employee)
- Demonstrate glassmorphic design and responsive layout
- Show timer functionality and custom notifications
- Point out code structure and how easy it is to extend
- Mention use of React Portals for modals and real-time polling for data
- Show annual leave limit and DOB restriction in AddEmployee
- Show mobile restriction overlay by resizing browser

---

## 12. Further Improvements (Optional for Q&A)
- Add authentication (Firebase Auth)
- Add user avatars/images
- Add more granular permissions
- Add unit tests (Jest, React Testing Library)
- Add dark/light mode toggle
- Add admin dashboard for analytics
- Add audit logs for all actions

---

**This documentation is now fully detailed for technical Q&A, code walkthroughs, and presentations.**

 