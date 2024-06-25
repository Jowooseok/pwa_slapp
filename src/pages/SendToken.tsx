import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@/shared/components/ui";
import Typography from "@/shared/components/typography";
import { IoChevronForwardOutline } from "react-icons/io5";
import PageHeader from "@/widgets/PageHeader";
import { AiOutlineScan } from "react-icons/ai";
import QrScanner from "react-qr-scanner";

const SendToken: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [address, setAddress] = useState<string>("");
  const navigate = useNavigate();

  const handleScan = (data: any) => {
    if (data) {
      setAddress(data.text);
      setShowScanner(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const constraints = {
    video: { facingMode: "environment" }, // Rear-facing camera
  };

  return (
    <div className="p-4 space-y-6 h-full">
      <PageHeader title="Send Token" />
      <div>
        <Typography.Large className="mb-2 block">
          Recipient Address
        </Typography.Large>
        <div className="relative">
          <Input
            id="recipient-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full pr-10 h-14 rounded-2xl"
            type="text"
          />
          <AiOutlineScan
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
            onClick={() => setShowScanner(true)}
          />
        </div>
      </div>
      {showScanner && (
        <div className="mt-4 flex flex-col">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", borderRadius: "30px" }}
            constraints={constraints}
          />
          <Button
            className="mt-2 w-24 self-end"
            onClick={() => setShowScanner(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      <Button
        className="w-full flex flex-row justify-between rounded-full h-14"
        onClick={() => navigate("/enter-amount", { state: { address } })}
        disabled={!address}
      >
        <div> </div>
        Next
        <IoChevronForwardOutline className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SendToken;
