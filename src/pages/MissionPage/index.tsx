import { TopTitle } from '@/shared/components/ui';
import './MissionPage.css';
import Images from '@/shared/assets/images';
import { Link } from 'react-router-dom';

interface OneTimeMissionCardProps {
  title: string;
  alt: string;
  image: string;
  diceNumber: number;
  starNumber: number;
  className: string;
}

const OneTimeMissionCard: React.FC<OneTimeMissionCardProps> = ({
  title,
  alt,
  image,
  diceNumber,
  starNumber,
  className,
}) => {
  return (
    <div
      className={` flex flex-col rounded-3xl  h-36 items-center justify-center gap-3  ${
        className && className
      }`}
    >
      <img src={image} alt={alt} className=" w-9 h-9" />
      <div className="flex flex-col items-center justify-center">
        <p className=" text-sm font-medium">{title}</p>
        <p className=" font-semibold text-base">
          +{diceNumber} Dice, +{starNumber} Star
        </p>
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

const MissionPage: React.FC = () => {
  return (
    <div className="flex flex-col text-white mx-6 md:mx-28">
      <TopTitle title="Mission" />
      <h1 className=" font-semibold text-lg ml-[2px] mb-4">
        One - Time Mission{' '}
      </h1>
      <div className="grid grid-cols-2 gap-3">
        <OneTimeMissionCard
          title="Follow on X"
          image={Images.Twitter}
          alt="Twitter"
          diceNumber={2}
          starNumber={50}
          className="follow-on-x-mission-card"
        />
        <OneTimeMissionCard
          title="Join Telegram"
          image={Images.Telegram}
          alt="telegram"
          diceNumber={2}
          starNumber={50}
          className="join-telegram-mission-card"
        />
        <OneTimeMissionCard
          title="Subscribe to Email"
          image={Images.Email}
          alt="Email"
          diceNumber={2}
          starNumber={50}
          className="subscribe-to-email-mission-card"
        />
        <OneTimeMissionCard
          title="Join the SL Discord"
          image={Images.Discord}
          alt="Discrod"
          diceNumber={2}
          starNumber={50}
          className="join-the-sl-discord-mission-card"
        />
        <div className=" col-span-2 basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between">
          <div className=" md:space-y-3">
            <p className="text-sm font-medium">
              Leave a Supportive Comment on SL X
            </p>

            <p className=" font-semibold">+2 Dice, +100 Star</p>
          </div>
          <img
            src={Images.LargeTwitter}
            alt="large-twitter"
            className=" w-20 h-20"
          />
        </div>
        <p className=" col-span-2 text-xs mb-8">
          * If the mission is not performed correctly, you may be excluded from
          the final reward.
        </p>
      </div>
      <h1 className=" font-semibold text-lg ml-[2px] mb-4">Daily Mission</h1>
      <Link to="/mini-game">
        <DailyMissionCard
          title="Dice Roll Game"
          alt="3d-dice-image"
          image={Images.Dice3D}
        />
      </Link>{' '}
      <Link to="/invite-friends">
        <DailyMissionCard
          title="Invite Friends"
          alt="invite-image"
          image={Images.InviteFriend}
        />
      </Link>
      <br /> <br /> <br /> <br />
      <br />
    </div>
  );
};

export default MissionPage;
