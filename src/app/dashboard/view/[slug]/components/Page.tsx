"use client";
import ViewBlock from "./ViewBlock";
import { BlokayProvider } from "@blokay/react";
import { useSession } from "next-auth/react";

export default function Page({
  params,
  jwt,
}: {
  params: { slug: string };
  jwt: string;
}) {
  const { data: session }: any = useSession();

  return (
    <div className="min-h-screen h-full">
      <BlokayProvider
        jwtToken={session?.jwtToken}
        endpoint={process.env.NEXT_PUBLIC_API || "https://app.blokay.com/api/"}
      >
        <ViewBlock slug={params.slug} jwt={jwt} />
      </BlokayProvider>
    </div>
  );
}
