import React from 'react';

function VersionHistoryTable({ versions, onViewDiff, onRollback }) {
  return (
    <table className="min-w-full bg-white border rounded shadow">
      <thead>
        <tr>
          <th className="p-2 border">Version</th>
          <th className="p-2 border">Edited Date</th>
          <th className="p-2 border">Editor</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {versions.map((v) => (
          <tr key={v.versionNumber} className="hover:bg-gray-50">
            <td className="p-2 border">{v.versionNumber}</td>
            <td className="p-2 border">{v.editedDate}</td>
            <td className="p-2 border">{v.editorName}</td>
            <td className="p-2 border flex gap-2">
              <button className="text-blue-600 underline" onClick={() => onViewDiff(v)}>View Diff</button>
              <button className="text-yellow-600 underline" onClick={() => onRollback(v)}>Rollback</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VersionHistoryTable;
