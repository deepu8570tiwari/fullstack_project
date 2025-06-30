import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Package } from 'lucide-react';

interface ScheduleItem {
  id: string;
  type: 'pickup' | 'delivery';
  client: string;
  address: string;
  time: string;
  items: number;
  status: 'upcoming' | 'in_progress' | 'completed';
  orderId: string;
}

const mockSchedule: ScheduleItem[] = [
  {
    id: 'S001',
    type: 'pickup',
    client: 'Grand Plaza Hotel',
    address: '123 Main Street, Downtown, NY 10001',
    time: '09:00 AM',
    items: 45,
    status: 'upcoming',
    orderId: 'D001'
  },
  {
    id: 'S002',
    type: 'delivery',
    client: 'City General Hospital',
    address: '456 Park Avenue, Midtown, NY 10022',
    time: '11:30 AM',
    items: 78,
    status: 'upcoming',
    orderId: 'D002'
  },
  {
    id: 'S003',
    type: 'pickup',
    client: 'Luxe Salon & Spa',
    address: '789 Broadway, SoHo, NY 10012',
    time: '02:00 PM',
    items: 22,
    status: 'upcoming',
    orderId: 'D003'
  }
];

function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 800);
  }, [selectedDate]);

  const updateItemStatus = (id: string, status: ScheduleItem['status']) => {
    setSchedule(schedule.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const getTypeColor = (type: string) => {
    return type === 'pickup' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Schedule</h1>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Package size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Stops</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{schedule.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Clock size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {schedule.filter(item => item.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <MapPin size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {schedule.filter(item => item.status !== 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Items */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : schedule.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No scheduled items for this date
          </div>
        ) : (
          schedule.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.client}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order #{item.orderId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{item.time}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.items} items</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.address}</p>
                </div>

                <div className="flex gap-3">
                  {item.status === 'upcoming' && (
                    <button
                      onClick={() => updateItemStatus(item.id, 'in_progress')}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm transition-colors duration-200"
                    >
                      Start {item.type}
                    </button>
                  )}
                  {item.status === 'in_progress' && (
                    <button
                      onClick={() => updateItemStatus(item.id, 'completed')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors duration-200"
                    >
                      Complete {item.type}
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200">
                    View Details
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

export default Schedule;