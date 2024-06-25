import React from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { Card } from '@/shared/components/ui';
import Typography from '@/shared/components/typography';

interface Hospital {
  name: string;
  address: string;
  logo: string;
}

interface HospitalListProps {
  hospitals: Hospital[];
  onClick: () => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onClick }) => {
  return (
    <div className="space-y-4">
      {hospitals.map((hospital, index) => (
        <Card
          key={index}
          className="flex items-center p-4 rounded-3xl h-24"
          onClick={onClick}
        >
          <Card className="rounded-2xl">
            <img
              src={hospital.logo}
              alt={hospital.name}
              className="w-12 h-12 p-2"
            />
          </Card>
          <div className="ml-4 flex-1">
            <Typography.Large>{hospital.name}</Typography.Large>
            <Typography.Muted>{hospital.address}</Typography.Muted>
          </div>
          <IoChevronForwardOutline className="w-6 h-6" />
        </Card>
      ))}
    </div>
  );
};

export default HospitalList;
