import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Product, ProductVariation, PaymentMethod, Order } from '../types';
import { 
  Search, 
  Settings, 
  ShoppingCart, 
  User, 
  Tag, 
  Trash2, 
  Plus, 
  Minus,
  Grid,
  Utensils,
  Coffee,
  IceCream,
  X,
  Menu,
  CreditCard,
  Banknote,
  CheckCircle,
  Printer,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Variation Selection Modal ---
const VariationSelectionModal = ({
  product,
  onClose,
  onSelect
}: {
  product: Product,
  onClose: () => void,
  onSelect: (variation: ProductVariation) => void
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-bold text-lg text-gray-800">Select Variation</h3>
            <p className="text-xs text-gray-500">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
           <div className="grid gap-3">
              {product.variations?.map(variation => (
                  <button
                    key={variation.id}
                    onClick={() => onSelect(variation)}
                    disabled={variation.stock === 0}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-all group text-left ${
                        variation.stock === 0 
                        ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' 
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm'
                    }`}
                  >
                      <div>
                          <span className="font-bold text-gray-800 block group-hover:text-blue-700">{variation.name}</span>
                          <span className={`text-xs ${variation.stock < 5 && variation.stock > 0 ? 'text-orange-500 font-bold' : variation.stock === 0 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            {variation.stock === 0 ? 'Out of Stock' : `${variation.stock} available`}
                          </span>
                      </div>
                      <span className="font-bold text-blue-600 text-lg">${variation.price.toFixed(2)}</span>
                  </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Checkout Modal ---
const CheckoutModal = ({
  total,
  onClose,
  onConfirm
}: {
  total: number,
  onClose: () => void,
  onConfirm: (name: string, method: PaymentMethod) => void
}) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800)); 
    onConfirm(customerName, paymentMethod);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <h3 className="font-bold text-xl text-gray-800">Checkout</h3>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
             </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
             <div className="text-center mb-6">
                <span className="text-gray-500 text-sm">Total Amount Due</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-1">${total.toFixed(2)}</h2>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name (Optional)</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                         type="text" 
                         value={customerName}
                         onChange={(e) => setCustomerName(e.target.value)}
                         className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                         placeholder="Walk-in Customer"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                           paymentMethod === 'Card' 
                           ? 'border-blue-600 bg-blue-50 text-blue-700' 
                           : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                         <CreditCard size={24} className="mb-2" />
                         <span className="font-semibold text-sm">Card Payment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cash')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                           paymentMethod === 'Cash' 
                           ? 'border-green-600 bg-green-50 text-green-700' 
                           : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                         <Banknote size={24} className="mb-2" />
                         <span className="font-semibold text-sm">Cash</span>
                      </button>
                   </div>
                </div>
             </div>

             <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
             </button>
          </form>
       </div>
    </div>
  );
};

// --- Receipt Modal ---
const ReceiptModal = ({
  order,
  onClose
}: {
  order: Order,
  onClose: () => void
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
          <div className="bg-green-600 p-6 text-white text-center">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <CheckCircle size={32} className="text-white" />
             </div>
             <h3 className="font-bold text-2xl">Payment Successful!</h3>
             <p className="text-green-100 mt-1">Order {order.id}</p>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
             <div className="flex justify-between items-center text-sm text-gray-500 mb-6 pb-6 border-b border-dashed border-gray-200">
                <span>{new Date(order.date).toLocaleString()}</span>
                <span className="font-medium text-gray-800">{order.paymentMethod}</span>
             </div>
             
             <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm">
                      <div className="flex-1">
                         <span className="font-medium text-gray-800">{item.name}</span>
                         {item.selectedVariation && (
                            <span className="text-xs text-gray-500 block">{item.selectedVariation.name}</span>
                         )}
                      </div>
                      <div className="text-right">
                         <span className="text-gray-500">x{item.quantity}</span>
                         <span className="font-medium text-gray-800 ml-3">
                            ${((item.selectedVariation?.price || item.price) * item.quantity).toFixed(2)}
                         </span>
                      </div>
                   </div>
                ))}
             </div>

             <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                   <span>Subtotal</span>
                   <span>${(order.total - order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                   <span>Tax (10%)</span>
                   <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                   <span>Total</span>
                   <span>${order.total.toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3">
             <button onClick={onClose} className="py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                Close
             </button>
             <button onClick={() => window.print()} className="py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Printer size={16} /> Print Receipt
             </button>
          </div>
       </div>
    </div>
  );
};

const PosPage: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, updateQuantity, clearCart, searchQuery, setSearchQuery, placeOrder } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Products');
  const [activeProductForVariation, setActiveProductForVariation] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All Products' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.selectedVariation ? item.selectedVariation.price : item.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProductClick = (product: Product) => {
    // Check stock for base product if no variations
    if (!product.variations || product.variations.length === 0) {
        if (product.stock === 0) {
            alert('Item is out of stock');
            return;
        }
        addToCart(product);
    } else {
        setActiveProductForVariation(product);
    }
  };

  const handleVariationSelect = (variation: ProductVariation) => {
    if (activeProductForVariation) {
        addToCart(activeProductForVariation, variation);
        setActiveProductForVariation(null);
    }
  };

  const handleCheckoutConfirm = async (name: string, method: PaymentMethod) => {
     try {
         const order = await placeOrder(name, method);
         setLastOrder(order);
         setIsCheckoutOpen(false);
     } catch (error) {
         console.error("Checkout failed", error);
         alert("Checkout failed. Please try again.");
     }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Food': return <Utensils size={20} />;
      case 'Drinks': return <Coffee size={20} />;
      case 'Desserts': return <IceCream size={20} />;
      default: return <Grid size={20} />;
    }
  };

  const categories: Category[] = ['All Products', 'Food', 'Drinks', 'Desserts'];

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden flex-col lg:flex-row">
      {/* Categories Sidebar (Desktop) */}
      <aside className="w-32 bg-white border-r border-gray-200 flex-col items-center py-6 gap-4 shadow-sm z-10 hidden lg:flex shrink-0">
        <h2 className="font-bold text-gray-800 mb-4 px-2 text-center">Categories</h2>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200 border ${
              selectedCategory === cat
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {getCategoryIcon(cat)}
            <span className="text-sm font-medium">{cat === 'All Products' ? 'All' : cat}</span>
          </button>
        ))}
      </aside>

      {/* Mobile Categories Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
           <aside className="w-64 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="font-bold text-lg text-gray-800">Categories</h2>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                 </button>
              </div>
              <div className="p-4 grid gap-3 overflow-y-auto">
                 {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all border text-left ${
                        selectedCategory === cat
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {getCategoryIcon(cat)}
                      </div>
                      <span className="font-medium">{cat === 'All Products' ? 'All' : cat}</span>
                    </button>
                  ))}
              </div>
           </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 min-h-0 relative">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
             >
                <Menu size={24} />
             </button>
             <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">POS</h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-end max-w-2xl">
            <Link 
              to="/admin" 
              className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 text-sm lg:text-base whitespace-nowrap"
            >
              <Settings size={18} />
              <span className="hidden sm:inline font-medium">Admin</span>
            </Link>
            
            <div className="relative flex-1 max-w-[200px] lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-100/50">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Search size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4">
              {filteredProducts.map((product) => {
                const hasVariations = product.variations && product.variations.length > 0;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-all group flex flex-col h-full ${
                      (!hasVariations && product.stock === 0) 
                          ? 'border-gray-200 opacity-60 grayscale' 
                          : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="relative pt-[75%] bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {hasVariations ? (
                          <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <Layers size={10} />
                              <span>Options</span>
                          </div>
                      ) : product.stock === 0 ? (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">OUT OF STOCK</span>
                          </div>
                      ) : (
                           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                              {product.stock} left
                           </div>
                      )}
                    </div>
                    <div className="p-3 lg:p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-800 leading-tight text-sm lg:text-base line-clamp-2">{product.name}</h3>
                      </div>
                      
                      <div className="mt-auto flex items-end justify-between">
                          <p className="text-blue-600 font-bold text-sm lg:text-base">
                              {hasVariations ? (
                                  <span className="text-xs text-gray-500 font-normal">From <span className="text-blue-600 font-bold text-sm lg:text-base">${Math.min(...product.variations!.map(v => v.price)).toFixed(2)}</span></span>
                              ) : (
                                  `$${product.price.toFixed(2)}`
                              )}
                          </p>
                          {hasVariations && (
                              <div className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                                  {product.variations?.length} Vars
                              </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <aside className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-lg z-20 shrink-0 h-[40vh] lg:h-full">
        {/* Cart Header */}
        <div className="h-14 lg:h-20 border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-gray-800" size={20} />
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Cart</h2>
          </div>
          <span className="text-xs lg:text-sm font-medium bg-blue-100 text-blue-700 px-2 lg:px-3 py-1 rounded-full">
            {cartItemCount} items
          </span>
        </div>

        {/* Action Buttons */}
        <div className="p-3 lg:p-4 grid grid-cols-2 gap-2 lg:gap-3 border-b border-gray-200 bg-gray-50/50">
          <button className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-xs lg:text-sm">
            <User size={16} />
            <span className="hidden sm:inline">Customer</span>
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-xs lg:text-sm">
            <Tag size={16} />
            <span className="hidden sm:inline">Discount</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={48} strokeWidth={1} className="opacity-50" />
              <div className="text-center px-4">
                <p className="text-base lg:text-lg font-medium text-gray-500">Your cart is empty</p>
                <p className="text-xs lg:text-sm">Add items to get started</p>
              </div>
            </div>
          ) : (
            cart.map((item) => {
                const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.price;
                return (
                  <div key={item.cartItemId} className="flex gap-3 bg-white p-2 lg:p-3 rounded-lg border border-gray-100 shadow-sm animate-fade-in">
                    <img src={item.image} alt={item.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-md object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                            {item.selectedVariation && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="inline-block text-[10px] text-purple-700 font-semibold bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                                        {item.selectedVariation.name}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">${(itemPrice * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-1 h-7">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-0.5 hover:text-red-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-0.5 hover:text-blue-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 lg:p-6 space-y-3 lg:space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="space-y-1.5 lg:space-y-2 text-sm lg:text-base">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${(cartTotal * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg lg:text-xl font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
              <span>Total</span>
              <span>${(cartTotal * 1.1).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className={`w-full py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg shadow-lg transition-all ${
              cart.length > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Checkout
          </button>
        </div>
      </aside>
      
      {activeProductForVariation && (
        <VariationSelectionModal 
            product={activeProductForVariation}
            onClose={() => setActiveProductForVariation(null)}
            onSelect={handleVariationSelect}
        />
      )}

      {isCheckoutOpen && (
          <CheckoutModal 
            total={cartTotal * 1.1} 
            onClose={() => setIsCheckoutOpen(false)}
            onConfirm={handleCheckoutConfirm}
          />
      )}

      {lastOrder && (
          <ReceiptModal 
             order={lastOrder}
             onClose={() => setLastOrder(null)}
          />
      )}
    </div>
  );
};

export default PosPage;