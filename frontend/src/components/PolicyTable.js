import React from 'react';

function PolicyTable({ policies, onEdit, onArchive, onDelete }) {
  return (
    <table className="min-w-full bg-white border rounded shadow">
      <thead>
        <tr>
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Start Date</th>
          <th className="p-2 border">End Date</th>
          <th className="p-2 border">Last Edited</th>
          <th className="p-2 border">Tags</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {policies.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="p-2 border text-blue-700 cursor-pointer" onClick={() => onEdit(p)}>{p.title}</td>
            <td className="p-2 border">{p.status}</td>
            <td className="p-2 border">{p.startDate}</td>
            <td className="p-2 border">{p.endDate}</td>
            <td className="p-2 border">{p.lastEdited}</td>
            <td className="p-2 border">{p.metadataTags?.join(', ')}</td>
            <td className="p-2 border flex gap-2">
              <button className="text-blue-600 underline" onClick={() => onEdit(p)}>Edit</button>
              <button className="text-yellow-600 underline" onClick={() => onArchive(p)}>Archive</button>
              <button className="text-red-600 underline" onClick={() => onDelete(p)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PolicyTable;
