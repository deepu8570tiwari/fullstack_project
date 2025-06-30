import { NavLink } from 'react-router-dom';
import { Home, Package, Users, User, Settings, X, CreditCard, Truck, Wallet, MessageSquare, HelpCircle, Shield, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user } = useAuth();

  // Define navigation links based on user role
  const getNavigationLinks = () => {
    const baseLinks = [
      { path: '/', label: 'Dashboard', icon: <Home size={20} />, roles: ['admin', 'delivery','salon','hospital','hostel','college'] }
    ];

    const roleBasedLinks = [
      // Admin links
      { path: '/admin/plans', label: 'Plan Management', icon: <Shield size={20} />, roles: ['admin'] },
      { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={20} />, roles: ['admin'] },
      { path: '/admin/reports', label: 'Reports', icon: <FileText size={20} />, roles: ['admin'] },
      
      // Manager links
      { path: '/orders', label: 'Orders', icon: <Package size={20} />, roles: ['admin', 'delivery','salon','hospital','hostel','college'] },
      { path: '/clients', label: 'Clients', icon: <Users size={20} />, roles: ['admin'] },
      { path: '/admin/business-type', label: 'Business Type', icon: <Users size={20} />, roles: ['admin'] },
      { path: '/admin/items-type', label: 'Items Type', icon: <Users size={20} />, roles: ['admin'] },
      { path: '/delivery-person', label: 'Delivery Personnel', icon: <Truck size={20} />, roles: ['admin'] },
      
      { path: '/subscription-plans', label: 'Subscription Plans', icon: <CreditCard size={20} />, roles: ['salon','hospital','hostel','college'] },
      { path: '/payments', label: 'Payments', icon: <Wallet size={20} />, roles:['salon','hospital','hostel','college']},
      // Common links
      { path: '/support', label: 'Support', icon: <MessageSquare size={20} />, roles: ['admin', 'delivery','salon','hospital','hostel','college'] },
      { path: '/faq', label: 'FAQ', icon: <HelpCircle size={20} />, roles: ['admin', 'delivery','salon','hospital','hostel','college'] },
      { path: '/profile', label: 'Profile', icon: <User size={20} />, roles: ['admin', 'delivery','salon','hospital','hostel','college'] },
      { path: '/settings', label: 'Settings', icon: <Settings size={20} />, roles: ['admin', 'delivery','salon','hospital','hostel','college'] }
    ];

    return [...baseLinks, ...roleBasedLinks].filter(link => 
      link.roles.includes(user?.role || '')
    );
  };

  const sidebarLinks = getNavigationLinks();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'delivery': return 'Delivery Personnel';
      case 'salon': return 'Salon Owner';
      case 'hospital': return 'Hospital Owner';
      case 'hotel': return 'Hotel Owner';
      case 'hostel': return 'Hostel Owner';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-300';
      case 'manager': return 'text-blue-300';
      case 'delivery': return 'text-green-300';
      case 'salon': return 'text-blue-300';
      case 'hotel': return 'text-green-300';
      case 'hostel': return 'text-blue-300';
      case 'hospital': return 'text-green-300';
      default: return 'text-primary-light';
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-dark">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold">Washing Doctor</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-primary-light md:hidden focus:outline-none"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-primary-dark">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className={`text-sm ${getRoleColor(user?.role || '')}`}>
                {getRoleDisplayName(user?.role || '')}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-dark text-white'
                        : 'text-white hover:bg-primary-dark/50'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-primary-dark">
          <div className="flex items-center justify-between text-sm text-primary-light">
            <span>© 2025 LaundryHub</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;