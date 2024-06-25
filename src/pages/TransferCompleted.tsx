import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import { FiCheck } from 'react-icons/fi';

const TransferCompleted: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, amount } = location.state;

  return (
    <div className="flex flex-col h-full p-4 space-y-6 gap-4">
      <div className="flex flex-col items-center gap-8 mt-28">
        <div className=" rounded-full bg-blue-700 flex  items-center justify-center h-16 w-16">
          <FiCheck className="w-12 h-12 text-white" />
        </div>
        <p className=" font-semibold text-2xl">Transfer Completed!</p>
      </div>
      <Card className="p-5 space-y-6 rounded-3xl flex flex-col">
        <div className="flex justify-between py-1 pb-5 border-b">
          <Typography.Muted>Address</Typography.Muted>
          <Typography.Small>{address}</Typography.Small>
        </div>
        <div className="flex justify-between py-1 pb-5 border-b">
          <Typography.Muted>Amount sent</Typography.Muted>
          <Typography.Small>{amount} SL</Typography.Small>
        </div>
        <div className="flex justify-between py-1 pb-5 border-b">
          <Typography.Muted>Transfer fee</Typography.Muted>
          <Typography.Small>0.15 SL</Typography.Small>
        </div>
        <div className="flex justify-between py-1">
          <Typography.Muted>Total</Typography.Muted>
          <Typography.Small>{parseFloat(amount) + 0.15} SL</Typography.Small>
        </div>
      </Card>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between gap-4">
          <Button
            className="flex-1 h-14 rounded-full"
            onClick={() => navigate('/wallet')}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferCompleted;
