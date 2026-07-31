import { Router } from 'express';
import { login, verifyToken } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/auth';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { getPrices, updatePrice } from '../controllers/priceController';
import { uploadMiddleware, uploadImage } from '../controllers/uploadController';

const router = Router();

// Auth Routes
router.post('/admin/login', login);
router.get('/admin/verify', authenticateAdmin, verifyToken);

// Categories Routes
router.get('/categories', getCategories);
router.post('/categories', authenticateAdmin, createCategory);
router.put('/categories/:id', authenticateAdmin, updateCategory);
router.delete('/categories/:id', authenticateAdmin, deleteCategory);

// Brands Routes
router.get('/brands', getBrands);
router.post('/brands', authenticateAdmin, createBrand);
router.put('/brands/:id', authenticateAdmin, updateBrand);
router.delete('/brands/:id', authenticateAdmin, deleteBrand);

// Products Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', authenticateAdmin, createProduct);
router.put('/products/:id', authenticateAdmin, updateProduct);
router.delete('/products/:id', authenticateAdmin, deleteProduct);

// Price List Routes
router.get('/prices', getPrices);
router.put('/prices/:variantId', authenticateAdmin, updatePrice);

// Image Upload Route
router.post('/upload', authenticateAdmin, uploadMiddleware.single('image'), uploadImage);

// Business Info Route (static data for simplicity)
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
