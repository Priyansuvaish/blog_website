"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsGrid } from "react-icons/bs";
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface SubItem {
  name: string;
  label: string;
  route: string;
}

interface MenuItem {
  name: string;
  label: string;
  type: 'link' | 'dropdown';
  route?: string;
  subitems?: SubItem[];
}

interface SideNavbarProps {
  onItemClick?: () => void;
}

interface ExpandedMenus {
  [key: string]: boolean;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ onItemClick }) => {
  const pathname = usePathname();
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [activeSubItem, setActiveSubItem] = useState<string>('');
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({});

  const menuItems: MenuItem[] = [
    { name: 'overview', label: 'Overview', type: 'link', route: '/admin/adminDash' },
    { name: 'demandSide', label: 'Users', type: 'dropdown', subitems: [
      { name: 'userSupply', label: 'Supply', route: '/admin/supply' },
      { name: 'userDemand', label: 'Demand', route: '/admin/demand' },
      { name: 'userLMP', label: 'LSP', route: '/admin/lsp' },
      { name: 'userBorh', label: 'Both', route: '/admin/both' }
    ] },
    { name: 'coupon', label: 'Coupon', type: 'link', route: '/admin/adminCoupon' },
    { name: 'prefLand', label: 'Land Preferences', type: 'link', route: '/admin/prefrenceLand' },
    { name: 'pricePlans', label: 'Plans', type: 'link', route: '/admin/adminPricing' },
    { name: 'manageLands', label: 'Manage Lands', type: 'link', route: '/admin/manageLands' },
    { name: 'reraData', label: 'Rera Data', type: 'link', route: '/admin/reraData' },
    { name: 'invoices', label: 'Invoices', type: 'dropdown', subitems: [
      {name: 'knowYourPrice', label: 'Know Your Price',route: '/admin/invoices'},
      {name: 'optedPlanInvoice', label: 'Opted Plan',route: '/admin/optedPlanInvoices'},
      {name: 'payPerViewInvoices', label: 'Pay Per View',route: '/admin/payPerViewInvoices'}
    ]},
    { name: 'landEnq', label: 'Land Enquiry', type: 'link', route: '/admin/adminLandEnq' },
    { name: 'contactView', label: 'Contact View', type: 'link', route: '/admin/adminContactView' },
    { name: 'demoReq', label: 'Demo Request', type: 'link', route: '/admin/adminDemoReq' },
    { name: 'contactUs', label: 'Contact Us', type: 'link', route: '/admin/adminContactUs' },
    { name: 'landService', label: 'Land Service', type: 'link', route: '/admin/adminlandService' },
  ];

  // Function to find menu item by route
  const findMenuItemByRoute = (route: string): { item: MenuItem; subItem: SubItem | null } | null => {
    // First check main menu items
    const mainItem = menuItems.find(item => item.route === route);
    if (mainItem) {
      return { item: mainItem, subItem: null };
    }

    // Then check subitems
    for (const menuItem of menuItems) {
      if (menuItem.subitems) {
        const subItem = menuItem.subitems.find(sub => sub.route === route);
        if (subItem) {
          return { item: menuItem, subItem };
        }
      }
    }
    return null;
  };

  // Effect to set active menu item based on current pathname
  useEffect(() => {
    const match = findMenuItemByRoute(pathname);
    if (match) {
      setActiveMenuItem(match.item.name);
      if (match.subItem) {
        setActiveSubItem(match.subItem.name);
        setExpandedMenus(prev => ({ ...prev, [match.item.name]: true }));
      } else {
        setActiveSubItem('');
      }
    }
  }, [pathname]);

  const toggleMenu = (menu: string): void => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleItemClick = (name: string, parentName: string | null = null): void => {
    if (parentName) {
      setActiveMenuItem(parentName);
      setActiveSubItem(name);
    } else {
      setActiveMenuItem(name);
      setActiveSubItem('');
    }
    
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <nav className="flex flex-col space-y-1 p-4 lg:mt-10">
        {menuItems.map((item) => (
          <div key={item.name} className="w-full">
            {item.type === 'link' ? (
              <Link href={item.route!} passHref>
                <div
                  className={`
                    flex items-center px-4 py-3 text-sm rounded-lg cursor-pointer
                    transition-colors duration-150 ease-in-out
                    hover:bg-gray-100
                    ${activeMenuItem === item.name ? 'bg-gray-100 font-medium text-[#009fff]' : ''}
                  `}
                  onClick={() => handleItemClick(item.name)}
                >
                  <BsGrid className={`w-5 h-5 mr-3 ${activeMenuItem === item.name ? 'text-[#009fff]' : 'text-gray-500'}`} />
                  <span className={activeMenuItem === item.name ? 'text-[#009fff]' : 'text-gray-700'}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <div
                  className={`
                    flex items-center justify-between px-4 py-3 text-sm rounded-lg cursor-pointer
                    transition-colors duration-150 ease-in-out
                    hover:bg-gray-100
                    ${activeMenuItem === item.name ? 'bg-gray-100' : ''}
                  `}
                  onClick={() => toggleMenu(item.name)}
                >
                  <div className="flex items-center">
                    <BsGrid className={`w-5 h-5 mr-3 ${activeMenuItem === item.name ? 'text-[#009fff]' : 'text-gray-500'}`} />
                    <span className={activeMenuItem === item.name ? 'text-[#009fff]' : 'text-gray-700'}>
                      {item.label}
                    </span>
                  </div>
                  <div className={`${activeMenuItem === item.name ? 'text-[#009fff]' : 'text-gray-400'}`}>
                    {expandedMenus[item.name] ? (
                      <FaChevronDown className="w-4 h-4" />
                    ) : (
                      <FaChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {expandedMenus[item.name] && item.subitems && (
                  <div className="ml-4 mt-1 mb-1">
                    {item.subitems.map((subitem) => (
                      <Link key={subitem.name} href={subitem.route} passHref>
                        <div
                          className={`
                            flex items-center px-4 py-2 text-sm rounded-lg cursor-pointer
                            transition-colors duration-150 ease-in-out
                            hover:bg-gray-100
                            ${activeSubItem === subitem.name ? 'bg-gray-100 font-medium text-[#009fff]' : ''}
                          `}
                          onClick={() => handleItemClick(subitem.name, item.name)}
                        >
                          <span className={`text-gray-600 ml-4 ${activeSubItem === subitem.name ? 'text-[#009fff]' : ''}`}>
                            {subitem.label}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SideNavbar;
