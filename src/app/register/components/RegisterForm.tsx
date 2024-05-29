"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { fetchRegister } from "@/app/services/auth";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [form, setForm]: any = useState({
    companySize: "1-5",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]: any = useState({});

  const register = () => {
    setLoading(true);
    fetchRegister(form)
      .then(() => {
        setForm({});
        return signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: true,
          callbackUrl: "/dashboard",
        });
      })
      .catch((err) => {
        let inputsErrors = err?.errors?.issues || [];
        let errs = inputsErrors.reduce((acc: any, curr: any) => {
          let key = curr.path[0];
          acc[key] = curr.message;
          return acc;
        }, {});

        setErrors(errs);
      })
      .finally(() => {
        setLoading(false);
      });
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

        <form action={register} className="flex flex-col gap-5">
          <DS.Input
            type="text"
            value={form.companyName}
            label="Company Name"
            onChange={(companyName: string) =>
              setForm({ ...form, companyName })
            }
            error={errors?.companyName}
          />

          <DS.Select
            value={form.companySize}
            label="Company Size"
            onChange={(val: string) => {
              setForm({ ...form, companySize: val });
            }}
            error={errors?.companySize}
          >
            <option value="me">Only me</option>
            <option value="1-5">1-5</option>
            <option value="6-20">6-20</option>
            <option value="21-100">21-100</option>
            <option value="101-1000">101-1000</option>
            <option value="1001-infinite">1001-Infinite</option>
          </DS.Select>

          <DS.Input
            type="text"
            value={form.name}
            label="Your name"
            onChange={(val: string) => {
              setForm({ ...form, name: val });
            }}
            error={errors?.name}
          />

          <DS.Input
            type="text"
            value={form.email}
            label="Your Email"
            onChange={(val: string) => {
              setForm({ ...form, email: val });
            }}
            error={errors?.email}
          />

          <DS.Input
            type="password"
            value={form.password}
            label="Password"
            onChange={(password: string) => setForm({ ...form, password })}
            error={errors?.password}
          />

          <div className="text-sm text-stone-500 font-light border-t border-stone-300 dark:border-black mt-3 pt-3">
            By using Blokay, you are agreeing to our{" "}
            <a
              href="https://blokay.com/privacy"
              className="underline "
              target="_blank"
            >
              privacy policy
            </a>{" "}
            and terms of service.
          </div>

          <DS.Button
            text="Sign up"
            icon="summaryclient"
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
          />
        </form>

        <div className=" mx-auto  mt-10  ">
          <a
            href="/login"
            className="border-stone-300 dark:border-stone-950 border-2 text-stone-700 px-5 py-3 rounded-2xl shadow-2xl shadow-stone-400 dark:shadow-black dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-950 flex items-center gap-5 bg-gradient-to-r from-white dark:from-black dark:to-blue-950 to-indigo-100"
          >
            <DS.Icon icon="account" className="size-10 fill-stone-500" />
            <div>
              <span className="font-bold">Existing workspace? </span>
              <div className="font-light text-sm">Sign in</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
