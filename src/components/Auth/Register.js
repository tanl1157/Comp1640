import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { realTimeDb, set, ref, auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

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
      <a href="/dashboard" className="block p-2 rounded-lg hover:bg-secondary/80">Dashboard</a>
      <a href="/dashboarduser" className="block p-2 rounded-lg hover:bg-secondary/80">Users</a>
      <a href="#" className="block p-2 rounded-lg hover:bg-secondary/80">Reports</a>
    </nav>
  </aside>
);

// Register Component
const sharedInputClasses = "mt-1 block w-full p-2 border border-input rounded-md bg-background text-foreground";
const sharedLabelClasses = "block text-sm font-medium text-muted-foreground";

const Register = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showMajorField, setShowMajorField] = useState(false);
  const [major, setMajor] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setShowMajorField(true);
    } else {
      setShowMajorField(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Tạo người dùng với email và mật khẩu
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;  // Lấy UID của người dùng mới đăng ký
  
      // Lưu dữ liệu người dùng vào Firebase Realtime Database
      await set(ref(realTimeDb, 'users/' + userId), {
        userName,
        email,
        role,
        major,
        password,
      });
  
      // Điều hướng đến trang khác sau khi đăng ký thành công
      navigate('/dashboarduser');
    } catch (error) {
      setError('Registration failed. Please try again.');
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
      <h2 className="text-2xl font-bold text-card-foreground mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-semibold">User Name</label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="text-sm font-semibold">User Role</label>
          <select
            id="role"
            className="w-full p-2 border border-gray-300 rounded"
            value={role}
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
              className="w-full p-2 border border-gray-300 rounded"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
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
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Register;
