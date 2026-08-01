import { Request, Response } from 'express';
import brands from '../data/brands.json';
import products from '../data/products.json';

export const getBrands = async (req: Request, res: Response) => {
  try {
    // Dynamically calculate product counts from in-memory products array
    const brandsWithCount = brands.map((brand) => {
      const productCount = products.filter((p) => p.brand_id === brand.id).length;
      return {
        ...brand,
        product_count: productCount
      };
    });
    res.json(brandsWithCount);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};
