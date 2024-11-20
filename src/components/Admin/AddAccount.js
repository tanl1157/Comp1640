// src/components/Admin/AddAccount.js
import { useState } from 'react';
import { firestore } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddAccount = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Thêm tài khoản vào Firestore
      await addDoc(collection(firestore, "users"), {
        email,
        name,
        role,
        password,
      });
      alert('Tạo tài khoản thành công');
    } catch (error) {
      console.error('Lỗi tạo tài khoản:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm Tài Khoản</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="teacher">Giáo viên</option>
          <option value="student">Học sinh</option>
        </select>
        <button type="submit">Tạo tài khoản</button>
      </form>
    </div>
  );
};

export default AddAccount;