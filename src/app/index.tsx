// src/app/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import SplashScreen from './components/SplashScreen';


const queryClient = new QueryClient();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // 스플래시 화면을 일정 시간 후에 숨김
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3초 후에 스플래시 화면 숨김

    return () => {
      clearTimeout(splashTimeout);
    };
  }, []);


  React.useEffect(() => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          {/* <InstallPrompt /> */}
          <Routes>
            <Route path="/home" element={
                <DiceEventLayout>
                  <Home />
                  </DiceEventLayout>
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
            <Route
              path="/login"
              element={
                <DiceEventLayout hidden={true}>
                  <Login />
                </DiceEventLayout>
              }
            />
            <Route
              path="/regist-pet"
              element={
                <DiceEventLayout hidden={true}>
                  <PetRegister />
                </DiceEventLayout>
              }
            />
            <Route
              path="/select-pet"
              element={
                <DiceEventLayout hidden={true}>
                  <SelectPet />
                </DiceEventLayout>
              }
            />
            <Route
              path="/edit-pet"
              element={
                <DiceEventLayout hidden={true}>
                  <EditPet />
                </DiceEventLayout>
              }
            />
            
            <Route
              path="/diagnosis-list"
              element={
                <DiceEventLayout hidden={true}>
                  <DiagnosisRecords />
                </DiceEventLayout>
              }
            />
            <Route
              path="/diagnosis-detail"
              element={
                <DiceEventLayout hidden={true}>
                  <DiagnosisDetail />
                </DiceEventLayout>
              }
            />
            <Route
              path="/signup-email"
              element={
                <DiceEventLayout hidden={true}>
                  <SignupEmail />
                </DiceEventLayout>
              }
            />
            <Route
              path="/signup-password"
              element={
                <DiceEventLayout hidden={true}>
                  <SignupPassword />
                </DiceEventLayout>
              }
            />
            <Route
              path="/find-password"
              element={
                <DiceEventLayout hidden={true}>
                  <FindPassword />
                </DiceEventLayout>
              }
            />
            <Route 
              path="/ai-dental-examination" 
              element={
                <DiceEventLayout hidden={true}>
                <AIDentalExamination />
                </DiceEventLayout>
              } 
            />
            <Route 
              path="/ai-xray-analysis" 
              element={
                <DiceEventLayout hidden={true}>
                <AIXrayAnalysis />
                </DiceEventLayout>
              } 
            />
            <Route
              path="/my-point"
              element={
                <DiceEventLayout hidden={true}>
                  <MyPoint />
                </DiceEventLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
