import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { addProduct, getOrders, updateOrderStatus, loginAdmin, logoutAdmin, subscribeToAuth, User } from '../services/db';
import { Plus, Package, Truck, CheckCircle, Lock, LogOut, Loader2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'upload' | 'orders'>('upload');
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    size: '',
    images: '' 
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      loadOrders();
    }
  }, [user, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await loginAdmin(authEmail, authPass);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleStatusUpdate = async (id: string, status: Order['status']) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Omit<Product, 'id' | 'createdAt'> = {
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description,
      category: newProduct.category,
      size: newProduct.size,
      images: newProduct.images.split(',').map(s => s.trim()).filter(s => s !== ''),
    };

    const result = await addProduct(productData);
    if (result) {
        alert('Product added successfully!');
        setNewProduct({ name: '', price: '', description: '', category: '', size: '', images: '' });
    } else {
        alert('Failed to add product. Check console.');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-yellow" /></div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-brand-dark p-8 border border-brand-gray shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-yellow/10 p-3 rounded-full">
              <Lock className="w-8 h-8 text-brand-yellow" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-white text-center mb-6">Admin Access</h2>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email"
              className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none"
              value={authEmail}
              onChange={e => setAuthEmail(e.target.value)}
            />
             <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none"
              value={authPass}
              onChange={e => setAuthPass(e.target.value)}
            />
            <button type="submit" className="w-full bg-brand-yellow text-black font-bold py-3 uppercase tracking-widest hover:bg-white transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wide">Admin Dashboard</h1>
        <button onClick={() => logoutAdmin()} className="text-sm text-red-400 hover:text-white flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
      
      <div className="flex space-x-4 mb-8 border-b border-brand-gray">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-4 px-4 font-bold uppercase text-sm tracking-widest ${activeTab === 'upload' ? 'border-b-2 border-brand-yellow text-brand-yellow' : 'text-gray-500'}`}
        >
          Upload Product
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-4 font-bold uppercase text-sm tracking-widest ${activeTab === 'orders' ? 'border-b-2 border-brand-yellow text-brand-yellow' : 'text-gray-500'}`}
        >
          Manage Orders
        </button>
      </div>

      {activeTab === 'upload' ? (
        <form onSubmit={handleUpload} className="max-w-2xl space-y-6 bg-brand-dark p-8 border border-brand-gray">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Product Name</label>
            <input 
              required
              className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none transition-colors"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Price (Rs)</label>
              <input 
                required
                type="number"
                className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none transition-colors"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Size</label>
              <input 
                required
                className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none transition-colors"
                value={newProduct.size}
                onChange={e => setNewProduct({...newProduct, size: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Category</label>
            <select 
              className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none transition-colors"
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="Jackets">Jackets</option>
              <option value="Shirts">Shirts</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Images (Comma separated URLs)</label>
            <input 
              required
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none transition-colors"
              value={newProduct.images}
              onChange={e => setNewProduct({...newProduct, images: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-black border border-brand-gray text-white p-3 focus:border-brand-yellow outline-none transition-colors"
              value={newProduct.description}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-brand-yellow text-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" /> Upload Product
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : orders.map(order => (
            <div key={order.id} className="bg-brand-dark border border-brand-gray p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-brand-yellow">Order #{order.id}</h3>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 text-xs font-bold uppercase ${
                    order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-200' :
                    order.status === 'shipped' ? 'bg-blue-900/50 text-blue-200' :
                    order.status === 'delivered' ? 'bg-green-900/50 text-green-200' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-bold mt-2 text-white">COD: Rs. {order.totalAmount}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-300">
                <div>
                  <p className="font-bold text-gray-500 uppercase text-xs mb-1">Customer</p>
                  <p>{order.customerName}</p>
                  <p>{order.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-500 uppercase text-xs mb-1">Address</p>
                  <p>{order.address}, {order.city} {order.zip}</p>
                </div>
              </div>
              <div className="border-t border-brand-gray pt-4 mb-4">
                <p className="font-bold text-gray-500 uppercase text-xs mb-2">Items</p>
                <ul className="text-sm space-y-1 text-gray-300">
                  {order.items.map(item => (
                    <li key={item.cartId} className="flex justify-between">
                      <span>{item.name} ({item.size})</span>
                      <span>Rs. {item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-dashed border-gray-700 text-brand-yellow">
                  <span>Shipping</span>
                  <span>Rs. {order.shippingFee}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'shipped')}
                  className="flex-1 border border-blue-900 text-blue-400 py-2 text-sm hover:bg-blue-900/20 flex justify-center items-center uppercase font-bold tracking-wider"
                >
                  <Truck className="w-4 h-4 mr-1" /> Mark Shipped
                </button>
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                  className="flex-1 border border-green-900 text-green-400 py-2 text-sm hover:bg-green-900/20 flex justify-center items-center uppercase font-bold tracking-wider"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Mark Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};