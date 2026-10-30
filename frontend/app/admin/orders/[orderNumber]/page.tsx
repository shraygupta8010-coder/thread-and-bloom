'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Truck, Package, CheckCircle, XCircle, Printer } from 'lucide-react';
import { getOrderById, updateOrderStatus as updateOrderStatusApi } from '@/lib/adminApi';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadOrder();
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      
      const data = await getOrderById(token, orderNumber);
      
      if (data.success && data.order) {
        setOrder(data.order);
        setNewStatus(data.order.order_status);
        setTrackingNumber(data.order.tracking_number || '');
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!newStatus) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      
      const data = await updateOrderStatusApi(token, orderNumber, {
        order_status: newStatus,
        tracking_number: trackingNumber || undefined
      });
      
      if (data.success) {
        alert('Order status updated successfully!');
        loadOrder();
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order');
    } finally {
      setUpdating(false);
    }
  };

  const printBill = () => {
    window.print();
  };

  const printBill = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12100E] flex items-center justify-center">
        <div className="text-[#C7B9A5]">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#12100E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#C7B9A5] mb-4">Order not found</p>
          <Link href="/admin/orders" className="text-[#E6C594] hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12100E]">
      {/* Header */}
      <header className="bg-[#1F1C19] border-b border-[#3A3125] sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders" className="text-[#C7B9A5] hover:text-[#E6C594]">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[#FAF6F0]">Order #{orderNumber}</h1>
                <p className="text-xs text-[#C7B9A5]">{order.customer_name}</p>
              </div>
            </div>
            <button
              onClick={printBill}
              className="flex items-center gap-2 px-4 py-2 bg-[#E6C594] text-[#12100E] rounded-lg hover:bg-[#FAF6F0] transition-colors font-semibold"
            >
              <Printer className="w-4 h-4" />
              Print Bill
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#FAF6F0] mb-4">Customer Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#C7B9A5] mb-1">Name</p>
                  <p className="text-[#FAF6F0] font-semibold">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-[#C7B9A5] mb-1">Phone</p>
                  <p className="text-[#FAF6F0] font-semibold">{order.customer_phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#C7B9A5] mb-1">Email</p>
                  <p className="text-[#FAF6F0] font-semibold">{order.customer_email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#C7B9A5] mb-1">Shipping Address</p>
                  <p className="text-[#FAF6F0] font-semibold">
                    {order.shipping_address}<br />
                    {order.locality && `${order.locality}, `}
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#FAF6F0] mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-[#3A3125] last:border-0">
                    <div className="w-20 h-20 bg-[#12100E] rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#FAF6F0] mb-1">{item.name}</h3>
                      <p className="text-xs text-[#C7B9A5] mb-2">
                        {item.size} • {item.colorName}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#C7B9A5]">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-[#E6C594]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-[#3A3125] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#C7B9A5]">Subtotal</span>
                  <span className="text-[#FAF6F0]">₹{order.subtotal?.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#C7B9A5]">Discount ({order.coupon_code})</span>
                    <span className="text-green-400">-₹{order.discount_amount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#C7B9A5]">Shipping</span>
                  <span className="text-[#FAF6F0]">
                    {order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#3A3125]">
                  <span className="text-[#FAF6F0]">Total</span>
                  <span className="text-[#E6C594]">₹{order.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status Update */}
          <div className="space-y-6 print:hidden">
            {/* Current Status */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#FAF6F0] mb-4">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Update Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] focus:outline-none focus:border-[#E6C594]"
                  >
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#C7B9A5] mb-2">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
                  />
                </div>

                <button
                  onClick={updateStatus}
                  disabled={updating}
                  className="w-full py-3 bg-[#E6C594] text-[#12100E] font-bold rounded-lg hover:bg-[#FAF6F0] transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Order Status'}
                </button>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#FAF6F0] mb-4">Payment Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#C7B9A5]">Method</span>
                  <span className="text-[#FAF6F0] font-semibold">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#C7B9A5]">Status</span>
                  <span className={`font-semibold ${
                    order.payment_status === 'PAID' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
                {order.razorpay_order_id && (
                  <div className="flex justify-between">
                    <span className="text-[#C7B9A5]">Transaction ID</span>
                    <span className="text-[#FAF6F0] font-mono text-xs">{order.razorpay_order_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
