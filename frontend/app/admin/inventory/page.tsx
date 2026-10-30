'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Package, Plus, Minus, PlusCircle, X, Upload, Loader } from 'lucide-react';
import Image from 'next/image';
import { fetchProducts, createProductApi } from '@/lib/api';
import { updateProductStock } from '@/lib/adminApi';

export default function AdminInventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    collection: '',
    subtitle: '',
    category: 'Bedsheets',
    price: 0,
    originalPrice: 0,
    stockQuantity: 0,
    description: '',
    sizes: ['King'],
    colors: [{ name: 'White', hex: '#FFFFFF' }],
    images: [''],
    sku: '',
    hsn: '6302',
    weight_kg: 2.5,
    dimensions_cm: '274x274',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    setUpdating(productId);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      
      const data = await updateProductStock(token, productId, newStock);
      
      if (data.success) {
        loadProducts();
      } else {
        alert('Failed to update stock');
      }
    } catch (err) {
      alert('Error updating stock');
    } finally {
      setUpdating(null);
    }
  };

  const handleAddProduct = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      // Generate ID from name
      const id = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const productPayload = {
        ...newProduct,
        id,
        inStock: newProduct.stockQuantity > 0,
        rating: 4.8,
        reviewsCount: 0,
        unitsSold: 0,
        sizePrices: {
          King: newProduct.price,
          Queen: Math.round(newProduct.price * 0.85),
        },
      };

      const data = await createProductApi(token, productPayload);
      
      if (data.success) {
        alert('Product added successfully!');
        setShowAddModal(false);
        resetForm();
        loadProducts();
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err: any) {
      alert(err.message || 'Error adding product');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      collection: '',
      subtitle: '',
      category: 'Bedsheets',
      price: 0,
      originalPrice: 0,
      stockQuantity: 0,
      description: '',
      sizes: ['King'],
      colors: [{ name: 'White', hex: '#FFFFFF' }],
      images: [''],
      sku: '',
      hsn: '6302',
      weight_kg: 2.5,
      dimensions_cm: '274x274',
    });
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#12100E]">
      {/* Header */}
      <header className="bg-[#1F1C19] border-b border-[#3A3125] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-[#C7B9A5] hover:text-[#E6C594]">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[#FAF6F0]">Inventory Management</h1>
                <p className="text-xs text-[#C7B9A5]">{filteredProducts.length} products</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#E6C594] text-[#12100E] rounded-lg hover:bg-[#FAF6F0] transition-colors font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C7B9A5]" />
            <input
              type="text"
              placeholder="Search products by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
            />
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12 text-[#C7B9A5]">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-12 text-center">
            <Package className="w-12 h-12 text-[#6B6B6B] mx-auto mb-4" />
            <p className="text-[#C7B9A5]">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#1F1C19] border border-[#3A3125] rounded-xl overflow-hidden hover:border-[#E6C594] transition-colors"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-[#12100E]">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-[#6B6B6B]" />
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                    product.stockQuantity === 0 ? 'bg-red-500/90 text-white' :
                    product.stockQuantity <= 10 ? 'bg-yellow-500/90 text-black' :
                    'bg-green-500/90 text-white'
                  }`}>
                    {product.stockQuantity === 0 ? 'Out of Stock' :
                     product.stockQuantity <= 10 ? `Low: ${product.stockQuantity}` :
                     `Stock: ${product.stockQuantity}`}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#FAF6F0] mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#C7B9A5] mb-3">
                    ID: {product.id}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#C7B9A5]">Current Stock:</span>
                    <span className="text-lg font-bold text-[#E6C594]">
                      {product.stockQuantity}
                    </span>
                  </div>

                  {/* Stock Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStock(product.id, Math.max(0, product.stockQuantity - 1))}
                      disabled={updating === product.id || product.stockQuantity === 0}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm">-1</span>
                    </button>
                    <button
                      onClick={() => updateStock(product.id, product.stockQuantity + 1)}
                      disabled={updating === product.id}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] hover:border-green-500 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">+1</span>
                    </button>
                  </div>

                  {/* Custom Stock Input */}
                  <div className="mt-3">
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stockQuantity}
                      onBlur={(e) => {
                        const newValue = parseInt(e.target.value);
                        if (!isNaN(newValue) && newValue !== product.stockQuantity) {
                          updateStock(product.id, newValue);
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] text-center focus:outline-none focus:border-[#E6C594]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1F1C19] border-b border-[#3A3125] p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#FAF6F0]">Add New Product</h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-[#C7B9A5] hover:text-[#FAF6F0]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Maharaja Royal Collection"
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Collection
                  </label>
                  <input
                    type="text"
                    value={newProduct.collection}
                    onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                    placeholder="e.g., Royal Collection"
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] focus:outline-none focus:border-[#E6C594]"
                  >
                    <option value="Bedsheets">Bedsheets</option>
                    <option value="Blankets">Blankets</option>
                    <option value="Comforters">Comforters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    placeholder="12999"
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stockQuantity || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="50"
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    placeholder="/products/collection/image.jpg"
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Luxurious bedsheet with premium cotton..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#1F1C19] border-t border-[#3A3125] p-6 flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="flex-1 py-3 bg-[#12100E] border border-[#3A3125] text-[#FAF6F0] rounded-lg hover:border-[#E6C594] transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={submitting || !newProduct.name || !newProduct.price || newProduct.stockQuantity < 0}
                className="flex-1 py-3 bg-[#E6C594] text-[#12100E] rounded-lg hover:bg-[#FAF6F0] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
