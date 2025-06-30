import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <Package size={40} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Page not found</p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
      </div>
      
      <Link 
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
      >
        <ArrowLeft size={18} />
        <span>Go to Dashboard</span>
      </Link>
    </div>
  );
}

export default NotFound;