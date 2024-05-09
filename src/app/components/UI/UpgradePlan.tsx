"use client";
import { AppIcon, AppButton } from "@/app/components/DS/Index";

export default function UpgradePlan({ onClick }: any) {
  return (
    <div
      className="mt-10 bg-black pt-20 pb-20 md:pb-20 border-0 border-sky-400 rounded-3xl mb-20 relative overflow-hidden md:bg-cover bg-no-repeat bg-bottom bg-[length:60rem_auto]  text-white"
      style={{
        backgroundImage:
          "url(https://assets-global.website-files.com/645a9acecda2e0594fac6126/658054b9bde4219f7c818b9b_gradient-noise-purple-azure-p-500.png)",
      }}
    >
      <div className="lg:w-1/3 min-w-96 rounded-xl bg-slate-900/50 backdrop-blur-md border-slate-800 px-5 py-10 shadow-lg mx-auto">
        <h2 className="font-bold text-2xl">Add a credit card</h2>

        <div className="mb-5 font-light mt-5">
          <ul className="text-sm flex flex-col gap-3">
            <li className="flex gap-3 items-center">
              <AppIcon icon="check" className="size-5 fill-white" />
              <span>Audit logs</span>
            </li>
            <li className="flex gap-3 items-center">
              <AppIcon icon="check" className="size-5 fill-white" />
              <span>Unlimited users</span>
            </li>
            <li className="flex gap-3 items-center">
              <AppIcon icon="check" className="size-5 fill-white" />
              <span>Granular access</span>
            </li>
          </ul>
        </div>
        <AppButton
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
