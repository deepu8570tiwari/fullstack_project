import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, Mail, Phone, MapPin, Save, Lock } from 'lucide-react';
import {toast} from 'react-toastify';

interface BusinessType {
  _id:string;
  business_type:string;
}

function AddClient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businesstype,setBusinesstype]=useState<BusinessType[]>([]);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'hospital',
    business_address: '',
    name: '',
    email: '',
    business_phone: '',
    password:'',
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
  const res = await fetch('http://localhost:8080/api/v1/signup/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data.message || res.statusText;
    throw new Error(errorMessage); // Just throw, don't toast here
  }
    toast.success('Client created successfully!');
    setTimeout(() => navigate('/clients'), 1500);
  } catch (err: any) {
    toast.error(err.message || 'Error creating client'); // Toast only once here
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Client</h1>
      </div>
     
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building size={16} className="mr-2" />
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building size={16} className="mr-2" />
                Business Type
              </label>
              <select
                name="business_type"
                required
                value={formData.business_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {businesstype.map((btype) => (
                <option key={btype._id} value={btype.business_type}>
                  {btype.business_type}
                </option>
              ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <MapPin size={16} className="mr-2" />
                Address
              </label>
              <input
                type="text"
                name="business_address"
                required
                value={formData.business_address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter complete address"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User size={16} className="mr-2" />
                Contact Person
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Phone size={16} className="mr-2" />
                Contact Phone
              </label>
              <input
                type="tel"
                name="business_phone"
                required
                value={formData.business_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Mail size={16} className="mr-2" />
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Lock size={16} className="mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
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
                  <span>Save Client</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClient;