import React from 'react';
import { FileText, Github } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold tracking-tight">ATS Scanner AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              How it Works
            </a>
            <div className="flex items-center text-gray-400 hover:text-white cursor-pointer">
               <Github className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
