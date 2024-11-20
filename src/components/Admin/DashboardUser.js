import { useEffect, useState } from 'react';
import { auth, signOut } from '../../firebaseConfig';
import { realTimeDb } from '../../firebaseConfig'; // Import Realtime Database
import { ref, get, remove } from 'firebase/database'; // Import get and ref functions from Firebase
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// DashboardUser Component
const DashboardUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from Realtime Database
    const fetchUsers = async () => {
      const userRef = ref(realTimeDb, 'users'); // Reference to 'users' node in Realtime Database
      const snapshot = await get(userRef); // Get the data from Realtime Database
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        // Convert the object into an array to map through in the table
        const usersArray = Object.keys(usersData).map((key) => ({
          id: key,
          ...usersData[key],
        }));
        setUsers(usersArray);
      } else {
        console.log('No data available');
      }
    };
    fetchUsers();
  }, []);

  // Header Component
  const Header = () => (
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
    <aside className="bg-card text-card-foreground w-64 p-4 hidden md:block">
      <nav className="space-y-2">
        <a href="/dashboard" className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80">Dashboard</a>
        <a href="/dashboarduser" className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80">Users</a>
        <a href="#" className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80">Reports</a>
      </nav>
    </aside>
  );

  // Button Created 
  const handleClick = () => {
    navigate('/register');
  };

   // Handle Logout
   const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Handle Edit
  const handleEdit = (userId) => {
    navigate(`/edituser/${userId}`); // Navigate to edit page for the specific user
  };
    // Handle Delete
    const handleDelete = async (userId) => {
      try {
        // Remove user from Realtime Database
        const userRef = ref(realTimeDb, 'users/' + userId);
        await remove(userRef);
        // Refresh the list of users
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    };

  return (
    <div className="form-container">
      <div className="bg-background text-foreground min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <Button variant="contained" sx={{ textTransform: 'none' }} onClick={handleClick}>Created</Button>
            <TableContainer component={Paper} className="mt-6">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Major</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.userName}</TableCell> {/* Changed to 'userName' */}
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.major || 'N/A'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={() => handleEdit(user.id)} 
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          onClick={() => handleDelete(user.id)} 
                          sx={{ marginLeft: 1 }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
