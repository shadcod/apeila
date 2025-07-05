'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaHome,
  FaBoxOpen,
  FaGift,
  FaCog,
  FaUsers,
  FaChartBar,
  FaThList,
  FaShoppingCart,
  FaChevronDown,
  FaChevronRight,
  FaTags,
  FaBoxes,
  FaTruck,
  FaClipboardList,
  FaCreditCard,
  FaBook,
  FaEye,
} from 'react-icons/fa';

const links = [
  { name: 'Home', path: '/dashboard/home', icon: FaHome, roles: ['admin', 'staff'] },
  { name: 'Orders', path: '/dashboard/orders', icon: FaShoppingCart, roles: ['admin', 'staff'] },
  { name: 'Products', path: '/dashboard/products', icon: FaBoxOpen, roles: ['admin', 'staff'] },
  { name: 'Content', path: '/dashboard/content', icon: FaGift, roles: ['admin', 'staff'] },
  { name: 'Customers', path: '/dashboard/customers', icon: FaUsers, roles: ['admin', 'staff'] },
  { name: 'Analytics', path: '/dashboard/analytics', icon: FaChartBar, roles: ['admin'] },
  { name: 'Marketing', path: '/dashboard/marketing', icon: FaThList, roles: ['admin'] },
  { name: 'Discounts', path: '/dashboard/discounts', icon: FaTags, roles: ['admin'] },
  { name: 'Online Store', path: '/dashboard/online-store', icon: FaBoxOpen, roles: ['admin'] },
];

const baseProductSubLinks = [
  { name: 'Collections', path: '/dashboard/products/collections', icon: FaTags },
  { name: 'Inventory', path: '/dashboard/products/inventory', icon: FaBoxes },
  { name: 'Purchase Orders', path: '/dashboard/products/purchase-orders', icon: FaClipboardList },
  { name: 'Transfers', path: '/dashboard/products/transfers', icon: FaTruck },
  { name: 'Gift Cards', path: '/dashboard/products/gift-cards', icon: FaCreditCard },
  { name: 'Catalogs', path: '/dashboard/products/catalogs', icon: FaBook },
];

export default function Sidebar({ isCollapsed, setIsCollapsed, userRole = 'admin' }) {
  const pathname = usePathname();
  const [productsCount, setProductsCount] = useState(0);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  useEffect(() => {
    setIsProductsOpen(pathname.startsWith('/dashboard/products'));
  }, [pathname]);

  useEffect(() => {
    async function fetchProductCount() {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        const count = Array.isArray(data)
          ? data.length
          : Array.isArray(data.products)
          ? data.products.length
          : 0;
        setProductsCount(count);
      } catch (err) {
        console.error('Error fetching product count:', err);
      }
    }
    fetchProductCount();
  }, []);

  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  return (
    <aside
      className={`h-full flex flex-col bg-white border-r transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {!isCollapsed && (
          <Link
            href="/dashboard"
            className="font-bold text-lg hover:underline flex items-center gap-1"
          >
            🛒 <span>Dashboard</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="text-sm text-gray-600"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {filteredLinks.map(({ name, path, icon: Icon }) => {
          const isActive = pathname === path;

          if (name === 'Products') {
            return (
              <div key="Products">
                <Link
                  href={path}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
                    pathname === '/dashboard/products'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? 'Products' : undefined}
                >
                  <Icon className="text-base" />
                  {!isCollapsed && (
                    <>
                      <span>Products</span>
                      <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {productsCount}
                      </span>
                      {isProductsOpen ? (
                        <FaChevronDown className="ml-2 text-xs" />
                      ) : (
                        <FaChevronRight className="ml-2 text-xs" />
                      )}
                    </>
                  )}
                </Link>

                {isProductsOpen && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {baseProductSubLinks.map(({ name, path, icon: SubIcon }) => (
                      <Link
                        key={name}
                        href={path}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                          pathname === path
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <SubIcon className="text-xs" />
                        <span>{name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (name === 'Online Store') {
            return (
              <div
                key={name}
                className={`flex items-center justify-between px-3 py-2 rounded-md transition text-sm ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Link
                  href={path}
                  className="flex items-center gap-3 flex-1"
                  title={isCollapsed ? name : undefined}
                >
                  <Icon className="text-base" />
                  {!isCollapsed && <span>{name}</span>}
                </Link>
                {!isCollapsed && (
                  <Link
                    href="http://localhost:3000/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600"
                    title="View Store"
                  >
                    <FaEye />
                  </Link>
                )}
              </div>
            );
          }

          return (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? name : undefined}
            >
              <Icon className="text-base" />
              {!isCollapsed && <span>{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t px-2 py-3">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
            pathname === '/dashboard/settings'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <FaCog className="text-base" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
