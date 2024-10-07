// src/app/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InstallPrompt from "./components/InstallPrompt";
import DiceEvent from "@/pages/DiceEvent";
import WalletPage from "@/pages/WalletPage";
import MissionPage from "@/pages/MissionPage";
import RankPage from "@/pages/RankPage";
import DiceEventLayout from "./layout/DiceEventLayout";
import MiniGame from "@/pages/MiniGame";
import InviteFriends from "@/pages/InviteFriends";
import SlotMachine from "@/pages/SlotMachine";
import SignUpPage from "@/pages/SignUp";
import MainPage from "@/pages/MainPage";
import Home from "@/pages/Home";

const App: React.FC = () => {
  React.useEffect(() => {
    const preventContextMenu = (e: { preventDefault: () => void }) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return (
    <Router>
      <div>
        {/* <InstallPrompt /> */}
        <Routes>
          <Route path="/home" element={
               <DiceEventLayout><Home /></DiceEventLayout>
            } />
          <Route
            path="/dice-event"
            element={
              <DiceEventLayout>
                <DiceEvent />
              </DiceEventLayout>
            }
          />

          <Route
            path="/mission"
            element={
              <DiceEventLayout>
                <MissionPage />
              </DiceEventLayout>
            }
          />
          <Route
            path="/rank"
            element={
              <DiceEventLayout>
                <RankPage />
              </DiceEventLayout>
            }
          />
          <Route
            path="/mini-game"
            element={
              <DiceEventLayout>
                <MiniGame />
              </DiceEventLayout>
            }
          />
          <Route
            path="/invite-friends"
            element={
              <DiceEventLayout>
                <InviteFriends />
              </DiceEventLayout>
            }
          />
          <Route
            path="/test"
            element={
              <DiceEventLayout>
                <SlotMachine />
              </DiceEventLayout>
            }
          />
      <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/" element={<MainPage />} />
          <Route
            path="/wallet"
            element={
              <DiceEventLayout>
                <WalletPage />
              </DiceEventLayout>
            }
          />
          <Route
            path="/dice-event"
            element={
              <DiceEventLayout>
                <DiceEvent />
              </DiceEventLayout>
            }
          />

          <Route
            path="/mission"
            element={
              <DiceEventLayout>
                <MissionPage />
              </DiceEventLayout>
            }
          />
          <Route
            path="/rank"
            element={
              <DiceEventLayout>
                <RankPage />
              </DiceEventLayout>
            }
          />
          <Route
            path="/mini-game"
            element={
              <DiceEventLayout>
                <MiniGame />
              </DiceEventLayout>
            }
          />
          <Route
            path="/invite-friends"
            element={
              <DiceEventLayout>
                <InviteFriends />
              </DiceEventLayout>
            }
          />
          <Route
            path="/test"
            element={
              <DiceEventLayout>
                <SlotMachine />
              </DiceEventLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
