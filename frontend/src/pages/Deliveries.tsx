import { useState, useEffect } from 'react';
import { Search, PlusCircle, MapPin, Phone, Mail, Building, Trash, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/modals/Delivery/DeleteConfirmationDeliveryModal';
import EditDeliveryModal from '../components/modals/Delivery/EditDeliveryModal';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface Users {
   _id:  string;
  business_address: string;
  name: string;
  email: string;
  business_phone: string;
  emergency_number:string,
  vehicle_type: string;
  vehicle_number: number;
  vehicle_model:number;
  vehicle_insurance_number: number;
  driver_licence_number:string;
  driver_licence_expiry: number;
  driver_aadhar_card_number:number;
  driver_pan_card_number:string;
}

function Deliveries() {
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Users | null>(null);
  useEffect(() => {
    setTimeout(() => {
     fetch('http://localhost:8080/api/v1/clients/delivery')
      .then((res) => res.json())
      .then((data) => setDelivery(data))
      .catch((err) => console.error(err));
      setLoading(false);
    }, 800);
  }, []);

  const filteredClients = delivery.filter(delivery => {
    const matchesSearch = delivery.name.toLowerCase().includes(searchTerm.toLowerCase()) || delivery.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const handleEdit = (delivery: Users) => {
    setSelectedDelivery(delivery);
    setEditModalOpen(true);
  };

  const handleDelete = (delivery: Users) => {
    setSelectedDelivery(delivery);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (_id: string) => {
  if (!selectedDelivery) return;
  try {

    // 1. Delete from Profile collection
      const clientRes = await fetch(
      `http://localhost:8080/api/v1/clients/${selectedDelivery._id}`,
      { method: 'DELETE' }
    );

    if (!clientRes.ok) throw new Error('Failed to delete client');

    const profileRes = await fetch(
      `http://localhost:8080/api/v1/delivery-persons/${selectedDelivery._id}`,
      { method: 'DELETE' }
    );

    if (!profileRes.ok) throw new Error('Failed to delete delivery profile');

    // 2. Delete from Client collection
  

    // 3. Update the local delivery state
    setDelivery(prev =>
      prev.filter(item => item._id !== selectedDelivery._id)
    );

    toast.success('Delivery user deleted successfully!');
  } catch (err) {
    console.error(err);
    toast.error('Error deleting delivery user');
  } finally {
    setDeleteModalOpen(false);
    setSelectedDelivery(null);
  }
};

  const handleSaveEdit = async (updatedDelivery: Users) => {
    try {
      // 1. Split user data
    const userPayload = {
      name: updatedDelivery.name,
      email: updatedDelivery.email,
      business_address: updatedDelivery.business_address,
      business_phone: updatedDelivery.business_phone,
      business_type: 'delivery'
    };

    // 2. Split delivery profile data
    const deliveryPayload = {
      emergency_number: updatedDelivery.emergency_number,
      vehicle_type: updatedDelivery.vehicle_type,
      vehicle_number: updatedDelivery.vehicle_number,
      vehicle_model: updatedDelivery.vehicle_model,
      vehicle_insurance_number: updatedDelivery.vehicle_insurance_number,
      driver_licence_number: updatedDelivery.driver_licence_number,
      driver_licence_expiry: updatedDelivery.driver_licence_expiry,
      driver_aadhar_card_number: updatedDelivery.driver_aadhar_card_number,
      driver_pan_card_number: updatedDelivery.driver_pan_card_number
    };
    // 3. Send both updates in parallel
    const [userRes, deliveryRes] = await Promise.all([
      fetch(`http://localhost:8080/api/v1/clients/${updatedDelivery._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      }),
      fetch(`http://localhost:8080/api/v1/delivery-persons/${updatedDelivery._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryPayload)
      })
    ]);

    // 4. Check response
    if (userRes.ok && deliveryRes.ok) {
      toast.success('Delivery profile updated successfully!');
      setDelivery(prevDelivery =>
        prevDelivery.map(delivery =>
          delivery._id === updatedDelivery._id ? updatedDelivery : delivery
        )
      );
      setEditModalOpen(false);
      setSelectedDelivery(null);
    } else {
      const userError = await userRes.text();
      const deliveryError = await deliveryRes.text();
      toast.error(`Failed to update: ${userError || ''} ${deliveryError || ''}`);
    }
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while updating the delivery profile');
  }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Delivery</h1>
        <button 
          onClick={() => navigate('/delivery-person/add')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
        >
          <PlusCircle size={18} />
          <span>Add New Delivery Person</span>
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
            placeholder="Search Delivery Boy..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            No delivery boy found
          </div>
        ) : (
          filteredClients.map((Users) => (
            <div 
              key={Users._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{Users.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin size={16} className="text-gray-400 mr-2 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{Users.business_address}</p>
                </div>
                <div className="flex items-center">
                  <Building size={16} className="text-gray-400 mr-2 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{Users.name}</p>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{Users.business_phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{Users.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
               
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(Users)}
                    className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(Users)}
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
          setSelectedDelivery(null);
        }}
        onConfirm={() => selectedDelivery && confirmDelete(selectedDelivery._id)}
        title="Delete Delivery"
        message={`Are you sure you want to delete ${selectedDelivery?.name} ? This action cannot be undone.`}
      />

      {/* Edit Delivery Modal */}
      {selectedDelivery && (
        <EditDeliveryModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedDelivery(null);
          }}
          onSave={handleSaveEdit}
          delivery={selectedDelivery}
        />
      )}
    </div>
  );
}

export default Deliveries;