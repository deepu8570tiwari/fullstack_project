import { useState, useEffect } from 'react';
import { Calendar, ClipboardList, TrendingUp, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { mockOrders, mockClients } from '../utils/mockData';
function Dashboard() {
  
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API data loading
    setTimeout(() => {
      const pending = mockOrders.filter(order => order.status === 'pending').length;
      const completed = mockOrders.filter(order => order.status === 'completed').length;
      const inProgress = mockOrders.filter(order => 
        order.status === 'picked_up' || order.status === 'in_process'
      ).length;
      
      setOrderStats({
        total: mockOrders.length,
        pending,
        completed,
        inProgress
      });
      
      setLoading(false);
    }, 800);
    
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Skeleton loaders for stats
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{orderStats.total}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ClipboardList size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-green-500 flex items-center">
                  <ArrowUp size={12} className="mr-1" />
                  12%
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">vs last week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Pickups</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{orderStats.pending}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-red-500 flex items-center">
                  <ArrowDown size={12} className="mr-1" />
                  3%
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">vs last week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{orderStats.inProgress}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-green-500 flex items-center">
                  <ArrowUp size={12} className="mr-1" />
                  8%
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">vs last week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{mockClients.length}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-green-500 flex items-center">
                  <ArrowUp size={12} className="mr-1" />
                  4%
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Skeleton loaders for table rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                  </tr>
                ))
              ) : (
                mockOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {order.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : order.status === 'picked_up'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {order.status === 'picked_up' ? 'Picked Up' : 
                         order.status === 'in_process' ? 'Processing' : 
                         order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {order.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <a href="/orders" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">View all orders</a>
        </div>
      </div>

      {/* Client Distribution & Performance Stats */}
       {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Client Distribution</h2>
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Hospitals</span>
                <span className="text-gray-800 dark:text-white font-medium">38%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Hotels</span>
                <span className="text-gray-800 dark:text-white font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Salons</span>
                <span className="text-gray-800 dark:text-white font-medium">17%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Your Performance</h2>
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">On-Time Delivery</span>
                <span className="text-gray-800 dark:text-white font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Client Satisfaction</span>
                <span className="text-gray-800 dark:text-white font-medium">88%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Orders Completed</span>
                <span className="text-gray-800 dark:text-white font-medium">95%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div> 
  );
}

export default Dashboard;