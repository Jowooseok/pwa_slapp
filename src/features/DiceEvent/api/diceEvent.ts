import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDiceEventStore } from "../store/diceEventStore"; // 상태 저장소 사용

const fetchDiceEventData = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/home`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dice event data");
  }

  return response.json();
};

export const useDiceEventDataQuery = () => {
  const { setPosition, setDiceCount, setStarPoints, setLotteryCount } =
    useDiceEventStore(); // 스토어 상태 업데이트

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["diceEventData"],
    queryFn: fetchDiceEventData,
  });

  // 데이터를 성공적으로 받아오면 상태 업데이트
  useEffect(() => {
    if (data) {
      const { nowDice, rank } = data.data;
      setPosition(nowDice.currentTileId);
      setDiceCount(nowDice.dice);
      setStarPoints(rank.star);
      setLotteryCount(rank.ticket);
    }
  }, [data, setPosition, setDiceCount, setStarPoints, setLotteryCount]);

  return { data, error, isLoading, refetch }; // refetch 추가
};
