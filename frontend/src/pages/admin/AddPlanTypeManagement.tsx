import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, Phone, Save,Plus, Minus } from 'lucide-react';
import {toast} from 'react-toastify';

interface BusinessType {
  _id:string;
  business_type:string;
}
interface LaundryItem {
  type: string;
}
interface AddSubscriptionPlan  {
  _id: string;
  plan_name:string;
  plan_description:string,
  business_type:string,
  billing_options:string,
  price:number,
  stripeprice_id:number,
  features:string[],
  isActive:boolean;
}
function AddPlanTypeManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businesstype,setBusinesstype]=useState<BusinessType[]>([]);
  const [items, setItems] = useState([{ type: '' }]);
  
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_description:'',
    price: '',
    billing_options: 'monthly',
    business_type: '',
    features: [],
    stripePriceId:'',
    isActive:''
  });

  useEffect(() => {
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const features = items.map(item => item.type.trim()).filter(Boolean); // ensure no empty strings
  const payload = {
    ...formData,
    features,
  };
  setLoading(true);
  try {
  const res = await fetch('http://localhost:8080/api/v1/subscription-plans/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data.message || res.statusText;
    throw new Error(errorMessage); // Just throw, don't toast here
  }
    toast.success('Plan created successfully!');
    setTimeout(() => navigate('/admin/plans'), 1500);
  } catch (err: any) {
    toast.error(err.message || 'Error creating Plans'); // Toast only once here
  } finally {
    setLoading(false);
  }
};
const handleItemChange = (index: number, field: keyof LaundryItem, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { type: ''}]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Plan</h1>
      </div>
     
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building size={16} className="mr-2" />
                Plan Name
              </label>
              <input
                type="text"
                name="plan_name"
                required
                value={formData.plan_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter business name"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building size={16} className="mr-2" />
                Plan Description
              </label>
              <input
                type="text"
                name="plan_description"
                required
                value={formData.plan_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter business name"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User size={16} className="mr-2" />
                Billing Options
              </label>
            <select
              name="billing_options"
              required
              value={formData.billing_options}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building size={16} className="mr-2" />
                Price
              </label>
              <input
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="INR 50"
              >
              </input>
            </div>
           
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Phone size={16} className="mr-2" />
               Business Type
              </label>
              <select
                name="business_type"
                required
                value={formData.business_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                  <option value="">-- Select Business Type --</option>
                 {businesstype.map((btype) => (
                <option key={btype._id} value={btype.business_type}>
                  {btype.business_type}
                </option>
              ))}
              </select>
            </div>
          </div>
          <div className="space-y-4 grid grid-cols-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Features Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
              >
                <Plus size={16} />
                Add new features
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Feature lists
                  </label>
                  <input
                    value={item.type}
                    name="features"
                    onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                  </input>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-6 p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  disabled={items.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}

            <div>
              <input
                type="hidden"
                name="stripePriceId"
                required
                value={formData.stripePriceId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>
            
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlanTypeManagement;