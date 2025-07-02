# Product Requirements Document (PRD)

---

## 1. Product Overview

**Product Name:** Higher Ed Policy Document Library

**Purpose:**

Provide universities with a secure web application to create, manage, and publish institutional policy documents. Administrators and editors manage policy lifecycles (draft, publish, archive), add structured metadata, track version changes, and ensure public users can search and access active policies.

**Target Users:**

- **Super Administrators** (manage users, metadata, system settings)
- **Editors/Administrators** (create/edit policies)
- **Public Users** (view/search published policies)

---

## 2. User Roles and Permissions

### Super Administrator

- Manage users (create/remove admins and editors)
- Configure metadata attributes and their values
- View audit logs
- Perform rollbacks on policies
- Access all policies and system settings

### Administrator / Editor

- Create, edit, delete policy drafts
- Submit policies for approval
- Manage policy versions
- Rollback to previous policy versions
- Attach files (within allowed size/type limits)
- Receive notifications
- View audit logs (read-only)

### Public User

- Search and view published policies
- Filter policies using metadata
- Download policies as PDF

---

## 3. Functional Requirements

### 3.1 Policy Management

- Create policy documents in rich-text format (WYSIWYG editor)
- Assign structured metadata attributes to each policy:
  - Multiple values per attribute allowed
  - Metadata attributes structured as specific data types (string, number, date, etc.)
- Upload file attachments to policies:
  - Allowed file types: **.pdf, .docx**
  - Max file size: **10 MB**
- Policy lifecycle states:
  - Draft
  - Published
  - Archived

#### Policy Dates

- Set start and end dates for each policy
- Automatically archive policies upon reaching end date
- Ability to schedule policies for future publication

#### Versioning

- Maintain full version history with diff tracking (textual changes highlighted)
- Revert to any previous version

#### Approval Workflow

- Editors can submit draft policies for supervisor approval
- Supervisor receives email notification with link to review policy
- Supervisor can:
  - Approve and publish policy
  - Send back for further edits
- Notification sent when policy is published

---

### 3.2 Search & Public Display

- Public-facing page listing published policies
- Search policies by:
  - Free-text search
  - Metadata filters
- View policy detail pages with:
  - Rich-text content
  - Metadata tags
  - Attachments for download
- Download policy as PDF
- **Multilingual support:**
  - Policies can be authored and stored in multiple languages
  - Users can select language preference when browsing policies
  - Metadata and UI labels should support translation/localization

---

### 3.3 User Management

- Authentication integrated with existing SSO (CAS)
- Configurable to support other SSO standards
- Role-based permissions:
  - Super Admin
  - Admin/Editor

---

### 3.4 Metadata Management

- Super Admins can:
  - Create new metadata attribute types (e.g. “Department”)
  - Define allowed values (e.g. “Human Resources,” “Finance”)
  - Specify data type (text, number, date, etc.)
- Editors/Admins can:
  - Select existing metadata when creating/editing policies
  - Cannot create new metadata types or values

---

### 3.5 Notifications

- Email notifications triggered:
  - One week before a policy’s end date
  - When a policy is published
  - For pending approvals in the workflow

---

### 3.6 Audit & Logging

- Maintain logs of:
  - Policy creations, edits, deletions
  - User management activities
  - Approvals/rejections
- Logs should include:
  - Timestamp
  - User who performed action
  - Action performed
- Rollback capability from audit log

---

## 4. Non-Functional Requirements

- **Accessibility**: WCAG 2.1 compliance for all public-facing and admin interfaces
- **Compliance**:
  - FERPA
  - Data privacy for any user-identifiable information
- **Performance**:
  - Front-end loads under 2 seconds for public searches
- **Scalability**:
  - Designed for single-tenant deployments but installable at other universities
- **Security**:
  - Secure authentication via CAS/SSO
  - Role-based authorization
  - CSRF/XSS protection
- **Compatibility**:
  - Usable on major browsers (Chrome, Firefox, Edge, Safari)
- **Localization/Internationalization**:
  - System and UI support multiple languages
  - Policies can be stored and retrieved in different languages

---

## 5. Suggested Technology Stack

### Front-End

✅ **React.js**
- Rich ecosystem for building modern UI
- Easy to integrate with accessibility libraries
- Supports multilingual UIs and WYSIWYG editors (Quill.js, Draft.js, TinyMCE)

✅ **Tailwind CSS** or **Bootstrap** (optional)
- For rapid styling and consistent design

✅ **i18next** or similar libraries
- For internationalization and multilingual UI

---

### Back-End

✅ **Node.js (Express.js)**
- Lightweight, performant
- Well-supported for REST APIs

✅ **MariaDB**
- Reliable relational database
- Supports structured data, audit logs, multilingual fields

✅ **Sequelize ORM** (for Node.js)
- Models relational data cleanly
- Supports migrations and multilingual table designs

---

### Authentication

✅ **CAS Client Libraries**
- Node.js CAS client packages available
- Allows connection to existing university SSO setups

---

### File Storage

✅ **Local storage or S3-compatible storage**
- Configurable depending on deployment environment

---

### PDF Generation

✅ **Puppeteer.js** or **pdf-lib**
- Convert HTML/rich text to PDF for downloads

---

### Search

✅ MariaDB Full-Text Search
- Good for medium-scale search/filtering
- If requirements grow, consider ElasticSearch integration

---

### Deployment

- Compatible with:
  - On-prem LAMP-like servers (Apache, Node.js reverse proxy)
  - Dockerized deployments
  - Cloud hosting (AWS, Azure, GCP)

---

## 6. Windsurf AI IDE Integration

Because Windsurf is a low-code/no-code or AI-driven IDE:

- Backend models and API routes should be defined as entities:
  - `Policy`
  - `PolicyVersion`
  - `MetadataAttribute`
  - `User`
  - `AuditLog`
- Connect Windsurf UI components for:
  - WYSIWYG editing
  - Multilingual UI
  - Table views for policies
  - Approval workflows
  - User management

---

## Open Items

✅ File size limit confirmed: **10 MB**  
✅ Allowed file types confirmed: **.pdf, .docx**  
✅ No PDF styling for now  
✅ Multilingual support confirmed

---

## Next Steps

Would you like me to help with:

- Database schema design for multilingual policies and metadata?
- Sample UI wireframes for Windsurf AI IDE?
- User flow diagrams?
- A first set of user stories for development planning?
