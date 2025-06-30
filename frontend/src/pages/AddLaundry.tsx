import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Minus } from 'lucide-react';

interface LaundryItem {
  type: string;
  quantity: number;
  price: number;
}
type Client = {
  _id: string;
  business_name: string;
};
type businesstype={
  _id: string;
  business_type: string;
}
type itemstype={
  _id: string;
  items_type: string;
}
function AddLaundry() {
 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientNames, setClientNames] = useState<Client[]>([]);
  const [BusinessType,setBusinessType]=useState<businesstype[]>([]);
  const [ItemsType,setItemsType]=useState<itemstype[]>([]);
  const [items, setItems] = useState<LaundryItem[]>([
    { type: '', quantity: 1, price: 0 }
  ]);

   useEffect(()=>{
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const business_type = await fetch('http://localhost:8080/api/v1/business-type/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const business_type_response = await business_type.json();
        setBusinessType(business_type_response.data);

        const items_type = await fetch('http://localhost:8080/api/v1/items-type/',{
           headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const items_type_response = await items_type.json();
        setItemsType(items_type_response.data);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    setTimeout(fetchData, 800);
  },[])

  const [formData, setFormData] = useState({
    business_type: '',
    business_name:'',
    pickupDate: '',
    expectedDeliveryDate: '',
    notes: ''
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
      // When clientType is selected, fetch client names
  if (name === 'business_type') {
    setFormData((prev) => ({ ...prev, clientId: '' })); // reset clientId
    try {
      const res = await fetch(`http://localhost:8080/api/v1/clients/getclientbytype/${value}`);
      const data = await res.json();
      if (res.ok) {
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
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { type: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Laundry Order:', {
      ...formData,
      items,
      totalAmount: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    });
    
    setLoading(false);
    navigate('/orders');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Laundry Order</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                name="pickupDate"
                required
                value={formData.pickupDate}
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
                name="expectedDeliveryDate"
                required
                value={formData.expectedDeliveryDate}
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

            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Type
                  </label>
                  <select
                    value={item.type}
                    onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
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
                  disabled={items.length === 1}
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

          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-lg font-medium">
              Total Amount: <span className="text-blue-600 dark:text-blue-400">
                ${items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/orders')}
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
                    <span>Create Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLaundry;