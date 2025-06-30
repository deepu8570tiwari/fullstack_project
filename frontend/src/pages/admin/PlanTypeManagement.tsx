import { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash } from 'lucide-react';
import EditSubscriptionPlan from './modals/EditSubscriptionPlan';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'

interface PlanDetails {
  _id: string;
  plan_name:string;
  plan_description:string,
  business_type:string,
  billing_options:string,
  price:number,
  stripePriceId:string,
  features:string[],
  isActive:boolean;
  createdAt: string;
}
function PlanTypeManagement() {
  const navigate = useNavigate();
  const [plantype, setPlanType] = useState<PlanDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModelOpen,setEditModelOpen]=useState(false);
  const [selectedUser, setSelectedUser] = useState<PlanDetails | null>(null);

  useEffect(() => {
    setTimeout(() => {
        fetch('http://localhost:8080/api/v1/subscription-plans/')
      .then((res) => res.json())
      .then((data) => setPlanType(data))
      .catch((err) => console.error(err));
      setLoading(false);
    }, 800);
  }, []);


const filteredUsers = plantype.filter(plan => {
  const name = plan.plan_name || '';
  return name.toLowerCase().includes(searchTerm.toLowerCase());
});

  const handleDelete = (plandetails: PlanDetails) => {
    setSelectedUser(plandetails);
    setDeleteModalOpen(true);
  };
   const handleEdit=(plandetails: PlanDetails)=>{
    setSelectedUser(plandetails);
    setEditModelOpen(true);
  }
  const confirmDelete = async () => {
    if (!selectedUser) return;
  try {
    const res = await fetch(`http://localhost:8080/api/v1/subscription-plans/${selectedUser._id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete Subscription Plans');
    }
    toast.success('Subscription Plans deleted successfully!');
     await new Promise(resolve => setTimeout(resolve, 800));
    setPlanType(plantype.filter(u => u._id !== selectedUser._id));
    setDeleteModalOpen(false);
    setSelectedUser(null);
  } catch (err) {
    console.error(err);
    toast.error('Error deleting client');
  } finally {
    setDeleteModalOpen(false);
  }
   
  };

  const toggleUserStatus = async (userId: string) => {
    setPlanType(plantype.map(user => 
      user._id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleSave = async (plandetails: PlanDetails) => {
    console.log(plandetails,'handleSave');
     try {
      const res = await fetch(`http://localhost:8080/api/v1/subscription-plans/${plandetails._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plandetails)
      });
      if (res.ok) {
         const savedPlan = await res.json(); 
      toast.success('Plan updated successfully!');
      setPlanType((prev) =>
      prev.map((plan) =>
        plan._id === savedPlan._id ? savedPlan : plan
      )
    );
      // Update UI state locally
      setEditModelOpen(false);
      setSelectedUser(null);
      } else {
        const errorText = await res.text();
      toast.error(`Failed to update plan: ${errorText}`);
      }
     } catch (error) {
    console.error(error);
    toast.error('An error occurred while updating the plans');
  }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Plan Management</h1>
        <button onClick={() => navigate('/admin/plans/add')} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm">
          <PlusCircle size={18} />
          <span>Add New Plan</span>
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
            placeholder="Search Plans..."
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
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan Price (Monthly/Yearly)
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
                    No Plans found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((plantype) => (
                  <tr key={plantype?._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                       
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {plantype.plan_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                        {plantype.plan_description}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(plantype._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plantype.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {plantype.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    {plantype.billing_options.includes('monthly')
                    ? `INR ${plantype.price} / Month`
                    : `INR ${plantype.price} / Year`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex gap-2">
                        <button onClick={()=>handleEdit(plantype)} className="text-primary hover:text-primary-dark dark:text-primary-light">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(plantype)}
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
      
      {selectedUser && (
      <EditSubscriptionPlan
      isOpen={editModelOpen}
      onClose={() => setEditModelOpen(false)}
      onSave={handleSave} // ✅ function that updates the user
      data={selectedUser} // ✅ the user object to edit
        />
    )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.plan_name}? This action cannot be undone.`}
      />
    </div>
  );
}

export default PlanTypeManagement;