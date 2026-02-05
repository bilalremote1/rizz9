import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  cartCount: number;
  onNavigate: (view: ViewState) => void;
  onScroll: (sectionId: string) => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate, onScroll, onOpenCart }) => {
  return (
    <nav className="sticky top-0 z-50 bg-brand-black border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section (Left) */}
          <div 
            className="cursor-pointer flex items-center gap-3 group" 
            onClick={() => onNavigate('home')}
          >
            <div className="bg-brand-yellow text-black w-10 h-10 flex items-center justify-center font-display font-bold text-2xl rounded-full transition-transform group-hover:scale-110">
              R
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">
              Thrift Rizz
            </h1>
          </div>
          
          {/* Right Side: Links + Icons Grouped */}
          <div className="flex items-center gap-8 md:gap-12">
             {/* Desktop Links */}
             <div className="hidden md:flex items-center space-x-8">
               <button onClick={() => onNavigate('home')} className="text-sm font-bold uppercase tracking-[0.2em] text-white hover:text-brand-yellow transition-colors">Home</button>
               <button onClick={() => onScroll('reviews')} className="text-sm font-bold uppercase tracking-[0.2em] text-white hover:text-brand-yellow transition-colors">Reviews</button>
             </div>

             {/* Cart Icon */}
             <div className="flex items-center">
                <button 
                  className="relative text-white hover:text-brand-yellow transition-colors"
                  onClick={onOpenCart}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-black bg-brand-yellow rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button className="md:hidden text-white ml-6">
                  <Menu className="w-6 h-6" />
                </button>
             </div>
          </div>

        </div>
      </div>
    </nav>
  );
};