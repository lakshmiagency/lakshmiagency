import { Request, Response } from 'express';
import { query, pool } from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
  const { search, category_id, brand_id } = req.query;

  let queryText = `
    SELECT p.id, p.category_id, p.brand_id, p.product_name, p.description, p.image, p.created_at, p.updated_at,
           c.name as category_name,
           b.name as brand_name,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', v.id,
                 'size', v.size,
                 'unit', v.unit,
                 'price', v.price,
                 'status', v.status
               ) ORDER BY v.price ASC
             ) FILTER (WHERE v.id IS NOT NULL), 
             '[]'
           ) as variants
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN variants v ON p.id = v.product_id
  `;

  const whereClauses: string[] = [];
  const params: any[] = [];

  if (category_id) {
    params.push(category_id);
    whereClauses.push(`p.category_id = $${params.length}`);
  }

  if (brand_id) {
    params.push(brand_id);
    whereClauses.push(`p.brand_id = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    const sIndex = params.length;
    whereClauses.push(`(p.product_name ILIKE $${sIndex} OR p.description ILIKE $${sIndex} OR c.name ILIKE $${sIndex} OR b.name ILIKE $${sIndex})`);
  }

  if (whereClauses.length > 0) {
    queryText += ` WHERE ` + whereClauses.join(' AND ');
  }

  queryText += `
    GROUP BY p.id, c.name, b.name
    ORDER BY p.created_at DESC
  `;

  try {
    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const queryText = `
    SELECT p.id, p.category_id, p.brand_id, p.product_name, p.description, p.image, p.created_at, p.updated_at,
           c.name as category_name,
           b.name as brand_name,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', v.id,
                 'size', v.size,
                 'unit', v.unit,
                 'price', v.price,
                 'status', v.status
               ) ORDER BY v.price ASC
             ) FILTER (WHERE v.id IS NOT NULL), 
             '[]'
           ) as variants
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN variants v ON p.id = v.product_id
    WHERE p.id = $1
    GROUP BY p.id, c.name, b.name
  `;

  try {
    const result = await query(queryText, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ message: 'Error fetching product detail' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { category_id, brand_id, product_name, description, image, variants } = req.body;

  if (!category_id || !product_name || !image) {
    return res.status(400).json({ message: 'Category, Product Name, and Image are required.' });
  }

  // Parse variants if they are sent as JSON string
  let parsedVariants = variants;
  if (typeof variants === 'string') {
    try {
      parsedVariants = JSON.parse(variants);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants format.' });
    }
  }

  if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
    return res.status(400).json({ message: 'At least one product variant (size, unit, price) is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert product
    const productInsertSQL = `
      INSERT INTO products (category_id, brand_id, product_name, description, image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const productRes = await client.query(productInsertSQL, [
      category_id,
      brand_id || null,
      product_name,
      description || '',
      image
    ]);
    const productId = productRes.rows[0].id;

    // 2. Insert variants
    const variantInsertSQL = `
      INSERT INTO variants (product_id, size, unit, price, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const v of parsedVariants) {
      await client.query(variantInsertSQL, [
        productId,
        v.size,
        v.unit,
        parseFloat(v.price) || 0,
        v.status || 'Available'
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product transaction:', error);
    res.status(500).json({ message: 'Error creating product' });
  } finally {
    client.release();
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category_id, brand_id, product_name, description, image, variants } = req.body;

  if (!category_id || !product_name || !image) {
    return res.status(400).json({ message: 'Category, Product Name, and Image are required.' });
  }

  let parsedVariants = variants;
  if (typeof variants === 'string') {
    try {
      parsedVariants = JSON.parse(variants);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants format.' });
    }
  }

  if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
    return res.status(400).json({ message: 'At least one variant is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update product
    const productUpdateSQL = `
      UPDATE products 
      SET category_id = $1, brand_id = $2, product_name = $3, description = $4, image = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id
    `;
    const productRes = await client.query(productUpdateSQL, [
      category_id,
      brand_id || null,
      product_name,
      description || '',
      image,
      id
    ]);

    if (productRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2. Delete old variants
    await client.query('DELETE FROM variants WHERE product_id = $1', [id]);

    // 3. Insert new variants
    const variantInsertSQL = `
      INSERT INTO variants (product_id, size, unit, price, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const v of parsedVariants) {
      await client.query(variantInsertSQL, [
        id,
        v.size,
        v.unit,
        parseFloat(v.price) || 0,
        v.status || 'Available'
      ]);
    }

    await client.query('COMMIT');
    res.json({ id, message: 'Product updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product transaction:', error);
    res.status(500).json({ message: 'Error updating product' });
  } finally {
    client.release();
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
