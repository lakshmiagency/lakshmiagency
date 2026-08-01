# Lakshmi Agency — Business Catalogue Website

A modern, premium, responsive business catalogue website for **Lakshmi Agency** (wholesale & retail supplier of building materials, hardware, paints, PVC pipes, bathroom fittings, waterproofing, and JK cement products in Sulibele, Bangalore Rural).

This project uses a **database-free, code-managed architecture**. All product items, brands, and categories are stored directly in local JSON files in the backend source code. 

There are **no databases to manage, no admin portals, no checkouts, and no dynamic server writes**. This ensures maximum speed, 100/100 Lighthouse performance, zero database costs, and instant load times.

---

## Folder Structure

```
lakshmi-agency/
├── backend/                  # Express + Node.js (TypeScript)
│   ├── src/
│   │   ├── data/             # Local database JSON files (edit these to update stock!)
│   │   │   ├── categories.json
│   │   │   ├── brands.json
│   │   │   └── products.json
│   │   ├── controllers/      # Route controllers (Category, Brand, Product, Price)
│   │   ├── routes/           # REST API routes
│   │   └── server.ts         # Backend Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js 15 (React, TypeScript, Tailwind CSS v4)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (Home, About, Products, Price List, Contact)
│   │   ├── components/       # Shared UI (Navbar, Footer, ProductCard, Modals, Providers)
│   │   ├── context/          # React contexts (DarkModeContext)
│   │   └── lib/              # API Fetch client
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
└── README.md                 # Project Documentation
```

---

## How to Manage Catalogue & Update Prices

To update prices, add new products, or change categories/brands, edit the JSON files in `backend/src/data/` and push the changes to GitHub. Render will automatically redeploy the backend and update your live catalogue instantly!

### 1. Categories (`backend/src/data/categories.json`)
Contains the departments list. Each category needs an `id` (integer), `name` (string), and `image` (URL):
```json
[
  { "id": 1, "name": "PVC Pipes", "image": "https://..." }
]
```

### 2. Brands (`backend/src/data/brands.json`)
Contains the brands list. Each brand needs an `id` (integer), `name` (string), and `logo` (optional URL):
```json
[
  { "id": 1, "name": "JK Cement", "logo": "" }
]
```

### 3. Products & Sizing Variants (`backend/src/data/products.json`)
Contains the full catalogue. Associate products with their category and brand using the respective IDs:
```json
[
  {
    "id": 1,
    "category_id": 10,
    "brand_id": 1,
    "product_name": "JK WallMaxX Putty",
    "description": "Premium quality white cement-based wall putty...",
    "image": "https://...",
    "variants": [
      { "id": 1, "size": "40", "unit": "kg", "price": 1150.00, "status": "Available" },
      { "id": 2, "size": "20", "unit": "kg", "price": 620.00, "status": "Available" }
    ]
  }
]
```

---

## Local Development Setup

### 1. Backend Setup
1. Move to the `backend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

### 2. Frontend Setup
1. Move to the `frontend/` directory.
2. Create `frontend/.env.local` containing:
   `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The website will run on [http://localhost:3000](http://localhost:3000).

---

## Deployment Guide

### 📁 Backend Deployment (Render Web Service)
1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New + > Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   * **Name**: `lakshmiagency-backend`
   * **Root Directory**: `backend`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
5. Click **Deploy Web Service**.
6. Once live, copy your service URL (e.g. `https://lakshmiagency.onrender.com`).

### 📁 Frontend Deployment (Vercel)
1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New > Project** and select your GitHub repository.
3. Configure the settings:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: `frontend`
4. Add the following environment variable:
   * **Name**: `NEXT_PUBLIC_API_URL`
   * **Value**: `https://<your_render_backend_url>/api` (e.g. `https://lakshmiagency.onrender.com/api`)
5. Click **Deploy**.
