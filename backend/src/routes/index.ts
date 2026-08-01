import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController';

const router = Router();

// Public Catalog Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Business Info Route (Static)
router.get('/business-info', (req, res) => {
  res.json({
    name: 'Lakshmi Agency',
    type: 'Wholesale & Retail Supplier of Building Materials, Hardware, Paint Accessories, PVC Pipes, Bathroom Fittings, Waterproofing Products, Putty, Wall Primer, Tile Chemicals and JK Cement Products.',
    address: 'College Main Road, Sulibele, Hoskote Taluk, Bangalore Rural - 562129',
    phoneNumbers: ['9481252271', '6361033361', '9008157128'],
    whatsApp: '6361033361',
    businessHours: 'Monday - Saturday: 8:30 AM - 8:30 PM, Sunday: Closed'
  });
});

export default router;
