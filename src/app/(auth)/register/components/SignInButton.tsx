"use client";
import { DS } from "@blokay/react";

export default function RegisterForm() {
  return (
    <div className="mx-auto">
      <a
        href="/login"
        className="border-neutral-300 dark:border-neutral-950 border-2 text-neutral-700 px-5 py-3 rounded-2xl shadow-2xl shadow-neutral-400 dark:shadow-black dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-950 flex items-center gap-5 "
      >
        <DS.Icon icon="account" className="size-8 fill-neutral-500" />
        <div>
          <span className="font-bold">Already have an account?</span>
          <div className="font-light text-sm">Sign in</div>
        </div>
      </a>
    </div>
  );
}
