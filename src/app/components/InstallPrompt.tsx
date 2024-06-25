// src/app/components/InstallPrompt.tsx
import React, { useEffect, useState } from "react";

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  return (
    <>
      {isVisible && !isInstalled && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center">
          <p className="text-black">Install our app for a better experience!</p>
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Install
          </button>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;
