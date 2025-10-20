'use client';

import { useSidebar } from './SidebarLayout';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div style={{ 
      marginLeft: collapsed ? '80px' : '280px', 
      flex: 1, 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'margin-left 0.3s ease',
    }}>
      {children}
    </div>
  );
}

