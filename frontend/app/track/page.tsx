'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastNotification from '@/components/ToastNotification';
import { useTheme } from '@/hooks/useTheme';

interface TrackingInfo {
  orderNumber: string;
  customerName: string;
  orderStatus: string;
  paymentStatus: string;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  orderDate: string;
  totalAmount: number;
  items: any[];
  shippingAddress: string;
}

function TrackOrderContent() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', visible: false });

  // Auto-fill from URL parameters
  useEffect(() => {
    const orderParam = searchParams.get('order');
    const phoneParam = searchParams.get('phone');
    
    if (orderParam) {
      setOrderNumber(orderParam);
    }
    if (phoneParam) {
      setPhone(phoneParam);
    }

    // Auto-track if both params present
    if (orderParam && phoneParam) {
      setTimeout(() => {
        handleTrackWithParams(orderParam, phoneParam);
      }, 500);
    }
  }, [searchParams]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleTrackWithParams = async (order: string, phoneNum: string) => {
    setError('');
    setTrackingInfo(null);
    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderNumber: order.trim().toUpperCase(),
          phone: phoneNum.trim()
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setTrackingInfo({
          orderNumber: data.order.order_number,
          customerName: data.order.customer_name,
          orderStatus: data.order.order_status,
          paymentStatus: data.order.payment_status,
          trackingNumber: data.order.awb_code,
          courierName: data.order.courier_name,
          estimatedDelivery: data.order.estimated_delivery_date,
          orderDate: data.order.created_at,
          totalAmount: data.order.total_amount,
          items: data.order.items || [],
          shippingAddress: data.order.shipping_address,
        });
      } else {
        setError(data.message || 'Order not found. Please check your order number and phone number.');
      }
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTrackWithParams(orderNumber, phone);
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <ToastNotification message={toast.message} visible={toast.visible} />
      <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-on-surface-variant">
            <li><Link href="/" className="hover:text-on-surface">Home</Link></li>
            <li>/</li>
            <li className="text-on-surface font-semibold">Track Order</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6C594]/10 border border-[#E6C594]/30 rounded-full mb-4">
            <span className="material-symbols-outlined text-3xl text-[#E6C594]">local_shipping</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-on-surface mb-3">
            Track Your Order
          </h1>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Enter your order number and phone number to track your luxury bedding delivery
          </p>
        </div>

        {/* Track Form */}
        {!trackingInfo && (
          <div className="bg-surface-container border border-outline-variant/70 p-8 sm:p-10 max-w-lg mx-auto">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-medium">
                  Order Number <span className="text-error">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="TB-123456"
                  className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors uppercase"
                />
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Found in your order confirmation email
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-medium">
                  Phone Number <span className="text-error">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                />
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Phone number used during order placement
                </p>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/30 text-error px-4 py-3 text-sm flex items-start gap-2">
                  <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E6C594] hover:bg-[#d4b07d] disabled:bg-[#E6C594]/50 text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] py-4 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    Tracking...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">search</span>
                    Track My Order
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tracking Results */}
        {trackingInfo && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Order Header */}
            <div className="bg-surface-container border border-[#E6C594]/20 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/30">
                <div>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Order Number</p>
                  <p className="text-xl font-bold text-on-surface">#{trackingInfo.orderNumber}</p>
                </div>
                <div className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider ${getStatusColor(trackingInfo.orderStatus)}`}>
                  {trackingInfo.orderStatus.replace('_', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Customer</p>
                  <p className="text-on-surface font-medium">{trackingInfo.customerName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Order Date</p>
                  <p className="text-on-surface font-medium">{formatDate(trackingInfo.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Payment Status</p>
                  <p className={`font-bold ${trackingInfo.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {trackingInfo.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Total Amount</p>
                  <p className="text-on-surface font-bold">₹{trackingInfo.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {trackingInfo.trackingNumber ? (
              <div className="bg-gradient-to-br from-[#E6C594]/10 to-[#E6C594]/5 border border-[#E6C594]/30 p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E6C594] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-[#12100E]">local_shipping</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">Live Shipment Tracking</h2>
                    <p className="text-xs text-on-surface-variant">Real-time delivery updates</p>
                  </div>
                </div>

                {/* Tracking Details Card */}
                <div className="bg-surface-container border border-outline-variant/50 p-5 mb-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant">Tracking Number (AWB)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-on-surface">{trackingInfo.trackingNumber}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(trackingInfo.trackingNumber || '');
                          showToast('Tracking number copied!');
                        }}
                        className="text-[#E6C594] hover:text-[#d4b07d] transition-colors"
                        title="Copy tracking number"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </div>

                  {trackingInfo.courierName && (
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-wider text-on-surface-variant">Courier Partner</span>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-[#E6C594]">local_shipping</span>
                        <span className="font-semibold text-on-surface">{trackingInfo.courierName}</span>
                      </div>
                    </div>
                  )}

                  {trackingInfo.estimatedDelivery && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs uppercase tracking-wider text-on-surface-variant">Estimated Delivery</span>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-green-600">event</span>
                        <span className="font-bold text-green-600">{formatDate(trackingInfo.estimatedDelivery)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Tracking Buttons */}
                <div className="space-y-3">
                  {/* Primary Shiprocket Tracking */}
                  <a
                    href={`https://shiprocket.co/tracking/${trackingInfo.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-sm uppercase tracking-[0.15em] py-4 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-md hover:shadow-xl relative overflow-hidden"
                  >
                    <span className="material-symbols-outlined text-xl">location_on</span>
                    <span>Get Live Location Updates</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </a>

                  {/* Track Shipment Details */}
                  <a
                    href={`https://shiprocket.co/tracking/${trackingInfo.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-2 border-on-surface hover:border-primary"
                  >
                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                    <span>View Shipment Journey</span>
                    <span className="material-symbols-outlined text-lg">open_in_new</span>
                  </a>
                </div>

                {/* Info Notice */}
                <div className="mt-6 bg-surface-container-low border-l-4 border-[#E6C594] p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#E6C594] text-xl flex-shrink-0">info</span>
                  <div className="text-xs text-on-surface-variant leading-relaxed">
                    <p className="font-semibold text-on-surface mb-1">Real-time tracking available</p>
                    <p>Click "Get Live Location Updates" to see your package's exact location, movement history, and estimated arrival time on Shiprocket's live tracking map.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* No Tracking Yet */
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-3xl text-yellow-600 flex-shrink-0">schedule</span>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface mb-2">Tracking Number Being Generated</h3>
                    <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                      Your order has been confirmed and is being prepared for shipment. The tracking number (AWB) will be assigned within 24 hours once the courier picks up your package.
                    </p>
                    <div className="bg-surface-container border border-outline-variant/50 p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                        <span className="text-on-surface">Order Confirmed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-yellow-600">pending</span>
                        <span className="text-on-surface">Awaiting Courier Pickup</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-on-surface-variant">local_shipping</span>
                        <span className="text-on-surface-variant">Tracking Available Soon</span>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-4">
                      📧 You'll receive an email with tracking details once your shipment is dispatched.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-surface-container border border-outline-variant/70 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                Delivery Address
              </h3>
              <p className="text-sm text-on-surface leading-relaxed">
                {trackingInfo.shippingAddress}
              </p>
            </div>

            {/* Order Items */}
            {trackingInfo.items && trackingInfo.items.length > 0 && (
              <div className="bg-surface-container border border-outline-variant/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
                  Order Items ({trackingInfo.items.length})
                </h3>
                <div className="space-y-3">
                  {trackingInfo.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/20 last:border-0">
                      <div>
                        <p className="font-medium text-on-surface">{item.name || item.productName}</p>
                        <p className="text-xs text-on-surface-variant">
                          {item.size && `Size: ${item.size}`} {item.colorName && `• ${item.colorName}`} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-on-surface">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setTrackingInfo(null);
                  setOrderNumber('');
                  setPhone('');
                  setError('');
                }}
                className="flex-1 bg-surface-container hover:bg-surface-container-low border border-outline-variant text-on-surface font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Track Another Order
              </button>
              <Link
                href="/blankets"
                className="flex-1 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-16 text-center">
          <p className="text-xs text-on-surface-variant mb-2">Need help with your order?</p>
          <Link href="/contact" className="text-sm text-[#E6C594] hover:text-[#d4b07d] font-semibold underline underline-offset-4">
            Contact Support
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}


export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#E6C594]">progress_activity</span>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
