import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./components/RegisterForm";
import Providers from "../login/components/Providers";

export default async function Register() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen h-full dark:bg-neutral-950 ">
      <div className="flex items-center justify-center min-h-screen w-full">
        <Providers>
          <RegisterForm />
        </Providers>
      </div>
    </div>
  );
}
