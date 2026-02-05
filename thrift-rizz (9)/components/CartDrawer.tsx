import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Changed width from w-screen to w-[85vw] on mobile to show overlay, giving a better 'drawer' feel */}
        <div className="w-[85vw] md:w-screen md:max-w-md bg-brand-dark shadow-2xl flex flex-col h-full border-l border-brand-yellow/20 transform transition-transform duration-300">
          <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-brand-gray bg-black">
            <h2 className="text-lg md:text-xl font-display font-bold text-white uppercase tracking-wide">Your Cart ({items.length})</h2>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-brand-yellow transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-brand-dark scrollbar-hide">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p>Your cart is empty.</p>
                <button onClick={onClose} className="mt-4 text-brand-yellow font-bold uppercase hover:underline">Start Shopping</button>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.cartId} className="flex py-2 border-b border-brand-gray pb-4 last:border-0">
                    <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden bg-brand-gray border border-white/10">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover object-center grayscale hover:grayscale-0 transition-all"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm md:text-base font-bold text-white">
                          <h3 className="line-clamp-2 leading-tight uppercase font-display pr-2">{item.name}</h3>
                          <p className="text-brand-yellow whitespace-nowrap">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">{item.size} | {item.category}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 text-xs">Qty 1</p>
                        <button
                          type="button"
                          onClick={() => onRemove(item.cartId)}
                          className="font-medium text-red-500 hover:text-red-400 flex items-center text-[10px] md:text-xs uppercase tracking-wide"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-brand-gray bg-black px-4 md:px-6 py-6 md:py-8">
              <div className="flex justify-between text-base font-medium text-white mb-4">
                <p className="uppercase text-sm tracking-widest text-gray-400">Subtotal</p>
                <p className="text-xl font-bold text-brand-yellow">Rs. {subtotal.toLocaleString()}</p>
              </div>
              <p className="mt-0.5 text-[10px] md:text-xs text-gray-500 mb-6">
                 Standard Shipping: Rs. 300 (Free with Online Payment)
              </p>
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center bg-brand-yellow px-6 py-4 text-sm md:text-base font-bold text-black uppercase tracking-widest hover:bg-white transition-colors"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};