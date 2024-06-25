import React from 'react';
import { Card } from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import Imgs from '@/shared/assets/images';

const TokenBalance: React.FC = () => {
  return (
    <Card className="bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-b-3xl rounded-t-none">
      <div className="p-6 text-center">
        <img
          src={Imgs.HorizontalLogo}
          alt="HorizontalLogo"
          className="h-5 md:h-6 mx-auto"
        />
        <Typography.P>Token Balance</Typography.P>
        <Typography.H1>30 SL</Typography.H1>
      </div>
    </Card>
  );
};

export default TokenBalance;
