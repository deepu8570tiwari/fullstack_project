import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-4 md:px-6 text-center text-gray-600 dark:text-gray-400 text-xs transition-colors duration-200">
      <p>© {year} LaundryHub. All rights reserved.</p>
    </footer>
  );
}

export default Footer;