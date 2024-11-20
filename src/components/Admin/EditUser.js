import { useEffect, useState } from 'react';
import { realTimeDb } from '../../firebaseConfig'; // Import Realtime Database
import { ref, get, update } from 'firebase/database'; // Import get, update functions from Firebase
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
// Header Component
const Header = () => (
  <header className="bg-card text-card-foreground shadow-md p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold">Admin</h1>
    </div>
    <div className="flex items-center space-x-4">
      <button className="bg-destructive text-destructive-foreground hover:bg-destructive/80 p-2 rounded-lg">Logout</button>
    </div>
  </header>
);

// Sidebar Component
const Sidebar = () => (
  <aside className="bg-card text-card-foreground w-64 p-4 hidden md:block" style={{ backgroundColor: '#FFFAFA' }}>
    <nav className="space-y-2">
        <a href="/dashboard" className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80">Dashboard</a>
        <a href="/dashboarduser" className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80">Users</a>
        <a href="#" className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80">Reports</a>
      </nav>
  </aside>
);

// Edit User Component
const EditUser = () => {
  const { userId } = useParams(); // Get the userId from URL parameters
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userName: '',
    email: '',
    role: '',
    major: '',
    password: '',
  });
  const [showMajorField, setShowMajorField] = useState(false);

  useEffect(() => {
    // Fetch user data by userId from Firebase
    const fetchUserData = async () => {
      const userRef = ref(realTimeDb, 'users/' + userId); // Reference to the user data
      const snapshot = await get(userRef); // Get the data from Realtime Database
      if (snapshot.exists()) {
        setUser(snapshot.val()); // Set user data into state
      } else {
        console.log('No user found');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setUser(prevUser => ({
      ...prevUser,
      role: selectedRole,
    }));
    setShowMajorField(selectedRole === 'student'); // Show major field for students only
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userRef = ref(realTimeDb, 'users/' + userId); // Reference to user data
      await update(userRef, {
        userName: user.userName,
        email: user.email,
        role: user.role,
        major: user.major,
        password: user.password,
      });

      navigate('/dashboarduser'); // Redirect back to the dashboard after successful update
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  return (
    <div className="form-container">
      <div className="bg-background text-foreground min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Edit User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="text-sm font-semibold">User Name</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={user.userName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={user.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="text-sm font-semibold">User Role</label>
                  <select
                    id="role"
                    name="role"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={user.role}
                    onChange={handleRoleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
                {showMajorField && (
                  <div>
                    <label htmlFor="major" className="text-sm font-semibold">Major</label>
                    <select
                      id="major"
                      name="major"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={user.major}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="IT">IT (International Technology)</option>
                      <option value="BM">BM (Business Management)</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="password" className="text-sm font-semibold">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={user.password}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                  Update User
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
