import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/widgets/SearchBar';
import HospitalList from '@/widgets/HospitalList';
import PageHeader from '@/widgets/PageHeader';
import Images from '@/shared/assets/images';

const hospitals = [
  {
    name: 'Acme Hospital',
    address: '123 Main St, Springfield, USA',
    logo: Images.BaseLogo,
  },
  {
    name: 'Apex Medical Center',
    address: '456 Oak Rd, Somewhere City',
    logo: Images.BaseLogo,
  },
];

const SelectHospital: React.FC = () => {
  const navigate = useNavigate();

  const handleHospitalClick = () => {
    navigate('/image-list');
  };

  return (
    <div className="p-4 space-y-6">
      <PageHeader title="Choose a hospital" />
      <SearchBar placeholder="Search for a hospital..." />
      <HospitalList hospitals={hospitals} onClick={handleHospitalClick} />
    </div>
  );
};

export default SelectHospital;
