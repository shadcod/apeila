'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardShell({ children, className = '' }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const topbarHeight = 64;

  useEffect(() => {
    setSidebarWidth(isSidebarCollapsed ? 64 : 240);
  }, [isSidebarCollapsed]);

  return (
    <div className={`bg-gray-50 ${className}`} style={{ height: '100vh', overflow: 'hidden' }}>
      {/* ✅ Topbar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: topbarHeight,
          zIndex: 1000,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Topbar onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
      </div>

      {/* ✅ Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: topbarHeight,
          left: 0,
          bottom: 0,
          width: sidebarWidth,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          transition: 'width 0.3s',
          zIndex: 900,
        }}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>

      {/* ✅ Main Content */}
      <main
        style={{
          marginTop: topbarHeight,
          marginLeft: sidebarWidth,
          height: `calc(100vh - ${topbarHeight}px)`,
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#f9fafb',
          transition: 'margin-left 0.3s',
        }}
      >
        {children}
      </main>
    </div>
  );
}
