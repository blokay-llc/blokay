"use client";
import { useState } from "react";
import EmailProvider from "./EmailProvider";
import Providers from "./Providers";
import SignInButton from "./SignInButton";

export default function RegisterForm() {
  const [step, setStep] = useState("providers");
  return (
    <div className="container">
      <div className="lg:max-w-96 mx-auto ">
        <a href="/">
          <img
            src="/logo-white.svg"
            className="h-8 mb-10 mx-auto hidden dark:block"
          />
          <img src="/logo.svg" className="h-10 mb-10 mx-auto dark:hidden" />
        </a>

        {step === "emailProvider" && <EmailProvider setStep={setStep} />}
        {step === "providers" && <Providers setStep={setStep} />}

        <div className="border-t border-neutral-300 dark:border-black my-6"></div>

        <SignInButton />
      </div>
    </div>
  );
}
