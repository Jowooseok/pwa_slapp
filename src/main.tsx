import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.scss";
import { registerSW } from "virtual:pwa-register";
import WebApp from "@twa-dev/sdk";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

WebApp.ready();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
