import { Moon, Sun, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  return (
    <header className="bg-white dark:bg-dark shadow-sm z-10 transition-colors duration-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="text-dark dark:text-gray-300 hover:text-primary dark:hover:text-primary md:hidden focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-dark dark:text-gray-300 hover:text-primary dark:hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-dark-light focus:outline-none transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          

          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center text-dark dark:text-gray-300 focus:outline-none"
            >
              <img
                src={user?.avatar}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 dark:border-dark-light"
              />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 card py-1 z-20">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light"
                >
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;