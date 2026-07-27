import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-20 w-full px-4 sm:px-8 pb-8">
      <div className="max-w-7xl mx-auto glass rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between text-mist-300 text-sm">
        <div className="mb-4 sm:mb-0">
          <span className="font-display text-xl text-white font-bold block mb-1">
            Wayfarer
          </span>
          <p className="text-xs font-mono">© {new Date().getFullYear()} Wayfarer Platform. All rights reserved.</p>
        </div>
        <div className="flex space-x-6 text-xs font-mono">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
