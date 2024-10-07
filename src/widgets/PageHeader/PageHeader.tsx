import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';

interface PageHeaderProps {
  title: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, className }) => {
  const navigate = useNavigate();

  return (
    <header
      className={`h-14 flex items-center justify-center font-bold text-xl mb-8 ${className}`}
    >
      <button onClick={() => navigate(-1)}>
        <IoChevronBackOutline className="w-6 h-6" />
      </button>
      <p>{title}</p>
      <span> </span>
    </header>
  );
};

export default PageHeader;
