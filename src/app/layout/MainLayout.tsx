import React from 'react';
import SimpleBottomNavigation from '../components/BottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean; // 바텀 네비게이션 표시 여부
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  showBottomNav = true,
}) => {
  return (
    <div className={`flex flex-col h-screen bg-neutral-100 ${className || ''}`}>
      <div className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-12' : ''}`}>
        {children}
      </div>
      {showBottomNav && <SimpleBottomNavigation />}
    </div>
  );
};

export default MainLayout;
