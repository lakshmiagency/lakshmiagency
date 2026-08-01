import { Request, Response } from 'express';
import categories from '../data/categories.json';
import products from '../data/products.json';

export const getCategories = async (req: Request, res: Response) => {
  try {
    // Dynamically calculate product counts from in-memory products array
    const categoriesWithCount = categories.map((cat) => {
      const productCount = products.filter((p) => p.category_id === cat.id).length;
      return {
        ...cat,
        product_count: productCount
      };
    });
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};
