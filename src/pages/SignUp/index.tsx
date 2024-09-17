import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 가져오기
import { useSignUpMutation } from "@/features/auth/api/signup"; // API 훅 가져오기
import TelegramActivityCheck from "./TelegramActivityCheck";
import SelectCharacter from "./SelectCharacter";

const SignUpPage: React.FC = () => {
  const [stage, setStage] = useState<"activityCheck" | "characterSelect">(
    "activityCheck"
  );
  const [telegramHash, setTelegramHash] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<
    "DOG" | "CAT" | null
  >(null);

  const signUpMutation = useSignUpMutation(); // Instead of destructuring, use the whole object
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  useEffect(() => {
    const hash = new URLSearchParams(window.location.search).get("hash");
    if (hash) {
      setTelegramHash(hash);
    }
  }, []);

  const handleContinueFromActivityCheck = () => {
    setStage("characterSelect");
  };

  const handleCharacterSelect = (character: "DOG" | "CAT") => {
    setSelectedCharacter(character);

    if (telegramHash) {
      signUpMutation.mutate(
        {
          telegramHash,
          petType: character,
        },
        {
          onSuccess: (data) => {
            console.log("Signup successful:", data);
            navigate(`/dice-event?hash=${telegramHash}`); // 회원가입 성공 후 해시 값을 URL에 포함하여 이동
          },
          onError: (error) => {
            console.error("Signup failed:", error);
          },
        }
      );
    }
  };

  return (
    <div>
      {stage === "activityCheck" ? (
        <TelegramActivityCheck onContinue={handleContinueFromActivityCheck} />
      ) : (
        <SelectCharacter onSelect={handleCharacterSelect} />
      )}
      {signUpMutation.isPending && <p>Signing up...</p>}{" "}
      {signUpMutation.isError && (
        <p>Error during signup: {signUpMutation.error.message}</p>
      )}
      {signUpMutation.isSuccess && <p>Signup successful! Welcome!</p>}
    </div>
  );
};

export default SignUpPage;
