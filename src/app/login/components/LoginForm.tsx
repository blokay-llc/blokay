"use client";
import { useEffect, useState } from "react";
import { AppInput, AppButton, AppIcon } from "@/app/components/DS/Index";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm]: any = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session]);

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
    <div className="w-96 ">
      <a href="/">
        <img
          src="/logo-white.svg"
          className="h-8 mb-10 mx-auto hidden dark:block"
        />
        <img src="/logo.svg" className="h-10 mb-10 mx-auto dark:hidden" />
      </a>

      <form action={login} className="flex flex-col gap-5">
        <AppInput
          type="text"
          label="Email"
          name="email"
          value={form.email}
          onChange={(val: string) => {
            setForm({ ...form, email: val });
          }}
        />

        <AppInput
          type="password"
          name="password"
          label="Password"
          value={form.password}
          onChange={(val: string) => {
            setForm({ ...form, password: val });
          }}
        />

        <AppButton
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

      <div className="mt-5 flex flex-col gap-3">
        {process.env.NEXT_PUBLIC_GOOGLE_LOGIN && (
          <div
            className="border-2 border-stone-300 dark:border-black rounded-lg flex gap-3 items-center text-stone-600 px-3 py-2 font-light hover:bg-stone-300 dark:hover:bg-stone-900 dark:text-stone-400 "
            onClick={() => {
              loginThird("google");
            }}
          >
            <AppIcon icon="google" className="fill-stone-600 size-5" />
            <div>Login with Google</div>
          </div>
        )}

        {process.env.NEXT_PUBLIC_GITHUB_LOGIN && (
          <div
            className="border-2 border-stone-300 dark:border-black rounded-lg flex gap-3 items-center text-stone-600 px-3 py-2 font-light hover:bg-stone-300  dark:hover:bg-stone-900 dark:text-stone-400"
            onClick={() => {
              loginThird("github");
            }}
          >
            <AppIcon icon="github" className="fill-stone-600 size-5" />
            <div>Login with GitHub</div>
          </div>
        )}
      </div>

      <div className="text-stone-600 mt-5 font-light text-sm text-center">
        ¿Any problem to login?
      </div>

      <div className=" mx-auto mt-10  ">
        <a
          href="/register"
          className="border-stone-300 dark:border-stone-950 border-2 text-stone-700 px-5 py-3 rounded-2xl shadow-2xl shadow-stone-400 dark:shadow-black dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-950 flex items-center gap-5"
        >
          <AppIcon icon="account" className="size-10 fill-stone-500" />
          <div>
            <span className="font-bold">¿Need a new workspace? </span>
            <div className="font-light text-sm">Sign up</div>
          </div>
        </a>
      </div>
    </div>
  );
}
