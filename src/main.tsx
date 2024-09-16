import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.scss";
import { registerSW } from "virtual:pwa-register";
import WebApp from "@twa-dev/sdk";
import "pretendard/dist/web/static/pretendard.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient 생성
const queryClient = new QueryClient();

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
