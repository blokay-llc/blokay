"use client";
import { DS } from "@blokay/react";

export default function UpgradePlan({ onClick }: any) {
  return (
    <div
      className=" border-glow bg-black py-10  border-0 border-sky-400 rounded-3xl relative overflow-hidden md:bg-cover bg-no-repeat bg-bottom bg-[length:60rem_auto]  text-white"
      style={{
        backgroundColor: "rgb(13 14 18 / var(--tw-bg-opacity))",
        backgroundImage:
          "radial-gradient(91.62% 38.88% at 1.4% 4.24%, #0d94881c 0, transparent 100%), radial-gradient(21.88% 21.86% at 80.72% 42.34%, rgba(7, 7, 9, .45) 6.77%, transparent 100%), radial-gradient(24.02% 75.21% at 54.85% 37.73%, #0d94881c 5%, transparent 100%)",
      }}
    >
      <div className="lg:w-1/3 border-glow w-4/5 md:min-w-96 rounded-xl bg-neutral-900/50 backdrop-blur-md  px-5 py-10 shadow-lg mx-auto">
        <h2 className="font-bold text-2xl">Add a credit card</h2>

        <div className="mb-5 font-light mt-5">
          <ul className="text-sm flex flex-col gap-3">
            <li className="flex gap-3 items-center">
              <DS.Icon icon="check" className="size-5 fill-white" />
              <span>Audit logs</span>
            </li>
            <li className="flex gap-3 items-center">
              <DS.Icon icon="check" className="size-5 fill-white" />
              <span>Unlimited users</span>
            </li>
            <li className="flex gap-3 items-center">
              <DS.Icon icon="check" className="size-5 fill-white" />
              <span>Granular access</span>
            </li>
          </ul>
        </div>
        <DS.Button
          text="add a card"
          onClick={onClick}
          variant="primary"
          size="lg"
          className="w-full"
        />

        <p className="text-sm font-light text-slate-300 mt-5">
          if you upgrade your plan, your current billing quote will be prorated
        </p>
      </div>
    </div>
  );
}
