# PeopleSync-Updated-frontend: Comprehensive Project Documentation

## 1. Project Overview
PeopleSync is a modern HR management system frontend built with React. It features employee management, leave and report tracking, real-time updates, and a beautiful glassmorphic UI. The app integrates with Firebase for backend data storage and uses Material UI and React Icons for a professional look.

---

## 2. Project Structure

```
PeopleSync-Updated-frontend/
├── public/                # Static assets (images, icons, manifest)
├── src/
│   ├── components/        # All React components (UI, logic)
│   ├── firebase.js        # Firebase configuration
│   ├── App.js             # Main app component, routing
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md              # Project info
```

### Key Files/Folders:
- **components/**: All main UI and logic (AddEmployee, Dashboard, EmployeeDetails, LeaveManagement, etc.)
- **firebase.js**: Sets up Firebase Realtime Database connection.
- **App.js**: Handles routing, layout, and global logic (user greeting, etc.).
- **index.js**: React entry point.
- **public/assets/**: Logos, backgrounds, and images.

---

## 3. Key Technologies Used
- **React**: UI framework (functional components, hooks)
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
- Handles routing between pages (Dashboard, AddEmployee, LeaveManagement, etc.)
- Displays user greeting (shows first name if name is long)
- Manages global state (user info, etc.)

### firebase.js
- Exports the Firebase app instance and database reference
- Used by all components for CRUD operations

### Dashboard.js
- Main landing page after login
- Shows quick stats, navigation, and user info

### AddEmployee.js
- Form to add new employees
- Validates input, sends data to Firebase
- Uses MUI icons and custom CSS

### EmployeeDetails.js
- Shows detailed info for each employee (in a popup)
- Allows editing fields (with animated input, real-time update)
- Delete employee (moves to archives, removes from users)
- Uses React Portal for popup
- Edit buttons are compact, icon-only, and animated
- All changes reflected in real-time

### PersonalDetails.js
- Shows logged-in user's own details
- Allows editing personal info (with validation)
- Uses similar UI/UX as EmployeeDetails

### LeaveManagement.js
- Table of all leave requests
- Approve/reject leave (HR/Exec roles)
- Table auto-refreshes every 5 seconds (real-time)
- Sticky headers, no horizontal scroll, glassmorphic style

### ReportManagement.js
- Table of all employee reports
- View report details in a modal (uses React Portal)
- Consistent table styling, sticky headers

### RequestedChanges.js
- Table of all requested changes (pending updates)
- Real-time updates (auto-refresh)
- Maps raw field names to human-readable labels

### Timer.js
- Time tracking for employees
- Start, pause, resume, and stop (with report submission)
- Custom glassmorphic notification (no browser alerts)
- Timer state persists in localStorage
- All actions update Firebase
- Buttons are context-aware (enabled/disabled based on state)

### ScheduleMeeting.js
- (If implemented) Handles meeting scheduling logic

---

## 5. Feature Explanations

### Authentication
- User info is stored in localStorage after login (handled elsewhere or in backend)
- Role-based UI: HR, Exec, Employee see different options

### Tables (Leave, Reports, Requested Changes)
- All tables use fixed layout, sticky headers, and responsive design
- No horizontal scrolling; all columns fit in view
- Padding, margin, and word-wrap for readability
- Real-time updates via polling (setInterval + Firebase)

### Modals & Popups
- All modals (edit, delete, report details) use React Portal for proper overlay
- Glassmorphic style: blurred background, rounded corners, drop shadow
- Animated transitions for edit fields

### Timer
- Start, pause, resume, and stop (with activity report)
- State is persisted in localStorage for reliability
- All actions update Firebase (for audit/history)
- Custom notification (toast) for all actions (no browser alerts)

### Notifications
- Custom toast notification component (glassmorphic, top-center)
- Used for timer actions and can be reused elsewhere

### Real-Time Updates
- Tables (leaves, requested changes) auto-refresh every 5 seconds
- Ensures all users see up-to-date data without manual refresh

### Styling
- Glassmorphism: frosted-glass backgrounds, blur, transparency
- Consistent color palette (blues, dark backgrounds, white text)
- Responsive: works on desktop and mobile
- Animations: fade-in, slide, and scale for modals and edit fields

---

## 6. Special Logic & Implementation Details

- **React Portals**: Used for all modals/popups to ensure overlays are not constrained by parent containers.
- **Sticky Table Headers**: CSS `position: sticky` keeps headers visible while scrolling.
- **Field Name Mapping**: RequestedChanges.js maps raw DB keys to readable labels.
- **Edit Button Animation**: Edit fields animate in with fade/slide for smooth UX.
- **Timer State**: Uses localStorage to persist timer state across reloads.
- **Role-Based UI**: Different actions/buttons shown based on user role.
- **Auto-Refresh**: setInterval in useEffect for real-time data sync.

---

## 7. How to Run, Build, and Develop

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

## 8. Tips for Demoing or Presenting
- Highlight real-time updates (open two tabs, show instant sync)
- Show role-based UI (login as HR, Exec, Employee)
- Demonstrate glassmorphic design and responsive layout
- Show timer functionality and custom notifications
- Point out code structure and how easy it is to extend
- Mention use of React Portals for modals and real-time polling for data

---

## 9. Further Improvements (Optional for Q&A)
- Add authentication (Firebase Auth)
- Add user avatars/images
- Add more granular permissions
- Add unit tests (Jest, React Testing Library)
- Add dark/light mode toggle

---

**Good luck on your final year project presentation!** 