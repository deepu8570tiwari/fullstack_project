import { useState, useEffect } from 'react';
import { Calendar, ClipboardList, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {mockClients } from '../utils/mockData';
type OrderStatus = 'picked_up' | 'completed' | 'in_process' | 'pending';
interface LaundryItem {
  item_name: string;
  quantity: number;
}
interface Order {
  _id: string; // ✅ Add this line
  id: string;
  client: string;
  clientType: 'hospital' | 'hotel' | 'salon';
  items: number;
  status: OrderStatus;
  date: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  notes: string;
  item_details: LaundryItem[];
  userId: string;
  delivery_person_id: string;
  business_type: string;
  pickup_time: string;
  delivery_time: string;
  business_name: string;
}
function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);
    useEffect(() => {
  const fetchOrders = async () => {
    try {
      let apiUrl =
        user?.role === 'admin'
          ? 'http://localhost:8080/api/v1/order/'
          : `http://localhost:8080/api/v1/order/${user?.role}`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      const mappedOrders: Order[] = data.map((order: any) => ({
        id: order._id,
        client: order.userId?.name || 'Unknown',
        clientType: order.userId?.business_type,
        items: order.item_details.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0
        ),
        status: mapStatus(order.status),
        date: new Date(order.pickup_time).toLocaleDateString(),
        address: order.userId?.business_address,
        contactPerson: order.userId?.name || 'N/A',
        contactNumber: order.userId?.business_phone || 'N/A',
        notes: order.notes || 'N/A'
      }));

      // ✅ Use mappedOrders directly
      const pending = mappedOrders.filter(order => order.status === 'pending').length;
      const completed = mappedOrders.filter(order => order.status === 'completed').length;
      const inProgress = mappedOrders.filter(
        order => order.status === 'picked_up' || order.status === 'in_process'
      ).length;

      setOrderStats({
        total: mappedOrders.length,
        pending,
        completed,
        inProgress
      });

      setOrders(mappedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  setTimeout(fetchOrders, 800);
}, []);



 const mapStatus = (status: string): OrderStatus => {
    switch (status.toLowerCase()) {
      case 'pickedup': return 'picked_up';
      case 'completed': return 'completed';
      case 'in_process': return 'in_process';
      default: return 'pending';
    }
  };
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
              
            </div>

             {['admin'].includes(user?.role?.toLowerCase() ?? '') && (
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
           
            </div>
             )}
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
                orders.slice(0, 5).map((order,index) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                      #{index + 1}
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