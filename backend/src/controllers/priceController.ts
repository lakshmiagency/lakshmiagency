import { Request, Response } from 'express';
import { query } from '../config/db';

export const getPrices = async (req: Request, res: Response) => {
  const { search, category_id, brand_id } = req.query;

  let queryText = `
    SELECT v.id as variant_id, v.size, v.unit, v.price, v.status,
           p.id as product_id, p.product_name,
           c.name as category_name, c.id as category_id,
           b.name as brand_name, b.id as brand_id
    FROM variants v
    JOIN products p ON v.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
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
    whereClauses.push(`(p.product_name ILIKE $${sIndex} OR c.name ILIKE $${sIndex} OR b.name ILIKE $${sIndex})`);
  }

  if (whereClauses.length > 0) {
    queryText += ` WHERE ` + whereClauses.join(' AND ');
  }

  queryText += `
    ORDER BY c.name ASC, p.product_name ASC, v.price ASC
  `;

  try {
    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching price list:', error);
    res.status(500).json({ message: 'Error fetching price list' });
  }
};

export const updatePrice = async (req: Request, res: Response) => {
  const { variantId } = req.params;
  const { price, status } = req.body;

  if (price === undefined && !status) {
    return res.status(400).json({ message: 'Price or status is required to update.' });
  }

  try {
    let result;
    if (price !== undefined && status) {
      result = await query(
        'UPDATE variants SET price = $1, status = $2 WHERE id = $3 RETURNING *',
        [parseFloat(price), status, variantId]
      );
    } else if (price !== undefined) {
      result = await query(
        'UPDATE variants SET price = $1 WHERE id = $2 RETURNING *',
        [parseFloat(price), variantId]
      );
    } else {
      result = await query(
        'UPDATE variants SET status = $1 WHERE id = $2 RETURNING *',
        [status, variantId]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    res.json({ message: 'Price updated successfully', variant: result.rows[0] });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ message: 'Error updating price' });
  }
};
