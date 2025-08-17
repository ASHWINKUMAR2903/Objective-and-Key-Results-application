import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      alert('Signup successful! Please login.');
      navigate('/');
    } catch (err) {
      alert('Signup failed: ' + err.response.data.message || 'Unknown error');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label>Name</label>
          <input name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="LEAD">Team Lead</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button className="btn btn-success">Signup</button>
      </form>
    </div>
  );
}

export default Signup;