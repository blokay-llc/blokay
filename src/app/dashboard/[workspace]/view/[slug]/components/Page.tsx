"use client";
import View from "./View";
import { BlokayProvider } from "@blokay/react";
import { useSession } from "next-auth/react";

export default function Page({
  workspace,
  slug,
  jwt,
}: {
  slug: string;
  workspace: string;
  jwt: string;
}) {
  const { data: session }: any = useSession();

  return (
    <div className="min-h-screen h-full">
      <BlokayProvider
        jwtToken={session?.jwtToken}
        endpoint={process.env.NEXT_PUBLIC_API || "https://app.blokay.com/api/"}
      >
        <View slug={slug} workspace={workspace} jwt={jwt} />
      </BlokayProvider>
    </div>
  );
}
