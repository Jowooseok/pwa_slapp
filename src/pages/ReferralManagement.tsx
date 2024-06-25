import React from 'react';
import { Card, Button, Input } from '@/shared/components/ui';
import Typography from '@/shared/components/typography';
import { IoCopyOutline } from 'react-icons/io5';
import PageHeader from '@/widgets/PageHeader';

const ReferralManagement: React.FC = () => {
  const referralCode = '0x1234abcd5678efgh9012';

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard');
  };

  return (
    <div className="p-4 space-y-6">
      <PageHeader title="Referral Management" />

      <Card className="space-y-2 p-4">
        <Typography.H4>Your Referral Code</Typography.H4>
        <div className="flex items-center space-x-2">
          <Input value={referralCode} readOnly className="flex-1" />
          <IoCopyOutline
            className="cursor-pointer"
            onClick={handleCopyToClipboard}
          />
        </div>
        <Button className="w-full mt-4 h-12 rounded-full">
          Share Your Code
        </Button>
      </Card>
      <Card className="space-y-2 p-4">
        <Typography.H4>Referral Status</Typography.H4>
        <Typography.P>Total Referrals: 10</Typography.P>
        <Typography.P>Total Earned: 50 SL</Typography.P>
      </Card>
      <Card className="space-y-2 p-4">
        <Typography.H4>Referrals Received</Typography.H4>
        {/* 추천 받은 내역을 여기에 표시 */}
        <Typography.P>0x5678efgh9012abcd1234</Typography.P>
        <Typography.P>0xabcdef1234567890ghij</Typography.P>
        {/* 더 많은 추천 내역 추가 */}
      </Card>
    </div>
  );
};

export default ReferralManagement;
