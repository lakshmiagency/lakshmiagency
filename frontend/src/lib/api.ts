import productsData from '../data/products.json';

interface Variant {
  id: number;
  size: string;
  unit: string;
  price: string | number;
  status: string;
  itemCode?: string;
  newLp?: string | number;
  coilsPerCarton?: number;
  colors?: string;
  stdPacking?: number;
  dealerPricePerBag?: string | number;
}

interface Product {
  id: number | string;
  product_name: string;
  description: string;
  image: string;
  tableType?: 'general' | 'jk_cement' | 'polycab_mcb' | 'polycab_wire';
  variants: Variant[];
}

const typedProductsData = productsData as unknown as Product[];

export const api = {
  // Public Data
  async getProducts(filters?: { search?: string }): Promise<Product[]> {
    let filtered = [...typedProductsData];
    
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      const isVBondQuery = ['v bond', 'v-bond', 'vbond', 'vb'].includes(term);
      filtered = filtered.filter((p) => {
        if (isVBondQuery && Number(p.id) >= 35 && Number(p.id) <= 43) {
          return true;
        }
        return p.product_name.toLowerCase().includes(term) ||
               p.description.toLowerCase().includes(term);
      });
    }
    
    return filtered;
  },

  async getProductById(id: string | number): Promise<Product> {
    const product = typedProductsData.find((p) => String(p.id) === String(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async getBusinessInfo() {
    return {
      name: 'Lakshmi Agency',
      type: 'Wholesale & Retail Supplier of Building Materials, Hardware, Paint Accessories, PVC Pipes, Bathroom Fittings, Waterproofing Products, Putty, Wall Primer, Tile Chemicals and JK Cement Products.',
      address: 'College Main Road, Sulibele, Hoskote Taluk, Bangalore Rural - 562129',
      phoneNumbers: ['9481252271', '6361033361', '9008157128'],
      whatsApp: '6361033361',
      businessHours: 'Monday - Saturday: 8:30 AM - 8:30 PM, Sunday: Closed'
    };
  },
};

export default api;
