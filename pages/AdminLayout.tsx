import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  Building2, 
  BarChart2, 
  Settings, 
  LogOut,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  DollarSign,
  AlertTriangle,
  X,
  Loader2,
  Trash2,
  Pencil,
  Upload,
  Image as ImageIcon,
  List,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MOCK_STATS, RECENT_ORDERS, CHART_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Product, ProductVariation } from '../types';
import { GoogleGenAI } from "@google/genai";

// --- Dashboard Component ---
const DashboardView = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
        <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">7 Days</button>
        <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">30 Days</button>
        <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">90 Days</button>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">${MOCK_STATS.totalSales.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <DollarSign className="text-green-600" size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-red-500 font-medium">~{MOCK_STATS.salesChange}%</span>
          <span className="text-gray-400 ml-2">from last period</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.totalOrders}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingCart className="text-blue-600" size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-red-500 font-medium">~{MOCK_STATS.ordersChange}%</span>
          <span className="text-gray-400 ml-2">from last period</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{MOCK_STATS.totalCustomers}</h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users className="text-purple-600" size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-900 font-medium">{MOCK_STATS.totalCustomers}</span>
          <span className="text-gray-400 ml-2">Active customer base</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">{MOCK_STATS.lowStockAlerts}</h3>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-red-600 font-medium">{MOCK_STATS.lowStockAlerts}</span>
          <span className="text-gray-400 ml-2">Items need restocking</span>
        </div>
      </div>
    </div>

    {/* Charts & Tables Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Sales Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
             View All
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-3 text-sm font-semibold text-gray-500">Order ID</th>
                <th className="text-left pb-3 text-sm font-semibold text-gray-500">Customer</th>
                <th className="text-left pb-3 text-sm font-semibold text-gray-500">Status</th>
                <th className="text-right pb-3 text-sm font-semibold text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-sm font-medium text-blue-600">{order.id}</td>
                  <td className="py-4 text-sm text-gray-800">{order.customer}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-bold text-gray-900 text-right">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    {/* Quick Actions */}
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                    <Package size={24} />
                </div>
                <span className="font-medium text-gray-700">Add Product</span>
            </button>
             <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 group">
                <div className="p-3 bg-green-50 text-green-600 rounded-full group-hover:bg-green-100 transition-colors">
                    <ShoppingCart size={24} />
                </div>
                <span className="font-medium text-gray-700">View Orders</span>
            </button>
             <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 group">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-100 transition-colors">
                    <Users size={24} />
                </div>
                <span className="font-medium text-gray-700">Manage Customers</span>
            </button>
             <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all gap-3 group">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full group-hover:bg-orange-100 transition-colors">
                    <BarChart2 size={24} />
                </div>
                <span className="font-medium text-gray-700">View Analytics</span>
            </button>
        </div>
    </div>
  </div>
);

