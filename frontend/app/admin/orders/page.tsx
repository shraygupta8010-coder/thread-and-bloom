'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Download, Eye, Package, Truck } from 'lucide-react';
import { getAllOrders } from '@/lib/adminApi';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      
      const data = await getAllOrders(token);
      
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'ALL' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'SHIPPED': case 'OUT_FOR_DELIVERY': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'CONFIRMED': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'PLACED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

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
                <h1 className="text-xl font-bold text-[#FAF6F0]">Order Management</h1>
                <p className="text-xs text-[#C7B9A5]">{filteredOrders.length} orders</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C7B9A5]" />
              <input
                type="text"
                placeholder="Search by order number, customer name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] focus:outline-none focus:border-[#E6C594]"
            >
              <option value="ALL">All Orders</option>
              <option value="PLACED">Placed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-[#C7B9A5]">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-12 text-center">
            <Package className="w-12 h-12 text-[#6B6B6B] mx-auto mb-4" />
            <p className="text-[#C7B9A5]">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.order_number}
                href={`/admin/orders/${order.order_number}`}
                className="block bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6 hover:border-[#E6C594] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#FAF6F0]">
                        #{order.order_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-sm text-[#C7B9A5]">
                      <p>{order.customer_name}</p>
                      <p>{order.customer_phone} • {order.customer_email}</p>
                      <p className="mt-1">{order.city}, {order.state} - {order.pincode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#E6C594] mb-1">
                      ₹{order.total_amount?.toLocaleString()}
                    </div>
                    <div className="text-xs text-[#C7B9A5]">
                      {order.payment_method} • {order.payment_status}
                    </div>
                    <div className="text-xs text-[#6B6B6B] mt-1">
                      {order.items?.length || 0} items
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#C7B9A5] pt-4 border-t border-[#3A3125]">
                  <Eye className="w-4 h-4" />
                  <span>Click to view full details & update status</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
