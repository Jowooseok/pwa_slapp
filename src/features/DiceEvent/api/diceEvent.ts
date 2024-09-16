import { useQuery } from "@tanstack/react-query";

// /home API를 호출하는 함수
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

// 주사위 이벤트 데이터를 가져오는 커스텀 훅
export const useDiceEventDataQuery = () => {
  return useQuery({
    queryKey: ["diceEventData"], // queryKey 수정
    queryFn: fetchDiceEventData,
    retry: false,
    staleTime: 60000,
  });
};
