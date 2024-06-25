import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { AiOutlineUser, AiOutlineHome } from 'react-icons/ai';
import { BiWallet, BiImages } from 'react-icons/bi';

const CustomBottomNavigationAction = styled(BottomNavigationAction)(
  ({ theme }) => ({
    '&.Mui-selected': {
      color: '#18181B', // 선택되었을 때 아이콘 및 라벨 색상
    },
    color: '#d1d5db', // 기본 아이콘 색상
  }),
);

export default function LabelBottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [value, setValue] = React.useState(location.pathname);

  React.useEffect(() => {
    if (location.pathname === '/images' && location.state?.fromHome) {
      setValue('/images');
    } else {
      setValue(location.pathname);
    }
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <BottomNavigation
      sx={{
        width: '100%',
        position: 'fixed',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        bottom: 0,
        '& .MuiTouchRipple-ripple': {
          color: '#ffffff', // 터치 영역 퍼지는 색상
        },
      }}
      value={value}
      onChange={handleChange}
      className="w-full fixed bottom-0 bg-white border-gray-200 drop-shadow-2xl"
    >
      <CustomBottomNavigationAction
        label="Home"
        value="/"
        icon={<AiOutlineHome className="w-5 h-5" />}
      />
      <CustomBottomNavigationAction
        label="Images"
        value="/images"
        icon={<BiImages className="w-5 h-5" />}
      />
      <CustomBottomNavigationAction
        label="Wallet"
        value="/wallet"
        icon={<BiWallet className="w-5 h-5" />}
      />
      <CustomBottomNavigationAction
        label="Profile"
        value="/profile"
        icon={<AiOutlineUser className="w-5 h-5" />}
      />
    </BottomNavigation>
  );
}
