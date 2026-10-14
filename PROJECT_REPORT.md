# Project Report — Client Portal System (CRM)

**Task ID:** WD-CRM-006  
**Student Code:** DAS-CRM-006  
**Domain:** CRM — Client Portal  
**Technology:** HTML5, CSS3, Vanilla JavaScript, localStorage

## 1. Objective
The objective of the Client Portal System is to provide a clear self-service workspace where clients can review project progress, access shared documents, create support tickets, view invoices, communicate with an account manager, and update profile details. A separate admin console demonstrates common workspace management operations.

## 2. Technology and Implementation
The interface is built with semantic HTML, responsive CSS, and plain JavaScript. Sample clients, projects, documents, tickets, invoices, activities, and messages are represented as JavaScript objects and arrays. Browser `localStorage` is used to preserve demo changes after refresh. CSS media queries adapt the sidebar, cards, tables, forms, and messaging layout for mobile screens.

## 3. Main Features
- Client dashboard with activity, account metrics, recent projects, and upcoming milestones.
- Project listing with status filters, sorting, progress bars, due dates, and project details.
- Document library with file search, type filters, upload metadata, and downloadable uploaded files.
- Support ticket creation, priority selection, and status tracking.
- Invoice history with status filters, invoice detail/print view, and CSV statement export.
- Local messaging thread with send-message interaction.
- Editable profile and notification preferences.
- Admin demo console for viewing clients/projects/tickets, adding a client/project, updating ticket status, exporting workspace JSON, and resetting sample data.
- Responsive navigation, dark mode, keyboard search shortcut, and toast notifications.

## 4. Learning Outcomes
This project practices DOM manipulation, event delegation, form validation, data modeling with arrays/objects, localStorage persistence, filtering and sorting, responsive layouts, reusable UI components, and export/download behavior using browser APIs.

## 5. Challenges and Limitations
The main implementation challenge is keeping UI state and locally stored records synchronized across several modules. This is addressed by centralized state helpers and re-render functions. Since the assignment specifies no database or backend, authentication and role switching are simulated, and file uploads remain browser-local. This is not a secure production CRM: a real deployment would require a backend, secure authentication and authorization, database, private document storage, server validation, audit logging, and payment-provider integration.
