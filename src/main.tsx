import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { frFR } from "@clerk/localizations";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// import { init } from '@emailjs/browser';
// console.log(init);

// Initialisation d'EmailJS avec votre ID utilisateur
// init("service_zgdp3i2");
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        localization={frFR}
      >
        <App />
      </ClerkProvider>
    </RecoilRoot>
  </StrictMode>
);
