// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Các thành phần (components) của bạn
import Login from './components/Auth/Login';
import Dashboard from './components/Admin/Dashboard';
import DashboardUser from './components/Admin/DashboardUser';
import DashboardTeacher from './components/Teacher/DashboardTeacher';
import DashboardStudent from './components/Student/DashboardStudent';
import DashboardGuest from './components/Guest/DashboardGuest';
import Register from './components/Auth/Register';
import EditUser from './components/Admin/EditUser';
import AddAccount from './components/Admin/AddAccount';
import SubmitAssignment from './components/Student/SubmitAssignment';
import AssignmentNotification from './components/Teacher/AssignmentNotification';
import AssignmentAdd from './components/Teacher/AssignmentAdd';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/dashboarduser" element={<DashboardUser />} />
        <Route path="/dashboardteacher" element={<DashboardTeacher />} />
        <Route path="/dashboardstudent" element={<DashboardStudent />} />
        <Route path="/dashboardguest" element={<DashboardGuest />} />
        <Route path="/edituser/:userId" element={<EditUser />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submitassignment" element={<SubmitAssignment />} />
        <Route path="/assignmentnotification" element={<AssignmentNotification />} />
        <Route path="/assignment/add" element={<AssignmentAdd />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
