import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onSubmit: (formData: any) => Promise<void>;
  loading: boolean;
}

const SHIPPING_COST = 300;

export const Checkout: React.FC<CheckoutProps> = ({ cart, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'COD' as 'COD' | 'Easypaisa_Jazzcash'
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const isPrepaid = formData.paymentMethod === 'Easypaisa_Jazzcash';
  const shipping = isPrepaid ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-white uppercase tracking-wide text-center md:text-left">Secure Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-brand-yellow uppercase">Shipping Details</h3>
            <input 
              required
              placeholder="Full Name"
              className="w-full p-4 border border-brand-gray rounded-none bg-brand-dark text-white outline-none focus:border-brand-yellow transition-colors placeholder-gray-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              required
              placeholder="Phone Number (03xxxxxxxxx)"
              type="tel"
              pattern="^03[0-9]{9}$"
              title="Please enter a valid Pakistani mobile number (e.g., 03001234567)"
              className="w-full p-4 border border-brand-gray rounded-none bg-brand-dark text-white outline-none focus:border-brand-yellow transition-colors placeholder-gray-500"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <textarea 
              required
              rows={3}
              placeholder="Full Address (Street, House #, Area)"
              className="w-full p-4 border border-brand-gray rounded-none bg-brand-dark text-white outline-none focus:border-brand-yellow transition-colors placeholder-gray-500 resize-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
            <div className="flex gap-4">
              <select 
                required
                className="w-full p-4 border border-brand-gray rounded-none bg-brand-dark text-white outline-none focus:border-brand-yellow transition-colors placeholder-gray-500"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              >
                <option value="" disabled>Select City</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Other">Other</option>
              </select>
              <input 
                placeholder="ZIP (Optional)"
                className="w-full p-4 border border-brand-gray rounded-none bg-brand-dark text-white outline-none focus:border-brand-yellow transition-colors placeholder-gray-500"
                value={formData.zip}
                onChange={e => setFormData({...formData, zip: e.target.value})}
              />
            </div>

            <div className="pt-8 border-t border-brand-gray">
               <h3 className="text-xl font-bold mb-4 text-brand-yellow uppercase">Payment Method</h3>
               
               <label className={`flex items-start p-4 border cursor-pointer mb-3 transition-colors ${formData.paymentMethod === 'COD' ? 'border-brand-yellow bg-brand-yellow/10' : 'border-brand-gray bg-transparent'}`}>
                 <input 
                   type="radio" 
                   name="payment" 
                   className="mt-1" 
                   checked={formData.paymentMethod === 'COD'}
                   onChange={() => setFormData({...formData, paymentMethod: 'COD'})}
                 />
                 <div className="ml-3">
                   <span className="block font-bold text-white uppercase">Cash on Delivery</span>
                   <span className="block text-sm text-gray-400 mt-1">
                      Pay upon delivery. Shipping Fee: Rs. 300.
                   </span>
                 </div>
               </label>

               <label className={`flex items-start p-4 border cursor-pointer transition-colors ${formData.paymentMethod === 'Easypaisa_Jazzcash' ? 'border-brand-yellow bg-brand-yellow/10' : 'border-brand-gray bg-transparent'}`}>
                 <input 
                   type="radio" 
                   name="payment" 
                   className="mt-1" 
                   checked={formData.paymentMethod === 'Easypaisa_Jazzcash'}
                   onChange={() => setFormData({...formData, paymentMethod: 'Easypaisa_Jazzcash'})}
                 />
                 <div className="ml-3">
                   <span className="block font-bold text-white uppercase">Easypaisa / Jazzcash (Manual)</span>
                   <div className="text-sm text-gray-400 mt-2 space-y-2">
                      <p>1. Send <strong>Rs. {total.toLocaleString()}</strong> to <span className="text-brand-yellow font-mono text-base font-bold">03458607832</span>.</p>
                      <p>2. Send screenshot on WhatsApp (<span className="text-brand-yellow font-bold">03458607832</span>).</p>
                      <p className="text-xs text-brand-yellow font-bold uppercase border border-brand-yellow/30 p-2 inline-block bg-brand-yellow/5">
                         Free Delivery Included
                      </p>
                   </div>
                 </div>
               </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-yellow text-black py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center mt-8"
            >
              {loading ? <Loader2 className="animate-spin" /> : `Place Order - Rs. ${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-brand-dark p-8 h-fit border border-brand-gray">
          <h3 className="text-xl font-bold mb-6 text-white uppercase">Order Summary</h3>
          <ul className="space-y-4 mb-8">
            {cart.map(item => (
              <li key={item.cartId} className="flex justify-between text-sm items-center">
                <div className="flex items-center gap-4">
                  <img src={item.images[0]} alt="" className="w-12 h-12 object-cover bg-brand-gray" />
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty 1</p>
                  </div>
                </div>
                <span className="text-white">Rs. {item.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-brand-gray pt-6 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-brand-yellow pt-4 border-t border-brand-gray mt-4">
              <span>TOTAL</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};