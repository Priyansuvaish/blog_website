"use client";
import { useState } from 'react';
import SideNavbar from './SideNavbar';
import Navbar from './Navbar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navbar - Full Width */}
      <div className="flex-shrink-0">
        <Navbar onMobileMenuToggle={toggleMobileSidebar} />
      </div>
      
      {/* Main layout area below navbar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Desktop always visible, Mobile overlay */}
        <div className={`
          w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
          md:translate-x-0 md:relative md:z-auto
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:block absolute inset-y-0 left-0 z-40
        `}>
          <SideNavbar onItemClick={closeMobileSidebar} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Mobile overlay backdrop - only inside main content area */}
          {isMobileSidebarOpen && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={closeMobileSidebar}
            />
          )}
          
          <main className="h-full overflow-y-auto p-6 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper; 