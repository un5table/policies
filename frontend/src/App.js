import React, { useState } from 'react';

// Error Boundary for catching UI errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('UI Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: 32 }}>An unexpected error occurred in the UI.<br/>{this.state.errorInfo && this.state.errorInfo.toString()}</div>;
    }
    return this.props.children;
  }
}

import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import WysiwygEditor from './components/WysiwygEditor';
import AuthUI from './components/AuthUI';

import AttachmentUploader from './components/AttachmentUploader';
import VersionHistoryTable from './components/VersionHistoryTable';
import PolicyVersionHistory from './components/PolicyVersionHistory';

import AdminMenu from './components/AdminMenu';
import UserAdmin from './components/UserAdmin';
import MyAccount from './components/MyAccount';
import PolicyHistoryReport from './components/PolicyHistoryReport';

// Placeholder components
function Header({ user, onLogout }) {
  const displayName = user?.username || 'User';
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef();

  React.useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow border-b border-gray-800">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-teal-300">Policy Library</span>
        <select className="ml-4 border border-gray-700 bg-gray-900 text-gray-100 rounded px-2 py-1 text-sm" title="Language Selector">
          <option>EN</option>
          <option>ES</option>
        </select>
      </div>
      <div className="relative flex items-center gap-2" ref={dropdownRef}>
        <span className="text-gray-100">{displayName}</span>
        <button
          onClick={() => setOpen(v => !v)}
          className="focus:outline-none"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`} alt="Profile" className="w-8 h-8 rounded-full border border-gray-700" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
            <a
              href="/account"
              className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-teal-700 hover:text-white rounded"
              onClick={() => setOpen(false)}
            >
              My Account
            </a>
            <button
              className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-teal-700 hover:text-white rounded"
              onClick={() => { setOpen(false); onLogout && onLogout(); }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

import * as api from './api';

// Helper for logging API errors
export async function logApiError(fn, ...args) {
  try {
    return await fn(...args);
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

import { useEffect } from 'react';

function PolicyList() {
  const navigate = useNavigate();
  const [policies, setPolicies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    setLoading(true);
    logApiError(api.fetchPolicies)
      .then(data => {
        setPolicies(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load policies');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 bg-gray-950 min-h-screen text-gray-100">Loading policies...</div>;
  if (error) return <div className="p-8 bg-gray-950 min-h-screen text-red-400">{error}</div>;

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-100 tracking-tight">Policies</h2>
        <button onClick={() => navigate('/edit')} className="bg-teal-700 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">Create New Policy</button>
      </div>
      <div className="mb-6 flex gap-4">
        <input className="border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500 w-64" placeholder="Search..." />
        <select className="border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 rounded focus:ring-2 focus:ring-teal-500">
          <option>Status: All</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Archived</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-800">
        <table className="min-w-full bg-gray-950">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Title</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Status</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Start Date</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">End Date</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Last Edited</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Tags</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} className="hover:bg-gray-900 transition-colors">
                <td className="p-3 border-b border-gray-900 text-teal-300 cursor-pointer hover:underline" onClick={() => navigate(`/edit/${p.id}`)}>{p.title}</td>
                <td className="p-3 border-b border-gray-900 text-gray-200">{p.status}</td>
                <td className="p-3 border-b border-gray-900 text-gray-200">{p.startDate?.slice(0,10)}</td>
                <td className="p-3 border-b border-gray-900 text-gray-200">{p.endDate?.slice(0,10)}</td>
                <td className="p-3 border-b border-gray-900 text-gray-500">{p.updatedAt?.slice(0,10) || ''}</td>
                <td className="p-3 border-b border-gray-900 text-gray-500">{p.metadata?.map(m => m.value).join(', ')}</td>
                <td className="p-3 border-b border-gray-900 flex gap-2">
                  <button className="text-teal-400 hover:text-teal-200 underline" onClick={() => navigate(`/edit/${p.id}`)}>Edit</button>
                  {/* Archive and Delete buttons can be wired up here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function PolicyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState('Draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  // Version history is not implemented in API yet
  const [versions] = useState([]);
  const [changeNote, setChangeNote] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      logApiError(api.fetchPolicy, id)
        .then(policy => {
          setTitle(policy.title || '');
          setContent(policy.content || '');
          
          setAttachments(policy.attachments || []);
          setStatus(policy.status || 'Draft');
          setStartDate(policy.startDate ? policy.startDate.slice(0,10) : '');
          setEndDate(policy.endDate ? policy.endDate.slice(0,10) : '');
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load policy');
          setLoading(false);
        });
    } else {
      setTitle('');
      setContent('');
      
      setAttachments([]);
      setStatus('Draft');
      setStartDate('');
      setEndDate('');
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content || !startDate || !endDate) {
      setError('Title, content, start date, and end date are required');
      return;
    }
    setError(null);
    try {
      const data = { title, content, status, startDate, endDate, attachments };
      if (changeNote && changeNote.trim() !== "") {
        data.changeNote = changeNote;
      }
      if (id) {
        await logApiError(api.updatePolicy, id, data);
      } else {
        await logApiError(api.createPolicy, data);
      }
      setChangeNote('');
      navigate('/');
    } catch (err) {
      setError('Failed to save policy');
    }
  };

  if (loading) return <div className="p-8 bg-gray-950 min-h-screen text-gray-100">Loading policy...</div>;
  if (error) return <div className="p-8 bg-gray-950 min-h-screen text-red-400">{error}</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gray-950 text-gray-100 rounded-xl shadow-2xl min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-teal-300 tracking-tight">{id ? 'Edit Policy' : 'Create Policy'}</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <input
          className="border border-gray-700 bg-gray-900 text-gray-100 px-4 py-2 rounded w-full focus:ring-2 focus:ring-teal-500 placeholder-gray-500"
          placeholder="Policy Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-400">Start Date</label>
            <input
              type="date"
              className="border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 rounded w-full"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-400">End Date</label>
            <input
              type="date"
              className="border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 rounded w-full"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-400">Status</label>
            <select
              className="border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 rounded w-full"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
        <WysiwygEditor value={content} onChange={setContent} />
        
        
        
        
        <AttachmentUploader attachments={attachments} onChange={setAttachments} policyId={id} />
        <div>
          <label className="block mb-1 text-gray-400 mt-6">Change Note</label>
          <textarea
            className="bg-gray-800 text-gray-100 px-3 py-2 rounded w-full mb-2"
            value={changeNote}
            onChange={e => setChangeNote(e.target.value)}
            placeholder="Enter a note about this change (optional)"
            rows={2}
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-lg shadow">Save</button>
          <button type="button" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2 rounded-lg" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
      {id && <PolicyVersionHistory policyId={id} currentVersion={{ id, editorId: null }} onRevert={() => window.location.reload()} />}
      <Link to="/" className="block mt-8 text-teal-400 underline">Back to Policy List</Link>
    </div>
  );
}

function PublicPolicyList() {
  const [policies, setPolicies] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    api.fetchPolicies()
      .then(data => {
        // Only show published policies
        const published = data.filter(p => p.status === 'Published');
        // Sort alphabetically by title
        published.sort((a, b) => a.title.localeCompare(b.title));
        setPolicies(published);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load policies');
        setLoading(false);
      });
  }, []);

  const filtered = policies.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 bg-gray-950 min-h-screen text-gray-100">Loading policies...</div>;
  if (error) return <div className="p-8 bg-gray-950 min-h-screen text-red-400">{error}</div>;

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-teal-300">Published Policies</h1>
      <input
        className="border border-gray-700 bg-gray-900 text-gray-100 px-4 py-2 rounded w-full max-w-xl mb-8 focus:ring-2 focus:ring-teal-500 placeholder-gray-500"
        placeholder="Search by policy name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="rounded-lg shadow-lg border border-gray-800 bg-gray-900 max-w-2xl mx-auto">
        <ul>
          {filtered.length === 0 && (
            <li className="p-6 text-gray-400 text-center">No policies found.</li>
          )}
          {filtered.map(policy => (
            <li key={policy.id} className="p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors">
              <Link to={`/view/${policy.id}`} className="text-teal-300 text-lg font-semibold hover:underline">
                {policy.title}
              </Link>
              <div className="text-gray-400 text-xs mt-1">
                {policy.metadata?.map(m => m.value).join(', ') || <span>No metadata</span>}
              </div>
              <div className="text-gray-500 text-xs mt-1 italic">
                {policy.content ? (policy.content.length > 100 ? policy.content.slice(0, 100) + '…' : policy.content) : <span>No content</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PolicyPublicView() {
  const { id } = useParams();
  const [policy, setPolicy] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    api.fetchPolicy(id)
      .then(data => {
        if (data.status !== 'Published') {
          setError('Policy not published or not found.');
          setLoading(false);
        } else {
          setPolicy(data);
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Failed to load policy');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 bg-gray-950 min-h-screen text-gray-100">Loading policy...</div>;
  if (error) return <div className="p-8 bg-gray-950 min-h-screen text-red-400">{error}</div>;
  if (!policy) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-950 text-gray-100 min-h-screen">
      <nav className="mb-2 text-gray-400 text-sm">
        <Link to="/public" className="text-teal-400 underline">All Policies</Link> / {policy.title}
      </nav>
      <h1 className="text-3xl font-bold mb-2 text-teal-300">{policy.title}</h1>
      <div className="mb-2 flex gap-2">
        {policy.metadata?.map(m => (
          <span key={m.id} className="bg-gray-800 text-teal-300 px-2 py-1 rounded text-xs">{m.value}</span>
        ))}
      </div>
      <div className="mb-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: policy.content }} />
      {policy.attachments && policy.attachments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-teal-300">Attachments</h3>
          <ul className="space-y-2">
            {policy.attachments.map(att => (
              <li key={att.id} className="flex items-center gap-2">
                <a
                  href={`/api/attachments/${att.id}/download`}
                  className="text-teal-400 underline hover:text-teal-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={e => {
                    // Try to fetch the file first to check if it exists
                    fetch(`/api/attachments/${att.id}/download`, { method: 'HEAD' })
                      .then(resp => {
                        if (!resp.ok) {
                          e.preventDefault();
                          alert('This file is no longer available on the server.');
                        }
                      })
                      .catch(() => {
                        e.preventDefault();
                        alert('This file is no longer available on the server.');
                      });
                  }}
                >
                  {att.originalName || att.filename}
                </a>
                <span className="text-xs text-gray-500">({(att.size / 1024).toFixed(1)} KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link to="/public" className="text-teal-400 underline">Back to Policy List</Link>
    </div>
  );
}

function App() {
  const [auth, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem('auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const setAuth = (val) => {
    setAuthState(val);
    if (val) {
      localStorage.setItem('auth', JSON.stringify(val));
    } else {
      localStorage.removeItem('auth');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Show header only if logged in, or on admin/editor routes */}
        {auth && window.location.pathname !== '/public' && !window.location.pathname.startsWith('/view/') && (
          <Header user={auth} onLogout={() => setAuth(null)} />
        )}
        {/* Show AdminMenu on /admin routes */}
        {auth && window.location.pathname.startsWith('/admin') && <AdminMenu />}
        <main className="max-w-7xl mx-auto">
          <Routes>
            {/* Publicly accessible routes */}
            <Route path="/public" element={<PublicPolicyList />} />
            <Route path="/view/:id" element={<PolicyPublicView />} />
            {/* Protected routes */}
            
            <Route path="/admin/users" element={auth ? <><AdminMenu /><UserAdmin /></> : <AuthUI onLogin={setAuth} />} />
            <Route path="/admin/reports" element={auth ? <><AdminMenu /><PolicyHistoryReport /></> : <AuthUI onLogin={setAuth} />} />
            <Route path="/edit/:id" element={auth ? <><AdminMenu /><PolicyEdit /></> : <AuthUI onLogin={setAuth} />} />
            <Route path="/edit" element={auth ? <><AdminMenu /><PolicyEdit /></> : <AuthUI onLogin={setAuth} />} />
            <Route path="/account" element={auth ? <MyAccount user={auth} onUpdate={setAuth} /> : <AuthUI onLogin={setAuth} />} />
            <Route path="/" element={auth ? <PolicyList /> : <AuthUI onLogin={setAuth} />} />
            <Route path="/edit" element={auth ? <PolicyEdit /> : <AuthUI onLogin={setAuth} />} />
            <Route path="/edit/:id" element={auth ? <PolicyEdit /> : <AuthUI onLogin={setAuth} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Wrap App in ErrorBoundary for global error catching
const WrappedApp = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default WrappedApp;
