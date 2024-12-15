import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InstallPrompt from "./components/InstallPrompt";
import DiceEvent from "@/pages/DiceEvent";
import WalletPage from "@/pages/WalletPage";
import MissionPage from "@/pages/MissionPage";
import Reward from "@/pages/RewardPage";
import DiceEventLayout from "./layout/DiceEventLayout";
import InviteFriends from "@/pages/InviteFriends";
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
import PreviousRewards from "@/pages/PreviousRewards";
import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useUserStore } from "@/entities/User/model/userModel";

const queryClient = new QueryClient();

//disableActions : true 마스크 클릭 안되도록
//stepInteraction : false : 강조된 영역 동작 안하도록
const steps = [
  {
    selector: "#first-step",
    content: (
      <div className="text-sm">
        <strong>Roll Dice Button:</strong> Click this button to roll the dice.
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#second-step",
    content: (
      <div className="text-sm">
        <strong>Dice Gauge:</strong> Press and hold the button to move the gauge bar, covering six sections (1–6).<div style={{ marginBottom: "1rem" }}></div>
        Rolling the dice within the gauge range gives a <strong>50% chance</strong> to trigger the <strong>Lucky Dice effect</strong> and display the corresponding number.
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#third-step",
    content: (
      <div className="text-sm">
        <strong>Dice Refill:</strong> Once all dice are used, the text changes to <em>'Refill Dice.'</em> Click it to refill your dice.<div style={{ marginBottom: "1rem" }}></div>
        After refilling, you can receive new dice again after <strong>1 hour</strong>.<div style={{ marginBottom: "1rem" }}></div>
        When the refill time is over, the text changes to <em>'Waiting.'</em> If you have no dice left, it reverts to <em>'Refill Dice.'</em>
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#fourth-step",
    content: (
      <div className="text-sm">
        <strong>NFT Dashboard:</strong> Displays the <strong>number of NFTs</strong> you own.<div style={{ marginBottom: "1rem" }}></div>
        Click it to view the <strong>effects</strong> of your owned NFTs.
      </div>
    ),
    stepInteraction: false,
  },
  {
    selector: "#fifth-step",
    content: (
      <div className="text-sm">
        <strong>Auto Function:</strong> If you own an <strong>Auto NFT</strong>, the dice will roll automatically.<div style={{ marginBottom: "1rem" }}></div>
        When the refill time arrives, the dice will also be refilled and rolled automatically.<div style={{ marginBottom: "1rem" }}></div>
        This function only works while the app is <strong>open</strong> and does not apply to actions on <em>Rock-Paper-Scissors</em>, <em>Spin</em>, or <em>Anywhere tiles</em>.
      </div>
    ),
    stepInteraction: false,
  },
];






const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const {completeTutorialFunc} = useUserStore();
  const disableBody = (target:any) => disableBodyScroll(target)
  const enableBody = (target:any) => enableBodyScroll(target)

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
  const renderDiceEventLayout = (
    path: string,
    component: React.ReactNode,
    hidden = false
  ) => (
    <Route
      path={path}
      element={<DiceEventLayout hidden={hidden}>{component}</DiceEventLayout>}
    />
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TourProvider
        steps={steps}    
        afterOpen={disableBody} beforeClose={enableBody}
        onClickMask={async({ setCurrentStep, currentStep, steps, setIsOpen })  => {
          if (steps) {
            if (currentStep === steps.length - 1) {
              await completeTutorialFunc();
              setIsOpen(false);
           
            }
            setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1));
          }
        }}

        onClickClose={ async({ setIsOpen }) => {
          await completeTutorialFunc();
          setIsOpen(false);
        }}
 
        styles={{
          popover: (base) => ({
            ...base,
            "--reactour-accent": "#0147E5",
            borderRadius: 10,
          }),
          maskArea: (base) => ({ ...base, rx: 10, margin: 30 }),
          // maskWrapper: (base) => ({ ...base, color: "#0147E5" }),
          badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
          // controls: (base) => ({ ...base, marginTop: 100 }),
          close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
        }}
      >
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
              {renderDiceEventLayout("/reward", <Reward />)}
              {renderDiceEventLayout("/invite-friends", <InviteFriends />)}
              {renderDiceEventLayout("/wallet", <WalletPage />)}
              {renderDiceEventLayout("/previous-rewards", <PreviousRewards />)}

              {/* Hidden Pages */}
              {renderDiceEventLayout("/login", <Login />, true)}
              {renderDiceEventLayout("/regist-pet", <PetRegister />, true)}
              {renderDiceEventLayout("/select-pet", <SelectPet />, true)}
              {renderDiceEventLayout("/edit-pet", <EditPet />, true)}
              {renderDiceEventLayout(
                "/diagnosis-list",
                <DiagnosisRecords />,
                true
              )}
              {renderDiceEventLayout(
                "/diagnosis-detail",
                <DiagnosisDetail />,
                true
              )}
              {renderDiceEventLayout("/signup-email", <SignupEmail />, true)}
              {renderDiceEventLayout(
                "/signup-password",
                <SignupPassword />,
                true
              )}
              {renderDiceEventLayout("/find-password", <FindPassword />, true)}
              {renderDiceEventLayout(
                "/ai-dental-examination",
                <AIDentalExamination />,
                true
              )}
              {renderDiceEventLayout(
                "/ai-xray-analysis",
                <AIXrayAnalysis />,
                true
              )}
              {renderDiceEventLayout("/my-point", <MyPoint />, true)}
            </Routes>
          </div>
        </Router>
      </TourProvider>
    </QueryClientProvider>
  );
};

export default App;
