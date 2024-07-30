import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import SignUp from "./components/Index";
import SessionProvider from "../../components/Providers/Session";
import RetroGrid from "@/app/components/Magic/RetroGrid";

export default async function Register() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen h-full relative dark:bg-neutral-950 ">
      <RetroGrid />

      <div className="flex items-center justify-center min-h-screen w-full">
        <SessionProvider>
          <SignUp />
        </SessionProvider>
      </div>
    </div>
  );
}
