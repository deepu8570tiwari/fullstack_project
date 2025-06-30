import { useState,useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  userId:string;
}

function Profile() {
  //const { user } = useAuth();
  const [formData, setFormData] =  useState<any>({});;
    useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
      const decoded = jwtDecode<DecodedToken>(token);
    fetch(`http://localhost:8080/api/v1/clients/${decoded.userId}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error('Failed to load user:', err));
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    
try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const decoded = jwtDecode<DecodedToken>(token);
    const userId = decoded.userId;

    const res = await fetch(`http://localhost:8080/api/v1/clients/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Optional: if your backend expects token in header
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await res.json();
    setFormData(updatedUser); // update UI with fresh data
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    alert('Failed to update profile. Please try again.');
  } finally {
    setSaving(false);
  }

    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-12 left-6 flex">
            <div className="relative">
              <img
                src="https://fastly.picsum.photos/id/1052/200/300.jpg?hmac=q0_PuucU1D2bExaKxMKCFVvt4Lld2Iy6UvlLhHmmrbE"
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors duration-200">
                <Camera size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-6 px-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <User size={16} className="mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name|| ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white">{formData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Mail size={16} className="mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white">{formData.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Phone size={16} className="mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="business_phone"
                        value={formData.business_phone|| ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white">{formData.business_phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <MapPin size={16} className="mr-2" />
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="business_address"
                        value={formData.business_address || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white">{formData.business_address}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Form buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {saving ? (
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
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;