import { Request, Response } from 'express';
import { query } from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    // Left join products to count how many products exist in each category
    const result = await query(`
      SELECT c.id, c.name, c.image, COUNT(p.id)::int as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ message: 'Name and image are required.' });
  }

  try {
    const result = await query(
      'INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *',
      [name, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ message: 'Category name already exists.' });
    }
    res.status(500).json({ message: 'Error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ message: 'Name and image are required.' });
  }

  try {
    const result = await query(
      'UPDATE categories SET name = $1, image = $2 WHERE id = $3 RETURNING *',
      [name, image, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Category name already exists.' });
    }
    res.status(500).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json({ message: 'Category deleted successfully.', category: result.rows[0] });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
