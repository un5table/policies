import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

const ROLES = ['SuperAdmin', 'Admin', 'Editor'];

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (e) {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(`${API_BASE}/users`, form);
      setForm({});
      fetchUsers();
    } catch (e) {
      setError('Failed to add user');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ username: user.username, email: user.email, role: user.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`${API_BASE}/users/${editingId}`, form);
      setEditingId(null); setForm({});
      fetchUsers();
    } catch (e) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user');
    }
  };

  const handleSuspend = async (id) => {
    setError(null);
    try {
      await axios.put(`${API_BASE}/users/${id}/suspend`);
      fetchUsers();
    } catch (e) {
      setError('Failed to suspend user');
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-lg max-w-3xl mx-auto mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-300">User Management</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-6 flex flex-wrap gap-2 items-end">
            <input name="username" value={form.username||''} onChange={handleInput} placeholder="Username" className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required disabled={!!editingId} />
            <input name="email" value={form.email||''} onChange={handleInput} placeholder="Email" className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required />
            <select name="role" value={form.role||'Editor'} onChange={handleInput} className="bg-gray-800 text-gray-100 px-2 py-1 rounded">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input name="password" type="password" value={form.password||''} onChange={handleInput} placeholder="Password" className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required={!editingId} />
            <button type="submit" className="bg-teal-700 hover:bg-teal-600 px-4 py-1 rounded text-white font-semibold">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" className="ml-2 text-gray-400 hover:text-gray-200" onClick={()=>{setEditingId(null);setForm({});}}>Cancel</button>
            )}
          </form>
          <table className="min-w-full bg-gray-950 rounded-lg overflow-hidden shadow-lg border border-gray-800">
            <thead>
              <tr className="bg-gray-900">
                <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Username</th>
                <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Email</th>
                <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Role</th>
                <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Status</th>
                <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={u.suspended ? 'bg-gray-800 text-gray-400' : ''}>
                  <td className="p-3 border-b border-gray-800">{u.username}</td>
                  <td className="p-3 border-b border-gray-800">{u.email}</td>
                  <td className="p-3 border-b border-gray-800">{u.role}</td>
                  <td className="p-3 border-b border-gray-800">{u.suspended ? 'Suspended' : 'Active'}</td>
                  <td className="p-3 border-b border-gray-800 flex gap-2">
                    <button className="text-teal-400 hover:text-teal-200" onClick={()=>handleEdit(u)}>Edit</button>
                    <button className="text-red-400 hover:text-red-200" onClick={()=>handleDelete(u.id)}>Delete</button>
                    {!u.suspended && <button className="text-yellow-400 hover:text-yellow-200" onClick={()=>handleSuspend(u.id)}>Suspend</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default UserAdmin;
