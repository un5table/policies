# Higher Ed Policy Library — Project Specification & Change Log

**Last updated:** 2025-07-01

## Project Overview
A web-based platform for managing higher education policy documents, including admin tools for metadata, file attachments, user management, and public access. The system is being extended for robust admin, metadata, and user account management, with future support for CAS 3.0 SSO.

---

## Key Features & Changes (Session: 2025-07-01)

### 1. Metadata Management
- Created backend Sequelize models and REST API endpoints for:
  - Departments, Divisions, Subjects (via `MetadataAttribute` model)
  - Contacts (dedicated `Contact` model)
- Implemented `/api/metadata` and `/api/contacts` endpoints for CRUD operations.
- Built a frontend admin UI (`/admin/metadata`) with tabs for managing all metadata types, including search/filter and dark mode styling.
- Integrated metadata selectors (Departments, Divisions, Subjects, Contacts) with search/filter into the policy add/edit form.

### 2. File Attachment Handling
- File upload and download APIs created and debugged.
- Attachments can be uploaded, associated with policies, and downloaded from public policy views.

### 3. Public & Admin Access
- Public routes (`/public`, `/view/:id`) are fully open.
- Admin/editor routes require authentication.
- Admin menu added for navigation between admin pages, including:
  - Manage Policies
  - Manage Metadata
  - Manage Users
  - View Public Site (opens in new tab)

### 4. User Account Management
- Extended backend User model to include `suspended` flag.
- Created `/api/users` endpoints for:
  - List all users (admin)
  - Create, update, delete users (admin)
  - Suspend/lock user accounts
  - Get current user info (`/api/users/me`)
- Frontend `/admin/users` page for admins to add/edit/delete/suspend users.
- "My Account" page (`/account`) for users to view and update their own info (email, password).
- Added dropdown under user icon with "My Account" and "Log out" options.
- Session persistence: user stays logged in via localStorage.

### 5. UI/UX Enhancements
- WYSIWYG editor restyled for high-contrast dark mode.
- All admin and user-facing pages use modern dark mode with teal accents.
- Admin menu and dropdowns are accessible and visually consistent.

### 6. Technical/Infrastructure
- All backend changes are auto-synced to the SQLite DB via `sequelize.sync({ alter: true })`.
- No migrations required; schema is updated on server restart.
- Error handling and API feedback improved for all new endpoints.

---

## Next Steps / TODO
- Add more granular permissions for user roles (SuperAdmin, Admin, Editor).
- Implement real authentication and CAS 3.0 SSO integration (local email used for SSO verification).
- Allow inline creation of metadata attributes from selectors.
- Add audit logging for user/admin actions.
- Enhance "My Account" page with more profile fields and avatar.
- Add reactivation for suspended users.
- Further refine admin UI (bulk actions, better filtering, etc.).

---

## How to Resume
- Review this document for all feature changes and endpoints.
- Continue with the next TODO item or request new features/enhancements.
- All code and UI changes are documented here for seamless handoff.
