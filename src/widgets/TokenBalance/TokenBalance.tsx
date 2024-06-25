import React from "react";
import { Card } from "@/shared/components/ui";
import Typography from "@/shared/components/typography";
import Imgs from "@/shared/assets/images";

const TokenBalance: React.FC = () => {
  return (
    <Card className="bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-b-3xl rounded-t-none  h-36 md:h-40">
      <div className="p-6 text-center flex justify-center items-center h-full">
        <img
          src={Imgs.HorizontalLogo}
          alt="HorizontalLogo"
          className="h-7 md:h-10 mx-auto"
        />
      </div>
    </Card>
  );
};

export default TokenBalance;
