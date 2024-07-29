import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import ForgotForm from "./components/ForgotForm";
import Providers from "../../../components/Providers/Providers";

export default async function Forgot({
  params,
}: {
  params: { token: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen h-full dark:bg-neutral-950 ">
      <div className="flex items-center justify-center min-h-screen w-full">
        <Providers>
          <ForgotForm token={params.token} />
        </Providers>
      </div>
    </div>
  );
}
