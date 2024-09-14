import React, { useState } from 'react';
import Images from '@/shared/assets/images';

const SelectCharacter: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<'dog' | 'cat'>(
    'dog',
  );

  return (
    <div className="flex flex-col bg-[#0D1226] h-screen text-white items-center">
      <h2 className=" font-semibold text-xl text-center mt-32">
        Save the Life!
        <br />
        Chose your character!
      </h2>
      <div className="flex flex-row mt-14 gap-3">
        <div
          className="flex flex-col items-center justify-center gap-3 cursor-pointer"
          onClick={() => setSelectedCharacter('dog')}
        >
          <div
            className={`w-40 h-48 rounded-[30px] border-2 ${
              selectedCharacter === 'dog'
                ? 'border-[#0147E5] bg-[#1E1B4B]'
                : 'border-[#737373] bg-[#1f1e27]'
            } flex items-center justify-center`}
          >
            <img
              src={
                selectedCharacter === 'dog'
                  ? Images.DogLv19to20
                  : Images.DogLv1to2
              }
              alt="dog"
              className="w-36 h-36"
            />
          </div>
          <div
            className={`flex w-11 h-7 border rounded-full items-center justify-center text-xs font-medium ${
              selectedCharacter === 'dog'
                ? 'border-white text-white'
                : 'border-[#737373]'
            }`}
          >
            Dog
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-3 cursor-pointer"
          onClick={() => setSelectedCharacter('cat')}
        >
          <div
            className={`w-40 h-48 rounded-[30px] border-2 ${
              selectedCharacter === 'cat'
                ? 'border-[#0147E5] bg-[#1E1B4B]'
                : 'border-[#737373] bg-[#1f1e27]'
            } flex items-center justify-center`}
          >
            <img
              src={
                selectedCharacter === 'cat'
                  ? Images.CatLv19to20
                  : Images.CatLv1to2
              }
              alt="cat"
              className="w-36 h-36"
            />
          </div>
          <div
            className={`flex w-11 h-7 border rounded-full items-center justify-center text-xs font-medium ${
              selectedCharacter === 'cat'
                ? 'border-white text-white'
                : 'border-[#737373]'
            }`}
          >
            Cat
          </div>
        </div>
      </div>
      <div className="bottom-10 absolute flex w-full self-center">
        <button className="h-14 bg-[#0147e5] rounded-full w-full mx-6">
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectCharacter;
