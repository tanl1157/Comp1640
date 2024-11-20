import React from 'react';
import Background from '../../assets/background_login.jpg';
import { auth, signOut } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Button} from '@mui/material';
import { useState } from 'react';
import { ref, push } from "firebase/database"; 
import { realTimeDb } from "../../firebaseConfig";

// Header Component
const Header = ({ handleLogout }) => (
  <header className="bg-card text-card-foreground shadow-md p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold">Teacher</h1>
    </div>
    <div className="flex items-center space-x-4">
      <button
        className="bg-destructive text-destructive-foreground hover:bg-destructive/80 p-2 rounded-lg"
        onClick={handleLogout} // Add onClick handler for logout
      >
        Logout
      </button>
    </div>
  </header>
);

// Sidebar Component
const Sidebar = () => (
  <aside
    className="bg-card text-card-foreground w-64 p-4 hidden md:block"
    style={{ backgroundColor: '#FFFAFA' }}
  >
    <nav className="space-y-2">
      <a
        href="/dashboardteacher"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Dashboard
      </a>
      <a
        href="/assignmentnotification"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Reports
      </a>
    </nav>
  </aside>
);
//css for add-assignment
const inputClasses = "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const labelClasses = "block text-sm font-medium text-muted-foreground mb-1";
const formContainerClasses = "max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md";


// AdminDashboard Component (Main Container)
const AssignmentAdd = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  //Add-Assignment
  const [formData, setFormData] = useState({
    subject: '',
    department: '',
    deadline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bắt đầu trạng thái loading
  
    try {
      const assignmentsRef = ref(realTimeDb, "assignments");
      await push(assignmentsRef, {
        subject: formData.subject,
        department: formData.department,
        deadline: formData.deadline,
        createdAt: new Date().toISOString(),
      });
  
      alert("Assignment submitted successfully!");
      setFormData({ subject: "", department: "", deadline: "" });
  
      // Chuyển hướng đến '/assignmentnotification'
      navigate('/assignmentnotification');
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment. Please try again.");
    } finally {
      setIsLoading(false); // Kết thúc trạng thái loading
    }
  };
  

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header handleLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
        <div className={formContainerClasses}>
      <h2 className="text-xl font-bold mb-4">Create New Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className={labelClasses}>Name Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className={inputClasses}
            placeholder="Enter subject name"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="department" className={labelClasses}>Department</label>
          <select
            id="department"
            name="department"
            className={inputClasses}
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select department</option>
            <option value="IT">IT (International Technology)</option>
            <option value="BM">BM (Business Management)</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="deadline" className={labelClasses}>Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            className={inputClasses}
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>
            <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isLoading} // Vô hiệu hóa khi đang loading
                >
                {isLoading ? "Submitting..." : "Submit Assignment"}
            </button>
      </form>
    </div>
        </main>
      </div>
    </div>
  );
};

export default AssignmentAdd;
