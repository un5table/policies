
# Higher Ed Policy Document Library

This is a minimum viable product (MVP) for a secure policy document management system for universities, based on the provided PRD.

## Tech Stack
- Frontend: React.js, Tailwind CSS, i18next, WYSIWYG editor (Quill.js)
- Backend: Node.js (Express.js), MariaDB, Sequelize ORM, CAS SSO (stub), Local file storage

## Structure
- `/backend`: Express.js API, Sequelize models, file storage, PDF generation
- `/frontend`: React.js app, role-based UI, multilingual support

## Getting Started
1. Install dependencies in both `backend` and `frontend`
2. Set up MariaDB and configure connection in `/backend/config/config.js`
3. Run backend: `npm start` in `/backend`
4. Run frontend: `npm start` in `/frontend`

## Features
- Policy CRUD, versioning, approval workflow
- Metadata management
- File upload (.pdf, .docx)
- Public search/listing
- Multilingual UI (stub)
- Audit logging (basic)

---
This MVP is a starting point and can be extended per the full PRD.

# policies
Policy Library Manager for Higher Ed
