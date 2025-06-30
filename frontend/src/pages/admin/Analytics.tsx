import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalClients: number;
  activeUsers: number;
  monthlyGrowth: number;
  ordersByType: { type: string; count: number; percentage: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        totalRevenue: 125000,
        totalOrders: 1250,
        totalClients: 85,
        activeUsers: 12,
        monthlyGrowth: 15.5,
        ordersByType: [
          { type: 'Hospital', count: 475, percentage: 38 },
          { type: 'Hotel', count: 563, percentage: 45 },
          { type: 'Salon', count: 212, percentage: 17 }
        ],
        revenueByMonth: [
          { month: 'Jan', revenue: 8500 },
          { month: 'Feb', revenue: 9200 },
          { month: 'Mar', revenue: 10800 },
          { month: 'Apr', revenue: 11500 },
          { month: 'May', revenue: 12300 },
          { month: 'Jun', revenue: 13100 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                ${data?.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-green-500 flex items-center">
              <TrendingUp size={12} className="mr-1" />
              {data?.monthlyGrowth}%
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {data?.totalOrders.toLocaleString()}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {data?.totalClients}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {data?.activeUsers}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <BarChart3 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Orders by Client Type</h3>
          <div className="space-y-4">
            {data?.ordersByType.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.type}</span>
                  <span className="text-gray-800 dark:text-white font-medium">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-purple-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Revenue Trend</h3>
          <div className="space-y-3">
            {data?.revenueByMonth.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.month}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  ${item.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;