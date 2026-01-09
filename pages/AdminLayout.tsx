import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut,
  Search,
  Plus,
  DollarSign,
  AlertTriangle,
  X,
  Loader2,
  Trash2,
  Pencil,
  Upload,
  Image as ImageIcon,
  List,
  Sparkles,
  Menu,
  Copy,
  Check,
  GripVertical
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
      variations: [],
      tags: []
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Variations State
  const [variations, setVariations] = useState<ProductVariation[]>(product?.variations || []);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarStock, setNewVarStock] = useState('');
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
  const [variationErrors, setVariationErrors] = useState<Record<string, string>>({});
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Tags State
  const [tagInput, setTagInput] = useState('');

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

  const validateVariation = () => {
      const errors: Record<string, string> = {};
      if (!newVarName.trim()) errors.name = "Name required";
      if (!newVarPrice || isNaN(parseFloat(newVarPrice)) || parseFloat(newVarPrice) < 0) errors.price = "Invalid price";
      if (!newVarStock || isNaN(parseInt(newVarStock)) || parseInt(newVarStock) < 0) errors.stock = "Invalid stock";
      setVariationErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdateVariation = () => {
    if (!validateVariation()) return;
    
    if (editingVariationId) {
        setVariations(prev => prev.map(v => v.id === editingVariationId ? {
            ...v,
            name: newVarName,
            price: parseFloat(newVarPrice),
            stock: parseInt(newVarStock)
        } : v));
        setEditingVariationId(null);
    } else {
        const newVariation: ProductVariation = {
            id: Date.now().toString(),
            name: newVarName,
            price: parseFloat(newVarPrice),
            stock: parseInt(newVarStock)
        };
        setVariations([...variations, newVariation]);
    }
    
    setNewVarName('');
    setNewVarPrice('');
    setNewVarStock('');
    setVariationErrors({});
  };

  const startEditVariation = (v: ProductVariation) => {
    setNewVarName(v.name);
    setNewVarPrice(v.price.toString());
    setNewVarStock(v.stock.toString());
    setEditingVariationId(v.id);
    setVariationErrors({});
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
    if (editingVariationId === id) {
        setEditingVariationId(null);
        setNewVarName('');
        setNewVarPrice('');
        setNewVarStock('');
    }
  };
  
  const copyFromBase = () => {
      if (formData.price) setNewVarPrice(formData.price.toString());
      if (formData.stock) setNewVarStock(formData.stock.toString());
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Required for some browsers to initiate drag
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Allow dropping
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newVariations = [...variations];
    const draggedItem = newVariations[draggedIndex];
    newVariations.splice(draggedIndex, 1);
    newVariations.splice(index, 0, draggedItem);
    
    setVariations(newVariations);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();

    const trimmed = tagInput.trim();
    if (!trimmed) return;
    
    const currentTags = formData.tags || [];
    if (!currentTags.includes(trimmed)) {
        setFormData({ ...formData, tags: [...currentTags, trimmed] });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
        ...formData, 
        tags: (formData.tags || []).filter(t => t !== tagToRemove) 
    });
  };

  const generateFallbackImage = (name: string, category: string) => {
    const bgColor = category === 'Food' ? '#fee2e2' : category === 'Drinks' ? '#e0f2fe' : '#fce7f3';
    const textColor = category === 'Food' ? '#991b1b' : category === 'Drinks' ? '#075985' : '#831843';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="45%" font-family="system-ui, -apple-system, sans-serif" font-size="120" fill="${textColor}" text-anchor="middle" dy=".3em" font-weight="bold">${initials}</text>
        <text x="50%" y="70%" font-family="system-ui, -apple-system, sans-serif" font-size="40" fill="${textColor}" text-anchor="middle" opacity="0.6">${category}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const fetchAiImage = async (name: string, category: string): Promise<string | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let styleDescription = "Professional studio photography, clean composition, neutral light gray background.";
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
      Requirements: Photorealistic, 4k resolution, centered subject, white or light gray background for e-commerce consistency, 4:3 aspect ratio.
      Do not include any text, labels, or watermarks in the image.`;
      
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
    } else {
        const fallback = generateFallbackImage(formData.name, formData.category || 'Food');
        setFormData(prev => ({ ...prev, image: fallback }));
    }
    setIsGenerating(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (formData.price === undefined || isNaN(formData.price)) {
        newErrors.price = "Price is required";
    } else if (formData.price < 0) {
        newErrors.price = "Price cannot be negative";
    }

    if (formData.stock === undefined || isNaN(formData.stock)) {
        newErrors.stock = "Stock level is required";
    } else if (formData.stock < 0) {
        newErrors.stock = "Stock cannot be negative";
    } else if (!Number.isInteger(formData.stock)) {
        newErrors.stock = "Stock must be a whole number";
    }

    if (formData.margin !== undefined && !isNaN(formData.margin)) {
       if (formData.margin < 0 || formData.margin > 100) {
           newErrors.margin = "Margin must be between 0% and 100%";
       }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsGenerating(true);

    let imageUrl = formData.image;

    if (!imageUrl || imageUrl.trim() === '') {
        const generated = await fetchAiImage(formData.name || '', formData.category || 'Food');
        if (generated) {
            imageUrl = generated;
        } else {
            imageUrl = generateFallbackImage(formData.name || '', formData.category || 'Food');
        }
    }

    if (!imageUrl) {
         imageUrl = generateFallbackImage(formData.name || '', formData.category || 'Food');
    }

    onSave({
      id: product?.id || Date.now().toString(),
      name: formData.name || '',
      category: formData.category || 'Food',
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      margin: Number(formData.margin) || 0,
      image: imageUrl,
      variations: variations,
      tags: formData.tags || []
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
                  value={formData.name}
                  onChange={e => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 outline-none transition-all`}
                  placeholder="e.g. Cheese Burger"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                      value={formData.price}
                      onChange={e => {
                        setFormData({...formData, price: parseFloat(e.target.value)});
                        if (errors.price) setErrors({...errors, price: ''});
                      }}
                      className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 outline-none`}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.stock}
                      onChange={e => {
                        setFormData({...formData, stock: parseInt(e.target.value)});
                        if (errors.stock) setErrors({...errors, stock: ''});
                      }}
                      className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 outline-none`}
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Margin (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={formData.margin}
                      onChange={e => {
                        setFormData({...formData, margin: parseFloat(e.target.value)});
                        if (errors.margin) setErrors({...errors, margin: ''});
                      }}
                      className={`w-full px-3 py-2 border ${errors.margin ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 outline-none`}
                    />
                    {errors.margin && <p className="text-red-500 text-xs mt-1">{errors.margin}</p>}
                 </div>
              </div>

              {/* Tags Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                    <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add a tag (e.g. Vegan, Gluten-Free)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button 
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900 ml-1"><X size={12} /></button>
                        </span>
                    ))}
                    {(!formData.tags || formData.tags.length === 0) && (
                        <span className="text-xs text-gray-400 italic">No tags added</span>
                    )}
                </div>
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* Variations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <List size={18} className="text-gray-500" />
                    <h4 className="font-semibold text-gray-800">Product Variations</h4>
                </div>
                <button 
                   type="button" 
                   onClick={copyFromBase}
                   className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                   title="Copy base price and stock to inputs"
                >
                    <Copy size={12} /> Use Base Values
                </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-3">
                        <input 
                            type="text" 
                            placeholder="Variant Name (e.g. Small, Red)" 
                            className={`w-full px-3 py-2 border ${variationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm outline-none`}
                            value={newVarName}
                            onChange={e => { setNewVarName(e.target.value); if(variationErrors.name) setVariationErrors({...variationErrors, name: ''}) }}
                        />
                    </div>
                    <div className="col-span-2">
                         <input 
                            type="number" 
                            placeholder="Price" 
                            className={`w-full px-3 py-2 border ${variationErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm outline-none`}
                            value={newVarPrice}
                            onChange={e => { setNewVarPrice(e.target.value); if(variationErrors.price) setVariationErrors({...variationErrors, price: ''}) }}
                        />
                    </div>
                    <div className="col-span-1">
                         <input 
                            type="number" 
                            placeholder="Stock" 
                            className={`w-full px-3 py-2 border ${variationErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm outline-none`}
                            value={newVarStock}
                            onChange={e => { setNewVarStock(e.target.value); if(variationErrors.stock) setVariationErrors({...variationErrors, stock: ''}) }}
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={handleAddOrUpdateVariation}
                        className={`col-span-1 ${editingVariationId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg flex items-center justify-center transition-colors`}
                        title={editingVariationId ? "Update Variation" : "Add Variation"}
                    >
                        {editingVariationId ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                </div>
                {(variationErrors.name || variationErrors.price || variationErrors.stock) && (
                    <div className="flex gap-4 text-xs text-red-500 px-1">
                        {variationErrors.name && <span>{variationErrors.name}</span>}
                        {variationErrors.price && <span>{variationErrors.price}</span>}
                        {variationErrors.stock && <span>{variationErrors.stock}</span>}
                    </div>
                )}

                {variations.length > 0 ? (
                    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100 overflow-hidden mt-2">
                        {variations.map((v, index) => (
                            <div 
                                key={v.id} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center justify-between p-3 transition-all
                                    ${editingVariationId === v.id ? 'bg-blue-50/50 border-blue-200' : 'hover:bg-gray-50 border-gray-200'}
                                    ${draggedIndex === index ? 'opacity-40 border-dashed border-2 border-blue-300 bg-gray-50' : 'bg-white border-b'}
                                `}
                            >
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                     <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600" onMouseDown={e => e.stopPropagation()}>
                                        <GripVertical size={16} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 items-center flex-1 cursor-pointer" onClick={() => startEditVariation(v)}>
                                        <span className="text-sm font-medium text-gray-800 truncate" title={v.name}>{v.name}</span>
                                        <span className="text-sm text-gray-600">${v.price.toFixed(2)}</span>
                                        <span className="text-sm text-gray-600">Qty: {v.stock}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => startEditVariation(v)}
                                        className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => removeVariation(v.id)} 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                                        title="Remove"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-100 rounded">
                        No variations added. Products with variations will force selection at checkout.
                    </p>
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

const AdminLayout: React.FC = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isProductsPage = location.pathname.includes('/products');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
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
    setEditingProduct(null);
  };
  
  const handleDelete = (id: string) => {
      if(window.confirm('Delete this product?')) {
          deleteProduct(id);
      }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-bold text-xl text-gray-800">AdminPanel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${!isProductsPage ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isProductsPage ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package size={20} />
            Products
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-100">
             <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                <LogOut size={20} />
                Exit to POS
             </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
       {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
           <aside className="w-64 h-full bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                 <span className="font-bold text-lg text-gray-800">Menu</span>
                 <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>
              <nav className="p-4 space-y-2">
                 <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${!isProductsPage ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                    <LayoutDashboard size={20} /> Dashboard
                 </Link>
                 <Link to="/admin/products" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isProductsPage ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                    <Package size={20} /> Products
                 </Link>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600">
                    <LogOut size={20} /> Exit to POS
                 </Link>
              </nav>
           </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-800">{isProductsPage ? 'Products' : 'Dashboard'}</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                JD
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
           {!isProductsPage ? (
              <DashboardView /> 
           ) : (
              <div className="space-y-6 animate-fade-in">
                 {/* Products Header Actions */}
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="relative w-full sm:w-96">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                          type="text" 
                          placeholder="Search products..." 
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                    </div>
                    <button 
                      onClick={handleAddNew}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                       <Plus size={20} />
                       <span>Add Product</span>
                    </button>
                 </div>

                 {/* Products List */}
                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Product</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Category</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Price</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Stock</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                             {filteredProducts.length === 0 ? (
                                <tr>
                                   <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                      No products found matching your search.
                                   </td>
                                </tr>
                             ) : (
                                filteredProducts.map((product) => (
                                   <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                      <td className="px-6 py-4">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                               <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                                               {product.variations && product.variations.length > 0 && (
                                                  <p className="text-xs text-blue-600 font-medium">{product.variations.length} variations</p>
                                               )}
                                            </div>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4">
                                         <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {product.category}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                                          {product.variations && product.variations.length > 0 
                                            ? `$${Math.min(product.price, ...product.variations.map(v => v.price)).toFixed(2)} - $${Math.max(product.price, ...product.variations.map(v => v.price)).toFixed(2)}`
                                            : `$${product.price.toFixed(2)}`
                                          }
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                            {product.stock}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         <div className="flex items-center justify-end gap-2">
                                            <button 
                                              onClick={() => handleEdit(product)}
                                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                               <Pencil size={18} />
                                            </button>
                                            <button 
                                              onClick={() => handleDelete(product.id)}
                                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                               <Trash2 size={18} />
                                            </button>
                                         </div>
                                      </td>
                                   </tr>
                                ))
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           )}
        </main>
      </div>

      {isModalOpen && (
        <ProductFormModal 
           product={editingProduct} 
           onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
           onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminLayout;