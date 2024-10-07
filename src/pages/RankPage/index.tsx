import { TopTitle } from '@/shared/components/ui';
import MyRankingWidget from '@/widgets/MyRanking/MyRankingWidget';
import './RankPage.css';
import Images from '@/shared/assets/images';

const RankPage: React.FC = () => {
  return (
    <div className="flex flex-col text-white  mx-6 md:mx-28 mb-44">
      <TopTitle title="Rank" />
      <MyRankingWidget />
      <div className=" mt-7 flex flex-col items-center">
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
        </div>

        {/**4등 ~ 컴포넌트 */}
        <div className="flex flex-col gap-3 md:w-[595.95px] w-[332px] justify-center items-center mt-8">
          <div className=" h-16 w-full flex flex-row items-center justify-between border-b">
            <p>4</p>
            <p>medpro1@gamil.com</p>
            <p className=" font-semibold text-lg">2,456</p>
          </div>
        </div>

        <button className=" border rounded-full mt-6 flex items-center justify-center w-[66px] h-7 font-medium text-xs mb-8">
          {' '}
          View All
        </button>
      </div>
      <div className="flex flex-col items-center justify-center  gap-4">
        <h1 className="font-jalnan text-3xl mb-4 w-full text-center">
          This month Prize
        </h1>
        <div className=" md:w-[595.95px] w-[332px]  h-60 bg-white flex flex-col rounded-3xl  items-center justify-center gap-3">
          <img
            src={Images.PrizeImage}
            alt="prize-image"
            className=" w-32 h-32"
          />
          <p className="text-[#171717] font-semibold text-center">
            $8,000 in SL or USDT for top 100, <br />
            awarded on a sliding scale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RankPage;
