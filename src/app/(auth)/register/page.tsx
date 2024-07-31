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
    <div className="grid grid-cols-12">
      <div className="col-span-12 min-h-screen h-full relative dark:bg-neutral-950 ">
        <RetroGrid />

        <div className="flex items-center justify-center min-h-screen w-full">
          <SessionProvider>
            <SignUp />
          </SessionProvider>
        </div>
      </div>
      {/* <div className="col-span-4 overflow-hidden flex justify-center items-center  py-10 px-10    bg-neutral-950 ">
        <div>
          <h2 className="text-2xl">
            SQL to <span className="font-bold">components</span>
          </h2>
          <div className="font-light text-sm text-pretty">
            Generate your backend and frontend code from SQL in seconds
          </div>

          <img src="/register.png" alt="" />
        </div>
      </div> */}
    </div>
  );
}
