import { useMutation } from "@tanstack/react-query";

interface SignUpData {
  telegramHash: string;
  petType: "DOG" | "CAT";
}

// API call function
const signUp = async (data: SignUpData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  return response.json();
};

// Custom Hook using useMutation from react-query
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUp,
  });
};
