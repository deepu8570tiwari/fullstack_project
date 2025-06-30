import { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash, Building } from 'lucide-react';
import EditBusinessTypeModal from './modals/EditBusinessType';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface BusinessType {
  _id:string;
  business_type:string;
}
function BusinessType() {
  const [users, setUsers] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModelOpen,setEditModelOpen]=useState(false);
  const [selectedUser, setSelectedUser] = useState<BusinessType | null>(null);
  const navigate=useNavigate();
  useEffect(() => {
  
    const fetchBusinessTypes = async () => {
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
        setUsers(json.data); // ✅ Set the latest data
      } catch (err) {
        console.error('Failed to load Business Type:', err);
      } finally {
        setLoading(false); // ✅ Always hide loader after fetch completes
      }
    };
    // Delay fetch for UX purposes (if needed)
    const timeout = setTimeout(fetchBusinessTypes, 800);
    return () => clearTimeout(timeout); // cleanup if unmounted early
  }, []);


  const filteredUsers = users.filter(user => {
    const matchesSearch = user.business_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit=(user: BusinessType)=>{
    setSelectedUser(user);
    setEditModelOpen(true);
  }

  const handleDelete = (user: BusinessType) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  
  const handleSave = async (updatedBusinessType: BusinessType) => {
    // Example PUT API call
    try {
       const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/v1/business-type/${updatedBusinessType._id}`, {
        method: 'PUT',
        headers: {
           'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBusinessType),
      });

      
      if (response.ok) {
        toast.success('Business Type Updated Successfully!');
        // Update local state or re-fetch list
        setUsers(prev =>
          prev.map(user =>
            user._id === updatedBusinessType._id ? updatedBusinessType : user
          )
        );
        setEditModelOpen(false);
      } else {
        console.error('Failed to update business type');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser?._id) return;
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/v1/business-type/${selectedUser._id}`, {
          method: 'DELETE',
          headers: {
           'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          toast.success('Business Type deleted successfully!');
          setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
          setDeleteModalOpen(false);
          setSelectedUser(null);
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Business Type Management</h1>
        <button  onClick={() => navigate('/admin/business-type/add')} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm">
          <PlusCircle size={18} />
          <span>Add New Business Type</span>
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
            placeholder="Search business type..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Business Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No Business Type Found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Building size={20} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.business_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex gap-2">
                        <button onClick={()=>handleEdit(user)} className="text-primary hover:text-primary-dark dark:text-primary-light">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash size={18} />
                        </button>
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
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.business_type}? This action cannot be undone.`}
      />

       {selectedUser && (
      <EditBusinessTypeModal
      isOpen={editModelOpen}
      onClose={() => setEditModelOpen(false)}
      onSave={handleSave} // ✅ function that updates the user
      data={selectedUser} // ✅ the user object to edit
        />
    )}
    </div>
  );
}

export default BusinessType;