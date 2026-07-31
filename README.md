# Lakshmi Agency — Business Catalogue Website

A modern, premium, responsive business catalogue website for **Lakshmi Agency** (wholesale & retail supplier of building materials, hardware, paints, PVC pipes, bathroom fittings, waterproofing, and JK cement products in Sulibele, Bangalore Rural).

> **Important Note:** This is a **catalogue-only website**. There are **no carts, checkouts, online payments, or user logins**. The website showcases products and latest estimated prices. Direct sales inquiries are facilitated via a floating WhatsApp chat button and direct phone calls.

---

## Folder Structure

```
lakshmi-agency/
├── backend/                  # Express + Node.js (TypeScript)
│   ├── src/
│   │   ├── config/           # Database config & Cloudinary config
│   │   ├── controllers/      # Route controllers (Auth, CRUD, Prices, Uploads)
│   │   ├── middleware/       # JWT Authentication middleware
│   │   ├── routes/           # REST API routes routing
│   │   ├── db/               # DB creation, migration & seed scripts
│   │   └── server.ts         # Backend Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js 15 (React, TypeScript, Tailwind CSS v4)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (Home, About, Products, Price List, Contact, Admin)
│   │   ├── components/       # Shared UI (Navbar, Footer, ProductCard, Modals, Providers)
│   │   ├── context/          # React contexts (AuthContext, DarkModeContext)
│   │   └── lib/              # API Fetch client
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
├── README.md                 # Project Documentation
└── .gitignore                # Workspace ignore
```

---

## Database Design & Schema

The application uses **PostgreSQL**. The relational schema is structured as follows:

```sql
-- 1. Admins Table
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  image TEXT NOT NULL
);

-- 3. Brands Table
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  logo TEXT
);

-- 4. Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Variants Table (Size & Prices)
CREATE TABLE variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(50) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Available'
);
```

---

## REST API Documentation

All routes are prefixed with `/api`. Protected routes require a valid JWT header (`Authorization: Bearer <token>`).

### Public Routes
*   `GET /categories` - Retrieve all categories along with active product counts.
*   `GET /brands` - Retrieve all brand partners with active product counts.
*   `GET /products` - Search and retrieve catalogued products.
    *   Query parameters: `?search=word`, `?category_id=id`, `?brand_id=id`.
*   `GET /products/:id` - Retrieve specific product details with all size variants.
*   `GET /prices` - Fetch a flat list of all variants (for the price list table).
    *   Query parameters: `?search=word`, `?category_id=id`, `?brand_id=id`.
*   `GET /business-info` - Returns details about the store (hours, phones, address).

### Admin Auth Routes
*   `POST /admin/login` - Authenticate admin credentials and retrieve a JWT.
*   `GET /admin/verify` - Validate JWT active state.

### Admin Protected Routes
*   `POST /categories` - Add a category.
*   `PUT /categories/:id` - Update a category.
*   `DELETE /categories/:id` - Delete a category.
*   `POST /brands` - Register a brand.
*   `PUT /brands/:id` - Edit a brand.
*   `DELETE /brands/:id` - Delete a brand.
*   `POST /products` - Catalogue a product and specify its variant sizes & prices.
*   `PUT /products/:id` - Edit a product description, image, and variant structure.
*   `DELETE /products/:id` - Delete a product.
*   `PUT /prices/:variantId` - Perform an inline price update or change variant stock status.
*   `POST /upload` - Upload an image (automatically handles Cloudinary upload or local write).

---

## Local Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running locally or on a cloud provider (e.g. Supabase, Render, Neon).

### 1. Database Initialization
Ensure you have created a database in PostgreSQL, for example `lakshmi_agency`.

### 2. Backend Installation & Seeding
1. Open a terminal and move to the `backend` folder.
2. Create your `.env` configuration (copy from `.env.example`).
3. Set your PostgreSQL database connection string in `DATABASE_URL`:
   `DATABASE_URL=postgresql://postgres:password@localhost:5432/lakshmi_agency`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the database setup script to migrate tables and seed realistic hardware catalogue data:
   ```bash
   npm run db:setup
   ```
6. Start the backend developer server:
   ```bash
   npm run dev
   ```
   The backend server will run on [http://localhost:5000](http://localhost:5000).

### 3. Frontend Installation
1. Open a terminal and move to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The website will run on [http://localhost:3000](http://localhost:3000).

---

## Seed Admin Credentials

*   **Username:** `admin`
*   **Password:** `Lakshmi@2026`

---

## Deployment Guide

### Backend Deployment (Render)
1. Commit the project to a **GitHub repository**.
2. Sign in to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Configure the Web Service settings:
   *   **Name:** `lakshmi-agency-backend`
   *   **Language:** `Node`
   *   **Root Directory:** `backend`
   *   **Build Command:** `npm install && npm run build`
   *   **Start Command:** `npm start`
6. Under **Environment Variables**, add:
   *   `PORT` = `10000` (or leave empty; Render assigns dynamic ports)
   *   `DATABASE_URL` = `<your_postgresql_connection_string>`
   *   `JWT_SECRET` = `<generate_a_random_jwt_key>`
   *   `ADMIN_USERNAME` = `admin`
   *   `ADMIN_PASSWORD` = `Lakshmi@2026`
   *   *(Optional)* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
7. Click **Deploy Web Service**.
8. Once deployed, note down your web service URL (e.g. `https://lakshmi-agency-backend.onrender.com`).

### Frontend Deployment (Vercel)
1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** and select **Project**.
3. Select your GitHub repository.
4. Configure the Vercel Deployment settings:
   *   **Framework Preset:** `Next.js`
   *   **Root Directory:** `frontend`
5. Under **Environment Variables**, add:
   *   `NEXT_PUBLIC_API_URL` = `https://<your_render_backend_url>/api` (e.g., `https://lakshmi-agency-backend.onrender.com/api`)
6. Click **Deploy**. Vercel will build and host the application, routing search engine crawlers and users to your premium web interface.
