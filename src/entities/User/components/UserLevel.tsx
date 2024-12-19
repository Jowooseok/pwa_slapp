import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserLevel: React.FC<{
  userLv: number;
  charactorImageSrc: string;
  exp: number; 
}> = ({ userLv, charactorImageSrc, exp }) => {
  let levelClassName = '';
  let mainColor = '';

  if (userLv >= 1 && userLv <= 4) {
    levelClassName = 'lv1to4-box';
    mainColor = '#dd2726';
  } else if (userLv >= 5 && userLv <= 8) {
    levelClassName = 'lv5to8-box';
    mainColor = '#f59e0b';
  } else if (userLv >= 9 && userLv <= 12) {
    levelClassName = 'lv9to12-box';
    mainColor = '#facc15';
  } else if (userLv >= 13 && userLv <= 16) {
    levelClassName = 'lv13to16-box';
    mainColor = '#22c55e';
  } else if (userLv >= 17 && userLv <= 20) {
    levelClassName = 'lv17to20-box';
    mainColor = '#0147e5';
  }

  const roundedExp = Math.floor(exp);

  const messages = [
    "Energized!",
    "Feeling <br/>stronger!",
    "Health <br/>boost!",
    "Powered <br/>up!",
    "Ready <br/>to roll!",
    "On top <br/>form!"
  ];

  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const startCycle = () => {
      setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
      setVisible(true);

      // 3초 후 말풍선 숨기기
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      // 8초 후 다음 메시지
      showTimer = setTimeout(() => {
        startCycle();
      }, 8000);
    };

    startCycle();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [messages.length]);

  const currentMessageParts = messages[currentMsgIndex].split('<br/>');

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-3xl w-32 h-36 md:w-48 md:h-44 ${levelClassName}`}
      style={{ position: 'relative' }}
    >
      {/* 말풍선 + 문구 */}
      <div className="absolute top-1 right-1 flex justify-end w-full px-1 z-30">
        <AnimatePresence>
          {visible && (
            <motion.div
              key={currentMsgIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="relative px-2 py-1 rounded-2xl shadow-lg font-semibold text-[10px]"
              style={{
                background: '#fff',
                color: '#333',
                textAlign: 'center',
                zIndex: 30,
                overflow: 'visible', // 꼬리가 밖으로 나와도 보이게
              }}
            >
              {currentMessageParts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < currentMessageParts.length - 1 && <br />}
                </React.Fragment>
              ))}
              {/* 꼬리: bottom을 음수로 줘서 말풍선 아래로 삐져나오게 하고 overflow:visible 로 보이게 함 */}
              <div
                style={{
                  content: '',
                  position: 'absolute' as const,
                  bottom: '-3px', // 말풍선 아래로 6px
                  left: '30%',
                  transform: 'translateX(-50%) ratate(-30deg)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #fff',
                }}
              ></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 캐릭터 */}
      <img
        src={charactorImageSrc}
        className="w-24 h-24 md:w-32 md:h-32 z-20"
        alt={`Character Level ${userLv}`}
      />

      <div className="flex flex-row items-center w-full px-4 gap-2">
        <p className="font-semibold text-[8px] md:text-xs">Lv.{userLv}</p>
        <div className="flex flex-row border border-[#F59E0B] rounded-full w-full h-2 relative overflow-hidden">
          {[...Array(100)].map((_, i) => {
            let barColor = '';
            if (i < 20) barColor = '#DD2726';
            else if (i < 40) barColor = '#F59E0B';
            else if (i < 60) barColor = '#FACC15';
            else if (i < 80) barColor = '#22C55E';
            else barColor = '#0147E5';

            return (
              <div
                key={i}
                className={`w-[1%] ${i === 0 ? 'rounded-l-full' : ''} ${i === 99 ? 'rounded-r-full' : ''}`}
                style={{ backgroundColor: i < roundedExp ? barColor : 'transparent' }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserLevel;
