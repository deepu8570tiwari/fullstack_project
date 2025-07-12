import { useState, useEffect } from 'react';
import { Search, PlusCircle, Building, XCircle,Eye,ArrowUpCircle,Settings, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/modals/Subscriptions/DeleteSubscriptionHistoryModal';
import EditSubscriptionHistoryModal from '../components/modals/Subscriptions/EditSubscriptionHistoryModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

interface History {
  _id: string;
  userId: string;
  stripeSubscriptionId: string;
  planName: string;
  billingInterval: string;
  status: string;
  startDate: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: string;
}

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  userId: string;
}

function SubscriptionHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<History | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const decoded = jwtDecode<DecodedToken>(token);
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/v1/user-subscription/${decoded.userId}`, {
        });
        const json = await res.json();
        setHistory(json);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const filteredHistory = history.filter(history=>
    history.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (hist: History) => {
    setSelectedClient(hist);
    setEditModalOpen(true);
  };

  const handleDelete = (hist: History) => {
    setSelectedClient(hist);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/user-subscription/${selectedClient.stripeSubscriptionId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to Cancel the subscription');
      toast.success('Subscription Cancel successfully!');
      setHistory(prev => prev.filter(h => h._id !== selectedClient._id));
    } catch (err) {
      console.error(err);
      toast.error('Error Cancelling the subscription');
    } finally {
      setDeleteModalOpen(false);
      setSelectedClient(null);
    }
  };

  const handleSaveEdit = async (updatedHist: History) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/user-subscription/${updatedHist._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHist),
      });

      if (res.ok) {
        toast.success('Subscription updated successfully!');
        setHistory(prev => prev.map(h => (h._id === updatedHist._id ? updatedHist : h)));
        setEditModalOpen(false);
        setSelectedClient(null);
      } else {
        const errorText = await res.text();
        toast.error(`Failed to update subscription: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the subscription');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Subscription History</h1>
        <button onClick={() => navigate('/subscription-plans')} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm">
          <PlusCircle size={18} />
          <span>Add New Subscription</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your Subscription history..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No Subscriptions Found</td></tr>
              ) : (
                filteredHistory.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Building size={20} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.planName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                             {user.billingInterval.charAt(0).toUpperCase() + user.billingInterval.slice(1)}
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                         <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(user.currentPeriodEnd) < new Date() ? (
                              <span className="text-red-600 font-semibold">Expired</span>
                            ) : user.cancelAtPeriodEnd ? (
                              <span className="text-orange-500 font-semibold">
                                Cancels on {new Date(user.currentPeriodEnd).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            ) : (
                              <span className="text-green-600 font-semibold">Active</span>
                            )}

                            </div>

                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{new Date(user.startDate).toDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{new Date(user.currentPeriodEnd).toDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex gap-2">
                        {/* <button onClick={() => handleEdit(user)} className="text-primary hover:text-primary-dark dark:text-primary-light">
                          <Eye size={18} />
                        </button> */}
                        {!user.cancelAtPeriodEnd && (
                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-700 dark:text-red-400">
                          <XCircle  size={18} />
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={confirmDelete}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel the ${selectedClient?.planName} Plan? `}
      />

      {selectedClient && (
        <EditSubscriptionHistoryModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedClient(null);
          }}
          onSave={handleSaveEdit}
          edithistory={selectedClient}
        />
      )}
    </div>
  );
}

export default SubscriptionHistory;
