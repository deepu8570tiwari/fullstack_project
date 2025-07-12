import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
   const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    business_address: '',
    name: '',
    email: '',
    business_phone: '',
    password:'',
    confirmpassword:'',
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
    const {
    name,
    email,
    password,
    confirmpassword,
    business_name,
    business_address,
    business_type,
    business_phone,
  } = formData;
    
    if (!name || !email || !password || !confirmpassword) {
      toast.success('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.success('Please enter a valid email address');
    return;
  }

    if (password !== confirmpassword) {
      toast.success('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.success('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const payload = {
      business_name,
      business_type,
      business_address,
      name,
      email,
      business_phone,
      password,
  };
    try {
  const res = await fetch('http://localhost:8080/api/v1/signup/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data.message || res.statusText;
    throw new Error(errorMessage); // Just throw, don't toast here
  }
    toast.success('Your account created successfully!');
    setTimeout(() => navigate('/profile'), 1500);
  } catch (err: any) {
    toast.error(err.message || 'Error creating client'); // Toast only once here
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
        <div className="bg-primary p-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-2">
            <Package size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Washing Doctor</h1>
          <p className="text-primary-light mt-1">Business Registration</p>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Create your account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Choose Type
              </label>
              <select
                name="business_type"
                required
                value={formData.business_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="">--Select Any--</option>
                <option value="flat-owner">Flat Owner</option>
                <option value="air-bnb">Air BnB</option>
                <option value="salon">Salon</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Address
              </label>
              <input
                name="business_address"
                type="text"
                required
                value={formData.business_address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Enter Your Address "
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Phone
              </label>
              <input
                name="business_phone"
                type="number"
                required
                value={formData.business_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="+91xxxxxxxx"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmpassword"
                type="password"
                required
                value={formData.confirmpassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                isLoading
                  ? 'bg-primary-light cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark dark:text-primary-light font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;