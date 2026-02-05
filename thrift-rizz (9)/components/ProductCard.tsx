import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onQuickAdd }) => {
  const stockNumber = (product.id.charCodeAt(product.id.length - 1) % 50) + 10;

  return (
    <div className="group flex flex-col bg-[#1a1a1a] hover:bg-[#222] transition-colors duration-300 h-full relative overflow-hidden">
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#101010] cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3 bg-black/90 text-white text-[10px] font-bold px-2 py-1 min-w-[30px] text-center z-10">
          {stockNumber}
        </div>

        {/* HOVER OVERLAY & VIEW DETAILS */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
           <div 
             className="bg-brand-yellow text-black font-display font-bold uppercase text-sm px-6 py-3 tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white cursor-pointer shadow-lg"
           >
             View Details
           </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div onClick={() => onClick(product)} className="cursor-pointer mb-4">
          <h3 className="text-xl font-display font-bold text-white uppercase leading-tight mb-2 line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 uppercase tracking-widest">{product.category}</span>
            <div className="px-2 py-0.5 border border-white/20 text-[10px] text-gray-400 uppercase">
              9/10 Condition
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Price</p>
            <p className="text-xl font-bold text-white">Rs. {product.price.toLocaleString()}</p>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="w-full bg-white hover:bg-brand-yellow text-black py-3 px-4 text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors duration-300"
          >
            <Plus className="w-3 h-3" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};