import React from 'react';
import BottomNavigation from '@/widgets/BottomNav/BottomNav';

interface DiveEventLayoutProps {
  children: React.ReactNode;
  className?: string;
  hidden? : boolean;
}

const DiceEventLayout: React.FC<DiveEventLayoutProps> = ({
  children,
  className,
  hidden,
}) => {
  return (
    <div className={`flex flex-col bg-[#0D1226] h-screen   ${className || ''}`}>
      <div className={`flex-1 overflow-y-auto`}>{children}</div>
      <BottomNavigation hidden={hidden} />
    </div>
  );
};

export default DiceEventLayout;
