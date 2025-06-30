import { useEffect, useState } from 'react';
import { X, Building, Save,MapPin,Phone,User,Minus,Plus, } from 'lucide-react';

interface SubscriptionPlan  {
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
interface BusinessType {
  _id:string;
  business_type:string;
}
interface LaundryItem {
  type: string;
}
interface EditSubscriptionPlanProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SubscriptionPlan) => void;
  data: SubscriptionPlan;
}

function EditSubscriptionPlan({ isOpen, onClose, onSave, data }: EditSubscriptionPlanProps) {
  const [formData, setFormData] = useState<SubscriptionPlan>(data);
  const [businesstype,setBusinesstype]=useState<BusinessType[]>([]);
  const [items, setItems] = useState([{ type: '' }]);
  console.log(formData,'formDatavalue');
const addItem = () => {
    setItems([...items, { type: ''}]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };
  const [loading, setLoading] = useState(false);
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
      setBusinesstype(json.data);
    } catch (err) {
      console.error('Failed to load Business Type:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeout = setTimeout(fetchItemsTypes, 800);
  return () => clearTimeout(timeout);
}, []);
useEffect(() => {
  if (data) {
    setFormData(data);
    if (data.features && Array.isArray(data.features)) {
      const converted = data.features.map((feature: string) => ({ type: feature }));
      setItems(converted.length > 0 ? converted : [{ type: '' }]);
    }
  }
}, [data]);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      try {
        console.log(formData,'formData_list');
    await onSave({
      ...formData,
      features: items.map((item) => item.type),
    });
    onClose();
  } finally {
    setLoading(false);
  }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 const handleItemChange = (index: number, field: keyof LaundryItem, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Plans
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Building size={16} className="mr-2" />
                  Plan Name
                </label>
                <input
                  name="plan_name"
                  required
                  value={formData.plan_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                >
                </input>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Building size={16} className="mr-2" />
                  Plan Description
                </label>
                <input
                  name="plan_description"
                  required
                  value={formData.plan_description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                >
                </input>
              </div>
              <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User size={16} className="mr-2" />
                Billing Options
              </label>
            <select  
              name="billing_options"
              required
              disabled
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
                readOnly
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
            <div className="space-y-4 grid grid-cols-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Features Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
              >
                <Plus size={16} />
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
          </div>
              
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-200 disabled:bg-primary-light disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSubscriptionPlan;