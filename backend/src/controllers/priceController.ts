import { Request, Response } from 'express';
import products from '../data/products.json';
import categories from '../data/categories.json';
import brands from '../data/brands.json';

export const getPrices = async (req: Request, res: Response) => {
  const { search, category_id, brand_id } = req.query;

  try {
    const flatPrices: any[] = [];

    // Flatten all variants from all products in memory
    products.forEach((p) => {
      const category = categories.find((c) => c.id === p.category_id);
      const brand = brands.find((b) => b.id === p.brand_id);

      p.variants.forEach((v) => {
        flatPrices.push({
          variant_id: v.id,
          size: v.size,
          unit: v.unit,
          price: v.price,
          status: v.status,
          product_id: p.id,
          product_name: p.product_name,
          category_id: p.category_id,
          category_name: category ? category.name : 'Unknown',
          brand_id: p.brand_id,
          brand_name: brand ? brand.name : 'Generic'
        });
      });
    });

    let filtered = [...flatPrices];

    if (category_id) {
      filtered = filtered.filter((item) => item.category_id === Number(category_id));
    }

    if (brand_id) {
      filtered = filtered.filter((item) => item.brand_id === Number(brand_id));
    }

    if (search) {
      const term = String(search).toLowerCase();
      filtered = filtered.filter((item) => 
        item.product_name.toLowerCase().includes(term) ||
        item.category_name.toLowerCase().includes(term) ||
        (item.brand_name && item.brand_name.toLowerCase().includes(term))
      );
    }

    // Sort by category name, then product name, then price
    filtered.sort((a, b) => {
      if (a.category_name !== b.category_name) {
        return a.category_name.localeCompare(b.category_name);
      }
      if (a.product_name !== b.product_name) {
        return a.product_name.localeCompare(b.product_name);
      }
      return Number(a.price) - Number(b.price);
    });

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching price list:', error);
    res.status(500).json({ message: 'Error fetching price list' });
  }
};
