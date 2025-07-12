import { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
// Define types for our orders
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
  index?: number; // 👈 Add this line
}

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const { user } = useAuth();
  //console.log(user,'UserData');
  useEffect(() => {
    const fetchOrders = async () => {
      try {
         let apiUrl = user?.role === 'admin'
      ? 'http://localhost:8080/api/v1/order/'
      : `http://localhost:8080/api/v1/order/${user?.role}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        const mappedOrders: Order[] = data.map((order: any) => ({
          id: order._id,
          client: order.userId?.name || 'Unknown',
          clientType: order.userId?.business_type,
          items: order.item_details.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0),
          status: mapStatus(order.status),
          date: new Date(order.pickup_time).toLocaleDateString(),
          address: order.userId?.business_address,
          contactPerson: order.userId?.name || 'N/A',
          contactNumber: order.userId?.business_phone || 'N/A',
          notes: order.notes || 'N/A'
        }));

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async(orderId: string, newStatus: OrderStatus) => {
     setUpdateStatusLoading(true);
    console.log(newStatus,'newstatue');
  try {
    const response = await fetch(`http://localhost:8080/api/v1/order/update-status/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setModalOpen(false);
      setSelectedOrder(null);
    } else {
      console.error('Status update failed:', result.error);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setUpdateStatusLoading(false);
  }
  };

  const openOrderDetails = (order: Order, index: number) => {
    setSelectedOrder({ ...order, index });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
        {['admin', 'delivery'].includes(user?.role?.toLowerCase() ?? '') && (
        <button onClick={() => navigate('/orders/add')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm">
          <PlusCircle size={18} />
          <span>Add Manual Order</span>
        </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_process">In Process</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Skeleton loading
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order,index) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {order.client}
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.clientType === 'hospital' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                          : order.clientType === 'hotel'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
                      }`}>
                        {order.clientType}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-left flex gap-2">
                      {/* <button 
                        onClick={() => handleEdit(order)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                         <Edit size={18} />
                      </button>
                      | */}
                      <button 
                        onClick={() => openOrderDetails(order,index)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order #{(selectedOrder.index ?? 0) + 1}</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedOrder.clientType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className={`font-medium ${
                    selectedOrder.status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                    selectedOrder.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                    selectedOrder.status === 'picked_up' ? 'text-blue-600 dark:text-blue-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`}>
                    {selectedOrder.status === 'picked_up' ? 'Picked Up' : 
                     selectedOrder.status === 'in_process' ? 'Processing' : 
                     selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.date}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.contactNumber}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.items} items</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Any Instruction</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.notes}</p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'picked_up')}
                      disabled={updateStatusLoading}
                      className={`flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm ${
                        updateStatusLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {updateStatusLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      ) : (
                        <Check size={16} />
                      )}
                      <span>Mark as Picked Up</span>
                    </button>
                  )}
                  
                  {selectedOrder.status === 'picked_up' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'in_process')}
                      disabled={updateStatusLoading}
                      className={`flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm ${
                        updateStatusLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {updateStatusLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      ) : (
                        <Check size={16} />
                      )}
                      <span>Mark as Processing</span>
                    </button>
                  )}
                  
                  {selectedOrder.status === 'in_process' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                      disabled={updateStatusLoading}
                      className={`flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm ${
                        updateStatusLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {updateStatusLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      ) : (
                        <Check size={16} />
                      )}
                      <span>Mark as Completed</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Edit Client Modal */}
      
 
    </div>
  );
}

export default Orders;