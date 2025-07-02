import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ADMIN_LINKS = [
  { to: '/', label: 'Manage Policies' },
  { to: '/admin/metadata', label: 'Manage Metadata' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/reports', label: 'Reports' },
  // Add more admin pages here as needed
];

const PUBLIC_LINK = { href: '/public', label: 'View Public Site' };

function AdminMenu() {
  const location = useLocation();
  return (
    <nav className="flex gap-4 bg-gray-900 border-b border-gray-800 px-8 py-3 mb-8 rounded-t-lg shadow">
      {ADMIN_LINKS.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-150 ${location.pathname === link.to ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-teal-600 hover:text-white'}`}
        >
          {link.label}
        </Link>
      ))}
      <a
        href={PUBLIC_LINK.href}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded font-semibold bg-gray-800 text-gray-300 hover:bg-teal-600 hover:text-white transition-colors duration-150"
        style={{ marginLeft: 'auto' }}
      >
        {PUBLIC_LINK.label}
      </a>
    </nav>
  );
}

export default AdminMenu;
