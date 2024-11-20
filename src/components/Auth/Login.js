import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import Background from '../../assets/background_login.jpg';
import { auth } from '../../firebaseConfig'; // Import Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import hàm đăng nhập của Firebase
import { getDatabase, ref, get, child } from 'firebase/database';

const SHARED_CLASSES = {
  input: 'w-full p-2 border border-border rounded-lg',
  label: 'block text-muted-foreground',
  button: 'p-2 rounded-lg flex items-center justify-center',
  flexCenter: 'flex items-center justify-center',
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // Để lưu lỗi khi đăng nhập thất bại
  const navigate = useNavigate(); // Khởi tạo navigate để điều hướng sau khi đăng nhập thành công

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Đăng nhập người dùng
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;
      const userEmail = userCredential.user.email; // Lấy email của người dùng
  
      // Kiểm tra nếu là admin
      if (userEmail === 'admin@gmail.com') {
        navigate('/dashboard');
        return; // Dừng tại đây nếu là admin
      }
  
      // Lấy role của người dùng từ Realtime Database
      const db = getDatabase();
      const userRoleRef = ref(db, `users/${userId}/role`);
      const snapshot = await get(userRoleRef);
  
      if (snapshot.exists()) {
        const role = snapshot.val();
  
        // Điều hướng dựa trên role
        if (role === 'teacher') {
          navigate('/dashboardteacher');
        } else if (role === 'student') {
          navigate('/dashboardstudent');
        } else if (role === 'guest') {
          navigate('/dashboardguest');
        } else {
          setError('Không nhận diện được quyền truy cập.');
        }
      } else {
        setError('Không tìm thấy quyền truy cập của người dùng.');
      }
    } catch (error) {
      setError('Đăng nhập thất bại! Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
    }
  };

  return (
    <div
      className={`${SHARED_CLASSES.flexCenter} min-h-screen bg-background`}
      style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-sm">
        <Header />
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full p-2 rounded-lg"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

const Header = () => (
  <div className={`${SHARED_CLASSES.flexCenter} mb-4`}>
    <img
      src="https://openui.fly.dev/openui/24x24.svg?text=🌐"
      alt="Sitemark Logo"
      className="mr-2"
    />
    <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
  </div>
);

const InputField = ({ label, id, type, placeholder, value, onChange }) => (
  <div className="mb-4">
    <label className={SHARED_CLASSES.label} htmlFor={id}>
      {label}
    </label>
    <input
      className={SHARED_CLASSES.input}
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default Login;
