import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export const PageShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-dusk-950 text-white flex flex-col selection:bg-sunset-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageShell;
