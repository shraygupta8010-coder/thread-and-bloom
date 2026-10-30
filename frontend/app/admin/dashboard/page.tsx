'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  AlertCircle,
  Users,
  IndianRupee,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { getDashboardStats, getAllOrders, DashboardStats } from '@/lib/adminApi';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      
      // Fetch stats
      const statsData = await getDashboardStats(token);
      
      if (statsData.success && statsData.stats) {
        setStats(statsData.stats);
      }

      // Fetch recent orders
      const ordersData = await getAllOrders(token);
      
      if (ordersData.success && ordersData.orders) {
        setRecentOrders(ordersData.orders.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12100E] flex items-center justify-center">
        <div className="text-[#E6C594]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12100E]">
      {/* Header */}
      <header className="bg-[#1F1C19] border-b border-[#3A3125] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#FAF6F0]">Thread & Bloom Admin</h1>
            <p className="text-xs text-[#C7B9A5]">Inventory & Order Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadDashboard}
              className="p-2 text-[#C7B9A5] hover:text-[#E6C594] transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#12100E] text-[#C7B9A5] hover:text-red-400 border border-[#3A3125] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-[#C7B9A5]">All Time</span>
            </div>
            <div className="text-3xl font-bold text-[#FAF6F0] mb-1">
              {stats?.totalOrders || 0}
            </div>
            <div className="text-sm text-[#C7B9A5]">Total Orders</div>
          </div>

          {/* Pending Orders */}
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <Link 
                href="/admin/orders?status=pending"
                className="text-xs text-[#E6C594] hover:underline"
              >
                View →
              </Link>
            </div>
            <div className="text-3xl font-bold text-[#FAF6F0] mb-1">
              {stats?.pendingOrders || 0}
            </div>
            <div className="text-sm text-[#C7B9A5]">Pending Orders</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-[#C7B9A5]">All Time</span>
            </div>
            <div className="text-3xl font-bold text-[#FAF6F0] mb-1">
              ₹{((stats?.totalRevenue || 0) / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-[#C7B9A5]">Total Revenue</div>
          </div>

          {/* Low Stock */}
          <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-red-400" />
              </div>
              <Link 
                href="/admin/inventory?lowStock=true"
                className="text-xs text-[#E6C594] hover:underline"
              >
                View →
              </Link>
            </div>
            <div className="text-3xl font-bold text-[#FAF6F0] mb-1">
              {stats?.lowStockProducts || 0}
            </div>
            <div className="text-sm text-[#C7B9A5]">Low Stock Items</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-[#1F1C19] border border-[#3A3125] hover:border-[#E6C594] rounded-xl p-6 transition-colors group"
          >
            <ShoppingBag className="w-8 h-8 text-[#E6C594] mb-3" />
            <h3 className="text-lg font-bold text-[#FAF6F0] mb-1 group-hover:text-[#E6C594]">
              Manage Orders
            </h3>
            <p className="text-sm text-[#C7B9A5]">
              View, update & track all customer orders
            </p>
          </Link>

          <Link
            href="/admin/inventory"
            className="bg-[#1F1C19] border border-[#3A3125] hover:border-[#E6C594] rounded-xl p-6 transition-colors group"
          >
            <Package className="w-8 h-8 text-[#E6C594] mb-3" />
            <h3 className="text-lg font-bold text-[#FAF6F0] mb-1 group-hover:text-[#E6C594]">
              Update Inventory
            </h3>
            <p className="text-sm text-[#C7B9A5]">
              Manage stock levels & product details
            </p>
          </Link>

          <Link
            href="/admin/products/add"
            className="bg-[#1F1C19] border border-[#3A3125] hover:border-[#E6C594] rounded-xl p-6 transition-colors group"
          >
            <TrendingUp className="w-8 h-8 text-[#E6C594] mb-3" />
            <h3 className="text-lg font-bold text-[#FAF6F0] mb-1 group-hover:text-[#E6C594]">
              Add New Product
            </h3>
            <p className="text-sm text-[#C7B9A5]">
              Upload new items to your catalog
            </p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#FAF6F0]">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[#E6C594] hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-[#C7B9A5]">
              No orders yet
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.order_number}
                  href={`/admin/orders/${order.order_number}`}
                  className="block p-4 bg-[#12100E] border border-[#3A3125] rounded-lg hover:border-[#E6C594] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#FAF6F0]">
                        #{order.order_number}
                      </div>
                      <div className="text-sm text-[#C7B9A5] mt-1">
                        {order.customer_name} • ₹{order.total_amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.order_status === 'DELIVERED' ? 'bg-green-500/10 text-green-400' :
                        order.order_status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400' :
                        order.order_status === 'PLACED' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {order.order_status}
                      </span>
                      <div className="text-xs text-[#C7B9A5] mt-1">
                        {order.payment_method}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
