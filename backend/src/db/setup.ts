import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const createTablesSQL = `
  -- Create Admins Table
  CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Categories Table
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    image TEXT NOT NULL
  );

  -- Create Brands Table
  CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    logo TEXT
  );

  -- Create Products Table
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Variants Table
  CREATE TABLE IF NOT EXISTS variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Available'
  );

  -- Add Indexes for search optimization
  CREATE INDEX IF NOT EXISTS idx_products_name ON products (product_name);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
  CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand_id);
  CREATE INDEX IF NOT EXISTS idx_variants_product ON variants (product_id);
`;

async function setupDB() {
  console.log('Starting Database Setup...');
  
  try {
    // 1. Create tables
    console.log('Creating tables and indexes if they do not exist...');
    await query(createTablesSQL);
    console.log('Tables created successfully.');

    // 2. Create Admin User
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Lakshmi@2026';
    
    const adminCheck = await query('SELECT * FROM admins WHERE username = $1', [adminUser]);
    if (adminCheck.rows.length === 0) {
      console.log(`Creating default admin user: ${adminUser}...`);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(adminPass, salt);
      await query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [adminUser, hash]);
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // 3. Seed Categories if empty
    const catCheck = await query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCheck.rows[0].count) === 0) {
      console.log('Seeding initial categories...');
      const categories = [
        { name: 'PVC Pipes', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=60' },
        { name: 'Garden Pipes', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=60' },
        { name: 'Bathroom Fittings', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60' },
        { name: 'Paint Chemicals', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=60' },
        { name: 'Putty', image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=500&auto=format&fit=crop&q=60' },
        { name: 'Wall Primer', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60' },
        { name: 'Waterproofing', image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=500&auto=format&fit=crop&q=60' },
        { name: 'Tile Chemicals', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=60' },
        { name: 'Hardware Tools', image: 'https://images.unsplash.com/photo-1530124560072-a059b014b666?w=500&auto=format&fit=crop&q=60' },
        { name: 'JK Cement Products', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop&q=60' }
      ];

      for (const cat of categories) {
        await query('INSERT INTO categories (name, image) VALUES ($1, $2)', [cat.name, cat.image]);
      }
      console.log('Categories seeded.');
    }

    // 4. Seed Brands if empty
    const brandCheck = await query('SELECT COUNT(*) FROM brands');
    if (parseInt(brandCheck.rows[0].count) === 0) {
      console.log('Seeding initial brands...');
      const brands = [
        { name: 'JK Cement', logo: '' },
        { name: 'Asian Paints', logo: '' },
        { name: 'Berger Paints', logo: '' },
        { name: 'Finolex Pipes', logo: '' },
        { name: 'Ashirvad Pipes', logo: '' },
        { name: 'Astral Pipes', logo: '' },
        { name: 'Dr. Fixit', logo: '' },
        { name: 'Supreme', logo: '' },
        { name: 'Laticrete', logo: '' },
        { name: 'Taparia', logo: '' }
      ];

      for (const brand of brands) {
        await query('INSERT INTO brands (name, logo) VALUES ($1, $2)', [brand.name, brand.logo]);
      }
      console.log('Brands seeded.');
    }

    // 5. Seed Products & Variants if empty
    const prodCheck = await query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCheck.rows[0].count) === 0) {
      console.log('Seeding initial products and variants...');

      // Fetch categories & brands for matching
      const catsRes = await query('SELECT id, name FROM categories');
      const catMap = new Map(catsRes.rows.map(c => [c.name, c.id]));

      const brandsRes = await query('SELECT id, name FROM brands');
      const brandMap = new Map(brandsRes.rows.map(b => [b.name, b.id]));

      const productsToSeed = [
        {
          category: 'JK Cement Products',
          brand: 'JK Cement',
          name: 'JK WallMaxX Putty',
          description: 'Premium quality white cement-based wall putty with advanced water resistance and excellent adhesion. Provides a smooth, glossy finish for interior and exterior walls.',
          image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '40', unit: 'kg', price: 1150.00 },
            { size: '20', unit: 'kg', price: 620.00 },
            { size: '5', unit: 'kg', price: 210.00 }
          ]
        },
        {
          category: 'JK Cement Products',
          brand: 'JK Cement',
          name: 'JK Super Strong Cement',
          description: 'High-performance PPC cement designed for durable RCC structures, foundations, and plastering. Offers excellent strength development and resistance to environmental elements.',
          image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '50', unit: 'kg', price: 430.00 }
          ]
        },
        {
          category: 'Waterproofing',
          brand: 'Dr. Fixit',
          name: 'Dr. Fixit LW+ Super',
          description: 'Liquid waterproofing compound mixed with concrete and mortar during construction. Reduces water permeability, prevents dampness, and increases concrete strength.',
          image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '1', unit: 'Litre', price: 185.00 },
            { size: '5', unit: 'Litre', price: 860.00 },
            { size: '10', unit: 'Litre', price: 1620.00 },
            { size: '20', unit: 'Litre', price: 3100.00 }
          ]
        },
        {
          category: 'Waterproofing',
          brand: 'Dr. Fixit',
          name: 'Dr. Fixit Pidiproof LW',
          description: 'Specially formulated additive for cement sand mortars to make plaster and concrete waterproof. Highly recommended for basements, terraces, and bathrooms.',
          image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '1', unit: 'Litre', price: 150.00 },
            { size: '5', unit: 'Litre', price: 710.00 }
          ]
        },
        {
          category: 'PVC Pipes',
          brand: 'Finolex Pipes',
          name: 'Finolex Rigid PVC Pipe (6kg/cm²)',
          description: 'High-quality unplasticized PVC pipes suitable for plumbing, water supply, and agriculture. Resistant to corrosion and easy to install with solvent cement.',
          image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '110mm (6m)', unit: 'Length', price: 850.00 },
            { size: '90mm (6m)', unit: 'Length', price: 680.00 },
            { size: '75mm (6m)', unit: 'Length', price: 540.00 }
          ]
        },
        {
          category: 'PVC Pipes',
          brand: 'Ashirvad Pipes',
          name: 'Ashirvad CPVC FlowGuard Pipe SDR 11',
          description: 'Chlorinated PVC pipes designed for hot and cold water distribution. Ideal for residential plumbing with high temperature resistance and lead-free formulation.',
          image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '1 inch (3m)', unit: 'Length', price: 440.00 },
            { size: '3/4 inch (3m)', unit: 'Length', price: 310.00 },
            { size: '1/2 inch (3m)', unit: 'Length', price: 215.00 }
          ]
        },
        {
          category: 'Garden Pipes',
          brand: 'Supreme',
          name: 'Supreme DuraHose Braided Garden Pipe',
          description: 'Heavy-duty 3-layer flexible PVC braided garden water hose pipe. Kink-resistant, weather-proof, and highly durable for gardening and car washing.',
          image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '1/2 inch - 30m', unit: 'Roll', price: 1250.00 },
            { size: '3/4 inch - 30m', unit: 'Roll', price: 1950.00 }
          ]
        },
        {
          category: 'Wall Primer',
          brand: 'Asian Paints',
          name: 'Asian Paints Decoprime Wall Primer (Water Based)',
          description: 'Superior quality water-based wall primer undercoat. Excellent sealing properties, enhances topcoat coverage, and increases paint adhesion on masonry surfaces.',
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '20', unit: 'Litre', price: 2450.00 },
            { size: '10', unit: 'Litre', price: 1350.00 },
            { size: '4', unit: 'Litre', price: 620.00 },
            { size: '1', unit: 'Litre', price: 180.00 }
          ]
        },
        {
          category: 'Paint Chemicals',
          brand: 'Asian Paints',
          name: 'Asian Paints Mineral Turpentine Oil (MTO)',
          description: 'Premium quality paint thinner and cleaning solvent. Speeds up drying time for oil paints and varnishes while providing a glossy finish.',
          image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '5', unit: 'Litre', price: 780.00 },
            { size: '1', unit: 'Litre', price: 175.00 },
            { size: '500', unit: 'ml', price: 95.00 }
          ]
        },
        {
          category: 'Tile Chemicals',
          brand: 'Laticrete',
          name: 'Laticrete 307 Stone & Tile Adhesive',
          description: 'Grey cement-based polymer fortified adhesive. Perfect for installing ceramic, vitrified tiles, and natural stones on floors and walls in interior applications.',
          image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: '20', unit: 'kg', price: 380.00 }
          ]
        },
        {
          category: 'Bathroom Fittings',
          brand: 'Astral Pipes',
          name: 'Astral Bathroom Overhead Shower & Arm',
          description: 'Premium chrome plated overhead shower with rub-clean silicon nozzles and durable brass connection arm. Features smooth flow and elegant design.',
          image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: 'Standard', unit: 'Piece', price: 1100.00 }
          ]
        },
        {
          category: 'Hardware Tools',
          brand: 'Taparia',
          name: 'Taparia 812 Steel Screw Driver Set',
          description: 'Multi-blade screwdriver kit containing 5 interchangeable blades made of high grade silicon-manganese steel and a shockproof plastic handle.',
          image: 'https://images.unsplash.com/photo-1530124560072-a059b014b666?w=500&auto=format&fit=crop&q=60',
          variants: [
            { size: 'Set of 5 Blades', unit: 'Box', price: 320.00 }
          ]
        }
      ];

      for (const prod of productsToSeed) {
        const catId = catMap.get(prod.category);
        const brandId = prod.brand ? brandMap.get(prod.brand) : null;

        if (catId) {
          const insertProdRes = await query(
            'INSERT INTO products (category_id, brand_id, product_name, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [catId, brandId, prod.name, prod.description, prod.image]
          );
          
          const productId = insertProdRes.rows[0].id;
          
          for (const variant of prod.variants) {
            await query(
              'INSERT INTO variants (product_id, size, unit, price) VALUES ($1, $2, $3, $4)',
              [productId, variant.size, variant.unit, variant.price]
            );
          }
        }
      }
      console.log('Products and variants seeded successfully.');
    } else {
      console.log('Products already exist, skipping seed.');
    }
    
    console.log('Database Setup Completed Successfully!');
  } catch (error) {
    console.error('Error during Database Setup:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDB();
