import { Request, Response } from 'express';
import products from '../data/products.json';

export const getPrices = async (req: Request, res: Response) => {
  const { search } = req.query;

  try {
    const flatPrices: any[] = [];

    // Flatten all variants from all products in memory
    products.forEach((p) => {
      p.variants.forEach((v) => {
        flatPrices.push({
          variant_id: v.id,
          size: v.size,
          unit: v.unit,
          price: v.price,
          status: v.status,
          product_id: p.id,
          product_name: p.product_name
        });
      });
    });

    let filtered = [...flatPrices];

    if (search) {
      const term = String(search).toLowerCase();
      filtered = filtered.filter((item) => 
        item.product_name.toLowerCase().includes(term) ||
        item.size.toLowerCase().includes(term)
      );
    }

    // Sort by product name, then price
    filtered.sort((a, b) => {
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
