"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { fetchRecoverPassword } from "@/app/services/auth";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/router";

export default function ForgotForm({ token }: { token: string }) {
  const [form, setForm]: any = useState({
    companySize: "1-5",
  });
  const { loading, errors, callApi } = useApi(fetchRecoverPassword);
  const router = useRouter();

  const recoverPassword = () => {
    callApi({ ...form, jwtToken: token }).then(() => {
      setForm({});
      router.replace("/");
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

        <form action={recoverPassword} className="flex flex-col gap-5">
          <DS.Input
            type="password"
            value={form.password}
            label="New password"
            onChange={(password: string) => setForm({ ...form, password })}
            error={errors?.password}
          />

          <DS.Input
            type="password"
            value={form.confirmPassword}
            label="Confirm password"
            onChange={(confirmPassword: string) =>
              setForm({ ...form, confirmPassword })
            }
            error={errors?.confirmPassword}
          />

          <DS.Button
            text="Change password"
            icon="summaryclient"
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
}
