"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [form, setForm]: any = useState({});
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    signIn("credentials", {
      callbackUrl: "/dashboard",
      email: form.email,
      password: form.password,
    });
  };

  const loginThird = (third: string) => {
    setLoading(true);
    signIn(third, { callbackUrl: "/dashboard" });
  };

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

        <form action={login} className="flex flex-col gap-5">
          <DS.Input
            type="text"
            label="Email"
            value={form.email}
            onChange={(val: string) => {
              setForm({ ...form, email: val });
            }}
          />

          <DS.Input
            type="password"
            label="Password"
            value={form.password}
            onChange={(val: string) => {
              setForm({ ...form, password: val });
            }}
          />

          <DS.Button
            text="Sign in"
            icon="account"
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
          />
        </form>

        <div></div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {process.env.NEXT_PUBLIC_GOOGLE_LOGIN != "0" && (
            <div
              className="transition duration-100 border-2 border-neutral-300 dark:border-neutral-800 rounded-lg flex gap-3 items-center text-neutral-600 px-3 py-2 font-light hover:bg-neutral-300 dark:hover:bg-neutral-900 dark:text-neutral-400 cursor-pointer "
              onClick={() => {
                loginThird("google");
              }}
            >
              <DS.Icon icon="google" className="fill-neutral-600 size-5" />
              <div> Google</div>
            </div>
          )}

          {process.env.NEXT_PUBLIC_GITHUB_LOGIN != "0" && (
            <div
              className="transition duration-100 border-2 border-neutral-300 dark:border-neutral-800 rounded-lg flex gap-3 items-center text-neutral-600 px-3 py-2 font-light hover:bg-neutral-300  dark:hover:bg-neutral-900 dark:text-neutral-400 cursor-pointer"
              onClick={() => {
                loginThird("github");
              }}
            >
              <DS.Icon icon="github" className="fill-neutral-600 size-5" />
              <div> GitHub</div>
            </div>
          )}
        </div>

        <div className="text-neutral-600 mt-5 font-light text-sm text-center">
          ¿Any problem to login?
        </div>

        <div className=" mx-auto mt-10  ">
          <a
            href="/register"
            className="border-neutral-300 dark:border-neutral-950 border-2 text-neutral-700 px-5 py-3 rounded-2xl shadow-2xl shadow-neutral-400 dark:shadow-black dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-950 flex items-center gap-5 bg-gradient-to-r from-white dark:from-black dark:to-teal-950 to-indigo-100"
          >
            <DS.Icon icon="account" className="size-10 fill-neutral-500" />
            <div>
              <span className="font-bold">Need a new workspace? </span>
              <div className="font-light text-sm">Sign up</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
