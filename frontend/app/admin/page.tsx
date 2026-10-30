'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastNotification from '@/components/ToastNotification';
import { useTheme } from '@/hooks/useTheme';
import {
  fetchAdminOrders,
  updateOrderStatus,
  fetchOrderManifest,
  seedSampleOrdersApi,
  AdminOrder,
  DeliveryManifest,
  ProductItem,
  InventoryStats,
  fetchProducts,
  fetchInventoryStats,
  deleteProductApi,
  quickUpdateStockApi,
  fetchAdminPatrons,
  AdminPatron,
} from '@/lib/api';
import ShippingManifestModal from '@/components/ShippingManifestModal';
import ProductFormModal from '@/components/admin/ProductFormModal';
import { useProductsStore } from '@/store/productsStore';

type AdminTab = 'orders' | 'catalog' | 'inventory' | 'patrons';

export default function AdminPortalPage() {
  const { theme, toggleTheme } = useTheme();
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('ALL');
  const [ordersPaymentFilter, setOrdersPaymentFilter] = useState('ALL');

  // 3PL Manifest Modal State
  const [manifestModalOpen, setManifestModalOpen] = useState(false);
  const [currentManifest, setCurrentManifest] = useState<DeliveryManifest | null>(null);

  // Patron Directory Search
  const [patronSearch, setPatronSearch] = useState('');

  // Catalog & Inventory State
  const { products, setProducts, loadProducts: syncZustandProducts } = useProductsStore();
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Patrons State from Supabase Users & Orders Database
  const [dbPatrons, setDbPatrons] = useState<AdminPatron[]>([]);

  // UI Toast & Login
  const [toast, setToast] = useState({ message: '', visible: false });
  const [keyInput, setKeyInput] = useState('');

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3500);
  }, []);

  const loadAllAdminData = useCallback(async (key: string) => {
    setLoadingOrders(true);
    setCatalogLoading(true);

    try {
      // 1. Load orders directly from Supabase
      const ordersRes = await fetchAdminOrders(key);
      if (ordersRes.success) {
        setOrders(ordersRes.orders || []);
      } else {
        showToast(ordersRes.message || 'Authentication error.');
        sessionStorage.removeItem('tb_admin_key');
        setIsAuthenticated(false);
        return;
      }

      // 2. Load products directly from Supabase
      const productsRes = await fetchProducts();
      if (productsRes.success && productsRes.products) {
        setProducts(productsRes.products);
      }

      // 3. Load inventory stats directly from Supabase
      const statsRes = await fetchInventoryStats(key);
      if (statsRes.success && statsRes.stats) {
        setInventoryStats(statsRes.stats);
      }

      // 4. Load registered patrons directly from Supabase users & orders tables
      const patronsRes = await fetchAdminPatrons(key);
      if (patronsRes.success && patronsRes.patrons) {
        setDbPatrons(patronsRes.patrons);
      }
    } catch {
      showToast('Error connecting to concierge backend API.');
    } finally {
      setLoadingOrders(false);
      setCatalogLoading(false);
    }
  }, [setProducts, showToast]);

  useEffect(() => {
    const savedKey = typeof window !== 'undefined' ? sessionStorage.getItem('tb_admin_key') : null;
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
      loadAllAdminData(savedKey);
    }
  }, [loadAllAdminData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    const trimmed = keyInput.trim();
    sessionStorage.setItem('tb_admin_key', trimmed);
    setAdminKey(trimmed);
    setIsAuthenticated(true);
    loadAllAdminData(trimmed);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tb_admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setOrders([]);
    showToast('Signed out from concierge operations portal.');
  };

  // --- Orders Actions ---
  const handleStatusChange = async (orderNumber: string, status: string, type: 'order' | 'payment') => {
    try {
      const updates = type === 'order' ? { order_status: status } : { payment_status: status };
      const res = await updateOrderStatus(adminKey, orderNumber, updates);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_number === orderNumber
              ? {
                  ...o,
                  ...(type === 'order'
                    ? { order_status: status as AdminOrder['order_status'] }
                    : { payment_status: status as AdminOrder['payment_status'] }),
                }
              : o
          )
        );
        showToast(`Order #${orderNumber} updated to ${status}.`);
      } else {
        showToast(res.message || 'Update failed.');
      }
    } catch {
      showToast('Error updating status.');
    }
  };

  const handleOpenManifest = async (orderNumber: string) => {
    try {
      const res = await fetchOrderManifest(adminKey, orderNumber);
      if (res.success && res.manifest) {
        setCurrentManifest(res.manifest);
        setManifestModalOpen(true);
      } else {
        showToast(res.message || 'Could not load delivery manifest.');
      }
    } catch {
      showToast('Error fetching manifest.');
    }
  };

  const handleSeedOrders = async () => {
    setIsSeeding(true);
    try {
      const res = await seedSampleOrdersApi(adminKey);
      if (res.success) {
        showToast(res.message || 'Seeded 5 sample logistics orders!');
        await loadAllAdminData(adminKey);
      } else {
        showToast(res.message || 'Failed to seed sample orders.');
      }
    } catch {
      showToast('Error seeding sample orders.');
    } finally {
      setIsSeeding(false);
    }
  };

  // --- Catalog Actions ---
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: ProductItem) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}" from storefront?`)) {
      return;
    }
    try {
      const res = await deleteProductApi(adminKey, product.id);
      if (res.success) {
        showToast(`Product "${product.name}" removed from catalog.`);
        syncZustandProducts();
        loadAllAdminData(adminKey);
      } else {
        showToast(res.message || 'Failed to delete product.');
      }
    } catch {
      showToast('Error deleting product.');
    }
  };

  const handleQuickStock = async (product: ProductItem, delta: number) => {
    try {
      const newStock = Math.max(0, product.stockQuantity + delta);
      const res = await quickUpdateStockApi(adminKey, product.id, { stockQuantity: newStock });
      if (res.success) {
        setProducts(
          products.map((p) =>
            p.id === product.id ? { ...p, stockQuantity: newStock, inStock: newStock > 0 } : p
          )
        );
        showToast(`Stock updated: ${product.name} has ${newStock} units remaining.`);
        // Refresh stats
        const statsRes = await fetchInventoryStats(adminKey);
        if (statsRes.success && statsRes.stats) setInventoryStats(statsRes.stats);
      }
    } catch {
      showToast('Error adjusting stock.');
    }
  };

  const handleProductSaved = (savedProduct: ProductItem, isNew: boolean) => {
    showToast(
      isNew
        ? `"${savedProduct.name}" published to storefront!`
        : `"${savedProduct.name}" details updated successfully.`
    );
    syncZustandProducts();
    loadAllAdminData(adminKey);
  };

  // --- Computed Metrics ---
  const totalOrders = orders.length;
  const verifiedOnlineRevenue = orders
    .filter((o) => o.payment_status === 'PAID')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingCodOrders = orders.filter((o) => o.payment_method === 'COD' && o.order_status !== 'DELIVERED');
  const inTransitCount = orders.filter((o) => o.order_status === 'SHIPPED').length;

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return products.filter((p) => {
      if (catalogCategory !== 'All' && p.category.toLowerCase() !== catalogCategory.toLowerCase()) {
        return false;
      }
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, catalogCategory, catalogSearch]);

  // --- Aggregated Patron Directory ---
  const patronList = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      totalOrders: number;
      totalSpend: number;
      lastOrderDate: string;
      itemsBought: Array<{ name: string; size: string; quantity: number }>;
    }>();

    for (const order of orders) {
      const key = (order.customer_email || order.customer_phone || order.order_number).toLowerCase();
      const existing = map.get(key);

      const items = Array.isArray(order.items) ? order.items : [];
      const itemSummaries = items.map((it) => ({
        name: it.name,
        size: it.size,
        quantity: it.quantity,
      }));

      const orderAmount = Number(order.total_amount) || 0;

      if (!existing) {
        map.set(key, {
          id: key,
          name: order.customer_name || 'Anonymous Patron',
          email: order.customer_email || '—',
          phone: order.customer_phone || '—',
          address: order.shipping_address || '—',
          city: order.city || '—',
          state: order.state || '—',
          pincode: order.pin_code || order.pincode || '—',
          totalOrders: 1,
          totalSpend: orderAmount,
          lastOrderDate: order.created_at,
          itemsBought: itemSummaries,
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpend += orderAmount;
        if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.created_at;
          existing.address = order.shipping_address || existing.address;
          existing.city = order.city || existing.city;
        }
        existing.itemsBought.push(...itemSummaries);
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (ordersStatusFilter !== 'ALL' && o.order_status !== ordersStatusFilter) return false;
      if (ordersPaymentFilter !== 'ALL') {
        if (ordersPaymentFilter === 'COD' && o.payment_method !== 'COD') return false;
        if (ordersPaymentFilter === 'ONLINE' && o.payment_method === 'COD') return false;
      }
      if (ordersSearch.trim()) {
        const q = ordersSearch.toLowerCase();
        return (
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.toLowerCase().includes(q) ||
          (o.customer_email || '').toLowerCase().includes(q) ||
          (o.city || '').toLowerCase().includes(q) ||
          (o.pin_code || o.pincode || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, ordersStatusFilter, ordersPaymentFilter, ordersSearch]);

  const activePatronList = useMemo(() => {
    const source = dbPatrons.length > 0 ? dbPatrons : patronList;
    if (!patronSearch.trim()) return source;
    const q = patronSearch.toLowerCase();
    return source.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q))
    );
  }, [dbPatrons, patronList, patronSearch]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-200">
      <ToastNotification message={toast.message} visible={toast.visible} />
      <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-32 sm:pt-36 pb-24">
        {/* Title & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/40">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-1">
              Private Client Concierge &amp; 3PL Logistics Operations
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-on-surface">
              Operations &amp; Catalog Management
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase PostgreSQL Connected:</span>
                <span className="font-bold underline">orders</span>,
                <span className="font-bold underline">products</span>,
                <span className="font-bold underline">users</span>
              </span>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleOpenCreateProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6C594] text-[#12100E] font-bold text-xs uppercase tracking-wider hover:bg-[#d4b07d] transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>Add Product</span>
              </button>

              <button
                type="button"
                onClick={handleSeedOrders}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E6C594]/20 hover:bg-[#E6C594] text-[#12100E] dark:text-[#E6C594] hover:dark:text-[#12100E] border border-[#E6C594] text-xs uppercase tracking-wider font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-sm ${isSeeding ? 'animate-spin' : ''}`}>
                  {isSeeding ? 'progress_activity' : 'inventory_2'}
                </span>
                <span>{isSeeding ? 'Seeding...' : 'Seed 5 Orders'}</span>
              </button>

              <button
                type="button"
                onClick={() => loadAllAdminData(adminKey)}
                disabled={loadingOrders || catalogLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container border border-outline-variant text-xs uppercase tracking-wider font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-sm ${loadingOrders ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                Refresh
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-on-surface text-surface hover:bg-primary hover:text-on-primary text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto my-12 bg-surface-container border border-outline-variant/70 p-8 shadow-xl text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6C594]/20 text-[#E6C594] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <h2 className="text-xl font-serif font-medium text-on-surface mb-2">Concierge Key Authentication</h2>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Enter your master administrative key to inspect patron orders, manage catalog stock, and coordinate logistics dispatch.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter Concierge Access Key"
                className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface"
              />
              <button
                type="submit"
                className="w-full bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-colors cursor-pointer"
              >
                Unlock Operations Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex border-b border-outline-variant/60 gap-1 sm:gap-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#E6C594] text-[#E6C594]'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">local_shipping</span>
                <span>Orders &amp; 3PL Logistics</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high font-mono">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'border-[#E6C594] text-[#E6C594]'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">inventory</span>
                <span>Product Catalog CMS</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high font-mono">
                  {products.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'border-[#E6C594] text-[#E6C594]'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">analytics</span>
                <span>Stock &amp; Sales Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('patrons')}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'patrons'
                    ? 'border-[#E6C594] text-[#E6C594]'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">group</span>
                <span>Patron Directory</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high font-mono">
                  {dbPatrons.length > 0 ? dbPatrons.length : patronList.length}
                </span>
              </button>
            </div>

            {/* TAB 1: ORDERS & 3PL LOGISTICS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Metric KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Total Orders
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-on-surface">{totalOrders}</p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">Live across all channels</span>
                  </div>
                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Verified Online Revenue
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-[#2E7D32]">
                      ₹{verifiedOnlineRevenue.toLocaleString('en-IN')}.00
                    </p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">Captured via Razorpay</span>
                  </div>
                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Pending COD Collection
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-[#B8860B]">{pendingCodOrders.length}</p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">Awaiting doorstep remittance</span>
                  </div>
                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      In-Transit 3PL Shipments
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-[#1E88E5]">{inTransitCount}</p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">Delhivery / Blue Dart AWB active</span>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-surface-container border border-outline-variant/70 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-base font-serif font-medium text-on-surface">Patron Orders &amp; Logistics Manifests</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Track who ordered what, verify shipping coordinates, and print 3PL thermal waybills.
                      </p>
                    </div>

                    {/* Search & Status Filters */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                          search
                        </span>
                        <input
                          type="text"
                          value={ordersSearch}
                          onChange={(e) => setOrdersSearch(e.target.value)}
                          placeholder="Search orders, names, phones, cities..."
                          className="pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline-variant text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:border-[#E6C594] focus:outline-none w-56 sm:w-64"
                        />
                        {ordersSearch && (
                          <button
                            type="button"
                            onClick={() => setOrdersSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <select
                        value={ordersStatusFilter}
                        onChange={(e) => setOrdersStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:border-[#E6C594] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="PLACED">Placed</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped / In Transit</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      <select
                        value={ordersPaymentFilter}
                        onChange={(e) => setOrdersPaymentFilter(e.target.value)}
                        className="px-2.5 py-1.5 bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:border-[#E6C594] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">All Payments</option>
                        <option value="COD">COD Only</option>
                        <option value="ONLINE">Online Paid</option>
                      </select>

                      <span className="text-xs font-semibold px-2.5 py-1.5 bg-surface-container-low border border-outline-variant/60 text-on-surface">
                        {filteredOrders.length} of {orders.length}
                      </span>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-16 text-center text-on-surface-variant text-xs space-y-3">
                      <span className="material-symbols-outlined text-4xl block text-outline-variant">inbox</span>
                      <p>No orders recorded in database yet.</p>
                      <button
                        type="button"
                        onClick={handleSeedOrders}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6C594] text-[#12100E] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Load 5 Sample Logistics Orders
                      </button>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-on-surface-variant text-xs space-y-2">
                      <span className="material-symbols-outlined text-3xl block text-outline-variant">search_off</span>
                      <p>No orders match "{ordersSearch}" with current filter criteria.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setOrdersSearch('');
                          setOrdersStatusFilter('ALL');
                          setOrdersPaymentFilter('ALL');
                        }}
                        className="text-xs text-[#E6C594] underline font-semibold cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase tracking-wider text-on-surface-variant">
                          <tr>
                            <th className="py-3 px-4">Order # &amp; Date</th>
                            <th className="py-3 px-4">Patron &amp; Contact</th>
                            <th className="py-3 px-4">Destination &amp; Address</th>
                            <th className="py-3 px-4">3PL Courier &amp; AWB</th>
                            <th className="py-3 px-4">Payment &amp; Collect</th>
                            <th className="py-3 px-4">Order Status</th>
                            <th className="py-3 px-4 text-right">3PL Logistics Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                          {filteredOrders.map((order) => {
                            const isExpanded = expandedOrder === order.order_number;
                            const items = Array.isArray(order.items) ? order.items : [];
                            const firstItem = items[0] || {};
                            const courier =
                              firstItem.courier_partner ||
                              (order.order_status === 'SHIPPED' ? 'Delhivery Express' : 'Awaiting Manifest');
                            const awb = firstItem.awb_number || '';
                            const weight = firstItem.weight_kg ? `${firstItem.weight_kg} kg` : '~1.8 kg';

                            const cleanPhone = (order.customer_phone || '').replace(/\D/g, '');
                            const waMsg = encodeURIComponent(
                              `Greetings from Thread & Bloom Luxury Living. Your order #${order.order_number} (${order.order_status}) for ₹${Number(
                                order.total_amount
                              ).toLocaleString('en-IN')} is being fulfilled. Tracking AWB: ${awb || 'Pending'}.`
                            );
                            const waLink = `https://wa.me/91${cleanPhone}?text=${waMsg}`;

                            return (
                              <tr key={order.order_number} className="hover:bg-surface-container-high/40 transition-colors">
                                {/* Order # */}
                                <td className="py-4 px-4 font-mono whitespace-nowrap">
                                  <span className="font-bold text-on-surface block">#{order.order_number}</span>
                                  <span className="text-[10px] text-on-surface-variant block">
                                    {order.created_at
                                      ? new Date(order.created_at).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                        })
                                      : '—'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.order_number)}
                                    className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline mt-1 font-sans font-semibold cursor-pointer"
                                  >
                                    {isExpanded ? 'Hide Items' : `View ${items.length} Item(s)`}
                                    <span className="material-symbols-outlined text-[12px]">
                                      {isExpanded ? 'expand_less' : 'expand_more'}
                                    </span>
                                  </button>
                                </td>

                                {/* Patron */}
                                <td className="py-4 px-4">
                                  <p className="font-semibold text-on-surface">{order.customer_name}</p>
                                  <p className="text-[11px] text-on-surface-variant">{order.customer_phone}</p>
                                  <p className="text-[10px] text-on-surface-variant/80 truncate max-w-[150px]">
                                    {order.customer_email}
                                  </p>
                                </td>

                                {/* Destination */}
                                <td className="py-4 px-4 text-on-surface-variant max-w-[200px]">
                                  <p className="text-on-surface font-medium truncate">{order.shipping_address || '—'}</p>
                                  <p className="text-[10px]">
                                    {order.city}, {order.state} – {order.pin_code || order.pincode}
                                  </p>
                                </td>

                                {/* 3PL Courier & AWB */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="material-symbols-outlined text-[14px] text-[#E6C594]">
                                      local_shipping
                                    </span>
                                    <span className="font-semibold text-on-surface text-[11px]">{courier}</span>
                                  </div>
                                  {awb && awb !== 'PENDING-AWB' && awb !== 'PENDING-DISPATCH' ? (
                                    <span className="font-mono text-[10px] text-[#E6C594] bg-surface-container-lowest px-1.5 py-0.5 border border-outline-variant block w-fit">
                                      {awb}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-on-surface-variant italic">Unmanifested</span>
                                  )}
                                  <span className="text-[10px] text-on-surface-variant block mt-0.5">
                                    Pkg: {weight}
                                  </span>
                                </td>

                                {/* Payment */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span
                                      className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                        order.payment_method === 'COD'
                                          ? 'bg-amber-500/20 text-[#B8860B] border border-amber-500/40'
                                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                      }`}
                                    >
                                      {order.payment_method}
                                    </span>
                                    <span className="font-bold text-on-surface">
                                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <select
                                    value={order.payment_status}
                                    onChange={(e) =>
                                      handleStatusChange(order.order_number, e.target.value, 'payment')
                                    }
                                    className="block bg-surface-container-lowest border border-outline-variant px-1.5 py-0.5 text-[10px] text-on-surface outline-none cursor-pointer"
                                  >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="FAILED">FAILED</option>
                                  </select>
                                  {order.payment_method === 'COD' && (
                                    <span className="text-[9px] text-amber-500 font-semibold block mt-0.5">
                                      Collect: ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </td>

                                {/* Order Status */}
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <select
                                    value={order.order_status}
                                    onChange={(e) => handleStatusChange(order.order_number, e.target.value, 'order')}
                                    className="block bg-surface-container-lowest border border-outline-variant px-2 py-1 text-xs text-on-surface outline-none font-semibold cursor-pointer"
                                  >
                                    <option value="PLACED">PLACED</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="SHIPPED">SHIPPED / IN TRANSIT</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                  </select>
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenManifest(order.order_number)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#E6C594] text-[#12100E] hover:bg-[#d4b07d] text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                                    <span>3PL Slip</span>
                                  </button>

                                  {cleanPhone && (
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] text-white hover:bg-[#1EBE5D] text-[11px] font-bold rounded-xs transition-colors"
                                      title="WhatsApp Patron with order status"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">chat</span>
                                      WhatsApp
                                    </a>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCT CATALOG CMS */}
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                {/* Catalog Controls Header */}
                <div className="bg-surface-container border border-outline-variant/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
                        search
                      </span>
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Search product, SKU..."
                        className="w-full bg-surface-container-lowest border border-outline-variant pl-9 pr-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={catalogCategory}
                      onChange={(e) => setCatalogCategory(e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Comforters">Comforters</option>
                      <option value="Blankets">Blankets</option>
                      <option value="Bedsheets">Bedsheets</option>
                      <option value="Towels">Towels</option>
                      <option value="Duvets">Duvets</option>
                      <option value="Bedding Sets">Bedding Sets</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <span className="text-xs text-on-surface-variant font-medium">
                      Showing {filteredCatalog.length} products
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenCreateProduct}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6C594] text-[#12100E] font-bold text-xs uppercase tracking-wider hover:bg-[#d4b07d] transition-all cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add New Product
                    </button>
                  </div>
                </div>

                {/* Catalog Table */}
                <div className="bg-surface-container border border-outline-variant/70 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        <tr>
                          <th className="py-3 px-4">Item &amp; Image</th>
                          <th className="py-3 px-4">Category &amp; SKU</th>
                          <th className="py-3 px-4">Price / MRP</th>
                          <th className="py-3 px-4">Sizes &amp; Colors</th>
                          <th className="py-3 px-4">Inventory Stock</th>
                          <th className="py-3 px-4">Units Sold</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {filteredCatalog.map((product) => {
                          const isLowStock = product.stockQuantity <= 15;
                          const isOutOfStock = product.stockQuantity === 0;

                          return (
                            <tr key={product.id} className="hover:bg-surface-container-high/40 transition-colors">
                              {/* Product Thumbnail & Name */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-surface-container-lowest border border-outline-variant/60 flex-shrink-0 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-on-surface line-clamp-1">{product.name}</p>
                                    <p className="text-[10px] text-on-surface-variant line-clamp-1">
                                      {product.subtitle || product.collection}
                                    </p>
                                    {product.badge && (
                                      <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-bold text-[#E6C594] bg-[#E6C594]/10 px-1.5 py-0.2 border border-[#E6C594]/30">
                                        {product.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Category & SKU */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="font-semibold text-on-surface block">{product.category}</span>
                                <span className="text-[10px] font-mono text-on-surface-variant block">
                                  {product.sku}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-3 px-4 whitespace-nowrap font-mono">
                                <span className="font-bold text-on-surface block">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-[10px] text-on-surface-variant line-through block">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </td>

                              {/* Sizes & Colors */}
                              <td className="py-3 px-4 text-[10px] text-on-surface-variant">
                                <p className="font-medium text-on-surface truncate max-w-[140px]">
                                  {product.sizes?.join(', ') || 'Standard'}
                                </p>
                                <p className="truncate max-w-[140px]">
                                  {product.colors?.map((c) => c.name).join(', ') || 'Default'}
                                </p>
                              </td>

                              {/* Inventory Stock & Controls */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-mono font-bold text-sm ${
                                      isOutOfStock
                                        ? 'text-red-500'
                                        : isLowStock
                                        ? 'text-amber-500'
                                        : 'text-emerald-500'
                                    }`}
                                  >
                                    {product.stockQuantity}
                                  </span>
                                  <span className="text-[10px] text-on-surface-variant">units</span>

                                  {/* Quick +/- buttons */}
                                  <div className="flex items-center ml-2 border border-outline-variant bg-surface-container-lowest">
                                    <button
                                      type="button"
                                      onClick={() => handleQuickStock(product, -1)}
                                      disabled={product.stockQuantity <= 0}
                                      className="px-1.5 py-0.5 hover:bg-surface-container text-on-surface-variant hover:text-on-surface disabled:opacity-30 cursor-pointer"
                                      title="Reduce 1 unit"
                                    >
                                      -
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickStock(product, 5)}
                                      className="px-1.5 py-0.5 hover:bg-surface-container text-[#E6C594] font-bold cursor-pointer"
                                      title="Add 5 units"
                                    >
                                      +5
                                    </button>
                                  </div>
                                </div>
                                <span
                                  className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider ${
                                    isOutOfStock
                                      ? 'text-red-500'
                                      : isLowStock
                                      ? 'text-amber-500'
                                      : 'text-emerald-500'
                                  }`}
                                >
                                  {isOutOfStock ? 'Sold Out' : isLowStock ? 'Low Stock Warning' : 'In Stock'}
                                </span>
                              </td>

                              {/* Units Sold */}
                              <td className="py-3 px-4 font-mono whitespace-nowrap">
                                <span className="font-semibold text-on-surface">{product.unitsSold}</span>
                                <span className="text-[10px] text-on-surface-variant block">
                                  ₹{((product.unitsSold || 0) * product.price).toLocaleString('en-IN')} rev
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                                {/* Live store link */}
                                <Link
                                  href={
                                    product.category.toLowerCase().includes('comforter')
                                      ? '/comforters'
                                      : '/blankets'
                                  }
                                  target="_blank"
                                  className="inline-flex items-center p-1.5 text-on-surface-variant hover:text-[#E6C594] transition-colors"
                                  title="View Live on Storefront"
                                >
                                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                </Link>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(product)}
                                  className="inline-flex items-center p-1.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                                  title="Edit Product Details & Specs"
                                >
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(product)}
                                  className="inline-flex items-center p-1.5 text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer"
                                  title="Remove from Catalog"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STOCK & SALES ANALYTICS */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                {/* Analytics KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Total Inventory Asset Value
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-[#E6C594]">
                      ₹{(inventoryStats?.totalValuation || 0).toLocaleString('en-IN')}.00
                    </p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">
                      Across {inventoryStats?.totalStockUnits || 0} active units in warehouse
                    </span>
                  </div>

                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Total Units Sold
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-on-surface">
                      {inventoryStats?.totalUnitsSold || 0} units
                    </p>
                    <span className="text-[10px] text-emerald-500 mt-1 block font-semibold">
                      ₹{(inventoryStats?.totalSalesRevenue || 0).toLocaleString('en-IN')} cumulative sales
                    </span>
                  </div>

                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Low Stock Alerts (&le; 15 units)
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-amber-500">
                      {inventoryStats?.lowStockCount || 0} SKUs
                    </p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">Immediate reorder required</span>
                  </div>

                  <div className="bg-surface-container border border-outline-variant/60 p-5">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">
                      Out of Stock
                    </span>
                    <p className="text-2xl sm:text-3xl font-serif font-medium text-red-500">
                      {inventoryStats?.outOfStockCount || 0} SKUs
                    </p>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">Customer backorders disabled</span>
                  </div>
                </div>

                {/* Stock Left vs Units Sold Detailed Breakdown Table */}
                <div className="bg-surface-container border border-outline-variant/70 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-serif font-medium text-on-surface">
                        Stock Remaining vs Units Sold Velocity
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Live comparison of remaining stock depth against sales numbers for each individual product.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        <tr>
                          <th className="py-3 px-4">Product Name &amp; SKU</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Stock Remaining</th>
                          <th className="py-3 px-4">Units Sold</th>
                          <th className="py-3 px-4">Sales vs Stock Velocity</th>
                          <th className="py-3 px-4">Inventory Valuation</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {products.map((p) => {
                          const total = p.stockQuantity + p.unitsSold;
                          const soldPercentage = total > 0 ? Math.round((p.unitsSold / total) * 100) : 0;
                          const valuation = p.stockQuantity * p.price;

                          return (
                            <tr key={p.id} className="hover:bg-surface-container-high/40 transition-colors">
                              <td className="py-3 px-4">
                                <p className="font-semibold text-on-surface">{p.name}</p>
                                <p className="text-[10px] font-mono text-on-surface-variant">{p.sku}</p>
                              </td>
                              <td className="py-3 px-4 text-on-surface-variant">{p.category}</td>
                              <td className="py-3 px-4 font-mono font-bold text-on-surface">
                                <span
                                  className={
                                    p.stockQuantity === 0
                                      ? 'text-red-500'
                                      : p.stockQuantity <= 15
                                      ? 'text-amber-500'
                                      : 'text-emerald-500'
                                  }
                                >
                                  {p.stockQuantity} units
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-on-surface font-semibold">
                                {p.unitsSold} sold
                              </td>
                              <td className="py-3 px-4 w-48">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-on-surface-variant">{soldPercentage}% sold</span>
                                    <span className="text-on-surface-variant">{p.stockQuantity} left</span>
                                  </div>
                                  <div className="w-full bg-surface-container-lowest h-2 overflow-hidden border border-outline-variant/50">
                                    <div
                                      className="bg-[#E6C594] h-full"
                                      style={{ width: `${Math.min(100, soldPercentage)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-on-surface">
                                ₹{valuation.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleQuickStock(p, 10)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-[11px] font-bold text-[#E6C594] transition-colors cursor-pointer"
                                >
                                  +10 Restock
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PATRON DIRECTORY */}
            {activeTab === 'patrons' && (
              <div className="space-y-6">
                <div className="bg-surface-container border border-outline-variant/70 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-base font-serif font-medium text-on-surface">Private Client Patron Directory</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Connected directly to Supabase <code className="text-[#E6C594] font-mono">users</code> &amp; <code className="text-[#E6C594] font-mono">orders</code> tables.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                          search
                        </span>
                        <input
                          type="text"
                          value={patronSearch}
                          onChange={(e) => setPatronSearch(e.target.value)}
                          placeholder="Search patrons, emails, phones, cities..."
                          className="pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline-variant text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:border-[#E6C594] focus:outline-none w-56 sm:w-64"
                        />
                        {patronSearch && (
                          <button
                            type="button"
                            onClick={() => setPatronSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <span className="text-xs font-semibold px-2.5 py-1.5 bg-surface-container-low border border-outline-variant/60 text-on-surface">
                        {activePatronList.length} of {(dbPatrons.length > 0 ? dbPatrons : patronList).length} patrons
                      </span>
                    </div>
                  </div>

                  {activePatronList.length === 0 ? (
                    <div className="p-12 text-center text-on-surface-variant text-xs space-y-2">
                      <span className="material-symbols-outlined text-3xl block text-outline-variant">person_search</span>
                      <p>No patrons match "{patronSearch}".</p>
                      <button
                        type="button"
                        onClick={() => setPatronSearch('')}
                        className="text-xs text-[#E6C594] underline font-semibold cursor-pointer"
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase tracking-wider text-on-surface-variant">
                          <tr>
                            <th className="py-3 px-4">Patron Name</th>
                            <th className="py-3 px-4">Contact Information</th>
                            <th className="py-3 px-4">Delivery Residence</th>
                            <th className="py-3 px-4">Orders Placed</th>
                            <th className="py-3 px-4">Lifetime Value (LTV)</th>
                            <th className="py-3 px-4">Last Order Date</th>
                            <th className="py-3 px-4 text-right">Concierge Contact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                          {activePatronList.map((patron) => {
                          const cleanPhone = patron.phone.replace(/\D/g, '');
                          const waLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                            `Greetings ${patron.name}, this is your Thread & Bloom Luxury Concierge.`
                          )}`;

                          return (
                            <tr key={patron.id} className="hover:bg-surface-container-high/40 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-[#E6C594]/20 text-[#E6C594] font-bold flex items-center justify-center font-serif text-xs">
                                    {patron.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-on-surface text-sm">{patron.name}</span>
                                </div>
                              </td>

                              <td className="py-4 px-4">
                                <p className="font-mono text-on-surface text-[11px]">{patron.phone}</p>
                                <p className="text-on-surface-variant text-[10px] truncate max-w-[180px]">
                                  {patron.email}
                                </p>
                              </td>

                              <td className="py-4 px-4 max-w-[240px]">
                                <p className="text-on-surface truncate">{patron.address}</p>
                                <p className="text-on-surface-variant text-[10px]">
                                  {patron.city}, {patron.state} – {patron.pincode}
                                </p>
                              </td>

                              <td className="py-4 px-4 font-mono whitespace-nowrap">
                                <span className="font-bold text-on-surface">{patron.totalOrders} order(s)</span>
                              </td>

                              <td className="py-4 px-4 font-mono font-bold text-[#2E7D32] whitespace-nowrap">
                                ₹{patron.totalSpend.toLocaleString('en-IN')}.00
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap text-on-surface-variant text-[11px]">
                                {patron.lastOrderDate
                                  ? new Date(patron.lastOrderDate).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : '—'}
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                                {cleanPhone && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white hover:bg-[#1EBE5D] text-[11px] font-bold rounded-xs transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[13px]">chat</span>
                                    WhatsApp
                                  </a>
                                )}
                                {patron.email && patron.email !== '—' && (
                                  <a
                                    href={`mailto:${patron.email}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[13px]">mail</span>
                                    Email
                                  </a>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        adminKey={adminKey}
        initialProduct={editingProduct}
        onSaved={handleProductSaved}
      />

      {/* 3PL Delivery Manifest & Shipping Slip Modal */}
      <ShippingManifestModal
        isOpen={manifestModalOpen}
        onClose={() => {
          setManifestModalOpen(false);
          setCurrentManifest(null);
        }}
        manifest={currentManifest}
        adminKey={adminKey}
        onDispatched={() => {
          loadAllAdminData(adminKey);
          if (currentManifest?.orderNumber) {
            handleOpenManifest(currentManifest.orderNumber);
          }
        }}
      />

      <Footer />
    </div>
  );
}
