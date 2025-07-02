import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

function MetadataMultiSelect({ label, type, selected, onChange, placeholder }) {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/metadata?type=${type}`)
      .then(res => setOptions(res.data))
      .catch(() => setOptions([]));
  }, [type]);

  const filtered = options.filter(opt =>
    opt.value.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-200">{label}</label>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder || `Search ${label.toLowerCase()}...`}
        className="bg-gray-800 text-gray-100 px-2 py-1 rounded mb-2 w-full"
      />
      <div className="flex flex-wrap gap-2">
        {filtered.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={
              selected.includes(opt.id)
                ? 'bg-teal-700 text-white px-3 py-1 rounded shadow'
                : 'bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700'
            }
          >
            {opt.value}
          </button>
        ))}
        {filtered.length === 0 && <span className="text-gray-400 text-sm">No {label.toLowerCase()} found.</span>}
      </div>
    </div>
  );
}

function ContactMultiSelect({ selected, onChange }) {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/contacts`).then(res => setOptions(res.data)).catch(() => setOptions([]));
  }, []);

  const filtered = options.filter(opt =>
    (`${opt.firstName} ${opt.lastName} ${opt.email}`.toLowerCase().includes(search.toLowerCase()))
  );

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-200">Contacts</label>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search contacts..."
        className="bg-gray-800 text-gray-100 px-2 py-1 rounded mb-2 w-full"
      />
      <div className="flex flex-wrap gap-2">
        {filtered.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={
              selected.includes(opt.id)
                ? 'bg-teal-700 text-white px-3 py-1 rounded shadow'
                : 'bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700'
            }
          >
            {opt.firstName} {opt.lastName} ({opt.email})
          </button>
        ))}
        {filtered.length === 0 && <span className="text-gray-400 text-sm">No contacts found.</span>}
      </div>
    </div>
  );
}

export { MetadataMultiSelect, ContactMultiSelect };
