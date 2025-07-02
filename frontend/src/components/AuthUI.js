import React, { useState } from 'react';

function AuthUI({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication (replace with real CAS/SSO logic)
    if (username && password) {
      onLogin({ username, role: username === 'admin' ? 'SuperAdmin' : 'Editor' });
    } else {
      setError('Please enter username and password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-80 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-300">Sign In</h2>
        {error && <div className="text-red-400 mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="border border-gray-700 bg-gray-950 text-gray-100 px-3 py-2 rounded w-full focus:ring-2 focus:ring-teal-500 placeholder-gray-500"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="border border-gray-700 bg-gray-950 text-gray-100 px-3 py-2 rounded w-full focus:ring-2 focus:ring-teal-500 placeholder-gray-500"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-teal-700 text-white py-2 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default AuthUI;
