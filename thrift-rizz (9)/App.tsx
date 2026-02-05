import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { Checkout } from './components/Checkout';
import { Product, CartItem, ViewState, Order } from './types';
import { getProducts, createOrder } from './services/db';
import { Check, Loader2, Instagram, Star, Quote, ChevronLeft, ChevronRight, Facebook, Twitter, Mail, Info, MessageCircle } from 'lucide-react';

const SHIPPING_COST = 300;

function App() {
  // State
  const [view, setView] = useState<ViewState | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Success & Notification State
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  // Review Slider State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviews = [
    {name: "Ahsan K.", text: "The quality is insane. The jacket I bought was exactly as described. Best thrift store in Pakistan.", date: "2 days ago"},
    {name: "Sara M.", text: "Shipping was super fast. Loved the packaging and the little sticker inside. Will shop again!", date: "1 week ago"},
    {name: "Hamza R.", text: "Finally a thrift store with legit pieces. No fake stuff. Highly recommended.", date: "2 weeks ago"},
    {name: "Zainab A.", text: "The fit on the Levis 501s was perfect. Customer service helped me with sizing on IG.", date: "3 weeks ago"},
    {name: "Bilal H.", text: "Prices are a bit high but quality justifies it. The vintage tees are genuine single stitch.", date: "1 month ago"}
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 3500); 

    return () => clearInterval(interval);
  }, [reviews.length]);

  // Load Products
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  // Handlers
  const addToCart = (product: Product) => {
    const newItem: CartItem = { ...product, cartId: Math.random().toString(36) };
    setCart([...cart, newItem]);
    
    // Show notification instead of opening cart
    setNotification(`Added ${product.name} to cart`);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.cartId !== id));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo(0, 0);
  };

  const handleScrollTo = (id: string) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReviewSlide = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    } else {
      setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const handleCheckoutSubmit = async (formData: any) => {
    setLoading(true);
    
    const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    const isPrepaid = formData.paymentMethod === 'Easypaisa_Jazzcash';
    const finalShippingFee = isPrepaid ? 0 : SHIPPING_COST;

    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      items: cart,
      shippingFee: finalShippingFee,
      totalAmount: subtotal + finalShippingFee,
      paymentMethod: formData.paymentMethod
    };

    const result = await createOrder(orderData);
    
    if (result) {
        setCart([]);
        setLastOrder(result);
        setShowSuccessPopup(true);
        setView('home'); 
    } else {
        alert("There was an error placing your order. Please try again.");
    }
    setLoading(false);
  };

  const SuccessPopup = () => {
    // Construct WhatsApp Message
    const whatsappMessage = lastOrder 
      ? `Hi Thrift Rizz, I just placed order #${lastOrder.id}. Name: ${lastOrder.customerName}, Amount: Rs. ${lastOrder.totalAmount}.`
      : "Hi Thrift Rizz, I just placed an order.";
    
    const whatsappLink = `https://wa.me/923458607832?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowSuccessPopup(false)} />
        <div className="relative bg-[#1a1a1a] border border-brand-yellow p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(255,215,0,0.2)]">
          <div className="bg-brand-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase">Order Placed!</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Your order has been successfully placed. <br/>ID: <span className="text-brand-yellow font-mono">{lastOrder?.id}</span>
          </p>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-3 font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 mb-3"
          >
            <MessageCircle className="w-5 h-5" /> Confirm on WhatsApp
          </a>

          <button 
            onClick={() => setShowSuccessPopup(false)}
            className="w-full bg-white text-black py-3 font-bold uppercase tracking-wider hover:bg-brand-yellow transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-yellow selection:text-black relative">
      {/* Top Notification Bar */}
      <div className="bg-brand-yellow text-black text-[10px] md:text-xs font-bold text-center py-2 tracking-widest uppercase">
        Free Delivery above orders of Rs. 5,000
      </div>

      <Navbar 
        cartCount={cart.length} 
        onNavigate={setView as any} 
        onScroll={handleScrollTo}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Added to Cart Notification Toast */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 transform ${notification ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a1a1a] border border-brand-yellow px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[300px]">
           <div className="bg-brand-yellow/20 p-2 rounded-full">
             <Check className="w-4 h-4 text-brand-yellow" />
           </div>
           <p className="text-white text-sm font-bold uppercase tracking-wide">{notification}</p>
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setView('checkout');
        }}
      />

      {showSuccessPopup && <SuccessPopup />}

      <main className="pb-0">
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-brand-dark flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/60"></div>
               
               <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
                 <p className="text-brand-yellow font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 text-xs md:text-sm flex items-center gap-3">
                   <span className="w-8 h-[2px] bg-brand-yellow"></span>
                   Est. 2024 • Curated Streetwear
                   <span className="w-8 h-[2px] bg-brand-yellow"></span>
                 </p>
                 <h2 className="text-5xl md:text-9xl font-display font-bold text-white mb-6 uppercase tracking-tight leading-[0.9]">
                   Premium<br/>Thrift
                 </h2>
                 <p className="text-gray-300 max-w-2xl text-sm md:text-lg mb-8 md:mb-12 font-light leading-relaxed">
                   The premier destination for hand-picked shoes, jackets, and sweaters. Timeless classics and unmatched style. Owned and curated by the Rizz team.
                 </p>
                 <div className="flex flex-col w-full md:w-auto md:flex-row gap-4 md:gap-6 px-8 md:px-0">
                   <button 
                     onClick={() => handleScrollTo('shop')}
                     className="bg-brand-yellow text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 w-full md:min-w-[200px]"
                   >
                     Shop Drop
                   </button>
                   <button 
                     onClick={() => handleScrollTo('reviews')}
                     className="border border-white text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 w-full md:min-w-[200px]"
                   >
                     The Hype
                   </button>
                 </div>
               </div>
            </div>

            {/* Product Grid */}
            <div id="shop" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-brand-black">
              <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
                <h3 className="text-4xl md:text-7xl font-display font-bold text-white uppercase tracking-tight mb-4">New Drops</h3>
                <div className="h-1.5 w-16 md:w-24 bg-brand-yellow"></div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-brand-yellow" /></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={handleProductClick}
                      onQuickAdd={addToCart} 
                    />
                  ))}
                  {products.length === 0 && !loading && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        <p>No products available right now. Check back soon!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sliding Reviews */}
            <div id="reviews" className="bg-[#0f0f0f] py-16 md:py-24 px-4 border-t border-white/5">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-4xl md:text-7xl font-display font-bold text-white uppercase tracking-tight mb-4">The Hype</h3>
                  <div className="h-1.5 w-16 md:w-24 bg-brand-yellow mx-auto"></div>
                  <p className="text-gray-400 mt-6 max-w-xl mx-auto text-sm md:text-base">
                    Don't just take our word for it. Here's what the community is saying about their pickups.
                  </p>
                </div>

                <div className="relative bg-gradient-to-br from-brand-dark to-black border border-brand-yellow/30 p-8 md:p-12 shadow-[0_0_30px_rgba(255,215,0,0.05)] rounded-sm">
                   <div className="flex flex-col items-center text-center transition-all duration-300">
                     <div className="flex text-brand-yellow mb-6 gap-1">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-6 h-6 fill-current drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                       ))}
                     </div>
                     <Quote className="w-12 h-12 text-brand-yellow/20 mb-6" />
                     <p className="text-xl md:text-3xl text-white font-medium italic mb-8 leading-relaxed font-display tracking-wide">
                       "{reviews[currentReviewIndex].text}"
                     </p>
                     <div className="mt-auto flex flex-col items-center">
                       <h4 className="bg-brand-yellow text-black px-4 py-1 font-bold uppercase tracking-widest text-sm md:text-base mb-2 transform -skew-x-12">
                         {reviews[currentReviewIndex].name}
                       </h4>
                       <span className="text-xs text-brand-yellow/60 uppercase tracking-wide">
                         {reviews[currentReviewIndex].date}
                       </span>
                     </div>
                   </div>

                   {/* Slider Controls */}
                   <button 
                     onClick={() => handleReviewSlide('prev')}
                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border border-brand-yellow/20 p-3 rounded-full text-white hover:text-brand-yellow hover:border-brand-yellow transition-all hidden md:flex hover:scale-110 active:scale-95"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={() => handleReviewSlide('next')}
                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border border-brand-yellow/20 p-3 rounded-full text-white hover:text-brand-yellow hover:border-brand-yellow transition-all hidden md:flex hover:scale-110 active:scale-95"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </button>

                   {/* Mobile Controls */}
                   <div className="flex justify-center gap-6 mt-10 md:hidden">
                      <button onClick={() => handleReviewSlide('prev')} className="bg-black/50 border border-brand-yellow/20 p-3 rounded-full text-white active:scale-95"><ChevronLeft className="w-5 h-5"/></button>
                      <button onClick={() => handleReviewSlide('next')} className="bg-black/50 border border-brand-yellow/20 p-3 rounded-full text-white active:scale-95"><ChevronRight className="w-5 h-5"/></button>
                   </div>
                   
                   {/* Progress indicators */}
                   <div className="flex justify-center gap-2 mt-8 absolute bottom-4 left-0 right-0">
                      {reviews.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1 rounded-full transition-all duration-300 ${idx === currentReviewIndex ? 'w-8 bg-brand-yellow' : 'w-2 bg-brand-gray'}`}
                        />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'product' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setView('home')}
            onAddToCart={addToCart}
          />
        )}

        {view === 'checkout' && (
          <Checkout 
            cart={cart}
            onSubmit={handleCheckoutSubmit}
            loading={loading}
          />
        )}

        {view === 'admin' && <AdminPanel />}
        
      </main>

      {/* Restored Detailed Footer with Policies */}
      <footer id="footer" className="bg-black border-t border-brand-gray text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1 text-center md:text-left">
              <h4 className="text-3xl font-display font-bold mb-6 uppercase text-brand-yellow tracking-wider">Thrift Rizz</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Pakistan's premium destination for vintage and streetwear. Curating culture one piece at a time.
              </p>
              <div className="flex justify-center md:justify-start gap-4 text-gray-400">
                <Instagram className="w-5 h-5 hover:text-brand-yellow cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 hover:text-brand-yellow cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-brand-yellow cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div className="text-center md:text-left">
               <h5 className="font-bold uppercase tracking-widest mb-6 text-sm">Shop</h5>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li className="hover:text-white cursor-pointer transition-colors">New Arrivals</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Jackets</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Tees</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Accessories</li>
               </ul>
            </div>

            <div className="text-center md:text-left">
               <h5 className="font-bold uppercase tracking-widest mb-6 text-sm">Support</h5>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li className="hover:text-white cursor-pointer transition-colors">Track Order</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Shipping Info</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Returns & Exchange</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
               </ul>
            </div>

            <div className="text-center md:text-left">
               <h5 className="font-bold uppercase tracking-widest mb-6 text-sm">Policies</h5>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Refund Policy</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Shipping Policy</li>
               </ul>
            </div>
          </div>

          <div className="border-t border-brand-gray pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p className="mb-4 md:mb-0">&copy; 2024 Thrift Rizz. All rights reserved.</p>
            <div className="flex gap-6">
               <span className="hover:text-gray-400 cursor-pointer">Powered by React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;