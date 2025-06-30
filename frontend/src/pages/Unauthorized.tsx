import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <Shield size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">403</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Access Denied</p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">You don't have permission to access this page.</p>
      </div>
      
      <Link 
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white transition-colors duration-200"
      >
        <ArrowLeft size={18} />
        <span>Go to Dashboard</span>
      </Link>
    </div>
  );
}

export default Unauthorized;