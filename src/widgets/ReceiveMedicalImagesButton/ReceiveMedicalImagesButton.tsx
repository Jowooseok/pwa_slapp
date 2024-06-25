import React from 'react';
import { Button } from '@/shared/components/ui';
import { HiDownload } from 'react-icons/hi';

interface ReceiveMedicalImagesButtonProps {
  onClick: () => void;
}

const ReceiveMedicalImagesButton: React.FC<ReceiveMedicalImagesButtonProps> = ({
  onClick,
}) => {
  return (
    <Button
      className="text-white w-full mt-4 flex items-center justify-center rounded-full h-14"
      onClick={onClick}
    >
      <HiDownload className="mr-2 w-5 h-5" />
      Get Medical Imaging
    </Button>
  );
};

export default ReceiveMedicalImagesButton;
