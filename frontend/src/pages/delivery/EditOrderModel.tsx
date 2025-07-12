import { useEffect, useState } from 'react';
import { X, Save, Minus, Plus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface ItemsType {
  _id: string;
  items_type: string;
  quantity: string;
}

interface BusinessType {
  _id: string;
  business_type: string;
}

interface LaundryItem {
  item_name: string;
  quantity: number;
}

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  userId: string;
}

// Define types for our orders
type OrderStatus = 'picked_up' | 'completed' | 'in_process' | 'pending';

interface Order {
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
}
type Client = {
  _id: string;
  business_name: string;
};
interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: any) => void;
  data: any;
}

let delivery_person_id = '';
const token = localStorage.getItem('authToken');
if (token) {
  const decoded = jwtDecode<DecodedToken>(token);
  delivery_person_id = decoded.userId;
}

function EditOrderModel({ isOpen, onClose, onSave, data }: EditOrderModalProps) {
    if (!isOpen || !data) return null;
console.log(data,'data_id')
  const [formData, setFormData] = useState({
    userId: data._id || '',
    delivery_person_id: data.delivery_person_id?._id || delivery_person_id,
    business_type: data.business_type || '',
    pickup_time: data.pickup_time?.slice(0, 10) || '',
    delivery_time: data.delivery_time?.slice(0, 10) || '',
    business_name: data.userId?.business_name || '',
    status: data.status,
    notes: data.notes,
    item_details: data.item_details || []
  });
console.log(formData.pickup_time,'pickup_time');
  const [loading, setLoading] = useState(false);
  const [ItemsType, setItemsType] = useState<ItemsType[]>([]);
  const [BusinessType, setBusinessType] = useState<BusinessType[]>([]);
  const [clientNames, setClientNames] = useState<Client[]>([]);
  const [item_details, setItem_details] = useState<LaundryItem[]>(formData.item_details);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const [businessTypeRes, itemsTypeRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/business-type/', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
          fetch('http://localhost:8080/api/v1/items-type/', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
        ]);

        const businessTypeData = await businessTypeRes.json();
        const itemsTypeData = await itemsTypeRes.json();

        setBusinessType(businessTypeData.data);
        setItemsType(itemsTypeData.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchData, 800);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...formData, item_details });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'business_type') {
    setFormData((prev) => ({ ...prev, userId: '' })); // reset clientId
    try {
     
      const res = await fetch(`http://localhost:8080/api/v1/clients/getclientbytype/${value.toLowerCase()}`);
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, userId: data[0]._id, business_name: data[0].business_name}));
        setClientNames(data); // assuming array of clients with id & name
      } else {
        setClientNames([]);
        console.error('Error fetching client names');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setClientNames([]);
    }
  }
  };

  const handleItemChange = (index: number, field: keyof LaundryItem, value: string | number) => {
    const newItems = [...item_details];
    newItems[index] = { ...newItems[index], [field]: value };
    setItem_details(newItems);
  };

  const addItem = () => {
    setItem_details([...item_details, { item_name: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (item_details.length > 1) {
      setItem_details(item_details.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Order 
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Type
              </label>
              <select
                name="business_type"
                required
                value={formData.business_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
              <option value="">Select any Client Type</option>
               {BusinessType.map((businesstype) => (
                <option key={businesstype._id} value={businesstype.business_type}>
                  {businesstype.business_type}
                </option>
              ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Name
              </label>
              <select
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {clientNames.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.business_name}
                </option>
              ))}
              </select>
            </div>
                
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                name="pickup_time"
                required
                value={formData.pickup_time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                name="delivery_time"
                min={formData.pickup_time}
                required
                value={formData.delivery_time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Laundry Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {item_details.map((item, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Type
                  </label>
                  <select
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                     <option value="">Select Any Item</option>
                   {ItemsType.map((itemstype) => (
                <option key={itemstype._id} value={itemstype.items_type}>
                  {itemstype.items_type}
                </option>
              ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-6 p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  disabled={item_details.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Add any special instructions or notes..."
            />
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

export default EditOrderModel;