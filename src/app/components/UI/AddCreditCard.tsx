"use client";
import { AppButton } from "../DS/Index";
export default function AddCreditCard({ text }: any) {
  return (
    <div
      className=" text-purple-900 font-light px-3 py-5 rounded-xl flex items-center justify-between gap-5"
      style={{
        background: "linear-gradient(45deg, #d8b4fe, #abb5fc)",
      }}
    >
      <div>{text}</div>
      <AppButton
        href="/dashboard/billing"
        text="Upgrade"
        variant="primary"
        size="sm"
      />
    </div>
  );
}
