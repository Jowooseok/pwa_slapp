import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
} from "@/shared/components/ui";
import Typography from "@/shared/components/typography";
import { IoChevronForwardOutline, IoShareOutline } from "react-icons/io5";
import { AiOutlineSetting } from "react-icons/ai";
import { BiShareAlt, BiBell, BiCheckShield, BiHistory } from "react-icons/bi";
import { MdOutlineLock } from "react-icons/md";
import { BsPeople } from "react-icons/bs";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleInviteFriends = () => {
    navigate("/referral-management");
  };

  return (
    <div className="p-4 space-y-2">
      <header className={`flex items-center space-x-4 justify-between `}>
        <span>&nbsp; </span>
        <Typography.H3>Profile</Typography.H3>
        <AiOutlineSetting className=" w-6 h-6" />
      </header>
      <div className="p-4">
        <div className="flex flex-row items-center gap-2 justify-between ">
          <div className="flex flex-row gap-4">
            <Avatar className=" w-14 h-14">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {" "}
              <Typography.Large>Nick Jo</Typography.Large>
              <Typography.Muted className="text-gray-500">
                nick@gmail.com
              </Typography.Muted>
            </div>
          </div>
          <IoChevronForwardOutline className=" w-6 h-6" />
        </div>
        <Button className="w-full mt-4 h-12 rounded-full">
          <IoShareOutline className="w-5 h-5 mr-2" />
          Invite Friends and Earn SL
        </Button>
      </div>
      <Card className="space-y-4 p-5 rounded-3xl">
        <p className="text-[#737373] font-semibold">Settings</p>
        <div className="flex items-center justify-between">
          <div
            className="flex flex-row items-center gap-4"
            onClick={handleInviteFriends}
          >
            <BsPeople className="w-5 h-5" />
            <p className=" text-sm ">Referral Management</p>
          </div>
          <IoChevronForwardOutline />
        </div>
        <div className=" border-b"></div>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <BiBell className="w-5 h-5" />
            <p className=" text-sm ">Notification Settings</p>
          </div>
          <IoChevronForwardOutline />
        </div>
      </Card>
      <Card className="space-y-4 p-5 rounded-3xl">
        <p className="text-[#737373] font-semibold">Account Settings</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <MdOutlineLock className="w-5 h-5" />
            <p className=" text-sm ">Change Password</p>
          </div>
          <IoChevronForwardOutline />
        </div>
        <div className=" border-b"></div>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <BiShareAlt className="w-5 h-5" />
            <p className=" text-sm ">Share Profile</p>
          </div>
          <IoChevronForwardOutline />
        </div>
      </Card>
      <Card className="space-y-4 p-5 rounded-3xl">
        <p className="text-[#737373] font-semibold">Security Settings</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <BiCheckShield className="w-5 h-5" />
            <p className=" text-sm ">Two-Factor Authentication</p>
          </div>
          <IoChevronForwardOutline />
        </div>
        <div className=" border-b"></div>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <BiHistory className="w-5 h-5" />
            <p className=" text-sm ">Login History</p>
          </div>
          <IoChevronForwardOutline />
        </div>
      </Card>
    </div>
  );
};

export default Profile;
