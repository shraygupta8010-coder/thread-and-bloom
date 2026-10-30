'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastNotification from '@/components/ToastNotification';
import AuthModal from '@/components/AuthModal';
import { useTheme } from '@/hooks/useTheme';
import { useUserStore } from '@/store/userStore';

interface OrderItem {
  name: string;
  productName?: string;
  image: string;
  size?: string;
  colorName?: string;
  quantity: number;
  price: number;
}

interface Order {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  awb_code?: string;
  tracking_status?: string;
  courier_name?: string;
  created_at: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { theme, toggleTheme } = useTheme();
  const { profile, isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    if (isLoggedIn && profile?.phone) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, profile]);

  const fetchOrders = async () => {
    if (!profile?.phone) return;

    setLoading(true);
    setError('');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: profile.phone }),
      });

      const data = await res.json();

      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Failed to load orders');
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PLACED: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      CONFIRMED: 'bg-green-500/10 text-green-600 border-green-500/30',
      SHIPPED: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      DISPATCHED: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      OUT_FOR_DELIVERY: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
      DELIVERED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/30',
      PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    };
    return statusMap[status] || 'bg-gray-500/10 text-gray-600 border-gray-500/30';
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'PAID' ? 'text-green-600' : 'text-yellow-600';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getFirstProductImage = (items: OrderItem[]) => {
    return items[0]?.image || '/placeholder-product.jpg';
  };

  // Not logged in - show auth gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
        <ToastNotification message={toast.message} visible={toast.visible} />
        <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />

        <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-24">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E6C594]/10 border border-[#E6C594]/30 rounded-full">
              <span className="material-symbols-outlined text-4xl text-[#E6C594]">shopping_bag</span>
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium text-on-surface mb-3">
                My Orders
              </h1>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Sign in to view your order history and track deliveries
              </p>
            </div>

            <div className="bg-surface-container border border-[#E6C594]/20 p-8 sm:p-10 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#E6C594]/10 border border-[#E6C594]/30 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-[#E6C594]">person_outline</span>
              </div>
              <h2 className="text-xl font-serif text-on-surface mb-2">Sign In Required</h2>
              <p className="text-xs text-on-surface-variant mb-6">
                Please sign in to view your order history
              </p>
              <button
                onClick={openAuthModal}
                className="w-full bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] py-4 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                Sign In
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/track"
                className="bg-surface-container hover:bg-surface-container-low border border-outline-variant text-on-surface font-bold text-xs uppercase tracking-[0.2em] px-8 py-3 transition-colors"
              >
                Track Order (No Login)
              </Link>
              <Link
                href="/blankets"
                className="bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.2em] px-8 py-3 transition-all duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>

        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      </div>
    );
  }

  // Logged in - show orders
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <ToastNotification message={toast.message} visible={toast.visible} />
      <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#E6C594] text-[#12100E] flex items-center justify-center font-bold text-sm">
              {profile?.firstName ? profile.firstName[0].toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-on-surface">
                My Orders
              </h1>
              <p className="text-xs text-on-surface-variant">
                {profile?.firstName} {profile?.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-on-surface-variant">
            <li><Link href="/" className="hover:text-on-surface">Home</Link></li>
            <li>/</li>
            <li className="text-on-surface font-semibold">My Orders</li>
          </ol>
        </nav>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#E6C594]">progress_activity</span>
            <p className="text-sm text-on-surface-variant mt-4">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-error/10 border border-error/30 text-error px-6 py-4 text-sm flex items-start gap-3 mb-6">
            <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-container border border-outline-variant rounded-full mb-4">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_bag</span>
            </div>
            <h2 className="text-xl font-serif text-on-surface mb-2">No Orders Yet</h2>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping for luxury bedding!
            </p>
            <Link
              href="/blankets"
              className="inline-flex bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 transition-all duration-200"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.order_number}
                href={`/track?order=${order.order_number}&phone=${order.customer_phone}`}
                className="block bg-surface-container border border-outline-variant/70 hover:border-[#E6C594]/50 transition-all duration-200 overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-surface-container-low overflow-hidden">
                    <Image
                      src={getFirstProductImage(order.items)}
                      alt={order.items[0]?.name || 'Product'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {order.items.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-[#12100E]/80 text-[#FAF6F0] text-[10px] font-bold px-2 py-1">
                        +{order.items.length - 1} more
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Order Number</p>
                        <p className="font-mono font-bold text-lg text-on-surface">#{order.order_number}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.order_status)}`}>
                          {order.order_status.replace('_', ' ')}
                        </div>
                        {order.awb_code && (
                          <div className="flex items-center gap-1.5 text-[#E6C594] text-xs">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            <span className="font-semibold">Tracking Available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Order Date</p>
                        <p className="font-semibold text-on-surface">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Total Amount</p>
                        <p className="font-bold text-on-surface">₹{order.total_amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Payment</p>
                        <p className={`font-bold ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Method</p>
                        <p className="font-semibold text-on-surface">{order.payment_method}</p>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="pt-2 border-t border-outline-variant/30">
                      <p className="text-xs text-on-surface-variant mb-1.5">Items ({order.items.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-xs text-on-surface bg-surface-container-low px-2 py-1">
                            {item.name || item.productName} {item.size && `• ${item.size}`} × {item.quantity}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-xs text-on-surface-variant bg-surface-container-low px-2 py-1">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.awb_code && (
                      <div className="pt-2 border-t border-outline-variant/30">
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div>
                            <span className="text-on-surface-variant">Tracking:</span>
                            <span className="font-mono font-bold text-on-surface ml-2">{order.awb_code}</span>
                          </div>
                          {order.courier_name && (
                            <div>
                              <span className="text-on-surface-variant">Courier:</span>
                              <span className="font-semibold text-on-surface ml-2">{order.courier_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Hint */}
                    <div className="flex items-center gap-2 text-[#E6C594] group-hover:text-[#d4b07d] text-xs font-semibold transition-colors">
                      <span>Click to view details & track</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/blankets"
              className="flex-1 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] py-4 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
              Continue Shopping
            </Link>
            <Link
              href="/track"
              className="flex-1 bg-surface-container hover:bg-surface-container-low border border-outline-variant text-on-surface font-bold text-xs uppercase tracking-[0.2em] py-4 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              Track Another Order
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
