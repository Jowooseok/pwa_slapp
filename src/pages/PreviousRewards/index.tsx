// src\pages\PreviousRewards\index.tsx
import React, { useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import "./PreviousRewards.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { IoCaretDown } from "react-icons/io5";

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
          className="p-6  bg-[#0D1226] text-white w-full h-full"
        >
          <div>
            {/** 받을 보상이 있는 경우 */}
            <p className=" font-semibold">
              Congratulations! Here’s your reward :{" "}
            </p>
            <div className="flex flex-row items-center box-bg rounded-3xl h-24 border-2 border-[#0147E5] mt-3 p-5 gap-3 ">
              <p>1</p>
              <div className="flex flex-col gap-1">
                <p>healthheror123@gamil.com</p>
                <div className="flex flex-row items-center gap-1">
                  <img
                    src={Images.TokenReward}
                    alt="token"
                    className="w-5 h-5"
                  />
                  <p className="text-sm font-semibold">
                    10,000{" "}
                    <span className="font-normal text-[#a3a3a3]">
                      (or 1,000 USDT)
                    </span>{" "}
                    + Gold NFT
                  </p>
                </div>
              </div>
            </div>
            <button className="bg-[#0147E5] rounded-full w-full h-14 mt-3 font-medium">
              Get Rewarded
            </button>
          </div>
          <div className="flex flex-col mt-8">
            {/** 1위~20위 랭킹 */}
            <div className="flex flex-row items-center p-4 border-b justify-around ">
              <p>1</p>
              <div className="flex flex-col gap-1">
                <p>healthheror123@gamil.com</p>
                <div className="flex flex-row items-center gap-1">
                  <img
                    src={Images.TokenReward}
                    alt="token"
                    className="w-5 h-5"
                  />
                  <p className="text-sm font-semibold">
                    10,000{" "}
                    <span className="font-normal text-[#a3a3a3]">
                      (or 1,000 USDT)
                    </span>{" "}
                    + Gold NFT
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center p-4 border-b justify-around ">
              <p>2</p>
              <div className="flex flex-col gap-1">
                <p>careasqeust@gamil.com</p>
                <div className="flex flex-row items-center gap-1">
                  <img src={Images.Usdt} alt="token" className="w-5 h-5" />
                  <p className="text-sm font-semibold">
                    10,000{" "}
                    <span className="font-normal text-[#a3a3a3]">
                      (or 1,000 USDT)
                    </span>{" "}
                    + Gold NFT
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-14 space-y-4">
            {/** 21위~100위 랭킹 */}

            <Dialog>
              <DialogTrigger className="w-full">
                {" "}
                <div className="flex flex-row justify-between items-center ">
                  <div className="flex flex-row items-center gap-2">
                    21-100 <IoCaretDown className={"w-5 h-5"} />
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <img
                      src={Images.TokenReward}
                      alt="token"
                      className="w-5 h-5"
                    />
                    <p className="text-sm font-semibold">
                      500{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or 50 USDT)
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="  text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
                <h1 className="text-center font-bold text-lg">21-100</h1>
                <div className="flex flex-row gap-10 border-b pb-2 truncate ">
                  <p>21</p>
                  <p> helalsldw@gamil.com</p>
                </div>
                {/** 내등수라면 텍스트 색상, 폰트 변경 */}
                <div className="flex flex-row gap-10 border-b pb-2 text-[#fde047]  font-bold truncate">
                  <p>22</p>
                  <p> helalsldw23@gamil.com</p>
                </div>{" "}
                <div className="flex flex-row gap-10 border-b pb-2 truncate">
                  <p>23</p>
                  <p> helalsldw4@gamil.com</p>
                </div>{" "}
                <div className="flex flex-row gap-10 border-b pb-2 truncate">
                  <p>24</p>
                  <p> helalsldw5@gamil.com</p>
                </div>
                {/** 내 등수 표시, 없으면 표시x */}
                <div className="flex flex-row rounded-2xl border-2 border-[#0147e5] p-5 box-bg gap-4 ">
                    <p>22</p>
                    <p> helalsldw23@gamil.com</p>
                </div>
              </DialogContent>
            </Dialog>

            <div className="w-full border-b"></div>
            {/** 101-500 */}
            <div className="flex flex-row justify-between items-center  ">
              <div className="flex flex-row items-center gap-2">
                101-500 <IoCaretDown className={"w-5 h-5"} />
              </div>
              <div className="flex flex-row items-center gap-1">
                <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                <p className="text-sm font-semibold">
                  25{" "}
                  <span className="font-normal text-[#a3a3a3]">
                    (or 2.5 USDT)
                  </span>{" "}
                </p>
              </div>
            </div>
            <div className="w-full border-b"></div>
            {/** 501-1000 */}
            <div className="flex flex-row justify-between items-center ">
              <div className="flex flex-row items-center gap-2">
                501-1000 <IoCaretDown className={"w-5 h-5"} />
              </div>
              <div className="flex flex-row items-center gap-1">
                <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                <p className="text-sm font-semibold">
                  10{" "}
                  <span className="font-normal text-[#a3a3a3]">
                    (or 1 USDT)
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="raffle" className="p-6 bg-[#0D1226]  text-white">
          asdad
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
