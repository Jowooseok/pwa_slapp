import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InstallPrompt from "./components/InstallPrompt";
import DiceEvent from "@/pages/DiceEvent";
import WalletPage from "@/pages/WalletPage";
import MissionPage from "@/pages/MissionPage";
import RankPage from "@/pages/RankPage";
import DiceEventLayout from "./layout/DiceEventLayout";
import InviteFriends from "@/pages/InviteFriends";
import SlotMachine from "@/pages/SlotMachine";
import SignUpPage from "@/pages/SignUp";
import MainPage from "@/pages/MainPage";
import Home from "@/pages/Home";
// added pages
import AIDentalExamination from "@/pages/AIDentalExamination";
import AIXrayAnalysis from "@/pages/AIXrayAnalysis";
import Login from "@/pages/Login";
import PetRegister from "@/pages/PetRegister";
import SelectPet from "@/pages/SelectPet";
import EditPet from "@/pages/EditPet";
import DiagnosisRecords from "@/pages/DiagnosisList";
import DiagnosisDetail from "@/pages/DiagnosisDetail";
import SignupEmail from "@/pages/Email";
import SignupPassword from "@/pages/Password";
import FindPassword from "@/pages/FindPassword";
import MyPoint from "@/pages/MyPoint";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 스플래시 화면을 일정 시간 후에 숨김
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => {
      clearTimeout(splashTimeout);
    };
  }, []);

  useEffect(() => {
    const preventContextMenu = (e: { preventDefault: () => void }) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  // 공통된 DiceEventLayout Route 생성
  const renderDiceEventLayout = (path: string, component: React.ReactNode, hidden = false) => (
    <Route
      path={path}
      element={<DiceEventLayout hidden={hidden}>{component}</DiceEventLayout>}
    />
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <Routes>
            {/* Single Layout Pages */}
            <Route path="/" element={<MainPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />

            {/* DiceEventLayout Pages */}
            {renderDiceEventLayout("/home", <Home />)}
            {renderDiceEventLayout("/dice-event", <DiceEvent />)}
            {renderDiceEventLayout("/mission", <MissionPage />)}
            {renderDiceEventLayout("/rank", <RankPage />)}
            {renderDiceEventLayout("/invite-friends", <InviteFriends />)}
            {renderDiceEventLayout("/test", <SlotMachine />)}
            {renderDiceEventLayout("/wallet", <WalletPage />)}

            {/* Hidden Pages */}
            {renderDiceEventLayout("/login", <Login />, true)}
            {renderDiceEventLayout("/regist-pet", <PetRegister />, true)}
            {renderDiceEventLayout("/select-pet", <SelectPet />, true)}
            {renderDiceEventLayout("/edit-pet", <EditPet />, true)}
            {renderDiceEventLayout("/diagnosis-list", <DiagnosisRecords />, true)}
            {renderDiceEventLayout("/diagnosis-detail", <DiagnosisDetail />, true)}
            {renderDiceEventLayout("/signup-email", <SignupEmail />, true)}
            {renderDiceEventLayout("/signup-password", <SignupPassword />, true)}
            {renderDiceEventLayout("/find-password", <FindPassword />, true)}
            {renderDiceEventLayout("/ai-dental-examination", <AIDentalExamination />, true)}
            {renderDiceEventLayout("/ai-xray-analysis", <AIXrayAnalysis />, true)}
            {renderDiceEventLayout("/my-point", <MyPoint />, true)}
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
