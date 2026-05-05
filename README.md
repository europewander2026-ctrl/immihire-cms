# ImmiHire Headless CMS & CRM

A modern, serverless, decoupled web architecture built for ImmiHire Management Consultancy. This platform features a lightning-fast public frontend, a secure Admin CMS for drag-and-drop page building, and an integrated CRM for lead management.

## 🚀 Tech Stack
*   **Frontend:** React, Tailwind CSS, Vite, React Router, Three.js, Framer Motion
*   **Backend:** Vercel Serverless Functions (Node.js/ESM)
*   **Database:** Neon (Serverless PostgreSQL)
*   **Storage:** Vercel Blob (Cloud Image Hosting)
*   **SEO:** React Helmet Async

## 🏗 Architecture Overview
The platform is split into two main environments:
1.  **Public Frontend (`/`)**: A dynamic React SPA that fetches JSON payloads from the database and renders them into custom UI widgets via the `SectionRenderer`.
2.  **Immi-Admin Portal (`/immi-admin`)**: A secure, token-gated dashboard where administrators can Create, Read, Update, and Delete pages, as well as manage inbound consultation requests (Leads).

## 🔑 Environment Variables
To run this project locally or in production, the following variables must be set in your `.env` file and Vercel Project Settings:
- `DATABASE_URL`="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"
- `ADMIN_SECRET`="your_super_secure_password"
- `BLOB_READ_WRITE_TOKEN`="vercel_blob_rw_..."

## 🗄 Database Schema (PostgreSQL)
The application relies on two primary tables in Neon DB:

### 1. Content Table (The CMS)
```sql
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    hero_image_url TEXT,
    content JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Leads Table (The CRM)
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧩 The "Lego Block" Component System
This application uses a modular `SectionRenderer` to dynamically build pages. 

### How to add a new CMS Component:
1. **Build the UI:** Create your new React component in `frontend/src/components/sections/`. Ensure it accepts dynamic data via props.
2. **Register it:** Open `frontend/src/components/SectionRenderer.jsx` and add a new case to the switch statement.
3. **Add to Admin UI:** Open `frontend/src/pages/admin/PagesManager.jsx` and add a new button/editor block to the Section Builder.

## 📡 API Routes
All backend logic is handled via Vercel Serverless Functions (`/api/*`):
*   **Public Routes:** `GET /api/page`, `GET /api/services`, `POST /api/contact`
*   **Protected Admin Routes (Requires Bearer Token):** `POST/PUT/DELETE /api/admin/content`, `GET/PUT /api/admin/leads`, `POST /api/admin/upload`
