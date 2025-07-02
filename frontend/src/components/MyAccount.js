import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

function MyAccount({ user, onUpdate }) {
  const [form, setForm] = useState({ username: '', email: '', role: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      setLoading(true); setError(null);
      try {
        const res = await axios.get(`${API_BASE}/users/me`, { params: { username: user.username } });
        setForm({ ...res.data, password: '' });
      } catch (e) {
        setError('Failed to load account info');
      }
      setLoading(false);
    }
    if (user?.username) fetchMe();
  }, [user]);

  const handleInput = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setError(null); setSuccess(false);
    try {
      await axios.put(`${API_BASE}/users/${form.id}`, { email: form.email, password: form.password });
      setSuccess(true);
      setForm(f => ({ ...f, password: '' }));
      if (onUpdate) onUpdate({ ...user, email: form.email });
    } catch (e) {
      setError('Failed to update account');
    }
  };

  if (loading) return <div className="p-8 bg-gray-950 min-h-screen text-gray-100">Loading account...</div>;
  if (error) return <div className="p-8 bg-gray-950 min-h-screen text-red-400">{error}</div>;

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-950 text-gray-100 rounded-xl shadow-2xl min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-teal-300">My Account</h2>
      {success && <div className="text-green-400 mb-2">Account updated!</div>}
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-400">Username</label>
          <input className="bg-gray-800 text-gray-100 px-3 py-2 rounded w-full" value={form.username} disabled />
        </div>
        <div>
          <label className="block mb-1 text-gray-400">Role</label>
          <input className="bg-gray-800 text-gray-100 px-3 py-2 rounded w-full" value={form.role} disabled />
        </div>
        <div>
          <label className="block mb-1 text-gray-400">Email</label>
          <input name="email" className="bg-gray-800 text-gray-100 px-3 py-2 rounded w-full" value={form.email} onChange={handleInput} required />
        </div>
        <div>
          <label className="block mb-1 text-gray-400">New Password</label>
          <input name="password" type="password" className="bg-gray-800 text-gray-100 px-3 py-2 rounded w-full" value={form.password} onChange={handleInput} placeholder="Leave blank to keep current password" />
        </div>
        <button type="submit" className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-lg shadow">Save Changes</button>
      </form>
    </div>
  );
}

export default MyAccount;
