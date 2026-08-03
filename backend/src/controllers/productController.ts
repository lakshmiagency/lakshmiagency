import { Request, Response } from 'express';
import products from '../data/products.json';

export const getProducts = async (req: Request, res: Response) => {
  const { search } = req.query;

  try {
    let filtered = [...products];

    if (search) {
      const term = String(search).toLowerCase();
      const isVBondQuery = ['v bond', 'v-bond', 'vbond', 'vb'].includes(term);
      filtered = filtered.filter((p) => {
        if (isVBondQuery && Number(p.id) >= 35 && Number(p.id) <= 43) {
          return true;
        }
        return p.product_name.toLowerCase().includes(term) ||
               p.description.toLowerCase().includes(term);
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = products.find((p) => String(p.id) === id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ message: 'Error fetching product detail' });
  }
};
