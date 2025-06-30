import { useState, useEffect } from 'react';
import { Package, MapPin, Phone, Clock, Check, X } from 'lucide-react';

interface DeliveryOrder {
  id: string;
  client: string;
  clientType: 'hospital' | 'hotel' | 'salon';
  items: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  pickupAddress: string;
  deliveryAddress: string;
  contactPerson: string;
  contactPhone: string;
  scheduledTime: string;
  notes?: string;
}

const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'D001',
    client: 'Grand Plaza Hotel',
    clientType: 'hotel',
    items: 45,
    status: 'assigned',
    pickupAddress: '123 Main Street, Downtown, NY 10001',
    deliveryAddress: '123 Main Street, Downtown, NY 10001',
    contactPerson: 'John Smith',
    contactPhone: '212-555-1234',
    scheduledTime: '2025-03-15 10:00 AM',
    notes: 'Use service entrance'
  },
  {
    id: 'D002',
    client: 'City General Hospital',
    clientType: 'hospital',
    items: 78,
    status: 'picked_up',
    pickupAddress: '456 Park Avenue, Midtown, NY 10022',
    deliveryAddress: '456 Park Avenue, Midtown, NY 10022',
    contactPerson: 'Sarah Johnson',
    contactPhone: '212-555-5678',
    scheduledTime: '2025-03-15 11:30 AM'
  }
];

function MyOrders() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered'>('all');

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockDeliveryOrders);
      setLoading(false);
    }, 800);
  }, []);

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const updateOrderStatus = async (orderId: string, newStatus: DeliveryOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'picked_up': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in_transit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned': return 'picked_up';
      case 'picked_up': return 'in_transit';
      case 'in_transit': return 'delivered';
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'picked_up': return 'Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Orders</h1>
        <div className="flex gap-2">
          {(['all', 'assigned', 'picked_up', 'in_transit', 'delivered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{order.client}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pickup/Delivery</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{order.contactPerson}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Time</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.scheduledTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Items</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.items} items</p>
                      </div>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      <strong>Note:</strong> {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status) as DeliveryOrder['status'])}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm transition-colors duration-200"
                    >
                      <Check size={16} />
                      <span>
                        Mark as {getStatusLabel(getNextStatus(order.status) || '')}
                      </span>
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200">
                    <Phone size={16} />
                    <span>Call Client</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrders;