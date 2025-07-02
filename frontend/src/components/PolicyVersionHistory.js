import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

function PolicyVersionHistory({ policyId, currentVersion, onRevert }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNote, setShowNote] = useState(false);
  const [revertNote, setRevertNote] = useState('');
  const [revertId, setRevertId] = useState(null);
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    fetchVersions();
    // eslint-disable-next-line
  }, [policyId]);

  const fetchVersions = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE}/policyVersions/policy/${policyId}`);
      setVersions(res.data);
    } catch (e) {
      setError('Failed to load version history');
    }
    setLoading(false);
  };

  const handleRevert = (id) => {
    setRevertId(id);
    setShowNote(true);
    setRevertNote('');
  };

  const confirmRevert = async () => {
    if (!revertNote) return;
    try {
      await axios.post(`${API_BASE}/policyVersions/${revertId}/revert`, {
        editorId: currentVersion.editorId, // pass current user id if available
        changeNote: revertNote
      });
      setShowNote(false);
      setRevertId(null);
      setRevertNote('');
      fetchVersions();
      if (onRevert) onRevert();
    } catch (e) {
      alert('Failed to revert version');
    }
  };

  const handleDiff = (version) => {
    setDiff(version.content);
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-3 text-teal-300">Version History</h3>
      {loading ? <div>Loading...</div>
        : error ? <div className="text-red-400">{error}</div>
        : versions.length === 0 ? <div className="text-gray-400">No Version History</div>
        : (
        <table className="min-w-full bg-gray-950 rounded-lg overflow-hidden shadow-lg border border-gray-800">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">#</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Date</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Editor</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Change Note</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Attachments</th>
              <th className="p-3 border-b border-gray-800 text-left text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id} className={v.id === currentVersion.id ? 'bg-teal-900/40' : ''}>
                <td className="p-3 border-b border-gray-800">{v.versionNumber}</td>
                <td className="p-3 border-b border-gray-800">{new Date(v.editedDate).toLocaleString()}</td>
                <td className="p-3 border-b border-gray-800">{v.editor ? v.editor.username : v.editorId}</td>
                <td className="p-3 border-b border-gray-800">{v.changeNote}</td>
                <td className="p-3 border-b border-gray-800">{v.attachments && v.attachments.length > 0 ? v.attachments.map(a => a.filename).join(', ') : <span className="text-gray-500">None</span>}</td>
                <td className="p-3 border-b border-gray-800 flex gap-2">
                  <button className="text-teal-400 hover:text-teal-200" onClick={()=>handleDiff(v)}>View</button>
                  <button className="text-yellow-400 hover:text-yellow-200" onClick={()=>handleRevert(v.id)}>Revert</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showNote && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-xl w-full max-w-md">
            <h4 className="text-lg mb-3 text-teal-300">Revert to Version</h4>
            <textarea
              className="w-full bg-gray-800 text-gray-100 rounded p-2 mb-3"
              rows={3}
              placeholder="Enter required note for this revert..."
              value={revertNote}
              onChange={e => setRevertNote(e.target.value)}
              required
            />
            <div className="flex gap-4 justify-end">
              <button className="px-4 py-2 bg-gray-700 rounded text-gray-100" onClick={()=>setShowNote(false)}>Cancel</button>
              <button className="px-4 py-2 bg-teal-700 rounded text-white" onClick={confirmRevert} disabled={!revertNote}>Confirm Revert</button>
            </div>
          </div>
        </div>
      )}
      {diff && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-xl w-full max-w-2xl overflow-auto max-h-[80vh]">
            <h4 className="text-lg mb-3 text-teal-300">Version Content</h4>
            <div className="prose max-w-none text-gray-100" dangerouslySetInnerHTML={{__html: diff}} />
            <div className="flex gap-4 justify-end mt-4">
              <button className="px-4 py-2 bg-teal-700 rounded text-white" onClick={()=>setDiff(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PolicyVersionHistory;
