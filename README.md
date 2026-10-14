# Orbit Client Portal System (CRM)

A responsive, frontend-only client portal built with HTML5, CSS3, and vanilla JavaScript for the Data Alcott Systems WD-CRM-006 / DAS-CRM-006 internship task.

## Features
- Client workspace dashboard with metrics, activity, and milestones
- Project tracking, progress indicators, status filters, sorting, and project details
- Document center with local file metadata, search/filter, and downloads for uploaded files
- Support ticket creation and status tracking
- Invoice history, CSV statement export, and printable invoice details
- Simulated messages with locally persisted thread
- Profile management and preferences
- Admin console with client/project/ticket views, add-client/project, ticket status updates, JSON export, and reset
- Client/Admin demo role switch from the profile menu
- Light/dark theme, responsive sidebar, keyboard shortcut (Ctrl/Cmd+K), toast feedback
- Browser persistence with `localStorage`

## Run locally
No build tools or server are required:
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Use the account menu at the bottom of the sidebar to switch between Client and Admin demo modes.

## Demo role switching
The role switch is a UI demonstration only, not real authentication or authorization. All records are fictional sample data. The admin panel is not secure.

## Storage and security limitations
This project is intentionally frontend-only. Data is stored in the browser's `localStorage`; uploaded files are not sent to a server or securely stored in the cloud. The app must not be used for real client records, sensitive documents, real invoices, or payment details. A production portal would require server-side authentication, authorization, database storage, file scanning/access controls, audit logs, and a secure payment provider.

## Project structure
```text
client-portal-system/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   └── app.js
├── assets/
│   └── README.md
├── README.md
├── PROJECT_REPORT.md
└── .gitignore
```

## Screenshots and demo submission
Suggested screenshots:
- Client dashboard
- Admin console
- Projects page
- Documents page
- Support tickets
- Invoice page
- Mobile responsive view

For a 3–5 minute demo, show the dashboard, open a project, upload a small sample file, create a support ticket, send a message, edit profile details, switch to admin mode, and export demo data. Mention that all functionality is simulated in-browser.

## GitHub Pages deployment
1. Create a public repository and upload the contents of this folder.
2. Open repository **Settings → Pages**.
3. Choose deployment from the `main` branch and `/ (root)`.
4. Save and wait for the Pages URL to become available.

## Credits
Built as a student demonstration project using HTML, CSS, and JavaScript. Icons are from Font Awesome CDN and typography uses Google Fonts, so those optional visual assets need internet access. The app itself runs locally without a backend.
