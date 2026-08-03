'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EnquiryItem {
  productId: string | number;
  productName: string;
  variantId: number;
  variantSize: string;
  variantPrice: string | number;
  itemCode?: string;
  quantity: number;
  unit: string;
}

interface EnquiryContextType {
  enquiryItems: EnquiryItem[];
  isDrawerOpen: boolean;
  addToEnquiry: (product: any, variant: any, quantity?: number) => void;
  removeFromEnquiry: (variantId: number) => void;
  updateQuantity: (variantId: number, qty: number) => void;
  clearEnquiry: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  sendWhatsAppEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export const EnquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enquiryItems, setEnquiryItems] = useState<EnquiryItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lakshmi_enquiry_list');
    if (saved) {
      try {
        setEnquiryItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse enquiry items from storage:', e);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('lakshmi_enquiry_list', JSON.stringify(enquiryItems));
    }
  }, [enquiryItems, mounted]);

  const addToEnquiry = (product: any, variant: any, quantity: number = 1) => {
    setEnquiryItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.product_name,
          variantId: variant.id,
          variantSize: variant.size,
          variantPrice: variant.price || '',
          itemCode: variant.itemCode,
          unit: variant.unit || '',
          quantity,
        },
      ];
    });
    setIsDrawerOpen(true); // Auto-open drawer when item is added
  };

  const removeFromEnquiry = (variantId: number) => {
    setEnquiryItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: number, qty: number) => {
    if (qty <= 0) {
      removeFromEnquiry(variantId);
      return;
    }
    setEnquiryItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearEnquiry = () => {
    setEnquiryItems([]);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const sendWhatsAppEnquiry = () => {
    if (enquiryItems.length === 0) return;

    const phoneNumber = '916361033361';
    let text = `Hello Lakshmi Agency,\n\nI would like to request a wholesale price quote for the following construction materials:\n\n`;

    enquiryItems.forEach((item, index) => {
      const name = item.productName;
      const variantDesc = item.itemCode 
        ? `Item Code: ${item.itemCode}` 
        : `${item.variantSize} ${item.unit}`.trim();
      
      text += `${index + 1}. *${name}* (${variantDesc})\n   *Quantity*: ${item.quantity}\n`;
    });

    text += `\nPlease let me know the current availability and wholesale rates. Thank you!`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiryItems,
        isDrawerOpen,
        addToEnquiry,
        removeFromEnquiry,
        updateQuantity,
        clearEnquiry,
        openDrawer,
        closeDrawer,
        sendWhatsAppEnquiry,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};