// --- Product Modal Component ---
const ProductFormModal = ({ 
  product, 
  onClose, 
  onSave 
}: { 
  product: Product | null, 
  onClose: () => void, 
  onSave: (p: Product) => void 
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      category: 'Food',
      price: 0,
      stock: 0,
      margin: 0,
      image: '',
      variations: []
    }
  );
  
  // Variations State
  const [variations, setVariations] = useState<ProductVariation[]>(product?.variations || []);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarStock, setNewVarStock] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariation = () => {
    if (!newVarName || !newVarPrice || !newVarStock) return;
    
    const newVariation: ProductVariation = {
        id: Date.now().toString(),
        name: newVarName,
        price: parseFloat(newVarPrice),
        stock: parseInt(newVarStock)
    };
    
    setVariations([...variations, newVariation]);
    setNewVarName('');
    setNewVarPrice('');
    setNewVarStock('');
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const fetchAiImage = async (name: string, category: string): Promise<string | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let styleDescription = "Professional studio photography, clean composition, neutral background.";
      if (category === 'Food') {
          styleDescription += " Appetizing, fresh ingredients, warm lighting, delicious presentation.";
      } else if (category === 'Drinks') {
           styleDescription += " Refreshing, condensation on glass (if cold), steam (if hot), vibrant liquid colors, crystal clear glass.";
      } else if (category === 'Desserts') {
           styleDescription += " Indulgent, elegant plating, sweet texture details, dusting of powder or glaze.";
      }

      const prompt = `Create a high-quality product image for "${name}". 
      Category: ${category}.
      Description: ${styleDescription}
      Requirements: Photorealistic, 4k resolution, centered subject, white or light gray background for e-commerce consistency, 4:3 aspect ratio.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3"
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Failed to generate image:", error);
      return null;
    }
  };

  const handleGenerateClick = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const url = await fetchAiImage(formData.name, formData.category || 'Food');
    if (url) {
        setFormData(prev => ({ ...prev, image: url }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    let imageUrl = formData.image;

    // If image is empty, generate one
    if (!imageUrl || imageUrl.trim() === '') {
        const generated = await fetchAiImage(formData.name || '', formData.category || 'Food');
        if (generated) {
            imageUrl = generated;
        } else {
            imageUrl = 'https://picsum.photos/400/300';
        }
    }

    if (!imageUrl) {
         imageUrl = 'https://picsum.photos/400/300';
    }

    onSave({
      id: product?.id || Date.now().toString(),
      name: formData.name || '',
      category: formData.category || 'Food',
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      margin: Number(formData.margin) || 0,
      image: imageUrl,
      variations: variations
    } as Product);
    
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h3 className="font-bold text-lg text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} disabled={isGenerating} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Main Info */}
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Cheese Burger"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="Food">Food</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Margin (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={formData.margin}
                      onChange={e => setFormData({...formData, margin: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* Variations Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <List size={18} className="text-gray-500" />
                <h4 className="font-semibold text-gray-800">Product Variations</h4>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-3">
                        <input 
                            type="text" 
                            placeholder="Variation Name (e.g. Large)" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newVarName}
                            onChange={e => setNewVarName(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2">
                         <input 
                            type="number" 
                            placeholder="Price" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newVarPrice}
                            onChange={e => setNewVarPrice(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                         <input 
                            type="number" 
                            placeholder="Stock" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newVarStock}
                            onChange={e => setNewVarStock(e.target.value)}
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={addVariation}
                        className="col-span-1 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {variations.length > 0 ? (
                    <div className="space-y-2 mt-2">
                        {variations.map((v) => (
                            <div key={v.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                <span className="text-sm font-medium text-gray-700 w-1/3 truncate">{v.name}</span>
                                <span className="text-sm text-gray-500 w-1/4">${v.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500 w-1/4">Qty: {v.stock}</span>
                                <button type="button" onClick={() => removeVariation(v.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 text-center py-2">No variations added yet.</p>
                )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            
            <div className="space-y-3">
              {/* Preview */}
              {formData.image ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button" 
                      onClick={() => setFormData({...formData, image: ''})}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-red-500/80 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2">
                   <ImageIcon size={32} className="opacity-50" />
                   <span className="text-sm">No image selected</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2">
                 <div className="relative flex-1">
                   <input 
                      type="text" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Paste image URL..."
                    />
                 </div>
                 
                 <button 
                    type="button"
                    onClick={handleGenerateClick}
                    disabled={isGenerating || !formData.name}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50"
                 >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {isGenerating ? "Generating..." : "Generate AI"}
                 </button>

                 <input 
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                 />
                 <label 
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm font-medium whitespace-nowrap"
                 >
                    <Upload size={18} />
                    Upload
                 </label>
              </div>
              <p className="text-xs text-gray-500">
                Paste a URL, upload a file, or click 'Generate AI' to create an image.
              </p>
            </div>
          </div>
        
          <div className="pt-4 flex gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isGenerating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                product ? 'Save Changes' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Delete Confirmation Modal ---
const DeleteConfirmationModal = ({
  product,
  onClose,
  onConfirm
}: {
  product: Product,
  onClose: () => void,
  onConfirm: () => void
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-800">{product.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm">Delete</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Products Component ---
const ProductsView = () => {
  const { products, updateProduct, addProduct, deleteProduct } = useStore();
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductData, setDeleteProductData] = useState<Product | null>(null);

  const filtered = products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteProductData(product);
  };

  const confirmDelete = () => {
    if (deleteProductData) {
      deleteProduct(deleteProductData.id);
      setDeleteProductData(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">Products</h2>
           <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
          <Filter size={18} />
          <span>All Categories</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48 bg-gray-100">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                      onClick={() => handleEdit(product)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-blue-600 hover:text-white text-gray-600 transition-colors shadow-sm"
                      title="Edit"
                  >
                      <Pencil size={18} />
                  </button>
                  <button 
                      onClick={() => handleDeleteClick(product)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-600 hover:text-white text-red-500 transition-colors shadow-sm"
                      title="Delete"
                  >
                      <Trash2 size={18} />
                  </button>
               </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                   <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{product.stock}</span>
              </div>
              
              <div className="flex items-end justify-between mt-4">
                 <div>
                    <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                    {product.variations && product.variations.length > 0 && (
                        <p className="text-xs text-blue-600 font-medium mt-0.5">{product.variations.length} Variants</p>
                    )}
                 </div>
                 <p className="text-xs text-gray-400">Inventory Co.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}

      {deleteProductData && (
        <DeleteConfirmationModal 
          product={deleteProductData}
          onClose={() => setDeleteProductData(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};


// --- Admin Layout Shell ---
const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard'; // Simple logic for demo

  // If path is exactly /admin, default to dashboard view
  const isProducts = location.pathname.includes('products');

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Layers size={20} />, label: 'Categories', path: '#' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '#' },
    { icon: <Users size={20} />, label: 'Customers', path: '#' },
    { icon: <Building2 size={20} />, label: 'Organizations', path: '#' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '#' },
    { icon: <Settings size={20} />, label: 'Settings', path: '#' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
           <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-900 text-white p-1.5 rounded-lg">
                  <Building2 size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">POS Admin</span>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const isActive = item.path === location.pathname || (item.path === '/admin' && location.pathname === '/admin/');
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
             <LogOut size={20} />
             <span>Back to POS</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
         <div className="p-8 max-w-7xl mx-auto">
            {isProducts ? <ProductsView /> : <DashboardView />}
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;