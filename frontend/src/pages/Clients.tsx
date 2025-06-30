import { useState, useEffect } from 'react';
import { Search, PlusCircle, MapPin, Phone, Mail, Building, Trash, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/modals/Clients/DeleteConfirmationModal';
import EditClientModal from '../components/modals/Clients/EditClientModal';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface ClientProfile {
   _id:string;
  business_name: string;
  business_type: 'hospital' | 'hotel' | 'salon';
  business_address: string;
  name: string;
  email: string;
  business_phone: string;
}

interface BusinessType {
  _id:string;
  business_type:string;
}

function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [businesstype,setBusinesstype]=useState<BusinessType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hospital' | 'hotel' | 'salon'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  useEffect(() => {
    // Simulate loading clients from an API
    setTimeout(() => {
     fetch('http://localhost:8080/api/v1/clients/')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error(err));
      setLoading(false);
    }, 800);
    const fetchItemsTypes = async () => {
        try {
          const token = localStorage.getItem('authToken');
          setLoading(true);
          const res = await fetch('http://localhost:8080/api/v1/business-type/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          const json = await res.json();
          setBusinesstype(json.data); // ✅ Set the latest data
        } catch (err) {
          console.error('Failed to load Business Type:', err);
        } finally {
          setLoading(false); // ✅ Always hide loader after fetch completes
        }
      };
      // Delay fetch for UX purposes (if needed)
      const timeout = setTimeout(fetchItemsTypes, 800);
      return () => clearTimeout(timeout); // cleanup if unmounted early
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || client.business_type === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleEdit = (client: ClientProfile) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  const handleDelete = (client: ClientProfile) => {
    setSelectedClient(client);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (client: ClientProfile) => {
    if (!selectedClient) return;
  try {
    const res = await fetch(`http://localhost:8080/api/v1/clients/${selectedClient._id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete client');
    }
    toast.success('Client deleted successfully!');
    setClients(prev => prev.filter(client => client._id !== selectedClient._id));
  } catch (err) {
    console.error(err);
    toast.error('Error deleting client');
  } finally {
    setDeleteModalOpen(false);
    setSelectedClient(null);
  }
  };

  const handleSaveEdit = async (updatedClient: ClientProfile) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/clients/${updatedClient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      });

      if (res.ok) {
      toast.success('Client updated successfully!');
      // Update UI state locally
      setClients(prevClients =>
        prevClients.map(client =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );
      setEditModalOpen(false);
      setSelectedClient(null);
      } else {
        const errorText = await res.text();
      toast.error(`Failed to update client: ${errorText}`);
      }
     } catch (error) {
    console.error(error);
    toast.error('An error occurred while updating the client');
  }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Clients</h1>
        <button 
          onClick={() => navigate('/clients/add')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
        >
          <PlusCircle size={18} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'hospital' | 'hotel' | 'salon')}
          >
          <option value="all">All</option>
            {businesstype.map((btype) => (
                <option key={btype._id} value={btype.business_type}>
                  {btype.business_type}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Skeleton loading
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            No clients found
          </div>
        ) : (
          filteredClients.map((client) => (
            <div 
              key={client._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{client.business_name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.business_type === 'hospital' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                    : client.business_type === 'hotel'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
                }`}>
                  {client.business_type}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin size={16} className="text-gray-400 mr-2 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{client.business_address}</p>
                </div>
                <div className="flex items-center">
                  <Building size={16} className="text-gray-400 mr-2 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{client.name}</p>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{client.business_phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{client.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400"></span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white"></span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={() => selectedClient && confirmDelete(selectedClient)}
        title="Delete Client"
        message={`Are you sure you want to delete ${selectedClient?.business_name}? This action cannot be undone.`}
      />

      {/* Edit Client Modal */}
      
      {selectedClient && (
  <EditClientModal
    isOpen={editModalOpen}
    onClose={() => {
      setEditModalOpen(false);
      setSelectedClient(null);
    }}
    onSave={handleSaveEdit}
    editclient={selectedClient} // ✅ No need for type assertion now
  />
)}
    </div>
  );
}

export default Clients;