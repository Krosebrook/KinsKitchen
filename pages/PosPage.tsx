import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Product, ProductVariation } from '../types';
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
  X
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
          <h3 className="font-bold text-lg text-gray-800">Select Option</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
           <h4 className="text-gray-500 text-sm mb-4 font-medium uppercase tracking-wide">Available Variations for {product.name}</h4>
           <div className="grid gap-3">
              {product.variations?.map(variation => (
                  <button
                    key={variation.id}
                    onClick={() => onSelect(variation)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                  >
                      <div>
                          <span className="font-bold text-gray-800 block group-hover:text-blue-700">{variation.name}</span>
                          <span className="text-xs text-gray-500">{variation.stock} in stock</span>
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

const PosPage: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, updateQuantity, clearCart, searchQuery, setSearchQuery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Products');
  const [activeProductForVariation, setActiveProductForVariation] = useState<Product | null>(null);

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
    if (product.variations && product.variations.length > 0) {
        setActiveProductForVariation(product);
    } else {
        addToCart(product);
    }
  };

  const handleVariationSelect = (variation: ProductVariation) => {
    if (activeProductForVariation) {
        addToCart(activeProductForVariation, variation);
        setActiveProductForVariation(null);
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
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Categories Sidebar */}
      <aside className="w-32 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-4 shadow-sm z-10 hidden md:flex">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          
          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            <Link 
              to="/admin" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <Settings size={18} />
              <span className="font-medium">Admin</span>
            </Link>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Search size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full"
                >
                  <div className="relative pt-[75%] bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.variations && product.variations.length > 0 && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {product.variations.length} Options
                        </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-1 leading-tight">{product.name}</h3>
                    <p className="text-blue-600 font-bold mt-auto">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      <aside className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-20 shrink-0">
        {/* Cart Header */}
        <div className="h-20 border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-gray-800" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Cart</h2>
          </div>
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {cartItemCount} items
          </span>
        </div>

        {/* Action Buttons */}
        <div className="p-4 grid gap-3 border-b border-gray-200 bg-gray-50/50">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
            <User size={18} />
            Select Customer
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
            <Tag size={18} />
            Apply Discount
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={64} strokeWidth={1} />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
                <p className="text-sm">Add items to get started</p>
              </div>
            </div>
          ) : (
            cart.map((item) => {
                const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.price;
                return (
                  <div key={item.cartItemId} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                            {item.selectedVariation && (
                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">{item.selectedVariation.name}</span>
                            )}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">${(itemPrice * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-md px-1">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-1 hover:text-red-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-1 hover:text-blue-600 transition-colors"
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
        <div className="bg-white border-t border-gray-200 p-6 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${(cartTotal * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
              <span>Total</span>
              <span>${(cartTotal * 1.1).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (cart.length > 0) {
                alert('Order processed successfully!');
                clearCart();
              }
            }}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
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
    </div>
  );
};

export default PosPage;