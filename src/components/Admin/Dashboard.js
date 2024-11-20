import React from 'react';
import Background from '../../assets/background_login.jpg';
import { auth, signOut } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Header Component
const Header = ({ handleLogout }) => (
  <header className="bg-card text-card-foreground shadow-md p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold">Admin</h1>
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
        href="/dashboard"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Dashboard
      </a>
      <a
        href="/dashboarduser"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Users
      </a>
      <a
        href="#"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Reports
      </a>
    </nav>
  </aside>
);

// AdminDashboard Component (Main Container)
const Dashboard = () => {
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

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header handleLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="flex-1 p-4">Welcome Admin!!!</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
