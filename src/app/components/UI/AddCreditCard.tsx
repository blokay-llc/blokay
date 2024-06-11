"use client";
import { DS } from "@blokay/react";
export default function AddCreditCard({ text }: any) {
  return (
    <div className=" text-purple-900 font-light px-5 py-3 rounded-lg flex items-center justify-between gap-5 bg-gradient-to-r from-[#d8b4fe] to-[#abb5fc] ">
      <div>{text}</div>
      <DS.Button
        href="/dashboard/billing"
        text="Upgrade"
        variant="primary"
        size="lg"
      />
    </div>
  );
}
