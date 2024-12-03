import { TopTitle } from "@/shared/components/ui";
import MyRankingWidget from "@/widgets/MyRanking/MyRankingWidget";
import "./Reward.css";
import Images from "@/shared/assets/images";

const Reward: React.FC = () => {
  return (
    <div className="flex flex-col text-white  mx-6 mb-44 md:w-[595.95px]">
      <TopTitle title="Rewards" />
      <div className="flex flex-row items-center justify-between mb-11 ">
        <div className="text-center cursor-pointer">
          Last month's
          <br />
          Results
        </div>
        <div className="text-center cursor-pointer">
          This month's
          <br />
          Awards
        </div>
        <div className="text-center cursor-pointer">
          Ranking
          <br />
          Status
        </div>
      </div>

      {/**클릭시 이전 랭킹(상품)결과로 이동 */}
      <div className="first-to-third-pace-box h-36 rounded-3xl  mb-14 flex flex-row items-center justify-around p-5   cursor-pointer">
        <div className="flex flex-col gap-2 ">
          <p className="text-xl font-semibold">Previous Rewards</p>
          <p className="text-sm">
            See your rankings and rewards from last month!
          </p>
        </div>
        <img src={Images.Trophy} alt="trophy" className=" w-24 h-24" />
      </div>

      {/**이번달 경품 보여주기 */}
      <div className="flex flex-col gap-3  justify-center items-center mb-14">
        <div className=" relative text-center font-jalnan text-3xl mb-6 z-10">
          <h1 className=" z-30">
          This Month's
          <br />
          Ranking Awards
          </h1>
          <img
            src={Images.GoldMedal}
            alt="gold-medal"
            className="absolute -top-1 -left-11  w-[70px] h-[70px] -z-10"
          />
        </div>
        {/** 1등부터 3등상품 */}
        <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4">
          <p>1</p>
          <div className="flex flex-row gap-1 font-medium items-center">
            <img
              src={Images.TokenReward}
              alt="token-reward"
              className="w-6 h-6"
            />
            <p>
              10,000 <span className="text-[#A3A3A3]">(or 1,000 UDST)</span> +
              Gold NFT
            </p>
          </div>
        </div>
        <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4">
          <p>2</p>
          <div className="flex flex-row gap-1 font-medium items-center">
            <img
              src={Images.TokenReward}
              alt="token-reward"
              className="w-6 h-6"
            />
            <p>
              5,000 <span className="text-[#A3A3A3]">(or 500 UDST)</span> +
              Silver NFT
            </p>
          </div>
        </div>
        <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4">
          <p>3</p>
          <div className="flex flex-row gap-1 font-medium items-center">
            <img
              src={Images.TokenReward}
              alt="token-reward"
              className="w-6 h-6"
            />
            <p>
              3,000 <span className="text-[#A3A3A3]">(or 300 UDST)</span> +
              Bronze NFT
            </p>
          </div>
        </div>

        {/**4등부터 1000등 상품 */}
        <div className="flex flex-col gap-2 justify-center items-center w-full ">
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>4-5</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                1,000 <span className="text-[#A3A3A3]">(or 100 UDST)</span>
              </p>
            </div>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>6-100</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                500 <span className="text-[#A3A3A3]">(or 50 UDST)</span>
              </p>
            </div>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>101-500</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                50 <span className="text-[#A3A3A3]">(or 5 UDST)</span>
              </p>
            </div>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>501-1000</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                20 <span className="text-[#A3A3A3]">(or 2 UDST)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

         {/**이번달 추첨권 경품 보여주기 */}
         <div className="flex flex-col gap-3  justify-center items-center mb-14">
         <div className=" relative text-center font-jalnan text-3xl mb-6 z-10">
          <h1 className=" z-30">
          This Month's
          <br />
          Raffle Awards
          </h1>
          <img
            src={Images.LotteryTicket}
            alt="Raffle"
            className="absolute -top-1 -right-12  w-[68px] h-[68px] -z-10"
          />
        </div>
        {/** 1등부터 3등상품 */}
        <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4">
          <p>1</p>
          <div className="flex flex-row gap-1 font-medium items-center">
            <img
              src={Images.TokenReward}
              alt="token-reward"
              className="w-6 h-6"
            />
            <p>
              10,000 <span className="text-[#A3A3A3]">(or 1,000 UDST)</span> +
              Gold NFT
            </p>
          </div>
        </div>
        <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4">
          <p>2</p>
          <div className="flex flex-row gap-1 font-medium items-center">
            <img
              src={Images.TokenReward}
              alt="token-reward"
              className="w-6 h-6"
            />
            <p>
              5,000 <span className="text-[#A3A3A3]">(or 500 UDST)</span> +
              Silver NFT
            </p>
          </div>
        </div>
        <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-center gap-4">
          <p>3</p>
          <div className="flex flex-row gap-1 font-medium items-center">
            <img
              src={Images.TokenReward}
              alt="token-reward"
              className="w-6 h-6"
            />
            <p>
              3,000 <span className="text-[#A3A3A3]">(or 300 UDST)</span> +
              Bronze NFT
            </p>
          </div>
        </div>

        {/**4등부터 1000등 상품 */}
        <div className="flex flex-col gap-2 justify-center items-center w-full ">
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>4-5</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                1,000 <span className="text-[#A3A3A3]">(or 100 UDST)</span>
              </p>
            </div>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>6-100</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                500 <span className="text-[#A3A3A3]">(or 50 UDST)</span>
              </p>
            </div>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>101-500</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                50 <span className="text-[#A3A3A3]">(or 5 UDST)</span>
              </p>
            </div>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>501-1000</p>
            <div className="flex flex-row items-center gap-2">
              <img
                src={Images.TokenReward}
                alt="token-reward"
                className="w-6 h-6"
              />
              <p className="">
                20 <span className="text-[#A3A3A3]">(or 2 UDST)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <MyRankingWidget />
      <div className=" mt-14 flex flex-col items-center">
        <h1 className="font-jalnan text-3xl mb-4">Leader Board</h1>
        {/**1~3등 컴포넌트 */}
        <div className="flex flex-col gap-3 md:w-[595.95px] w-[332px] justify-center items-center">
          <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-around">
            <div className="flex flex-row gap-4 text-lg font-medium items-center">
              <p>1</p>
              <p>medpro1@gamil.com</p>
            </div>
            <p className="text-[#fde047] font-semibold text-xl">2,456</p>
          </div>
          <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-around">
            <div className="flex flex-row gap-4 text-lg font-medium items-center">
              <p>2</p>
              <p>medpro1@gamil.com</p>
            </div>
            <p className="text-[#fde047] font-semibold text-xl">2,456</p>
          </div>
          <div className=" h-16 w-full rounded-3xl first-to-third-pace-box flex flex-row items-center justify-around">
            <div className="flex flex-row gap-4 text-lg font-medium items-center">
              <p>3</p>
              <p>medpro1@gamil.com</p>
            </div>
            <p className="text-[#fde047] font-semibold text-xl">2,456</p>
          </div>
        </div>

        {/**4등 ~ 100등 컴포넌트 */}
        <div className="flex flex-col gap-2 w-full justify-center items-center mt-4">
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>4</p>
            <p>medpro1@gamil.com</p>
            <p className=" font-semibold text-lg">2,456</p>
          </div>
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>5</p>
            <p>medpro1@gamil.com</p>
            <p className=" font-semibold text-lg">2,456</p>
          </div>
        </div>

        <button className=" border rounded-full mt-6 flex items-center justify-center w-[80px] h-7 font-medium text-xs mb-8">
          {" "}
          View More
        </button>
      </div>
    </div>
  );
};

export default Reward;
