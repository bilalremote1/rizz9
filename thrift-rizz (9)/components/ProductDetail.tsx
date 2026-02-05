import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20">
      <button 
        onClick={onBack}
        className="flex items-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-brand-yellow mb-6 md:mb-10 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
        {/* Images Section */}
        <div className="space-y-4 md:space-y-6">
          <div className="aspect-[3/4] w-full overflow-hidden bg-brand-gray relative">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute top-4 right-4 bg-brand-yellow text-black font-bold px-3 py-1 uppercase text-xs">
              In Stock
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square overflow-hidden bg-brand-gray ${
                  selectedImage === img ? 'ring-2 ring-brand-yellow' : 'opacity-50 hover:opacity-100'
                } transition-opacity`}
              >
                <img src={img} alt="" className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col pt-0 md:pt-4">
          <div className="flex items-center gap-4 mb-3 md:mb-4">
             <span className="text-brand-yellow text-xs md:text-sm font-bold uppercase tracking-widest">{product.category}</span>
             <div className="h-px w-8 md:w-10 bg-brand-gray"></div>
          </div>
          
          <h1 className="text-2xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6 uppercase leading-none">{product.name}</h1>
          <p className="text-2xl md:text-3xl font-medium text-brand-yellow mb-6 md:mb-10">Rs. {product.price.toLocaleString()}</p>
          
          <div className="prose prose-invert mb-8 md:mb-10">
            <p className="text-gray-300 leading-relaxed text-sm md:text-lg font-light">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-brand-gray py-6 md:py-8 mb-8 md:mb-10">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">Size</span>
              <span className="text-white font-bold text-base md:text-lg">{product.size}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">Condition</span>
              <span className="text-white font-bold text-base md:text-lg">9/10</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-brand-yellow text-black py-4 px-6 flex items-center justify-center space-x-3 hover:bg-white transition-all duration-300 transform active:scale-98 font-bold uppercase tracking-widest text-sm md:text-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-gray-500 mt-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Vintage • TCS Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
};