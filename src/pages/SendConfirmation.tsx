import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import PageHeader from '@/widgets/PageHeader';

const SendConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, amount } = location.state;

  const handleSend = () => {
    navigate('/transfer-completed', { state: { address, amount } });
  };
  return (
    <div className="p-4 space-y-6 h-full">
      <PageHeader title="Send Token" />
      <div className="text-center">
        <Typography.P>Send to</Typography.P>
        <Typography.Large>{address}</Typography.Large>
        <div className="flex flex-row items-center justify-center gap-2 mt-8">
          <Typography.H1>{amount}</Typography.H1>
          <Typography.H1>SL</Typography.H1>
        </div>
        <Typography.Muted>$ {parseFloat(amount) * 0.5}</Typography.Muted>
      </div>
      <div className="absolute bottom-8 left-0 right-0">
        <div className=" flex flex-row justify-between px-4">
          <p className=" font-medium">Transfer Fee</p>
          <p className=" font-semibold">0.15 SL</p>
        </div>
        <div className="mt-8 flex justify-between px-4 gap-4">
          <Button
            variant="outline"
            className=" h-14 w-/3 rounded-full"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button className="flex-1 h-14 rounded-full" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendConfirmation;
