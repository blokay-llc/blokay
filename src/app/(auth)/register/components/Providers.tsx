"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { DS } from "@blokay/react";

export default function Providers({ setStep }: { setStep: any }) {
  const [loading, setLoading] = useState(false);

  const signUpThird = (third: string) => {
    setLoading(true);
    signIn(third, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {process.env.NEXT_PUBLIC_GOOGLE_LOGIN != "0" && (
        <div
          className="transition duration-100 border-2 border-neutral-300 dark:border-neutral-800 rounded-lg flex gap-3 items-center text-neutral-600 px-3 py-2 font-light hover:bg-neutral-300 dark:hover:bg-neutral-900 dark:text-neutral-400 cursor-pointer "
          onClick={() => {
            signUpThird("google");
          }}
        >
          <DS.Icon icon="google" className="fill-neutral-600 size-5" />
          <div>Sign up with Google</div>
        </div>
      )}

      {process.env.NEXT_PUBLIC_GITHUB_LOGIN != "0" && (
        <div
          className="transition duration-100 border-2 border-neutral-300 dark:border-neutral-800 rounded-lg flex gap-3 items-center text-neutral-600 px-3 py-2 font-light hover:bg-neutral-300  dark:hover:bg-neutral-900 dark:text-neutral-400 cursor-pointer"
          onClick={() => {
            signUpThird("github");
          }}
        >
          <DS.Icon icon="github" className="fill-neutral-600 size-5" />
          <div>Sign up with GitHub</div>
        </div>
      )}

      <div
        className="transition duration-100 border-2 border-neutral-300 dark:border-neutral-800 rounded-lg flex gap-3 items-center text-neutral-600 px-3 py-2 font-light hover:bg-neutral-300  dark:hover:bg-neutral-900 dark:text-neutral-400 cursor-pointer"
        onClick={() => {
          setStep("emailProvider");
        }}
      >
        <DS.Icon icon="account" className="fill-neutral-600 size-5" />
        <div>Sign up with Email</div>
      </div>
    </div>
  );
}
