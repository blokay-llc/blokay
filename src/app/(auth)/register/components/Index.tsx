"use client";
import { useState } from "react";
import EmailProvider from "./EmailProvider";
import Providers from "./Providers";
import SignInButton from "./SignInButton";

export default function SignUp() {
  const [step, setStep] = useState("providers");
  return (
    <div className="container">
      <div className="lg:max-w-96 mx-auto bg-white shadow-lg px-5 py-10 my-10 rounded-xl">
        <a href="/" className="mb-5 block">
          <img
            src="/logo-white.svg"
            className="h-8 mx-auto hidden dark:block"
          />
          <img src="/logo.svg" className="h-10 mx-auto dark:hidden" />
        </a>

        <h2 className="text-neutral-950 text-center text-xl font-bold mb-10">
          Create your Blokay account
        </h2>

        {step === "emailProvider" && <EmailProvider setStep={setStep} />}
        {step === "providers" && <Providers setStep={setStep} />}

        <div className="border-t border-neutral-300 dark:border-black my-6"></div>

        <SignInButton />
      </div>
    </div>
  );
}
