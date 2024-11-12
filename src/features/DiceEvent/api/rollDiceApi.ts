// src\features\DiceEvent\api\rollDiceApi.ts

import api from '@/shared/api/axiosInstance';

interface RollDiceResponseData {
  rank: number;
  star: number;
  ticket: number;
  dice: number;
  slToken: number;
  diceResult: number;
  tileSequence: number;
}

export const rollDiceAPI = async (gauge: number): Promise<RollDiceResponseData> => {
  const response = await api.post('/roll-dice', { gauge });

  if (response.data.code === 'OK') {
    console.log(response.data.data)
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Roll dice failed');
  }
};