'use client';

import { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaUser, FaWrench } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Link from 'next/link';
import { signOut } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export default function Topbar({ onToggleSidebar }) {
  const [showMenu, setShowMenu] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const menuRef = useRef(null);

  const { user, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
      }
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      alert(error.message || 'Failed to logout.');
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 h-16 shadow bg-white relative z-50">
        {/* شعار الموقع */}
        <div className="text-lg font-bold text-blue-600 cursor-pointer select-none">
          Wetren Admin
        </div>

        {/* حقل البحث */}
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            aria-label="Search"
          />
        </div>

        {/* أيقونات اليمين */}
        <div className="flex items-center gap-4 relative">
          {/* إشعارات */}
          <button
            className="relative text-gray-600 hover:text-blue-600 transition"
            aria-label={`Notifications (${notificationsCount} new)`}
            title="Notifications"
            type="button"
          >
            <FaBell className="text-xl" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* إعدادات */}
          <Link
            href="/dashboard/settings"
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="Settings"
            title="Settings"
          >
            <FaCog className="text-xl" />
          </Link>

          {/* حالة المستخدم وقائمة الحساب */}
          <div className="relative flex items-center" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition focus:outline-none"
              aria-haspopup="true"
              aria-expanded={showMenu}
              aria-label="User menu"
              type="button"
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden md:block font-medium truncate max-w-[120px]">
                {user?.email || 'Admin'}
              </span>
            </button>

            {/* حالة الاتصال مع تأثير الموجة */}
            <span
              data-tooltip-id="status-tooltip"
              data-tooltip-content={user ? 'Online' : 'Offline'}
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                user ? 'bg-green-500' : 'bg-red-500'
              } pulse-ring`}
              aria-label={user ? 'Online' : 'Offline'}
              role="status"
            ></span>
            <Tooltip id="status-tooltip" place="top" effect="solid" />

            {/* قائمة المستخدم */}
            {showMenu && (
              <div
                className="absolute right-0 top-12 bg-white border rounded shadow-lg w-40 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-label="User menu options"
                tabIndex={-1}
              >
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex={0}
                >
                  <FaUser className="text-sm" /> Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex={0}
                >
                  <FaWrench className="text-sm" /> Settings
                </Link>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                  role="menuitem"
                  tabIndex={0}
                  type="button"
                >
                  <FaSignOutAlt className="text-sm" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid currentColor;
          border-radius: 9999px;
          opacity: 0;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          75% {
            transform: scale(1.8);
            opacity: 0;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}