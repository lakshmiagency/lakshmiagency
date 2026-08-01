import { Request, Response } from 'express';
import products from '../data/products.json';
import categories from '../data/categories.json';
import brands from '../data/brands.json';

// Helper to map category and brand names to products
const getMappedProducts = () => {
  return products.map((p) => {
    const category = categories.find((c) => c.id === p.category_id);
    const brand = brands.find((b) => b.id === p.brand_id);
    return {
      ...p,
      category_name: category ? category.name : 'Unknown',
      brand_name: brand ? brand.name : 'Generic'
    };
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const { search, category_id, brand_id } = req.query;

  try {
    let filtered = getMappedProducts();

    if (category_id) {
      filtered = filtered.filter((p) => p.category_id === Number(category_id));
    }

    if (brand_id) {
      filtered = filtered.filter((p) => p.brand_id === Number(brand_id));
    }

    if (search) {
      const term = String(search).toLowerCase();
      filtered = filtered.filter((p) => 
        p.product_name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category_name.toLowerCase().includes(term) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(term))
      );
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
    const mapped = getMappedProducts();
    const product = mapped.find((p) => p.id === Number(id));

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ message: 'Error fetching product detail' });
  }
};
