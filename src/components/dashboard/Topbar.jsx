'use client';
import { useState } from 'react';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaUser, FaWrench } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Link from 'next/link';

export default function Topbar({ onToggleSidebar }) {
  const isOnline = true; // يمكن لاحقًا ربطها بحالة حقيقية
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 h-16 shadow bg-white relative z-50">
      {/* شعار الموقع */}
      <div className="text-lg font-bold text-blue-600">
        Wetren Admin
      </div>

      {/* حقل البحث في المنتصف */}
      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
      </div>

      {/* أيقونات اليمين */}
      <div className="flex items-center gap-4 relative">
        {/* إشعارات */}
        <button className="relative text-gray-600 hover:text-blue-600 transition">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* إعدادات */}
        <Link href="/dashboard/settings" className="text-gray-600 hover:text-blue-600 transition">
          <FaCog className="text-xl" />
        </Link>

        {/* حالة الاتصال والمستخدم */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
          >
            <FaUserCircle className="text-2xl" />
            <span className="hidden md:block font-medium">Admin</span>
          </button>

          {/* الحالة */}
          <span
            data-tooltip-id="status-tooltip"
            data-tooltip-content={isOnline ? 'Online' : 'Offline'}
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></span>
          <Tooltip id="status-tooltip" place="top" effect="solid" />

          {/* قائمة المستخدم */}
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white border rounded shadow-lg w-40 z-50">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FaUser className="text-sm" /> Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FaWrench className="text-sm" /> Settings
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                onClick={() => alert('Logout clicked')}
              >
                <FaSignOutAlt className="text-sm" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
