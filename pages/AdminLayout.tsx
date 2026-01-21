import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariation, Order } from '../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  List, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Sparkles, 
  Ban, 
  FileText, 
  Clock, 
  Check, 
  GripVertical, 
  Pencil, 
  Copy, 
  Filter, 
  ChevronRight, 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Menu,
  Star,
  MoreHorizontal,
  RefreshCw,
  ImagePlus,
  HelpCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface Draft extends Partial<Product> {
  draftId: string;
  lastSaved: string;
  images?: string[];
}

// --- Dashboard View ---
const DashboardView = () => {
  const { stats, orders } = useStore();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.totalSales.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span className="font-medium">+{stats.salesChange}%</span>
            <span className="text-gray-400 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span className="font-medium">+{stats.ordersChange}%</span>
            <span className="text-gray-400 ml-1">from yesterday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package size={20} />
            </div>
          </div>
           <div className="mt-4 flex items-center text-sm text-gray-400">
            <span>Lifetime unique customers</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStockAlerts}</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <span className="font-medium">{stats.lowStockAlerts > 0 ? 'Action needed' : 'All good'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Orders View ---
const OrdersView = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    if (filter === 'All') return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
         <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {['All', 'Completed', 'Pending', 'Cancelled', 'Refunded'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        filter === status ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {status}
                </button>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items.length} items
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                        {order.items.map(i => i.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Refunded' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                     <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-white border border-gray-200 text-gray-700 text-xs rounded px-2 py-1 outline-none focus:border-blue-500"
                     >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                     </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      images: [],
      variations: [],
      tags: []
    }
  );
  
  const [gallery, setGallery] = useState<string[]>(
      product?.images && product.images.length > 0 
          ? product.images 
          : product?.image ? [product.image] : []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [variations, setVariations] = useState<ProductVariation[]>(product?.variations || []);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarStock, setNewVarStock] = useState('');
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
  const [variationErrors, setVariationErrors] = useState<Record<string, string>>({});
  const [showVariationSort, setShowVariationSort] = useState(false);
  const [useBaseDefaults, setUseBaseDefaults] = useState(false);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [tagInput, setTagInput] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showDraftsList, setShowDraftsList] = useState(false);

  // Context Menu State for Long Press
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  useEffect(() => {
      const savedDrafts = localStorage.getItem('product_drafts');
      if (savedDrafts) {
          try {
              setDrafts(JSON.parse(savedDrafts));
          } catch (e) {
              console.error("Failed to parse drafts", e);
          }
      }
  }, []);

  useEffect(() => {
    if (gallery.length > 0 && !formData.image) {
        setFormData(prev => ({ ...prev, image: gallery[0] }));
    }
    if (gallery.length === 0 && formData.image) {
         setFormData(prev => ({ ...prev, image: '' }));
    }
  }, [gallery]);

  useEffect(() => {
    if (useBaseDefaults) {
        setNewVarPrice(formData.price?.toString() || '');
        setNewVarStock(formData.stock?.toString() || '');
    }
  }, [useBaseDefaults, formData.price, formData.stock]);

  // Click outside to close context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const addImageToGallery = (url: string) => {
      if (!url) return;
      const newGallery = [...gallery, url];
      setGallery(newGallery);
      if (!formData.image) {
          setFormData(prev => ({ ...prev, image: url }));
      }
      setImageUrlInput('');
  };

  const removeImageFromGallery = (index: number) => {
      const imageToRemove = gallery[index];
      const newGallery = gallery.filter((_, i) => i !== index);
      setGallery(newGallery);
      
      if (formData.image === imageToRemove) {
          setFormData(prev => ({ ...prev, image: newGallery.length > 0 ? newGallery[0] : '' }));
      }
  };

  const setPrimaryImage = (url: string) => {
      setFormData(prev => ({ ...prev, image: url }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        addImageToGallery(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDraft = () => {
      if (!formData.name) {
          alert("Please enter at least a product name to save a draft.");
          return;
      }
      const newDraft: Draft = {
          ...formData,
          variations,
          images: gallery,
          draftId: Date.now().toString(),
          lastSaved: new Date().toLocaleString()
      };
      
      const updatedDrafts = [newDraft, ...drafts];
      setDrafts(updatedDrafts);
      localStorage.setItem('product_drafts', JSON.stringify(updatedDrafts));
      alert("Draft saved successfully!");
  };

  const loadDraft = (draft: Draft) => {
      if (window.confirm("Loading a draft will overwrite current form data. Continue?")) {
          setFormData({
              name: draft.name,
              category: draft.category,
              price: draft.price,
              stock: draft.stock,
              margin: draft.margin,
              image: draft.image,
              tags: draft.tags
          });
          setVariations(draft.variations || []);
          setGallery(draft.images || (draft.image ? [draft.image] : []));
          setShowDraftsList(false);
      }
  };

  const deleteDraft = (draftId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updatedDrafts = drafts.filter(d => d.draftId !== draftId);
      setDrafts(updatedDrafts);
      localStorage.setItem('product_drafts', JSON.stringify(updatedDrafts));
  };

  const validateVariation = () => {
      const errors: Record<string, string> = {};
      
      if (!newVarName.trim()) {
          errors.name = "Name required";
      }

      const price = parseFloat(newVarPrice);
      if (!newVarPrice) {
          errors.price = "Price required";
      } else if (isNaN(price)) {
          errors.price = "Price must be a number";
      } else if (price < 0) {
          errors.price = "Price cannot be negative";
      }

      const stock = parseInt(newVarStock);
      if (!newVarStock) {
          errors.stock = "Stock required";
      } else if (isNaN(stock)) {
           errors.stock = "Stock must be a number";
      } else if (stock < 0) {
          errors.stock = "Stock cannot be negative";
      } else if (!Number.isInteger(stock)) {
          errors.stock = "Stock must be an integer";
      }

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
    setNewVarPrice(useBaseDefaults ? (formData.price?.toString() || '') : '');
    setNewVarStock(useBaseDefaults ? (formData.stock?.toString() || '') : '');
    setVariationErrors({});
  };

  const startEditVariation = (v: ProductVariation) => {
    setNewVarName(v.name);
    setNewVarPrice(v.price.toString());
    setNewVarStock(v.stock.toString());
    setEditingVariationId(v.id);
    setVariationErrors({});
    setUseBaseDefaults(false);
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
    if (editingVariationId === id) {
        setEditingVariationId(null);
        setNewVarName('');
        setNewVarPrice(useBaseDefaults ? (formData.price?.toString() || '') : '');
        setNewVarStock(useBaseDefaults ? (formData.stock?.toString() || '') : '');
    }
  };
  
  const copyFromBase = () => {
      if (formData.price) setNewVarPrice(formData.price.toString());
      if (formData.stock) setNewVarStock(formData.stock.toString());
  }

  const sortVariations = (criteria: 'name' | 'price' | 'stock') => {
      setVariations(prev => [...prev].sort((a, b) => {
          if (criteria === 'name') return a.name.localeCompare(b.name);
          return a[criteria] - b[criteria];
      }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
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
    // Generate deterministic colors based on name string
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const saturation = 65 + (Math.abs(hash) % 30); 
    const lightness = 90 + (Math.abs(hash) % 10); // Very light pastel background

    const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const textColor = `hsl(${hue}, ${saturation}%, 30%)`;
    const circleColor = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`;

    // Category Icons Map
    const icons: Record<string, string[]> = {
        'Food': ['🍽️', '🍔', '🍕', '🥘', '🥗', '🍖', '🥪', '🌮', '🍜'],
        'Drinks': ['🥤', '☕', '🍵', '🍹', '🍺', '🍷', '🥛', '🧃', '🧉'],
        'Desserts': ['🍰', '🍦', '🍩', '🍪', '🍫', '🍮', '🧁', '🥧', '🧇']
    };

    const categoryIcons = icons[category] || icons['Food'];
    const iconIndex = Math.abs(hash) % categoryIcons.length;
    const icon = categoryIcons[iconIndex];

    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        
        <!-- Decorative Elements -->
        <circle cx="400" cy="250" r="180" fill="${circleColor}" fill-opacity="0.6"/>
        
        <!-- Main Icon -->
        <text x="400" y="320" font-family="system-ui, sans-serif" font-size="220" text-anchor="middle" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.1))">${icon}</text>
        
        <!-- Separator -->
        <rect x="200" y="480" width="400" height="4" fill="${textColor}" rx="2" opacity="0.1"/>
        
        <!-- Product Name -->
        <text x="400" y="540" font-family="system-ui, -apple-system, sans-serif" font-size="48" fill="${textColor}" text-anchor="middle" font-weight="bold" letter-spacing="-0.5">${name}</text>
      </svg>
    `;
    
    // Safely encode SVG with emoji support
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const fetchAiImage = async (name: string, category: string): Promise<string | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let styleDescription = "Professional studio photography, clean composition, neutral light gray background.";
      
      if (!customPrompt) {
        if (category === 'Food') {
            styleDescription += " Vibrant colors, high detail, appetizing, fresh ingredients.";
        } else if (category === 'Drinks') {
             styleDescription += " Sleek, modern design, refreshing, crystal clear glass.";
        } else if (category === 'Desserts') {
             styleDescription += " Elegant, textured, indulgent, sweet details.";
        }
      }

      let prompt = `Create a high-quality product image for "${name}". 
      Category: ${category}.
      ${customPrompt ? `User Customization: ${customPrompt}.` : ''}
      
      Style: ${styleDescription}
      Requirements: Photorealistic, 4k resolution, centered subject, white or light gray background, 4:3 aspect ratio.
      
      Negative Prompt: text, labels, watermarks, logo, ${negativePrompt || ''}`;
      
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
    if (!formData.name) {
        setErrors(prev => ({...prev, name: 'Please enter a name to generate image'}));
        return;
    }
    setIsGenerating(true);
    setContextMenu(null);
    
    try {
        const url = await fetchAiImage(formData.name, formData.category || 'Food');
        if (url) {
            addImageToGallery(url);
        } else {
            const fallback = generateFallbackImage(formData.name, formData.category || 'Food');
            addImageToGallery(fallback);
        }
    } catch (e) {
        const fallback = generateFallbackImage(formData.name, formData.category || 'Food');
        addImageToGallery(fallback);
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
    let finalGallery = gallery;

    // Logic to ensure at least one image exists
    if (finalGallery.length === 0) {
        let generatedUrl;
        try {
            // Try to use existing URL from input if user typed it but didn't add it
            if (imageUrlInput) {
                generatedUrl = imageUrlInput;
            } else {
                 generatedUrl = await fetchAiImage(formData.name || '', formData.category || 'Food');
            }
            
            if (generatedUrl) {
                imageUrl = generatedUrl;
            } else {
                imageUrl = generateFallbackImage(formData.name || '', formData.category || 'Food');
            }
        } catch {
            imageUrl = generateFallbackImage(formData.name || '', formData.category || 'Food');
        }
        finalGallery = [imageUrl];
    } else if (!imageUrl && finalGallery.length > 0) {
        imageUrl = finalGallery[0];
    }

    onSave({
      id: product?.id || Date.now().toString(),
      name: formData.name || '',
      category: formData.category || 'Food',
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      margin: Number(formData.margin) || 0,
      image: imageUrl || '',
      images: finalGallery,
      variations: variations,
      tags: formData.tags || []
    } as Product);
    
    setIsGenerating(false);
  };

  // --- Long Press Handlers ---
  const startLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPressRef.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        setContextMenu({ x: clientX, y: clientY });
    }, 600); // 600ms long press
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
      // Prevent standard click if it was a long press
      if (isLongPressRef.current) {
          e.preventDefault();
          return;
      }
      
      // If no image, act as "Generate" button
      if (gallery.length === 0) {
          handleGenerateClick();
      }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const VARIATION_PRESETS = ['Small', 'Medium', 'Large', 'Extra Large', 'Pack of 6', 'Pack of 12', 'Combo'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col relative">
        
        {/* Loading Overlay */}
        {isGenerating && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-200">
                <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-2xl border border-purple-100 transform transition-all scale-100">
                    <div className="relative w-20 h-20">
                        <svg className="animate-spin w-full h-full text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Creating Magic</h3>
                        <p className="text-gray-500 font-medium">AI is generating your product image...</p>
                        <p className="text-xs text-gray-400">This usually takes about 5-10 seconds</p>
                    </div>
                </div>
            </div>
        )}

        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h3>
              
              {/* Drafts Dropdown */}
              {!product && (
                  <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowDraftsList(!showDraftsList)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
                      >
                          <FileText size={14} />
                          {drafts.length} Drafts
                      </button>
                      
                      {showDraftsList && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-20 max-h-60 overflow-y-auto">
                              {drafts.length === 0 ? (
                                  <div className="p-4 text-center text-gray-400 text-xs">No saved drafts</div>
                              ) : (
                                  <div className="divide-y divide-gray-100">
                                      {drafts.map(draft => (
                                          <div key={draft.draftId} className="p-3 hover:bg-gray-50 cursor-pointer group" onClick={() => loadDraft(draft)}>
                                              <div className="flex justify-between items-start mb-1">
                                                  <span className="font-medium text-gray-800 text-sm">{draft.name || 'Untitled'}</span>
                                                  <button onClick={(e) => deleteDraft(draft.draftId, e)} className="text-gray-400 hover:text-red-500">
                                                      <X size={14} />
                                                  </button>
                                              </div>
                                              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                  <Clock size={10} />
                                                  {draft.lastSaved}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              )}
          </div>
          <div className="flex items-center gap-2">
              {!product && (
                  <button 
                    type="button" 
                    onClick={saveDraft}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100"
                  >
                      <Save size={14} /> Save Draft
                  </button>
              )}
              <button onClick={onClose} disabled={isGenerating || isUploading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto" onScroll={() => setContextMenu(null)}>
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
                <div className="flex items-center gap-2">
                    {variations.length > 1 && (
                        <div className="relative">
                            <button 
                                type="button" 
                                onClick={() => setShowVariationSort(!showVariationSort)}
                                className="text-xs text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 border border-gray-200 rounded px-2 py-1 bg-white"
                            >
                                <Filter size={12} /> Sort
                            </button>
                            {showVariationSort && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg py-1 w-32 z-20">
                                    <button type="button" onClick={() => { sortVariations('name'); setShowVariationSort(false); }} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-700">Name</button>
                                    <button type="button" onClick={() => { sortVariations('price'); setShowVariationSort(false); }} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-700">Price</button>
                                    <button type="button" onClick={() => { sortVariations('stock'); setShowVariationSort(false); }} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-700">Stock</button>
                                </div>
                            )}
                        </div>
                    )}
                    <button 
                    type="button" 
                    onClick={copyFromBase}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 border border-blue-100 bg-blue-50 rounded px-2 py-1"
                    title="Copy base price and stock to inputs"
                    >
                        <Copy size={12} /> Use Base Values
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-3">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                           {VARIATION_PRESETS.map(preset => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setNewVarName(preset)}
                                className="text-[10px] px-2 py-0.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-full transition-colors text-gray-600"
                              >
                                {preset}
                              </button>
                           ))}
                        </div>
                        <input 
                            type="text" 
                            placeholder="Variant Name (e.g. Small, Red)" 
                            className={`w-full px-3 py-2 border ${variationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm outline-none`}
                            value={newVarName}
                            onChange={e => { setNewVarName(e.target.value); if(variationErrors.name) setVariationErrors({...variationErrors, name: ''}) }}
                        />
                    </div>
                    <div className="col-span-2">
                         <div className="h-6 mb-2 flex items-center">
                             <label className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer select-none font-medium">
                                <input
                                    type="checkbox"
                                    checked={useBaseDefaults}
                                    onChange={(e) => setUseBaseDefaults(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                                />
                                Use Base Values
                             </label>
                         </div>
                         <input 
                            type="number" 
                            placeholder="Price" 
                            className={`w-full px-3 py-2 border ${variationErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm outline-none ${useBaseDefaults ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                            value={newVarPrice}
                            onChange={e => { setNewVarPrice(e.target.value); if(variationErrors.price) setVariationErrors({...variationErrors, price: ''}) }}
                            disabled={useBaseDefaults}
                        />
                    </div>
                    <div className="col-span-1">
                         <div className="h-6 mb-2"></div>
                         <input 
                            type="number" 
                            placeholder="Stock" 
                            className={`w-full px-3 py-2 border ${variationErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm outline-none ${useBaseDefaults ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                            value={newVarStock}
                            onChange={e => { setNewVarStock(e.target.value); if(variationErrors.stock) setVariationErrors({...variationErrors, stock: ''}) }}
                            disabled={useBaseDefaults}
                        />
                    </div>
                    <div className="col-span-1 flex flex-col justify-end">
                        <button 
                            type="button"
                            onClick={handleAddOrUpdateVariation}
                            className={`w-full h-[38px] ${editingVariationId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg flex items-center justify-center transition-colors`}
                            title={editingVariationId ? "Update Variation" : "Add Variation"}
                        >
                            {editingVariationId ? <Check size={18} /> : <Plus size={18} />}
                        </button>
                    </div>
                </div>
                {(variationErrors.name || variationErrors.price || variationErrors.stock) && (
                    <div className="flex flex-col gap-1 text-xs text-red-500 px-1">
                        {variationErrors.name && <span>• {variationErrors.name}</span>}
                        {variationErrors.price && <span>• {variationErrors.price}</span>}
                        {variationErrors.stock && <span>• {variationErrors.stock}</span>}
                    </div>
                )}

                {variations.length > 0 ? (
                    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100 overflow-hidden mt-2 relative">
                        {variations.map((v, index) => (
                            <div 
                                key={v.id} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center justify-between p-3 transition-all duration-200
                                    ${editingVariationId === v.id ? 'bg-blue-50/50 border-blue-200' : 'hover:bg-gray-50 border-gray-200'}
                                    ${draggedIndex === index ? 'opacity-30 bg-gray-100 scale-[0.98]' : 'bg-white border-b last:border-0'}
                                `}
                            >
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                     <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1" onMouseDown={e => e.stopPropagation()}>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            
            <div className="space-y-4">
              {/* Preview Gallery */}
              {gallery.length > 0 ? (
                 <div className="space-y-3">
                    {/* Main Preview (Primary Image) */}
                    <div 
                        className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer"
                        onMouseDown={startLongPress}
                        onMouseUp={cancelLongPress}
                        onMouseLeave={cancelLongPress}
                        onTouchStart={startLongPress}
                        onTouchEnd={cancelLongPress}
                        onClick={handleImageClick}
                        onContextMenu={handleContextMenu}
                    >
                         <img 
                           src={formData.image || gallery[0]} 
                           alt="Preview" 
                           className="w-full h-full object-cover transition-opacity duration-300" 
                         />
                         <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                             <Star size={10} fill="currentColor" /> Primary Image
                         </div>
                    </div>
                    
                    {/* Carousel/Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {gallery.map((img, idx) => {
                            const isPrimary = formData.image === img || (!formData.image && idx === 0);
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => setPrimaryImage(img)}
                                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                                        isPrimary 
                                        ? 'border-blue-500 shadow-md scale-105 ring-2 ring-blue-100' 
                                        : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    
                                    {/* Remove Button */}
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImageFromGallery(idx); }}
                                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity z-10"
                                        title="Remove image"
                                    >
                                        <X size={10} />
                                    </button>

                                    {/* Primary Indicator Overlay */}
                                    {isPrimary && (
                                        <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-white text-[8px] text-center font-bold py-0.5 backdrop-blur-sm uppercase tracking-wide">
                                            Main
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                 </div>
              ) : (
                <div 
                    className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100 transition-colors hover:border-blue-400 hover:text-blue-500 group relative"
                    onClick={handleGenerateClick}
                    title="Click to generate image with AI"
                >
                   <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Sparkles size={24} className="text-purple-500" />
                   </div>
                   <span className="text-sm font-medium group-hover:text-blue-600">Click to Generate with AI</span>
                   <span className="text-[10px] text-gray-400">(Requires Product Name)</span>
                </div>
              )}

              {/* Context Menu */}
              {contextMenu && (
                  <div 
                    className="fixed z-[60] bg-white rounded-lg shadow-xl border border-gray-100 w-48 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                  >
                      <button 
                        type="button"
                        onClick={handleGenerateClick}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                      >
                          <RefreshCw size={14} /> Regenerate Image
                      </button>
                      <label 
                        htmlFor="menu-image-upload"
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                          <ImagePlus size={14} /> Upload New Photo
                          <input 
                            type="file"
                            id="menu-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                handleFileUpload(e);
                                setContextMenu(null);
                            }}
                         />
                      </label>
                      {gallery.length > 0 && (
                          <button 
                            type="button"
                            onClick={() => {
                                const currentIdx = gallery.findIndex(img => img === formData.image) || 0;
                                removeImageFromGallery(currentIdx);
                                setContextMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                          >
                              <Trash2 size={14} /> Remove Current
                          </button>
                      )}
                  </div>
              )}

              {/* Controls */}
              <div className="space-y-3">
                 <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      className="flex-1 pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Paste image URL..."
                    />
                    <button 
                        type="button"
                        onClick={() => addImageToGallery(imageUrlInput)}
                        disabled={!imageUrlInput.trim()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm disabled:opacity-50"
                    >
                        Add
                    </button>
                 </div>

                 {/* AI Generation Controls */}
                 <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-purple-800 flex items-center gap-1">
                            <Sparkles size={12} /> AI Image Generation
                        </label>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="space-y-1">
                             <div className="flex gap-2 items-center">
                                <input 
                                    type="text" 
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="Custom prompt (Optional)..."
                                    className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white placeholder-purple-300"
                                />
                                <div className="relative group shrink-0">
                                    <HelpCircle size={18} className="text-purple-400 cursor-help hover:text-purple-600 transition-colors" />
                                    <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                        <div className="font-bold mb-1 text-purple-300">Tips for better results:</div>
                                        <ul className="list-disc pl-3 space-y-1 text-gray-300">
                                            <li>Mention lighting (e.g., "cinematic lighting", "soft morning light")</li>
                                            <li>Describe the setting (e.g., "on a wooden table", "marble countertop")</li>
                                            <li>Add style keywords (e.g., "minimalist", "close-up", "high resolution")</li>
                                        </ul>
                                         <div className="absolute bottom-0 right-1.5 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-700"></div>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={handleGenerateClick}
                                    disabled={isGenerating || !formData.name}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    {isGenerating ? "Generating..." : "Generate"}
                                </button>
                             </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 mb-1">
                                <label className="text-[10px] font-semibold text-purple-800 flex items-center gap-1">
                                    <Ban size={10} /> Negative Prompt (Exclude)
                                </label>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input 
                                     type="text" 
                                     value={negativePrompt}
                                     onChange={(e) => setNegativePrompt(e.target.value)}
                                     placeholder="e.g. blurry, text, watermark, people, distorted"
                                     className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white placeholder-purple-300"
                                />
                                <div className="relative group shrink-0">
                                    <HelpCircle size={18} className="text-purple-400 cursor-help hover:text-purple-600 transition-colors" />
                                    <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                        <div className="font-bold mb-1 text-purple-300">What to exclude:</div>
                                        <ul className="list-disc pl-3 space-y-1 text-gray-300">
                                            <li>Unwanted objects (e.g., "hands", "people", "utensils")</li>
                                            <li>Image defects (e.g., "blurry", "low quality", "distorted")</li>
                                            <li>Text or logos (e.g., "watermark", "signature", "text")</li>
                                        </ul>
                                         <div className="absolute bottom-0 right-1.5 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-700"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500 flex-1">Or upload from your device:</span>
                     <input 
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                     />
                     <label 
                        htmlFor="image-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm font-medium whitespace-nowrap ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
                     >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {isUploading ? "Uploading..." : "Upload File"}
                     </label>
                 </div>
              </div>
            </div>
          </div>
        
          <div className="pt-4 flex gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              disabled={isGenerating || isUploading}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isGenerating || isUploading}
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

// --- Products View ---
const ProductsView = () => {
  const { products, addProduct, updateProduct, deleteProduct, searchQuery, setSearchQuery } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Simple filtering
  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

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
      if (window.confirm("Are you sure you want to delete this product?")) {
          deleteProduct(id);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Products Inventory</h2>
          <button 
             onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
             className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
             <Plus size={18} /> Add New Product
          </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                       <th className="px-6 py-3 text-left w-20">Image</th>
                       <th className="px-6 py-3 text-left">Product Name</th>
                       <th className="px-6 py-3 text-left">Category</th>
                       <th className="px-6 py-3 text-left">Price</th>
                       <th className="px-6 py-3 text-left">Stock</th>
                       <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                       <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-3">
                             <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                             </div>
                          </td>
                          <td className="px-6 py-3">
                             <div className="font-medium text-gray-900">{product.name}</div>
                             <div className="text-xs text-gray-500">
                                 {product.variations && product.variations.length > 0 ? `${product.variations.length} variations` : 'Standard'}
                             </div>
                          </td>
                          <td className="px-6 py-3">
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {product.category}
                             </span>
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-3 text-sm">
                              <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                                  {product.stock}
                              </span>
                          </td>
                          <td className="px-6 py-3">
                              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                      <Edit size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </td>
                       </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                <Search size={32} className="mx-auto mb-2 opacity-50" />
                                <p>No products found matching your search.</p>
                            </td>
                        </tr>
                    )}
                 </tbody>
              </table>
          </div>
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

// --- Main Layout ---
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active view based on path
  const currentView = useMemo(() => {
      if (location.pathname.includes('/orders')) return 'orders';
      if (location.pathname.includes('/products')) return 'products';
      return 'dashboard';
  }, [location.pathname]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'products', label: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: List, path: '/admin/orders' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0 z-20">
         <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <h1 className="font-bold text-xl text-gray-800 tracking-tight">Admin Panel</h1>
         </div>
         
         <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
                <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                        currentView === item.id
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <item.icon size={20} />
                    {item.label}
                </Link>
            ))}
         </nav>

         <div className="p-4 border-t border-gray-200">
             <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                 <LogOut size={20} />
                 Back to POS
             </Link>
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
         {/* Mobile Header */}
         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
             <div className="flex items-center gap-3 md:hidden">
                 <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600">
                     <Menu size={24} />
                 </button>
                 <span className="font-bold text-lg">Admin</span>
             </div>

             {/* Search Bar (only show on products page usually, but globally here for simplicity) */}
             <div className="flex-1 max-w-xl mx-4 hidden md:block">
                 {currentView === 'products' && (
                     <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                         <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                         />
                     </div>
                 )}
             </div>

             <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                     AD
                 </div>
             </div>
         </header>

         <main className="flex-1 overflow-y-auto p-4 md:p-8">
             {currentView === 'dashboard' && <DashboardView />}
             {currentView === 'products' && <ProductsView />}
             {currentView === 'orders' && <OrdersView />}
         </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white shadow-xl flex flex-col animate-slide-in-left" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-xl">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} className="text-gray-500" /></button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                                currentView === item.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                         <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                             <LogOut size={20} />
                             Back to POS
                         </Link>
                    </div>
                </nav>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;