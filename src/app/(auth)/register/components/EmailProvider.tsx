"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { fetchRegister } from "@/app/services/auth";
import { signIn } from "next-auth/react";
import { useApi } from "@/hooks/useApi";

export default function EmailProvider({ setStep }: { setStep: any }) {
  const [form, setForm]: any = useState({
    companySize: "1-5",
  });
  const { loading, errors, callApi } = useApi(fetchRegister);

  const register = () => {
    callApi(form).then(() => {
      setForm({});
      return signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    });
  };

  return (
    <form action={register} className="flex flex-col gap-3">
      <DS.Input
        type="text"
        value={form.companyName}
        label="Company Name"
        onChange={(companyName: string) => setForm({ ...form, companyName })}
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

      <div className="text-sm text-neutral-500 font-light border-t border-neutral-300 dark:border-black mt-3 pt-3">
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
  );
}
