// Layout.js

import React from 'react';
import Appbar from './Appbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-black">
      {/* AppBar */}
      <Appbar />

      {/* Main Content */}
      <main className="r mx-auto p-4 md:p-6 bg-black bg-opacity-80 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} My Application
      </footer>
    </div>
  );
};

export default Layout;
