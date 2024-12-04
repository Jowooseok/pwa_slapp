// src\pages\PreviousRewards\index.tsx
import React, { useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

const PreviousRewards: React.FC = () => {
  return (
    <div className="flex flex-col  mb-44 text-white items-center w-full ">
      <TopTitle title="Last month's results" />

      <Tabs defaultValue="ranking" className=" w-full rounded-none">
        <TabsList className="grid w-full grid-cols-2 rounded-none outline-none bg-[#0D1226]">
          <TabsTrigger
            value="ranking"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-#0D1226 text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="raffle"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-#0D1226 text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Raffle
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="ranking"
          className="px-6  bg-[#0D1226] text-white w-full h-full"
        >
          <div className="text-white">asdadasdasdasdasd</div>
        </TabsContent>
        <TabsContent value="raffle" className="px-6 bg-[#0D1226]  text-white">
          asdad
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
