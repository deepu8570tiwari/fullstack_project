import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Lock, FileCheck, Calendar, Car } from 'lucide-react';
import {toast} from 'react-toastify';

function AddDeliveryPerson() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business_phone: '',
    business_address: '',
    business_type: 'delivery',
    business_name:'null',
    password: '',
    emergency_number: '',
    vehicle_type: '',
    vehicle_number: '',
    vehicle_model: '',
    vehicle_insurance_number: '',
    driver_licence_number: '',
    driver_licence_expiry: '',
    driver_aadhar_card_number: '',
    driver_pan_card_number: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
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
      // Check if user is a delivery person
        if (formData.business_type === 'delivery') {
          const deliveryData = {
            user_Id: data.result._id, // Make sure the signup API returns this
            vehicle_type: formData.vehicle_type,
            vehicle_number: formData.vehicle_number,
            vehicle_model: formData.vehicle_model,
            vehicle_insurance_number: formData.vehicle_insurance_number,
            driver_licence_number: formData.driver_licence_number,
            driver_licence_expiry: formData.driver_licence_expiry,
            driver_aadhar_card_number: formData.driver_aadhar_card_number,
            driver_pan_card_number: formData.driver_pan_card_number,
            emergency_number: formData.emergency_number,
          };

          const deliveryRes = await fetch('http://localhost:8080/api/v1/delivery-persons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deliveryData),
          });

          const deliveryResult = await deliveryRes.json();

          if (!deliveryRes.ok) {
            throw new Error(deliveryResult.message || 'Failed to create delivery profile');
          }
        }
        toast.success('Delivery Account created successfully!');
        setTimeout(() => navigate('/delivery-person'), 1500);
      } catch (err: any) {
        toast.error(err.message || 'Error creating client'); // Toast only once here
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Delivery Person</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={16} className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail size={16} className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              <input
                  type="hidden"
                  name="business_type"
                  required
                  value={formData.business_type}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  
                />
                <input
                  type="hidden"
                  name="business_name"
                  required
                  value={formData.business_name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  
                />
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="business_phone"
                  required
                  value={formData.business_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter complete address"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone size={16} className="mr-2" />
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergency_number"
                  required
                  value={formData.emergency_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Emergency contact number"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Car size={16} className="mr-2" />
                  Vehicle Type
                </label>
                <select
                  name="vehicle_type"
                  required
                  value={formData.vehicle_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Car size={16} className="mr-2" />
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicle_number"
                  required
                  value={formData.vehicle_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., IN0AB 6078"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Car size={16} className="mr-2" />
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="vehicle_model"
                  required
                  value={formData.vehicle_model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 2012"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={16} className="mr-2" />
                  Vehicle Insurance Number
                </label>
                <input
                  type="tesxt"
                  name="vehicle_insurance_number"
                  required
                  value={formData.vehicle_insurance_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 1234as56XXXXX"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileCheck size={16} className="mr-2" />
                  License Plate Number
                </label>
                <input
                  type="text"
                  name="driver_licence_number"
                  required
                  value={formData.driver_licence_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter license plate number"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileCheck size={16} className="mr-2" />
                  License Expiry Date
                </label>
                <input
                  type="date"
                  name="driver_licence_expiry"
                  required
                  value={formData.driver_licence_expiry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter license plate number"
                />
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Document Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileCheck size={16} className="mr-2" />
                  Driver's Aadhar Number
                </label>
                <input
                  type="text"
                  name="driver_aadhar_card_number"
                  required
                  value={formData.driver_aadhar_card_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter driver's license number"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={16} className="mr-2" />
                  Driver Pan Card Number
                </label>
                <input
                  type="text"
                  name="driver_pan_card_number"
                  required
                  value={formData.driver_pan_card_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/delivery-person/')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm transition-colors duration-200 disabled:bg-primary-light disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDeliveryPerson;