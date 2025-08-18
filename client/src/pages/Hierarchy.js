import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

function Hierarchy() {
  const token = localStorage.getItem('token');
  const [orgName, setOrgName] = useState('');
  const [orgs, setOrgs] = useState([]);

  const [selectedOrg, setSelectedOrg] = useState(null);
  const [deptName, setDeptName] = useState('');
  const [depts, setDepts] = useState([]);

  const [selectedDept, setSelectedDept] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);

  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  //const headers = { Authorization: `Bearer ${token}` };


  // Create Organization
  const createOrg = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/hierarchy/organizations', { name: orgName }, { headers });
      setOrgs([...orgs, res.data]);
      setOrgName('');
      loadHierarchy();
      alert("Organization has been created");
    } catch (err) {
      alert('Failed to create organization');
    }
  };

  // Create Department
  const createDept = async () => {
    if (!selectedOrg) {
        alert('Please select an organization first.');
        return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/hierarchy/organizations/${selectedOrg}/departments`, { name: deptName }, { headers });
      setDepts([...depts, res.data]);
      setDeptName('');
      loadHierarchy();
      alert("Department has been created");
    } catch (err) {
      alert('Failed to create department');
    }
  };

  // Create Team
  const createTeam = async () => {
        if (!selectedDept) {
        alert('Please select a department first.');
        return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/hierarchy/departments/${selectedDept}/teams`, { name: teamName }, { headers });
      setTeams([...teams, res.data]);
      setTeamName('');
      loadHierarchy();
      alert("Team has been created");
    } catch (err) {
      alert('Failed to create team');
    }
  };

  // Assign User to Team
  const assignUser = async () => {
    try {
      await axios.post(`http://localhost:5000/api/hierarchy/teams/${selectedTeam}/users/${selectedUser}`, {}, { headers });
      alert('User assigned to team!');
    } catch (err) {
      alert('Failed to assign user.');
    }
  };

  const loadHierarchy = useCallback(async () => {
    try {
        const orgRes = await axios.get('http://localhost:5000/api/hierarchy/organizations', { headers });
        setOrgs(orgRes.data);

        const allDepts = [];
        const allTeams = [];

        for (const org of orgRes.data) {
        const deptRes = await axios.get(`http://localhost:5000/api/hierarchy/organizations/${org._id}/departments`, { headers });
        allDepts.push(...deptRes.data);

        for (const dept of deptRes.data) {
            const teamRes = await axios.get(`http://localhost:5000/api/hierarchy/departments/${dept._id}/teams`, { headers });
            allTeams.push(...teamRes.data);
        }
        }

        setDepts(allDepts);
        setTeams(allTeams);
    } catch (err) {
        console.error(err);
    }
    }, [headers]);

  // Fetch users from auth DB
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/users', { headers })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, [headers]);
  
  // Load hierarchy structure
  useEffect(() => {
    loadHierarchy();
    }, [loadHierarchy]);

  return (
    <div className="container mt-5">
      <h3>Hierarchy Management</h3>
      <hr />

      <div className="mb-4">
        <h5>Create Organization</h5>
        <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Org name" className="form-control w-50" />
        <button className="btn btn-primary mt-2" onClick={createOrg}>Add Organization</button>
      </div>

      <div className="mb-4">
        <h5>Create Department</h5>
        <select className="form-select w-50" onChange={(e) => setSelectedOrg(e.target.value)}>
          <option>Select Organization</option>
          {orgs.map((org) => (
            <option key={org._id} value={org._id}>{org.name}</option>
          ))}
        </select>
        <input type="text" value={deptName} onChange={(e) => setDeptName(e.target.value)} placeholder="Department name" className="form-control w-50 mt-2" />
        <button className="btn btn-primary mt-2" onClick={createDept}>Add Department</button>
      </div>

      <div className="mb-4">
        <h5>Create Team</h5>
        <select onChange={(e) => setSelectedDept(e.target.value)}>
            <option>Select Department</option>
            {depts.map((dept) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
        </select>
        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" className="form-control w-50" />
        <button className="btn btn-primary mt-2" onClick={createTeam}>Add Team</button>
      </div>

      <div className="mb-4">
        <h5>Assign User to Team</h5>
        <select className="form-select w-50" onChange={(e) => setSelectedTeam(e.target.value)}>
          <option>Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>

        <select className="form-select w-50 mt-2" onChange={(e) => setSelectedUser(e.target.value)}>
          <option>Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.email}</option>
          ))}
        </select>

        <select className="form-select w-50 mt-2" value={selectedDept || ''} onChange={(e) => setSelectedDept(e.target.value)}>
        <option value="">Select Department</option>
        {depts
            .filter((dept) => dept.organization === selectedOrg)
            .map((dept) => (
            <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
        </select>

        <button className="btn btn-success mt-2" onClick={assignUser}>Assign User</button>
      </div>

      <hr />
        <h4>🔍 View Organization Structure</h4>
        {orgs.map((org) => (
        <div key={org._id} className="mb-3 p-2 border rounded">
            <h5>🏢 {org.name}</h5>
            <ul>
            {depts
                .filter((dept) => dept.organization.toString() === org._id.toString())
                .map((dept) => (
                <li key={dept._id}>
                    🏬 {dept.name}
                    <ul>
                    {teams
                        .filter((team) => team.department === dept._id)
                        .map((team) => (
                        <li key={team._id}>👥 {team.name}</li>
                        ))}
                    </ul>
                </li>
                ))}
            </ul>
        </div>
        ))}
    </div>
  );
}

export default Hierarchy;