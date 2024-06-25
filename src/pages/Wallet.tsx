import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import { BiBell, BiTransferAlt } from 'react-icons/bi';
import EthImage from '@/shared/assets/eth.svg';
import {
  IoChevronDownOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoCopyOutline,
} from 'react-icons/io5';
import QRCode from 'react-qr-code';

const transactions = [
  {
    type: 'Sent',
    amount: '0.5 SL',
    date: 'June 11, 2024',
    status: 'Failed',
    address: '0x1234abcd5678efgh9012',
    direction: 'out',
  },
  {
    type: 'Received',
    amount: '0.5 SL',
    date: 'June 11, 2024',
    status: 'Succeeded',
    address: '0x1234abcd5678efgh9012',
    direction: 'in',
  },
];

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTransactionClick = (id: number) => {
    // Add functionality to handle transaction click if needed
  };

  const handleSendClick = () => {
    navigate('/send-token');
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText('0x1234abcd5678efgh9012').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /**Todoo
   * 1. 클립보드 구현하기
   */

  return (
    <div className="">
      <header className="relative p-4 h-[304px] rounded-b-3xl bg-gradient-to-br from-[#0C4FE7] to-[#7AA3FF] text-white text-center">
        <div className="flex flex-row items-center justify-between">
          <div className=" flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Typography.Large>Nick Jo</Typography.Large>
          </div>
          <BiBell className="w-6 h-6" />
        </div>
        {/**token balance, */}

        <div className="flex flex-col mt-6 gap-4">
          <Typography.P>Token Balance</Typography.P>
          <Typography.H1>1200 SL</Typography.H1>
          <div className="flex flex-row items-center justify-center gap-4">
            <img src={EthImage} alt="EthImage" className=" w-5 h-5" />
            <p>Ethereum</p>
            <IoChevronDownOutline className="w-4 h-4" />
          </div>
        </div>
        <Card className=" absolute top-[244px] bg-white rounded-3xl p-4 h-[120px] left-1/2 transform -translate-x-1/2 w-11/12 ">
          <div className="flex justify-evenly items-center h-full">
            <div className="flex flex-col justify-center items-center gap-2">
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full flex flex-col items-center w-12 h-12"
                  >
                    <IoArrowDownOutline className="w-6 h-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Receive Token</DrawerTitle>
                    <DrawerDescription>
                      Scan the QR code to receive tokens.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col items-center justify-center py-4">
                    <QRCode value="0x1234abcd5678efgh9012" size={200} />
                    <div
                      className="mt-4 flex items-center space-x-2"
                      onClick={handleCopyClick}
                    >
                      <Typography.Large>
                        0x1234abcd5678efgh9012
                      </Typography.Large>
                      <IoCopyOutline className="cursor-pointer" />
                    </div>
                    {copied && (
                      <Typography.Muted className="mt-2">
                        Address copied to clipboard!
                      </Typography.Muted>
                    )}
                  </div>
                  <DrawerFooter className="flex space-x-4">
                    <Button
                      variant="default"
                      className="rounded-full flex-1 min-h-14 h-14 "
                    >
                      Share
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              Receive
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full flex flex-col items-center w-12 h-12"
                onClick={handleSendClick}
              >
                <IoArrowUpOutline className="w-6 h-6" />
              </Button>
              Send
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full flex flex-col items-center w-12 h-12"
              >
                <BiTransferAlt className="w-6 h-6" />
              </Button>
              Staking
            </div>
          </div>
        </Card>
      </header>

      <div className="p-4 mt-12">
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <Typography.H4>Transaction</Typography.H4>
            <Typography.Muted
              className="cursor-pointer"
              onClick={() => navigate('/transactions')}
            >
              View All
            </Typography.Muted>
          </div>
          <div className="space-y-4 mt-4">
            {transactions.map((transaction, index) => (
              <Card
                key={index}
                className="p-4 rounded-3xl"
                onClick={() => handleTransactionClick(index)}
              >
                <div className="flex items-center p-2">
                  <div className="flex flex-row items-center w-full">
                    <div className="w-full space-y-2">
                      <div className="flex flex-row items-center">
                        <div
                          className={`rounded-full bg-opacity-10 w-10 h-10 flex justify-center items-center min-w-10 min-h-10 ${
                            transaction.direction === 'in'
                              ? 'bg-blue-700'
                              : 'bg-red-600'
                          }`}
                        >
                          <IoArrowDownOutline
                            className={`w-6 h-6 ${
                              transaction.type === 'Sent'
                                ? 'rotate-180 text-red-600'
                                : 'text-blue-700'
                            }`}
                          />
                        </div>
                        <div className="ml-4 flex flex-col w-full">
                          <div className="flex flex-row justify-between w-full">
                            <Typography.Large>
                              {transaction.type}
                            </Typography.Large>
                            <Typography.Large
                              className={
                                transaction.direction === 'in'
                                  ? 'text-blue-700'
                                  : 'text-red-600'
                              }
                            >
                              {transaction.direction === 'in' ? '+' : '-'}{' '}
                              {transaction.amount}
                            </Typography.Large>
                          </div>
                          <div className="flex flex-row justify-between">
                            <Typography.Muted className="truncate max-w-[15ch]">
                              {transaction.address}
                            </Typography.Muted>
                            <Typography.Muted>
                              {transaction.date}
                            </Typography.Muted>
                          </div>
                        </div>
                      </div>

                      <div className="border-b"></div>
                      <div className="flex flex-row items-center justify-between w-full ">
                        <p>Status</p>
                        <p
                          className={
                            transaction.direction === 'in'
                              ? 'text-blue-700'
                              : 'text-red-600'
                          }
                        >
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
