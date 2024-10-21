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
               <DiceEventLayout hidden={true}>
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
            path="/diagnosis-list/:id"
            element={
              <DiceEventLayout hidden={true}>
                <DiagnosisRecords />
              </DiceEventLayout>
            }
          />
          <Route
            path="/diagnosis-detail/:id"
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
            path="/ai-dental-examination/:id" 
            element={
              <DiceEventLayout hidden={true}>
              <AIDentalExamination />
              </DiceEventLayout>
            } 
          />
          <Route 
            path="/ai-xray-analysis/:id" 
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
  );
};

export default App;
