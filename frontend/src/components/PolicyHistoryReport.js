import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

function PolicyHistoryReport() {
  const [policies, setPolicies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  async function fetchPolicies() {
    try {
      const res = await axios.get(`${API_BASE}/policies`);
      setPolicies(res.data);
    } catch (e) {
      setError('Failed to load policies');
    }
  }

  async function fetchReport() {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API_BASE}/report/history`, {
        params: { policyIds: selected.join(',') }
      });
      setReport(res.data);
    } catch (e) {
      setError('Failed to load report');
    }
    setLoading(false);
  }

  function handleSelect(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function downloadPDF() {
    window.open(`${API_BASE}/report/history.pdf?policyIds=${selected.join(',')}`,'_blank');
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-950 text-gray-100 rounded-xl shadow-2xl min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-teal-300">Policy Version History Report</h2>
      <div className="mb-6">
        <h3 className="text-lg mb-2 text-gray-300">Select Policies</h3>
        {policies.length === 0 ? <div>Loading policies...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {policies.map(p => (
              <label key={p.id} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => handleSelect(p.id)}
                />
                <span>{p.title}</span>
              </label>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-4">
          <button
            className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-lg shadow"
            onClick={fetchReport}
            disabled={selected.length === 0 || loading}
          >
            Generate Report
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow"
            onClick={downloadPDF}
            disabled={selected.length === 0}
          >
            Download PDF
          </button>
        </div>
      </div>
      {loading && <div>Loading report...</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {report.length > 0 && (
        <div className="bg-gray-900 rounded p-4 mt-4">
          {report.map(({ policy, versions }) => (
            <div key={policy.id} className="mb-8">
              <h4 className="text-lg text-teal-400 font-semibold mb-1">{policy.title} (ID: {policy.id})</h4>
              <div className="text-gray-400 mb-2">Status: {policy.status} | Start: {new Date(policy.startDate).toLocaleDateString()} | End: {new Date(policy.endDate).toLocaleDateString()}</div>
              <table className="min-w-full bg-gray-950 rounded-lg overflow-hidden shadow border border-gray-800 mb-4">
                <thead>
                  <tr className="bg-gray-800 text-gray-300">
                    <th className="p-2 border-b border-gray-700 text-left">Version</th>
                    <th className="p-2 border-b border-gray-700 text-left">Date</th>
                    <th className="p-2 border-b border-gray-700 text-left">Editor</th>
                    <th className="p-2 border-b border-gray-700 text-left">Change Note</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map(v => (
                    <tr key={v.id}>
                      <td className="p-2 border-b border-gray-800">{v.versionNumber}</td>
                      <td className="p-2 border-b border-gray-800">{new Date(v.editedDate).toLocaleString()}</td>
                      <td className="p-2 border-b border-gray-800">{v.editorId}</td>
                      <td className="p-2 border-b border-gray-800">{v.changeNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PolicyHistoryReport;
