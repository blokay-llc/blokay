"use client";
import ViewBrain from "./ViewBrain";
import { BlokayProvider } from "@blokay/react";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { slug: string } }) {
  const { data: session }: any = useSession();

  return (
    <div className="min-h-screen h-full">
      <BlokayProvider jwtToken={session?.jwtToken}>
        <ViewBrain slug={params.slug} />
      </BlokayProvider>
    </div>
  );
}
