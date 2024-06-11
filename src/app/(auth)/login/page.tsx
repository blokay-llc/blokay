import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import LoginForm from "./components/LoginForm";
import Providers from "./components/Providers";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen h-full dark:bg-neutral-950">
      <div className="flex items-center justify-center min-h-screen w-full">
        <Providers>
          <LoginForm />
        </Providers>
      </div>
    </div>
  );
}
