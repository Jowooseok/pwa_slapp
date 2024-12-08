// src/widgets/PreviousRewards/ui/RewardSelectionDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";

interface RewardSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  data: PlayerData | null;
  onSelect: (type: "USDT" | "SL") => void;
}

const RewardSelectionDialog: React.FC<RewardSelectionDialogProps> = ({open, onClose, data, onSelect}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm p-6 flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Choose your reward type</DialogTitle>
          <DialogDescription>
            Please select how you want to receive your reward.
          </DialogDescription>
        </DialogHeader>

        {data && (
          <div className="text-sm font-normal text-[#a3a3a3] p-2 border rounded-md">
            <p><strong>Rank:</strong> {data.rank}</p>
            <p><strong>User ID:</strong> {data.userId}</p>
            <p><strong>SL Rewards:</strong> {(data.slRewards ?? 0).toLocaleString()}</p>
            <p><strong>USDT Rewards:</strong> {(data.usdtRewards ?? 0).toLocaleString()}</p>
            {data.nftType && <p><strong>NFT:</strong> {data.nftType}</p>}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            className="bg-[#0147E5] rounded-full w-full h-12 font-medium"
            onClick={() => onSelect("USDT")}
          >
            Receive as USDT
          </button>
          <button
            className="bg-[#0147E5] rounded-full w-full h-12 font-medium"
            onClick={() => onSelect("SL")}
          >
            Receive as SL
          </button>
        </div>
        <DialogClose asChild>
          <button className="text-white mt-3">Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default RewardSelectionDialog;
