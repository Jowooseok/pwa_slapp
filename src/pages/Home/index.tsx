import { TopTitle } from '@/shared/components/ui';
import './Home.css';
import Images from '@/shared/assets/images';

interface HomeMenuProps {
  title: string;
  alt: string;
  image: string;

  className: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({
  title,
  alt,
  image,
  className,
}) => {
  return (
    <div
      className={`flex flex-col rounded-3xl h-40 items-center justify-center gap-3  ${
        className && className
      }`}
    >
      <img src={image} alt={alt} className=" w-16 h-16" />
      <div className="flex flex-col items-center justify-center">
        <p className=" text-sm font-semibold text-center">{title}</p>
      </div>
    </div>
  );
};

interface DailyMissionProps {
  title: string;
  image: string;
  alt: string;
}

const DailyMissionCard: React.FC<DailyMissionProps> = ({
  title,
  image,
  alt,
}) => {
  return (
    <div className="basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between mb-3">
      <div className=" space-y-3">
        <p className="text-xl font-semibold">{title}</p>
        <p className=" text-sm">
          Earn various rewards <br className="md:hidden" /> such as dice,
          points, SL coins
        </p>
      </div>
      <img src={image} alt={alt} className=" w-24 h-24" />
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="flex flex-col text-white mx-6 md:mx-28">
      <TopTitle title="Pet Health Management" />
      <div className="grid grid-cols-2 gap-3">
        <HomeMenu
          title="AI-based real-time dental analysis"
          image={Images.HomeTooth}
          alt="HomeTooth"

          className="follow-on-x-mission-card"
        />
        <HomeMenu
          title="AI-based dental X-ray analysis"
          image={Images.HomeXray}
          alt="HomeXray"
  
          className="join-telegram-mission-card"
        />
        <HomeMenu
          title="Viewing Records"
          image={Images.HomeReport}
          alt="HomeReport"
       className="join-the-sl-discord-mission-card"
        />
        <HomeMenu
          title="Animal Dice game"
          image={Images.Dice3D}
          alt="Dice3D"
                className="subscribe-to-email-mission-card"
        />
        </div>
      <br /> <br /> <br /> <br />
      <br />
    </div>
  );
};

export default Home;
