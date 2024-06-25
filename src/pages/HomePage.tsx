import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationCarousel from '@/widgets/NotificationCarousel';
import TokenBalance from '@/widgets/TokenBalance';
import ReceiveMedicalImagesButton from '@/widgets/ReceiveMedicalImagesButton';
import RecentDiagnosis from '@/widgets/RecentDiagnosis';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetMedicalImaging = () => {
    navigate('/select-hospital');
  };

  return (
    <div className="space-y-6">
      <TokenBalance />
      <div className="p-4 pt-0">
        <NotificationCarousel />
        <ReceiveMedicalImagesButton onClick={handleGetMedicalImaging} />
        <RecentDiagnosis />
      </div>
    </div>
  );
};

export default HomePage;
