import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-sm text-gray-400">Powered by <a href="https://expressjs.com" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">Express.js</a></div>
          <div className="text-sm text-gray-400">Created by Saiful Abidin</div>
          <div className="flex items-center space-x-6">
            <a href="https://twitter.com/syaifulosd" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="https://github.com/saifulabidin" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
