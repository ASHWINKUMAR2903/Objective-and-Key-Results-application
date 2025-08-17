import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', role: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) 
    {
      alert('You must login first');
      navigate('/');
    }
    else
    {
      axios
        .get('http://localhost:5000/api/protected', 
          {
            headers: { Authorization: `Bearer ${token}` }
          })
        .then(res => 
          {
            setUser({ name: res.data.name || 'NAME NOT SHOWING', role: res.data.role || 'USER NOT SHOWING' });
          })
        .catch(() => 
          {
            alert('Invalid session. Login again.');
            localStorage.removeItem('token');
            navigate('/');
          });
    }
  }, [navigate]);

  const handleLogout = () => 
  {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome to MyOKR Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h5>User Name: {user.name}</h5>
      <h5>User Role: {user.role}</h5>
      <hr />
      <p>This is where OKRs will appear.</p>
    </div>
  );
}

export default Dashboard;