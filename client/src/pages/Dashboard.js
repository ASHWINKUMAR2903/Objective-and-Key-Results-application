import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', role: '' });
  const [okrs, setOkrs] = useState([]);
  const token = localStorage.getItem('token');
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState(['']);
  const [editingOKRId, setEditingOKRId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editObjective, setEditObjective] = useState('');
  const [editKeyResults, setEditKeyResults] = useState([]);



  useEffect(() => {
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

      axios
        .get('http://localhost:5000/api/okrs', 
          {
            headers: { Authorization: `Bearer ${token}` }
          })
        .then((res) => 
          {
            setOkrs(res.data)
          })
        .catch((err) => 
          {
            alert('Invalid okrs session.');
            console.error(err)
          });
    }
  }, [navigate, token]);



  const handleAddOKR = async (e) => 
    {
      e.preventDefault();
      try {
        const newOKR = { title, objective, keyResults };
        const res = await axios.post('http://localhost:5000/api/okrs', newOKR, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOkrs([...okrs, res.data]);
        setTitle('');
        setObjective('');
        setKeyResults(['']);
        alert('OKR added!');
      } 
      catch (err) {
        console.error(err);
        alert('Failed to add OKR.');
      }
  };

  const handleUpdateProgress = async (id, progress) => {
    try {
      await axios.put(
        `http://localhost:5000/api/okrs/${id}`,
        { progress },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Progress updated!');
    } 
    catch (err) {
      console.error(err);
      alert('Failed to update progress.');
    }
  };

  const handleDeleteOKR = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/okrs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOkrs(okrs.filter((o) => o._id !== id));
      alert('OKR deleted.');
    } 
    catch (err) {
      console.error(err);
      alert('Failed to delete OKR.');
    }
  };

  const handleEditOKR = async (id) => {
    try {
      const updatedOKR = {
        title: editTitle,
        objective: editObjective,
        keyResults: editKeyResults
      };

      await axios.put(`http://localhost:5000/api/okrs/${id}`, updatedOKR, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedList = okrs.map((okr) =>
        okr._id === id ? { ...okr, ...updatedOKR } : okr
      );
      setOkrs(updatedList);
      setEditingOKRId(null);
      alert('OKR updated!');
    } 
    catch (err) {
      console.error(err);
      alert('Failed to update OKR.');
    }
  };

  const handleLogout = () => 
  {
    localStorage.removeItem('token');
    navigate('/');
    alert("Logout has been done successfully");
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

      <h4>Add New OKR</h4>
      <form onSubmit={handleAddOKR} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Key Results:</label>
          {keyResults.map((kr, index) => (
            <input
              key={index}
              type="text"
              className="form-control my-1"
              placeholder={`Key Result ${index + 1}`}
              value={kr}
              onChange={(e) => {
                const updated = [...keyResults];
                updated[index] = e.target.value;
                setKeyResults(updated);
              }}
              required
            />
          ))}
          <button
            type="button"
            className="btn btn-sm btn-secondary mt-1"
            onClick={() => setKeyResults([...keyResults, ''])}
          >
            + Add Key Result
          </button>
        </div>
        <button className="btn btn-primary">Create OKR</button>
      </form>
      <hr />

      <h4>Your OKRs:</h4>
      {okrs.length === 0 ? ( <p>No OKRs found.</p>) : (
        <ul className="list-group">
          {okrs.map((okr) => (
            /*<li key={okr._id} className="list-group-item">
              <strong>{okr.title}</strong>
              <p>{okr.objective}</p>
              <ul>
                {okr.keyResults && Array.isArray(okr.keyResults) ? ( okr.keyResults.map((kr, i) => <li key={i}>{kr}</li>) ) : ( <li>No Key Results</li> )}
              </ul>
              <p>Progress: {okr.progress}%</p>
            </li>


            <li key={okr._id} className="list-group-item">
            <strong>{okr.title}</strong>
            <p>{okr.objective}</p>
            <ul>
              {okr.keyResults.map((kr, i) => (
                <li key={i}>{kr}</li>
              ))}
            </ul>
            <p>Progress: {okr.progress}%</p>

            //{ ✅ Progress Update Input }
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Update progress"
              className="form-control w-25 d-inline-block me-2"
              onChange={(e) => {
                const updated = { ...okr, progress: parseInt(e.target.value) || 0 };
                setOkrs(okrs.map((o) => (o._id === okr._id ? updated : o)));
              }}
            />
            <button
              className="btn btn-sm btn-success me-2"
              onClick={() => handleUpdateProgress(okr._id, okr.progress)}
            > ✅ Save </button>
            //{ 🛠 Delete Button }
            <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeleteOKR(okr._id)}>
              🗑 Delete
            </button>
          </li>*/

          <li key={okr._id} className="list-group-item">
            {
              editingOKRId === okr._id ? (
              <div className="mb-3">
                <input
                  className="form-control mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                />
                {Array.isArray(editKeyResults) && editKeyResults.length > 0 ? (
                  editKeyResults.map((kr, i) => (
                    <input
                      key={i}
                      className="form-control mb-1"
                      value={kr}
                      onChange={(e) => {
                        const updated = [...editKeyResults];
                        updated[i] = e.target.value;
                        setEditKeyResults(updated);
                      }}
                    />
                  ))
                ) : (
                  <p>No Key Results</p>
                )}
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleEditOKR(okr._id)}> 💾 Save </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingOKRId(null)}> ❌ Cancel </button>
              </div>
            ) : (
              <>
                <strong>{okr.title}</strong>
                <p>{okr.objective}</p>
                <ul>
                  {Array.isArray(okr.keyResults) && okr.keyResults.length > 0 ? (
                    okr.keyResults.map((kr, i) => (
                      <li key={i}>{kr}</li>
                    ))
                  ) : (
                    <li>No Key Results</li>
                  )}
                </ul>
                <p>Progress: {okr.progress}%</p>

                <input
                  type="number"
                  className="form-control w-25 d-inline-block me-2"
                  min="0"
                  max="100"
                  value={okr.progress}
                  onChange={(e) => {
                    const updated = { ...okr, progress: parseInt(e.target.value) || 0 };
                    setOkrs(okrs.map((o) => (o._id === okr._id ? updated : o)));
                  }}
                />
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleUpdateProgress(okr._id, okr.progress)}> ✅ Save </button>
                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => handleDeleteOKR(okr._id)}> 🗑 Delete </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setEditingOKRId(okr._id);
                    setEditTitle(okr.title);
                    setEditObjective(okr.objective);
                    setEditKeyResults(Array.isArray(okr.keyResults) ? okr.keyResults : []);
                  }}> ✏️ Edit </button> </>
            )}
          </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/hierarchy')} className="btn btn-info">
        Go to Hierarchy
      </button>
    </div>
  );
}

export default Dashboard;