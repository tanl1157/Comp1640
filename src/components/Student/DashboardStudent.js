import React from 'react';
import Background from '../../assets/background_login.jpg';
import { auth, signOut } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Button} from '@mui/material';
import { useState, useEffect } from 'react';
import { onValue, ref, remove } from "firebase/database";
import { realTimeDb } from "../../firebaseConfig";


// Header Component
const Header = ({ handleLogout }) => (
  <header className="bg-card text-card-foreground shadow-md p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold">Student</h1>
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
        href="/dashboardstudent"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Student
      </a>
    </nav>
  </aside>
);
//css for add-assignment
const cardClasses = "p-3 border-b border-border";
const tableHeaderClasses = "p-3 text-left border-b border-border";
const buttonClass = "flex items-center bg-primary text-primary-foreground hover:bg-primary/80 p-2 rounded-lg";
const iconClass = "mr-2";

// AdminDashboard Component (Main Container)
const DashboardStudent = () => {
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

  // button upload
  const handleUpload = () => {
    navigate('/submitassignment'); // Điều hướng đến trang SubmitAssignment
  };
  
  // Quản lý trạng thái assignments
  const [assignments, setAssignments] = useState([]);

  // Lấy dữ liệu từ Firebase khi component được mount
  useEffect(() => {
    const assignmentsRef = ref(realTimeDb, "assignments");
    const unsubscribe = onValue(assignmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển đổi dữ liệu từ dạng object sang array
        const formattedData = Object.entries(data).map(([id, value]) => ({
          id, // Firebase ID để hỗ trợ các hành động như xóa
          ...value,
        }));
        setAssignments(formattedData);
      } else {
        setAssignments([]); // Xóa dữ liệu nếu không còn tồn tại
      }
    });

    return () => unsubscribe(); // Cleanup listener khi component bị unmount
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header handleLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
         <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10">
              <h2 className="text-2xl font-bold mb-4">Assignment</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className=" text-secondary-foreground">
                    <th className={tableHeaderClasses}>New Subject</th>
                    <th className={tableHeaderClasses}>Department</th>
                    <th className={tableHeaderClasses}>Deadline</th>
                    <th className={tableHeaderClasses}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className={cardClasses}>{assignment.subject}</td>
                        <td className={cardClasses}>{assignment.department}</td>
                        <td className={cardClasses}>{assignment.deadline}</td>
                        <button className={buttonClass} onClick={handleUpload}>
                            <img
                            aria-hidden="true"
                            alt="arrow-up-tray"
                            src="https://openui.fly.dev/openui/24x24.svg?text=⬆️"
                            className={iconClass}
                            />
                            Upload
                        </button>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4">
                        No assignments available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardStudent;
