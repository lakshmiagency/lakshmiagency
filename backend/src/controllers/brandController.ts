import { Request, Response } from 'express';
import { query } from '../config/db';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT b.id, b.name, b.logo, COUNT(p.id)::int as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      GROUP BY b.id
      ORDER BY b.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  const { name, logo } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Brand name is required.' });
  }

  try {
    const result = await query(
      'INSERT INTO brands (name, logo) VALUES ($1, $2) RETURNING *',
      [name, logo || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating brand:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Brand name already exists.' });
    }
    res.status(500).json({ message: 'Error creating brand' });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, logo } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Brand name is required.' });
  }

  try {
    const result = await query(
      'UPDATE brands SET name = $1, logo = $2 WHERE id = $3 RETURNING *',
      [name, logo || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating brand:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Brand name already exists.' });
    }
    res.status(500).json({ message: 'Error updating brand' });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM brands WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    res.json({ message: 'Brand deleted successfully.', brand: result.rows[0] });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ message: 'Error deleting brand' });
  }
};
