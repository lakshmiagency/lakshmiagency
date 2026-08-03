'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ClipboardList } from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

export const EnquiryDrawer: React.FC = () => {
  const {
    enquiryItems,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromEnquiry,
    clearEnquiry,
    sendWhatsAppEnquiry
  } = useEnquiry();

  if (!isDrawerOpen) return null;

  const totalItems = enquiryItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[100] no-print">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in transition-all duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Enquiry List
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
              {enquiryItems.length}
            </span>
          </div>
          <button 
            onClick={closeDrawer}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {enquiryItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-slate-350" />
              </div>
              <p className="text-slate-800 font-extrabold text-sm uppercase">Your list is empty</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Browse our catalogue and click "Add to List" to request a wholesale rate quote for materials.
              </p>
              <button
                onClick={closeDrawer}
                className="mt-6 py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Start Adding Items
              </button>
            </div>
          ) : (
            enquiryItems.map((item) => (
              <div 
                key={item.variantId} 
                className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3 items-start hover:border-slate-300 transition-colors"
              >
                <div className="flex-grow">
                  <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">
                    {item.itemCode ? `Item Code: ${item.itemCode}` : `${item.variantSize} ${item.unit}`.trim()}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight line-clamp-1 mt-0.5">
                    {item.productName}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                    {typeof item.variantPrice === 'number' || !isNaN(Number(item.variantPrice))
                      ? `Est: ₹${Number(item.variantPrice).toLocaleString('en-IN')}`
                      : item.variantPrice}
                  </p>
                  
                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromEnquiry(item.variantId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors self-start"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {enquiryItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Total Unique Items: {enquiryItems.length}</span>
              <button 
                onClick={clearEnquiry}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <button
              onClick={sendWhatsAppEnquiry}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4.5 h-4.5 fill-current" />
              Send Enquiry on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryDrawer;
