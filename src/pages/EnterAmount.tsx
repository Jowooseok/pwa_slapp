import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import PageHeader from '@/widgets/PageHeader';
import { IoChevronForwardOutline, IoArrowBackOutline } from 'react-icons/io5';

const EnterAmount: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = location.state;
  const [amount, setAmount] = useState('');

  const handleNumberClick = (num: string) => {
    setAmount((prevAmount) => prevAmount + num);
  };

  const handleDeleteClick = () => {
    setAmount((prevAmount) => prevAmount.slice(0, -1));
  };

  return (
    <div className=" space-y-6 h-full">
      <PageHeader title="Send Token" className="p-4" />
      <div className="text-center px-4">
        <Typography.P>Send to</Typography.P>
        <Badge>{address}</Badge>
        <div className="flex flex-row items-center justify-center gap-2 mt-8">
          <Typography.H1>{amount || '0'}</Typography.H1>
          <Typography.H1>SL</Typography.H1>
        </div>
        <Typography.Muted>$ {parseFloat(amount) * 0.5}</Typography.Muted>

        <Button
          className="w-full flex flex-row justify-between rounded-full h-14 mt-8"
          onClick={() =>
            navigate('/send-confirmation', { state: { address, amount } })
          }
          disabled={!amount}
        >
          <div> </div>
          Next
          <IoChevronForwardOutline className="w-5 h-5" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 my-4 bg-[#e7e7e7] p-4 bottom-0 absolute w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'].map((num) => (
          <Button
            key={num}
            variant={'ghost'}
            className="h-14 flex justify-center items-center text-3xl "
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}

        <Button
          className="h-14 flex justify-center items-center"
          variant={'ghost'}
          onClick={handleDeleteClick}
        >
          <IoArrowBackOutline className="w-10 h-10" />
        </Button>
        <div className=" col-span-3 h-8"></div>
      </div>
    </div>
  );
};

export default EnterAmount;
